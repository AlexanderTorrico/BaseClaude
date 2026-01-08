import i18n from "i18next"
import detector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import translationGr from "./locales/gr/translation.json"
import translationIT from "./locales/it/translation.json"
import translationRS from "./locales/rs/translation.json"
import translationES from "./locales/es/translation.json"
import translationEN from "./locales/en/translation.json"

// Traducciones del módulo MyPages
import myPagesEN from "./modules/WebSites/MyPages/locales/en.json"
import myPagesES from "./modules/WebSites/MyPages/locales/es.json"
import myPagesIT from "./modules/WebSites/MyPages/locales/it.json"

// Traducciones del módulo CreatePage
import createPageEN from "./modules/WebSites/CreatePage/locales/en.json"
import createPageES from "./modules/WebSites/CreatePage/locales/es.json"
import createPageIT from "./modules/WebSites/CreatePage/locales/it.json"

// the translations
const resources = {
  gr: {
    translation: translationGr,
  },
  it: {
    translation: { ...translationIT, ...myPagesIT, ...createPageIT },
  },
  rs: {
    translation: translationRS,
  },
  es: {
    translation: { ...translationES, ...myPagesES, ...createPageES },
  },
  en: {
    translation: { ...translationEN, ...myPagesEN, ...createPageEN },
  },
}

const language = localStorage.getItem("I18N_LANGUAGE")
if (!language) {
  localStorage.setItem("I18N_LANGUAGE", "en")
}

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem("I18N_LANGUAGE") || "en",
    fallbackLng: "en", // use en if detected lng is not available

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
