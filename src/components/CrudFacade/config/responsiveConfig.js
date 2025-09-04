/**
 * Configuración responsive global de la aplicación
 * Define los breakpoints estándar que se usarán en toda la app
 */

// Breakpoints globales por defecto
export const GLOBAL_BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200
};

// Configuración de vistas por defecto global
export const GLOBAL_DEFAULT_VIEWS = {
  mobile: 'cards',
  tablet: 'table',
  desktop: 'table'
};

// Configuración de botones de vista global
export const GLOBAL_VIEW_TOGGLE = {
  showOnMobile: false,
  showOnTablet: true,
  showOnDesktop: true
};

// Configuración de layout por defecto global
export const GLOBAL_LAYOUT_CONFIG = {
  mobile: {
    cardsPerRow: 1,
    showFilters: false,
    showBulkActions: false
  },
  tablet: {
    cardsPerRow: 2,
    showFilters: true,
    showBulkActions: true
  },
  desktop: {
    cardsPerRow: 3,
    showFilters: true,
    showBulkActions: true
  }
};

/**
 * Función para crear configuración responsive personalizada
 * @param {Object} customConfig - Configuración personalizada
 * @param {Object} customConfig.breakpoints - Breakpoints personalizados
 * @param {Object} customConfig.defaultViews - Vistas por defecto personalizadas
 * @param {Object} customConfig.viewToggle - Configuración de botones personalizada
 * @param {Object} customConfig.layout - Configuración de layout personalizada
 * @returns {Object} Configuración responsive completa
 */
export const createResponsiveConfig = (customConfig = {}) => {
  const {
    breakpoints = {},
    defaultViews = {},
    viewToggle = {},
    layout = {}
  } = customConfig;

  // Combinar configuración global con personalizada
  const finalBreakpoints = { ...GLOBAL_BREAKPOINTS, ...breakpoints };
  const finalDefaultViews = { ...GLOBAL_DEFAULT_VIEWS, ...defaultViews };
  const finalViewToggle = { ...GLOBAL_VIEW_TOGGLE, ...viewToggle };
  const finalLayout = {
    mobile: { ...GLOBAL_LAYOUT_CONFIG.mobile, ...layout.mobile },
    tablet: { ...GLOBAL_LAYOUT_CONFIG.tablet, ...layout.tablet },
    desktop: { ...GLOBAL_LAYOUT_CONFIG.desktop, ...layout.desktop }
  };

  return {
    breakpoints: finalBreakpoints,
    defaultViews: finalDefaultViews,
    viewToggle: finalViewToggle,
    layout: finalLayout,

    // Generar media queries CSS
    getMediaQueries: () => ({
      mobile: `@media (max-width: ${finalBreakpoints.mobile}px)`,
      tablet: `@media (min-width: ${finalBreakpoints.mobile + 1}px) and (max-width: ${finalBreakpoints.tablet}px)`,
      desktop: `@media (min-width: ${finalBreakpoints.tablet + 1}px)`
    }),

    // Determinar tipo de dispositivo
    getDeviceType: (width) => {
      if (width <= finalBreakpoints.mobile) return 'mobile';
      if (width <= finalBreakpoints.tablet) return 'tablet';
      return 'desktop';
    }
  };
};

/**
 * Configuración responsive por defecto para usar directamente
 */
export const defaultResponsiveConfig = createResponsiveConfig();