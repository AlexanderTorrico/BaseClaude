import { useState, useEffect } from 'react';
import { 
  GLOBAL_BREAKPOINTS, 
  GLOBAL_DEFAULT_VIEWS, 
  GLOBAL_VIEW_TOGGLE 
} from '../CrudFacade/config/responsiveConfig';

/**
 * @deprecated Use GLOBAL_BREAKPOINTS from config instead
 */
export const DEFAULT_BREAKPOINTS = GLOBAL_BREAKPOINTS;

/**
 * @deprecated Use GLOBAL_DEFAULT_VIEWS from config instead  
 */
export const DEFAULT_VIEWS = GLOBAL_DEFAULT_VIEWS;

/**
 * Hook genérico para manejo responsivo
 * @param {Object} options - Configuración personalizada
 * @param {Object} options.breakpoints - Puntos de quiebre personalizados
 * @param {Object} options.defaultViews - Vistas por defecto personalizadas
 * @param {Object} options.viewToggle - Configuración de botones de vista
 * @returns {Object} Información del dispositivo actual y configuraciones
 */
export const useResponsive = (options = {}) => {
  const {
    breakpoints = GLOBAL_BREAKPOINTS,
    defaultViews = GLOBAL_DEFAULT_VIEWS,
    viewToggle = GLOBAL_VIEW_TOGGLE
  } = options;

  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width <= breakpoints.mobile) {
        setDeviceType('mobile');
      } else if (width <= breakpoints.tablet) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    // Ejecutar al cargar
    handleResize();

    // Escuchar cambios de tamaño
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints]);

  // Obtener vista por defecto según dispositivo
  const getDefaultViewMode = () => {
    return defaultViews[deviceType] || 'table';
  };

  // Verificar si mostrar botones de cambio de vista
  const shouldShowViewToggle = () => {
    switch (deviceType) {
      case 'mobile':
        return viewToggle.showOnMobile;
      case 'tablet':
        return viewToggle.showOnTablet;
      case 'desktop':
        return viewToggle.showOnDesktop;
      default:
        return true;
    }
  };

  // Generar media queries CSS
  const getMediaQueries = () => ({
    mobile: `@media (max-width: ${breakpoints.mobile - 1}px)`,
    tablet: `@media (min-width: ${breakpoints.mobile}px) and (max-width: ${breakpoints.tablet - 1}px)`,
    desktop: `@media (min-width: ${breakpoints.tablet}px)`
  });

  return {
    deviceType,
    breakpoints,
    defaultViews,
    viewToggle,
    getDefaultViewMode,
    shouldShowViewToggle,
    getMediaQueries,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet', 
    isDesktop: deviceType === 'desktop'
  };
};