import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import es from "./locales/es.json";

const resources = {
  en: { translation: en },
  es: { translation: es },
};

const getStoredLanguage = (): string => {
  try {
    const storedState = localStorage.getItem("language-storage");
    if (storedState) {
      const parsed = JSON.parse(storedState);
      return parsed.state?.language || "en";
    }
  } catch (error) {
    console.error("Error parsing language from localStorage:", error);
  }
  return "en";
};

const savedLanguage = getStoredLanguage();

i18n
  .use(initReactI18next) // Bind i18n to React
  .init({
    lng: savedLanguage,
    resources,
    fallbackLng: "en",
  });

export default i18n;
