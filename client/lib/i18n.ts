export type Language = "en" | "ar";

export const translations = {
  en: {
    // Common
    app_name: "Power Plant Calculations",
    save: "Save",
    cancel: "Cancel",
    done: "Done",
    clear: "Clear",
    today: "Today",
    
    // Tabs
    tab_feeders: "Feeders",
    tab_turbines: "Turbines",
    tab_calculations: "Calculations",
    tab_reports: "Reports",
    
    // Feeders Screen
    feeders_title: "Feeders",
    feeder: "Feeder",
    start_of_day: "Start of Day",
    end_of_day: "End of Day",
    difference: "Difference",
    export: "Export",
    withdrawal: "Withdrawal",
    positive_energy_flow: "Positive energy flow",
    negative_energy_flow: "Negative energy flow",
    feeders_summary: "Feeders Summary",
    start: "Start",
    end: "End",
    diff: "Diff",
    
    // Turbines Screen
    turbines_title: "Turbines",
    turbine: "Turbine",
    previous: "Previous",
    present: "Present",
    hours: "Hours",
    mw_per_hr: "MW/Hr",
    turbine_error: "Error: Present value is less than Previous",
    total_generation: "Total Generation",
    avg_mw_per_hr: "Average MW/Hr",
    turbines_summary: "Turbines Summary",
    
    // Calculations Screen
    calculations_title: "Calculations",
    energy_balance: "Energy Balance",
    sum_feeder_diff: "Sum(Feeder Diff)",
    total_turbine_diff: "Total Turbine Diff",
    net_balance: "Net Balance",
    mwh: "MWh",
    day_letter: "Day Letter",
    station_service: "Station Service",
    formula_turbine_feeder: "Turbine - Feeder",
    formula_station_service: "(Feeder × 1000) ÷ Turbine × 100",
    day_type: "Day Type",
    
    // Reports Screen
    reports_title: "Reports",
    generate_report: "Generate Report",
    daily_summary: "Daily Summary",
    no_data: "No data available",
    
    // Calendar
    select_date: "Select Date",
    
    // Settings
    settings: "Settings",
    language: "Language",
    select_language: "Select your preferred language",
    english: "English",
    arabic: "العربية",
    theme: "Theme",
    dark_mode: "Dark Mode",
    light_mode: "Light Mode",
  },
  ar: {
    // Common
    app_name: "حسابات محطة الطاقة",
    save: "حفظ",
    cancel: "إلغاء",
    done: "تم",
    clear: "مسح",
    today: "اليوم",
    
    // Tabs
    tab_feeders: "المغذيات",
    tab_turbines: "التوربينات",
    tab_calculations: "الحسابات",
    tab_reports: "التقارير",
    
    // Feeders Screen
    feeders_title: "المغذيات",
    feeder: "مغذي",
    start_of_day: "بداية اليوم",
    end_of_day: "نهاية اليوم",
    difference: "الفرق",
    export: "تصدير",
    withdrawal: "سحب",
    positive_energy_flow: "تدفق طاقة إيجابي",
    negative_energy_flow: "تدفق طاقة سلبي",
    feeders_summary: "ملخص المغذيات",
    start: "البداية",
    end: "النهاية",
    diff: "الفرق",
    
    // Turbines Screen
    turbines_title: "التوربينات",
    turbine: "توربين",
    previous: "السابق",
    present: "الحالي",
    hours: "الساعات",
    mw_per_hr: "ميجاواط/ساعة",
    turbine_error: "خطأ: القيمة الحالية أقل من السابقة",
    total_generation: "إجمالي التوليد",
    avg_mw_per_hr: "متوسط ميجاواط/ساعة",
    turbines_summary: "ملخص التوربينات",
    
    // Calculations Screen
    calculations_title: "الحسابات",
    energy_balance: "ميزان الطاقة",
    sum_feeder_diff: "مجموع فرق المغذيات",
    total_turbine_diff: "إجمالي فرق التوربينات",
    net_balance: "الرصيد الصافي",
    mwh: "ميجاواط ساعة",
    day_letter: "حرف اليوم",
    station_service: "خدمة المحطة",
    formula_turbine_feeder: "التوربين - المغذي",
    formula_station_service: "(المغذي × 1000) ÷ التوربين × 100",
    day_type: "نوع اليوم",
    
    // Reports Screen
    reports_title: "التقارير",
    generate_report: "إنشاء تقرير",
    daily_summary: "الملخص اليومي",
    no_data: "لا توجد بيانات",
    
    // Calendar
    select_date: "اختر التاريخ",
    
    // Settings
    settings: "الإعدادات",
    language: "اللغة",
    select_language: "اختر لغتك المفضلة",
    english: "English",
    arabic: "العربية",
    theme: "السمة",
    dark_mode: "الوضع الداكن",
    light_mode: "الوضع الفاتح",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function isRTL(language: Language): boolean {
  return language === "ar";
}
