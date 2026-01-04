import i18n from "i18next"
import detector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import translationGr from "./locales/gr/translation.json"
import translationIT from "./locales/it/translation.json"
import translationRS from "./locales/rs/translation.json"
import translationSP from "./locales/sp/translation.json"
import translationENG from "./locales/eng/translation.json"

// Traducciones del módulo MyPages
import myPagesENG from "./modules/WebSites/MyPages/locales/eng.json"
import myPagesSP from "./modules/WebSites/MyPages/locales/sp.json"
import myPagesIT from "./modules/WebSites/MyPages/locales/it.json"

// Traducciones del módulo CreatePage
import createPageENG from "./modules/WebSites/CreatePage/locales/eng.json"
import createPageSP from "./modules/WebSites/CreatePage/locales/sp.json"
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
  sp: {
    translation: { ...translationSP, ...myPagesSP, ...createPageSP },
  },
  eng: {
    translation: { ...translationENG, ...myPagesENG, ...createPageENG },
  },
}

const language = localStorage.getItem("I18N_LANGUAGE")
if (!language) {
  localStorage.setItem("I18N_LANGUAGE", "eng")
}

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem("I18N_LANGUAGE") || "eng",
    fallbackLng: "eng", // use eng if detected lng is not available

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
