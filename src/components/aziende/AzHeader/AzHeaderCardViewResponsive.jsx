import React from "react";
import PropTypes from "prop-types";
import AzHeaderCardViews from "./AzHeaderCardViews";

// Configuración estática de vistas predeterminadas
const DEFAULT_VIEWS_CONFIG = {
  web: { name: "Web", icon: "mdi-monitor", title: "Vista Web" },
  table: { name: "Tabla", icon: "mdi-table", title: "Vista Tabla" },
  movil: { name: "Móvil", icon: "mdi-cellphone", title: "Vista Móvil" },
  cards: { name: "Cards", icon: "mdi-card-multiple", title: "Vista Cards" },
  grid: { name: "Grid", icon: "mdi-view-grid", title: "Vista Grid" },
  list: { name: "Lista", icon: "mdi-view-list", title: "Vista Lista" }
};

// Función helper para normalizar configuración de vistas
const normalizeViewConfig = (view, index) => {
  // Si es un objeto con name, icon y content
  if (typeof view === 'object' && view.name && view.icon) {
    return {
      key: view.key || index.toString(), // Usar key si existe, sino índice
      name: view.name,
      icon: view.icon.startsWith('mdi-') ? view.icon : `mdi-${view.icon}`,
      title: view.title || `Vista ${view.name}`,
      content: view.content || null
    };
  }

  // Si es string, verificar si es configuración predeterminada
  if (typeof view === 'string') {
    // Formato "nombre:mdi-icon-name" (mantener compatibilidad)
    if (view.includes(':')) {
      const [name, icon] = view.split(':');
      return {
        key: index.toString(),
        name: name.charAt(0).toUpperCase() + name.slice(1),
        icon: icon.startsWith('mdi-') ? icon : `mdi-${icon}`,
        title: `Vista ${name.charAt(0).toUpperCase() + name.slice(1)}`,
        content: null
      };
    }

    // String simple, buscar en configuraciones predeterminadas
    if (DEFAULT_VIEWS_CONFIG[view]) {
      const config = DEFAULT_VIEWS_CONFIG[view];
      return {
        key: index.toString(),
        name: config.name,
        icon: config.icon,
        title: config.title,
        content: null
      };
    }

    // String personalizado sin configuración
    return {
      key: index.toString(),
      name: view.charAt(0).toUpperCase() + view.slice(1),
      icon: "mdi-eye",
      title: `Vista ${view.charAt(0).toUpperCase() + view.slice(1)}`,
      content: null
    };
  }

  // Fallback genérico
  return {
    key: index.toString(),
    name: `Vista ${index + 1}`,
    icon: "mdi-eye",
    title: `Vista ${index + 1}`,
    content: null
  };
};

/**
 * Hook personalizado para manejo responsivo automático de vistas
 * @param {Array} views - Array de vistas (objetos o strings) [desktop, tablet, mobile]
 * @param {Object} breakpoints - Puntos de quiebre {mobile: 768, tablet: 1024, desktop: 1200}
 * @returns {Object} {currentView, isMobile, currentBreakpoint}
 */
