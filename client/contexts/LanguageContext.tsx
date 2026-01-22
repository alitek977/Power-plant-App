import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nManager } from "react-native";
import { reloadAppAsync } from "expo";

import { Language, translations, TranslationKey, isRTL as isRTLLanguage } from "@/lib/i18n";

const LANGUAGE_KEY = "pp-app:language";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
  isHydrated: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function applyRTLSettings(shouldBeRTL: boolean): boolean {
  const currentIsRTL = I18nManager.isRTL;
  const needsChange = currentIsRTL !== shouldBeRTL;
  
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(shouldBeRTL);
  I18nManager.swapLeftAndRightInRTL(true);
  
  return needsChange;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(I18nManager.isRTL ? "ar" : "en");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (saved === "en" || saved === "ar") {
        const shouldBeRTL = isRTLLanguage(saved);
        const needsReload = applyRTLSettings(shouldBeRTL);
        
        if (needsReload) {
          await reloadAppAsync();
          return;
        }
        
        setLanguageState(saved);
      } else {
        const defaultLang: Language = I18nManager.isRTL ? "ar" : "en";
        setLanguageState(defaultLang);
      }
      setIsHydrated(true);
    } catch (error) {
      console.error("Error loading language:", error);
      setIsHydrated(true);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
      
      const shouldBeRTL = isRTLLanguage(lang);
      const needsReload = applyRTLSettings(shouldBeRTL);
      
      if (needsReload) {
        await reloadAppAsync();
      } else {
        setLanguageState(lang);
      }
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  if (!isHydrated) {
    return null;
  }

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isRTL: I18nManager.isRTL,
        isHydrated,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
