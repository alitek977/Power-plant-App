import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import {
  DayData,
  FEEDERS,
  TURBINES,
  num,
  feederExport,
  turbineProductionMwh,
  turbineRowComputed,
  gasForTurbine,
  monthKey,
} from "./storage";

type TranslateFunc = (key: string) => string;

function computeDayStats(day: DayData) {
  const production = turbineProductionMwh(day);
  const exportVal = feederExport(day);
  const consumption = production - exportVal;
  const isExport = exportVal >= 0;

  let totalGas = 0;
  for (const t of TURBINES) {
    const row = turbineRowComputed(day, t);
    totalGas += gasForTurbine(row.diff, row.mwPerHr);
  }

  return { production, consumption, exportVal, isExport, gasConsumed: totalGas };
}

function formatDate(dateKey: string, language: string): string {
  const date = new Date(dateKey);
  if (isNaN(date.getTime())) return dateKey;

  if (language === "ar") {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}/${month}/${day}`;
  }

  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function formatMonth(monthStr: string, language: string): string {
  if (language === "ar") {
    return monthStr;
  }
  const [year, month] = monthStr.split("-");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
}

interface MonthlyStats {
  month: string;
  production: number;
  exportTotal: number;
  withdrawalTotal: number;
  hasExport: boolean;
  hasWithdrawal: boolean;
  consumption: number;
  gasConsumed: number;
  daysCount: number;
}

export async function generateExcelReport(
  currentDay: DayData,
  allDays: DayData[],
  t: TranslateFunc,
  language: string
): Promise<void> {
  const workbook = XLSX.utils.book_new();

  const feedersData: (string | number)[][] = [
    [t("feeder_name"), t("end_of_day"), t("difference")]
  ];
  for (const f of FEEDERS) {
    const start = num(currentDay.feeders[f]?.start);
    const end = num(currentDay.feeders[f]?.end);
    const diff = end - start;
    feedersData.push([f, end, diff]);
  }
  const feedersSheet = XLSX.utils.aoa_to_sheet(feedersData);
  setColumnWidths(feedersSheet, [15, 15, 15]);
  XLSX.utils.book_append_sheet(workbook, feedersSheet, t("feeders"));

  const turbinesData: (string | number)[][] = [
    [t("turbine_name"), t("end_of_day"), t("difference")]
  ];
  for (const tb of TURBINES) {
    const computed = turbineRowComputed(currentDay, tb);
    turbinesData.push([t("turbine") + " " + tb, computed.present, computed.diff]);
  }
  const turbinesSheet = XLSX.utils.aoa_to_sheet(turbinesData);
  setColumnWidths(turbinesSheet, [15, 15, 15]);
  XLSX.utils.book_append_sheet(workbook, turbinesSheet, t("turbines"));

  const currentStats = computeDayStats(currentDay);
  const flowLabel = currentStats.isExport ? t("export") : t("withdrawal");
  const summaryData: (string | number)[][] = [
    [t("metric"), t("value"), t("unit")],
    [t("production"), round2(currentStats.production), t("mwh")],
    [flowLabel, round2(Math.abs(currentStats.exportVal)), t("mwh")],
    [t("consumption"), round2(currentStats.consumption), t("mwh")],
    [t("gas_consumed"), round2(currentStats.gasConsumed), "Nm³"],
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  setColumnWidths(summarySheet, [20, 15, 10]);
  XLSX.utils.book_append_sheet(workbook, summarySheet, t("summary"));

  const sortedDays = [...allDays]
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    .slice(-31);

  const dailyData: (string | number)[][] = [
    [t("date"), t("production") + " (MWh)", t("export") + "/" + t("withdrawal") + " (MWh)", t("consumption") + " (MWh)", t("gas_consumed") + " (Nm³)"]
  ];
  for (const day of sortedDays) {
    const stats = computeDayStats(day);
    const flowValue = stats.isExport ? stats.exportVal : -Math.abs(stats.exportVal);
    dailyData.push([
      formatDate(day.dateKey, language),
      round2(stats.production),
      round2(flowValue),
      round2(stats.consumption),
      round2(stats.gasConsumed),
    ]);
  }
  const dailySheet = XLSX.utils.aoa_to_sheet(dailyData);
  setColumnWidths(dailySheet, [18, 18, 25, 18, 20]);
  XLSX.utils.book_append_sheet(workbook, dailySheet, t("daily_summary_sheet"));

  const monthlyMap = new Map<string, MonthlyStats>();
  for (const day of allDays) {
    const mk = monthKey(day.dateKey);
    const stats = computeDayStats(day);

    if (!monthlyMap.has(mk)) {
      monthlyMap.set(mk, {
        month: mk,
        production: 0,
        exportTotal: 0,
        withdrawalTotal: 0,
        hasExport: false,
        hasWithdrawal: false,
        consumption: 0,
        gasConsumed: 0,
        daysCount: 0,
      });
    }

    const m = monthlyMap.get(mk)!;
    m.production += stats.production;
    m.consumption += stats.consumption;
    m.gasConsumed += stats.gasConsumed;
    m.daysCount++;

    if (stats.isExport) {
      m.exportTotal += stats.exportVal;
      m.hasExport = true;
    } else {
      m.withdrawalTotal += Math.abs(stats.exportVal);
      m.hasWithdrawal = true;
    }
  }

  const monthlyList = Array.from(monthlyMap.values())
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12);

  const hasMixedModes = monthlyList.some(m => m.hasExport && m.hasWithdrawal);

  let monthlyData: (string | number)[][];
  if (hasMixedModes) {
    monthlyData = [
      [t("month"), t("production") + " (MWh)", t("export") + " (MWh)", t("withdrawal") + " (MWh)", t("consumption") + " (MWh)", t("gas_consumed") + " (Nm³)", t("days_count")]
    ];
    for (const m of monthlyList) {
      monthlyData.push([
        formatMonth(m.month, language),
        round2(m.production),
        round2(m.exportTotal),
        round2(m.withdrawalTotal),
        round2(m.consumption),
        round2(m.gasConsumed),
        m.daysCount,
      ]);
    }
  } else {
    const allExport = monthlyList.every(m => m.hasExport && !m.hasWithdrawal);
    const flowHeader = allExport ? t("export") : t("withdrawal");
    monthlyData = [
      [t("month"), t("production") + " (MWh)", flowHeader + " (MWh)", t("consumption") + " (MWh)", t("gas_consumed") + " (Nm³)", t("days_count")]
    ];
    for (const m of monthlyList) {
      const flowVal = allExport ? m.exportTotal : m.withdrawalTotal;
      monthlyData.push([
        formatMonth(m.month, language),
        round2(m.production),
        round2(flowVal),
        round2(m.consumption),
        round2(m.gasConsumed),
        m.daysCount,
      ]);
    }
  }
  const monthlySheet = XLSX.utils.aoa_to_sheet(monthlyData);
  setColumnWidths(monthlySheet, hasMixedModes ? [15, 18, 15, 18, 18, 20, 12] : [15, 18, 18, 18, 20, 12]);
  XLSX.utils.book_append_sheet(workbook, monthlySheet, t("monthly_summary_sheet"));

  const wbout = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });
  const fileName = `PowerPlant_Report_${currentDay.dateKey}.xlsx`;
  const filePath = FileSystem.documentDirectory + fileName;

  await FileSystem.writeAsStringAsync(filePath, wbout, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(filePath, {
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: t("export_excel"),
    });
  }
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}


function setColumnWidths(sheet: XLSX.WorkSheet, widths: number[]): void {
  sheet["!cols"] = widths.map(w => ({ wch: w }));
}
