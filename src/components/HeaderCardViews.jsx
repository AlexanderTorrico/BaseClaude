import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import HeaderCard from "./HeaderCard";

// Configuración estática de vistas (fuera del componente para evitar re-creación)
const VIEWS_CONFIG = {
  // Vistas predeterminadas con iconos automáticos
  web: { icon: "mdi-monitor", label: "Web", title: "Vista Web" },
  table: { icon: "mdi-table", label: "Tabla", title: "Vista Tabla" },
  movil: { icon: "mdi-cellphone", label: "Móvil", title: "Vista Móvil" },
  cards: { icon: "mdi-card-multiple", label: "Cards", title: "Vista Cards" },
  grid: { icon: "mdi-view-grid", label: "Grid", title: "Vista Grid" },
  list: { icon: "mdi-view-list", label: "Lista", title: "Vista Lista" },
  // Función helper para obtener configuración de vista (permite iconos personalizados)
  getViewConfig: (viewName) => {
    // Si es una configuración predeterminada, devolverla
    if (VIEWS_CONFIG[viewName]) {
      return VIEWS_CONFIG[viewName];
    }
    
    // Si contiene un icono personalizado (formato: "nombre:mdi-icon-name")
    if (typeof viewName === 'string' && viewName.includes(':')) {
      const [name, icon] = viewName.split(':');
      return {
        icon: icon.startsWith('mdi-') ? icon : `mdi-${icon}`,
        label: name.charAt(0).toUpperCase() + name.slice(1),
        title: `Vista ${name.charAt(0).toUpperCase() + name.slice(1)}`
      };
    }
    
    // Vista personalizada sin icono específico (usar icono genérico)
    return {
      icon: "mdi-eye",
      label: typeof viewName === 'string' ? viewName.charAt(0).toUpperCase() + viewName.slice(1) : "Vista",
      title: `Vista ${typeof viewName === 'string' ? viewName.charAt(0).toUpperCase() + viewName.slice(1) : "Personalizada"}`
    };
  }
};

/**
 * HeaderCardViews optimizado con soporte responsivo
 * Componente de header con cambio de vistas y botones de navegación
 * 
 * @param {string} title - Título principal del header
 * @param {string} [description] - Descripción opcional del header  
 * @param {string|Object} [badge] - Badge simple (string) o complejo {count, total, color, text}
 * @param {string} [currentView="table"] - Vista actualmente seleccionada
 * @param {function} [onViewChange] - Función callback para cambio de vista
 * @param {string[]} [views=["table", "cards"]] - Array de vistas disponibles (soporta: web, table, movil, cards, grid, list, o formato personalizado "nombre:mdi-icon")
 * @param {React.ReactNode} [contentTopRight] - Contenido del área superior derecha (botones de acción)
 * @param {React.ReactNode} [contentBottomLeft] - Contenido del área inferior izquierda (filtros, inputs)
 * @param {React.ReactNode} [contentBottomRight] - Contenido del área inferior derecha (controles, ordenamiento)
 * @param {string} [className] - Clases CSS adicionales
 * @param {boolean} [hideViewButtons=false] - Oculta los botones de cambio de vista
 * @param {boolean} [responsiveMode=false] - Indica si está en modo responsivo (solo lectura)
 */
const HeaderCardViews = React.memo(({
  title,
  description,
  // Badge simplificado
  badge,
  // Vista actual y cambio
  currentView = "table",
  onViewChange,
  views = ["table", "cards"],
  // Slots con nomenclatura consistente
  contentTopRight,    // Área superior derecha: botones de acción, controles principales
  contentBottomLeft,  // Área inferior izquierda: inputs, selects, filtros, etc.
  contentBottomRight, // Área inferior derecha: botones, controles, ordenamiento, etc.
  // Configuración responsiva
  hideViewButtons = false,
  responsiveMode = false,
  isManualOverride = false,
  responsiveView,
  // Estilos opcionales
  className
}) => {

  const renderViewButtons = () => {
    // Ocultar botones si está configurado o si hay menos de 2 vistas
    if (hideViewButtons || views.length < 2) return null;
    
    return (
      <div className="btn-group d-none d-md-flex me-2" role="group">
        {views.map((view, index) => {
          const config = VIEWS_CONFIG.getViewConfig(view);
          
          const isActive = currentView === view;
          const isResponsiveMatch = responsiveView === view;
          
          return (
            <Button 
              key={`${view}-${index}`}
              color={isActive ? 'primary' : 'light'}
              onClick={() => onViewChange && onViewChange(view)}
              size="sm"
              title={responsiveMode ? 
                `${config.title} ${isResponsiveMatch ? '(Vista responsiva)' : '(Override manual)'}` : 
                config.title
              }
              style={{
                position: 'relative'
              }}
            >
              <i className={`mdi ${config.icon}`}></i>
              <span className="d-none d-lg-inline ms-1">{config.label}</span>
            </Button>
          );
        })}
      </div>
    );
  };

  // Determinar badge props (memoizado para rendimiento)
  const badgeProps = React.useMemo(() => {
    if (!badge) return {};
    return {
      showBadge: true,
      ...(typeof badge === 'string' ? { badgeText: badge } : badge)
    };
  }, [badge]);

  return (
    <HeaderCard
      title={title}
      description={description}
      {...badgeProps}
      showBottomRow={!!(contentBottomLeft || contentBottomRight)}
      contentTopRight={
        <div className="d-flex flex-wrap gap-2 justify-content-lg-end justify-content-center">
          {renderViewButtons()}
          {contentTopRight}
        </div>
      }
      bottomLeftSlot={contentBottomLeft}
      bottomRightSlot={contentBottomRight}
      className={className}
    />
  );
});

