import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        verifyTitle: "Check my age",
        verifySubtitle: "Terms of Use – Ensures ...",
      },
    },
    cs: {
      translation: {
        verifyTitle: "Ověřit můj věk",
        verifySubtitle: "Podmínky použití – Zajišťuje ...",
      },
    },
  },
  fallbackLng: "cs",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
