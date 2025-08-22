// Importar React hooks necesarios
import { useState, useEffect } from 'react';

// Configuración responsiva para el CRUD
export const responsiveConfig = {
  // Breakpoints en píxeles
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  },

  // Configuración de vistas por dispositivo
  defaultViews: {
    mobile: 'cards',     // Móvil siempre cards
    tablet: 'table',     // Tablet usa tabla por defecto
    desktop: 'table'     // Desktop usa tabla por defecto
  },

  // Configuración de botones de vista
  viewToggle: {
    // En móvil no mostrar botones de cambio de vista
    showOnMobile: false,
    // En tablet y desktop sí permitir cambio
    showOnTablet: true,
    showOnDesktop: true
  },

  // Media queries CSS para usar en styled-components o CSS modules
  mediaQueries: {
    mobile: `@media (max-width: 767px)`,
    tablet: `@media (min-width: 768px) and (max-width: 1023px)`,
    desktop: `@media (min-width: 1024px)`
  },

  // Configuración de grid/layout por dispositivo
  layout: {
    mobile: {
      cardsPerRow: 1,
      showFilters: false,  // Filters colapsados en móvil
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
  }
};

// Hook para detectar el tipo de dispositivo actual
export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < responsiveConfig.breakpoints.mobile) {
        setDeviceType('mobile');
      } else if (width < responsiveConfig.breakpoints.tablet) {
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
  }, []);

  return deviceType;
};