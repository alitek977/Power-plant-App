import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  DayData,
  todayKey,
  defaultDay,
  getDayDataWithLinkedValues,
  saveDayData,
} from "@/lib/storage";

interface DayContextType {
  dateKey: string;
  setDateKey: (key: string) => void;
  day: DayData;
  setDay: React.Dispatch<React.SetStateAction<DayData>>;
  saveDay: () => Promise<void>;
  resetDay: () => void;
  loading: boolean;
}

const DayContext = createContext<DayContextType | undefined>(undefined);

export function DayProvider({ children }: { children: ReactNode }) {
  const [dateKey, setDateKey] = useState(todayKey());
  const [day, setDay] = useState<DayData>(defaultDay(dateKey));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDay();
  }, [dateKey]);

  const loadDay = async () => {
    setLoading(true);
    const data = await getDayDataWithLinkedValues(dateKey);
    setDay(data);
    setLoading(false);
  };

  const saveDay = useCallback(async () => {
    await saveDayData({ ...day, dateKey });
  }, [day, dateKey]);

  const resetDay = useCallback(() => {
    setDay(defaultDay(dateKey));
  }, [dateKey]);

  return (
    <DayContext.Provider
      value={{
        dateKey,
        setDateKey,
        day,
        setDay,
        saveDay,
        resetDay,
        loading,
      }}
    >
      {children}
    </DayContext.Provider>
  );
}

export function useDay() {
  const context = useContext(DayContext);
  if (!context) {
    throw new Error("useDay must be used within a DayProvider");
  }
  return context;
}
