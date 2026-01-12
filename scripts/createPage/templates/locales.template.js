/**
 * Template para generar archivos de traducción (locales)
 * Genera archivos JSON para cada idioma soportado
 */

const LOCALES = ['en', 'es', 'it'];

const translations = {
  en: (moduleName) => ({
    [`${moduleName.toLowerCase()}.title`]: moduleName
  }),
  es: (moduleName) => ({
    [`${moduleName.toLowerCase()}.title`]: moduleName
  }),
  it: (moduleName) => ({
    [`${moduleName.toLowerCase()}.title`]: moduleName
  })
};

export const generateLocaleEN = (moduleName) => {
  return JSON.stringify(translations.en(moduleName), null, 2) + '\n';
};

export const generateLocaleES = (moduleName) => {
  return JSON.stringify(translations.es(moduleName), null, 2) + '\n';
};

export const generateLocaleIT = (moduleName) => {
  return JSON.stringify(translations.it(moduleName), null, 2) + '\n';
};

export default {
  generateLocaleEN,
  generateLocaleES,
  generateLocaleIT,
  LOCALES
};
