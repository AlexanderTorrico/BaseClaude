import { TFunction } from 'i18next';

/**
 * Genera las columnas de configuracion para filtros de MyPages
 * @param t - Funcion de traduccion de i18next
 */
export const getMyPagesColumns = (t: TFunction) => [
  {
    key: "name",
    header: t('myPages.filters.name') || "Nombre",
    sortable: true,
    filterable: true,
    filterType: "text" as const,
  },
  {
    key: "rutName",
    header: t('myPages.filters.domain') || "Dominio",
    sortable: true,
    filterable: true,
    filterType: "text" as const,
  },
];

// Columnas por defecto sin traduccion
export const mypagesColumns = [
  {
    key: "name",
    header: "Nombre",
    sortable: true,
    filterable: true,
    filterType: "text" as const,
  },
  {
    key: "rutName",
    header: "Dominio",
    sortable: true,
    filterable: true,
    filterType: "text" as const,
  },
];
