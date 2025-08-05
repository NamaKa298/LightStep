import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./locales/en/translation.json";
import translationES from "./locales/es/translation.json";
import translationFR from "./locales/fr/translation.json";

const resources = {
  fr: { translation: translationFR },
  en: { translation: translationEN },
  es: { translation: translationES },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("userLanguage") || navigator.language.split("-")[0] || "fr",
  fallbackLng: "fr",
  interpolation: { escapeValue: false },
});

export default i18n;