const useResponsiveView = (views = [
  { name: "Web", icon: "mdi-monitor" },
  { name: "Tabla", icon: "mdi-table" },
  { name: "Móvil", icon: "mdi-cellphone" }
], breakpoints = { mobile: 768, tablet: 1024, desktop: 1200 }) => {
  const [windowWidth, setWindowWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [manualView, setManualView] = React.useState(null); // Vista seleccionada manualmente
  const [lastBreakpoint, setLastBreakpoint] = React.useState(null);

  // Normalizar vistas en el hook
  const normalizedViews = React.useMemo(() => {
    return views.map((view, index) => normalizeViewConfig(view, index));
  }, [views]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCurrentBreakpoint = React.useCallback(() => {
    if (windowWidth <= breakpoints.mobile) return 'mobile';
    if (windowWidth <= breakpoints.tablet) return 'tablet';
    return 'desktop';
  }, [windowWidth, breakpoints]);

  const currentBreakpoint = getCurrentBreakpoint();

  // Reset manual selection when breakpoint changes (responsive priority)
  React.useEffect(() => {
    if (lastBreakpoint && lastBreakpoint !== currentBreakpoint) {
      setManualView(null); // Reset override when breakpoint changes
    }
    setLastBreakpoint(currentBreakpoint);
  }, [currentBreakpoint, lastBreakpoint]);

  const getResponsiveView = React.useCallback(() => {
    const breakpointIndex = {
      desktop: 0,
      tablet: 1,
      mobile: 2
    };

    const viewIndex = breakpointIndex[currentBreakpoint];
    // Usar vistas normalizadas y obtener el key
    const selectedView = normalizedViews[viewIndex] || normalizedViews[0];
    return selectedView ? selectedView.key : 'web';
  }, [normalizedViews, currentBreakpoint]);

  const currentView = manualView || getResponsiveView();

  return {
    currentView,
    responsiveView: getResponsiveView(),
    isMobile: currentBreakpoint === 'mobile',
    isManualOverride: !!manualView,
    setManualView,
    normalizedViews
  };
};

/**
 * AzHeaderCardViewResponsive con configuración responsiva inteligente
 * Componente completo que incluye header y contenido que cambia automáticamente según el tamaño de pantalla
 *
 * @param {string} title - Título principal del header
 * @param {string} [description] - Descripción opcional del header
 * @param {string|Object} [badge] - Badge simple (string) o complejo {count, total, color, text}
 * @param {Array} [views=['web', 'table', 'movil']] - Vistas responsivas [desktop, tablet, mobile]. Acepta objetos {name, icon} o strings
 * @param {Object} [breakpoints] - Puntos de quiebre personalizados {mobile: 768, tablet: 1024, desktop: 1200}
 * @param {Array} [contents] - Array de contenidos para usar como slots adicionales [contentTopRight, contentBottomLeft, contentBottomRight]
 * @param {React.ReactNode} [viewWeb] - Contenido para vista web (desktop). Fallback por defecto para todas las vistas
 * @param {React.ReactNode} [viewTable] - Contenido para vista tablet (fallback a viewWeb si no se proporciona)
 * @param {React.ReactNode} [viewMovil] - Contenido para vista móvil (fallback a viewTable → viewWeb si no se proporciona)
 * @param {React.ReactNode} [contentTopRight] - Contenido del área superior derecha (botones de acción)
 * @param {React.ReactNode} [contentBottomLeft] - Contenido del área inferior izquierda (filtros, inputs)
 * @param {React.ReactNode} [contentBottomRight] - Contenido del área inferior derecha (controles, ordenamiento)
 * @param {string} [className] - Clases CSS adicionales para el header
 * @param {string} [contentClassName] - Clases CSS adicionales para el área de contenido
 * @param {boolean} [enableTransitions=true] - Habilita transiciones suaves entre vistas
 */
const AzHeaderCardViewResponsive = React.memo(({
  title,
  description,
  badge,
  // Vista y contenido con configuración responsiva
  views = ["web", "table", "movil"], // [desktop, tablet, mobile]
  breakpoints = { mobile: 768, tablet: 1024, desktop: 1200 },
  contents = [], // Array de contenidos para usar como slots
  viewWeb,
  viewTable,
  viewMovil,
  // Slots de contenido
  contentTopRight,    // Área superior derecha: botones de acción, controles principales
  contentBottomLeft,  // Área inferior izquierda: inputs, selects, filtros, etc.
  contentBottomRight, // Área inferior derecha: botones, controles, ordenamiento, etc.
  // Estilos
  className,
  contentClassName,
  enableTransitions = true
}) => {
  const { currentView, responsiveView, isMobile, isManualOverride, setManualView, normalizedViews } = useResponsiveView(views, breakpoints);

  const handleViewChange = React.useCallback((view) => {
    // Si view es null, resetear a modo responsivo automático
    setManualView(view);
  }, [setManualView]);

  const renderContent = React.useCallback(() => {
    // Lógica de fallback inteligente usando las vistas normalizadas
    const getViewContent = (viewKey) => {
      switch (viewKey) {
        case '0': // Vista web (desktop)
        case 'web':
          return viewWeb; // Siempre mostrar viewWeb si está disponible

        case '1': // Vista tabla (tablet)
        case 'table':
          // Si no hay viewTable, usar viewWeb como fallback
          return viewTable || viewWeb;

        case '2': // Vista móvil
        case 'movil':
          // Si no hay viewMovil, usar viewTable (si existe) o viewWeb
          return viewMovil || viewTable || viewWeb;

        case 'cards':
          // Compatibilidad: cards = table con misma lógica de fallback
          return viewTable || viewWeb;

        case 'grid':
          // Compatibilidad: grid = movil con misma lógica de fallback
          return viewMovil || viewTable || viewWeb;

        default:
          // Para vistas personalizadas, usar viewWeb por defecto
          return viewWeb;
      }
    };

    const selectedContent = getViewContent(currentView);

    if (!selectedContent) {
      // Buscar el nombre de la vista actual para mostrar en el mensaje
      const currentViewConfig = normalizedViews.find(v => v.key === currentView);
      const viewDisplayName = currentViewConfig ? currentViewConfig.name : currentView;

      return (
        <div className="card">
          <div className="card-body text-center text-muted p-5">
            <i className="mdi mdi-eye-off fs-1 mb-3 d-block"></i>
            <h6>Vista {viewDisplayName} no configurada</h6>
            <p className="mb-0">Proporciona el contenido para esta vista</p>
          </div>
        </div>
      );
    }

    return selectedContent;
  }, [currentView, viewWeb, viewTable, viewMovil, normalizedViews]);

  return (
    <React.Fragment>
      <AzHeaderCardViews
        title={title}
        description={description}
        badge={badge}
        currentView={currentView}
        onViewChange={handleViewChange} // Permitir cambio manual
        views={views}
        contents={contents} // Pasar el array de contents
        contentTopRight={contentTopRight}
        contentBottomLeft={contentBottomLeft}
        contentBottomRight={contentBottomRight}
        className={className}
        hideViewButtons={isMobile} // Nueva prop para ocultar botones en móvil
        responsiveMode={true} // Indica que está en modo responsivo
        isManualOverride={isManualOverride} // Indica si está en override manual
        responsiveView={responsiveView} // Vista que correspondería por responsivo
      />

      <div
        className={`view-content ${contentClassName || ''}`}
        style={enableTransitions ? {
          transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
          opacity: 1,
          transform: 'translateX(0)'
        } : {}}
      >
        {renderContent()}
      </div>
    </React.Fragment>
  );
});

AzHeaderCardViewResponsive.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  badge: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      text: PropTypes.string,
      count: PropTypes.number,
      total: PropTypes.number,
      color: PropTypes.string
    })
  ]),
  views: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string, // Compatibilidad hacia atrás
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        key: PropTypes.string,
        title: PropTypes.string
      })
    ])
  ),
  breakpoints: PropTypes.shape({
    mobile: PropTypes.number,
    tablet: PropTypes.number,
    desktop: PropTypes.number
  }),
  contents: PropTypes.arrayOf(PropTypes.node), // Array de contenidos
  viewWeb: PropTypes.node,
  viewTable: PropTypes.node,
  viewMovil: PropTypes.node,
  // Props legacy (deprecated pero mantenidas por compatibilidad)
  contentTopRight: PropTypes.node,    // Área superior derecha
  contentBottomLeft: PropTypes.node,  // Área inferior izquierda
  contentBottomRight: PropTypes.node, // Área inferior derecha
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  enableTransitions: PropTypes.bool
};

AzHeaderCardViewResponsive.displayName = "AzHeaderCardViewResponsive";

// Exportar componente y hook
export { useResponsiveView };
export default AzHeaderCardViewResponsive;