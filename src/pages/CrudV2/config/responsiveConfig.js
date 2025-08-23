import { useResponsive } from '../../../components/Common/useResponsive';

// Configuración específica de breakpoints para este CRUD
const CRUD_BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200
};

// Configuración de layout específica para el CRUD
const CRUD_LAYOUT_CONFIG = {
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

// Hook personalizado para este CRUD que usa la configuración específica
export const useCrudResponsive = () => {
  const responsive = useResponsive({
    breakpoints: CRUD_BREAKPOINTS
  });

  return {
    ...responsive,
    layout: CRUD_LAYOUT_CONFIG[responsive.deviceType],
    mediaQueries: responsive.getMediaQueries()
  };
};

// Exportar configuración completa para compatibilidad
export const responsiveConfig = {
  breakpoints: CRUD_BREAKPOINTS,
  defaultViews: {
    mobile: 'cards',
    tablet: 'table',
    desktop: 'table'
  },
  viewToggle: {
    showOnMobile: false,
    showOnTablet: true,
    showOnDesktop: true
  },
  layout: CRUD_LAYOUT_CONFIG
};

// Hook simple para compatibilidad hacia atrás
export const useDeviceType = () => {
  const { deviceType } = useCrudResponsive();
  return deviceType;
};