HeaderCardViews.propTypes = {
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
  currentView: PropTypes.string,
  onViewChange: PropTypes.func,
  views: PropTypes.arrayOf(PropTypes.string), // Acepta cualquier string para permitir vistas personalizadas
  contentTopRight: PropTypes.node,    // Área superior derecha
  contentBottomLeft: PropTypes.node,  // Área inferior izquierda
  contentBottomRight: PropTypes.node, // Área inferior derecha
  hideViewButtons: PropTypes.bool,    // Oculta botones de vista
  responsiveMode: PropTypes.bool,     // Modo responsivo automático
  isManualOverride: PropTypes.bool,   // Indica si está en override manual
  responsiveView: PropTypes.string, // Vista que correspondería por responsivo
  className: PropTypes.string
};

/**
 * Hook personalizado para manejo responsivo automático de vistas
 * @param {string[]} views - Array de vistas [desktop, tablet, mobile]
 * @param {Object} breakpoints - Puntos de quiebre {mobile: 768, tablet: 1024, desktop: 1200}
 * @returns {Object} {currentView, isMobile, currentBreakpoint}
 */
const useResponsiveView = (views = ["web", "table", "movil"], breakpoints = { mobile: 768, tablet: 1024, desktop: 1200 }) => {
  const [windowWidth, setWindowWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [manualView, setManualView] = React.useState(null); // Vista seleccionada manualmente
  const [lastBreakpoint, setLastBreakpoint] = React.useState(null);
  
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
    // Fallback a desktop (índice 0) si no hay vista definida para tablet/mobile
    return views[viewIndex] || views[0] || 'web';
  }, [views, currentBreakpoint]);
  
  const currentView = manualView || getResponsiveView();
  
  return {
    currentView,
    responsiveView: getResponsiveView(),
    isMobile: currentBreakpoint === 'mobile',
    isManualOverride: !!manualView,
    setManualView
  };
};

/**
 * HeaderCardViewResponsive con configuración responsiva inteligente
 * Componente completo que incluye header y contenido que cambia automáticamente según el tamaño de pantalla
 * 
 * @param {string} title - Título principal del header
 * @param {string} [description] - Descripción opcional del header
 * @param {string|Object} [badge] - Badge simple (string) o complejo {count, total, color, text}
 * @param {string[]} [views=['web', 'table', 'movil']] - Vistas responsivas [desktop, tablet, mobile]. Soporta: web, table, movil, cards, grid, list, o formato personalizado "nombre:mdi-icon"
 * @param {Object} [breakpoints] - Puntos de quiebre personalizados {mobile: 768, tablet: 1024, desktop: 1200}
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
const HeaderCardViewResponsive = React.memo(({
  title,
  description,
  badge,
  // Vista y contenido con configuración responsiva
  views = ["web", "table", "movil"], // [desktop, tablet, mobile]
  breakpoints = { mobile: 768, tablet: 1024, desktop: 1200 },
  viewWeb,
  viewTable,
  viewMovil,
  // Slots con nomenclatura consistente
  contentTopRight,    // Área superior derecha: botones de acción, controles principales
  contentBottomLeft,  // Área inferior izquierda: inputs, selects, filtros, etc.
  contentBottomRight, // Área inferior derecha: botones, controles, ordenamiento, etc.
  // Estilos
  className,
  contentClassName,
  enableTransitions = true
}) => {
  const { currentView, responsiveView, isMobile, isManualOverride, setManualView } = useResponsiveView(views, breakpoints);

  const handleViewChange = React.useCallback((view) => {
    // Si view es null, resetear a modo responsivo automático
    setManualView(view);
  }, [setManualView]);

  const renderContent = React.useCallback(() => {
    // Lógica de fallback inteligente según los requisitos
    const getViewContent = (viewType) => {
      switch (viewType) {
        case 'web':
          return viewWeb; // Siempre mostrar viewWeb si está disponible
        
        case 'table':
          // Si no hay viewTable, usar viewWeb como fallback
          return viewTable || viewWeb;
        
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
      return (
        <div className="card">
          <div className="card-body text-center text-muted p-5">
            <i className="mdi mdi-eye-off fs-1 mb-3 d-block"></i>
            <h6>Vista {currentView} no configurada</h6>
            <p className="mb-0">Proporciona el contenido para esta vista</p>
          </div>
        </div>
      );
    }

    return selectedContent;
  }, [currentView, viewWeb, viewTable, viewMovil]);

  return (
    <React.Fragment>
      <HeaderCardViews
        title={title}
        description={description}
        badge={badge}
        currentView={currentView}
        onViewChange={handleViewChange} // Permitir cambio manual
        views={views}
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

HeaderCardViewResponsive.propTypes = {
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
  views: PropTypes.arrayOf(PropTypes.string), // Acepta cualquier string para permitir vistas personalizadas
  breakpoints: PropTypes.shape({
    mobile: PropTypes.number,
    tablet: PropTypes.number,
    desktop: PropTypes.number
  }),
  viewWeb: PropTypes.node,
  viewTable: PropTypes.node,
  viewMovil: PropTypes.node,
  contentTopRight: PropTypes.node,    // Área superior derecha
  contentBottomLeft: PropTypes.node,  // Área inferior izquierda  
  contentBottomRight: PropTypes.node, // Área inferior derecha
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  enableTransitions: PropTypes.bool
};

HeaderCardViews.displayName = "HeaderCardViews";
HeaderCardViewResponsive.displayName = "HeaderCardViewResponsive";

// Exportar componentes y hook
export { HeaderCardViews, HeaderCardViewResponsive, useResponsiveView };
export default HeaderCardViews;