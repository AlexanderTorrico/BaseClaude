import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import AzHeaderCard from "./AzHeaderCard";

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
 * AzHeaderCardViews con sistema de pestañas integrado
 * Componente de header con cambio de vistas y contenido dinámico
 *
 * @param {string} title - Título principal del header
 * @param {string} [description] - Descripción opcional del header
 * @param {string|Object} [badge] - Badge simple (string) o complejo {count, total, color, text}
 * @param {string} [currentView="0"] - Vista actualmente seleccionada (índice de la vista)
 * @param {function} [onViewChange] - Función callback para cambio de vista
 * @param {Array} [views] - Array de vistas: objetos {name, icon, content} o strings (compatibilidad)
 * @param {Array} [contents] - Array de contenidos para usar como slots adicionales
 * @param {React.ReactNode} [contentTopRight] - Contenido del área superior derecha
 * @param {React.ReactNode} [contentBottomLeft] - Contenido del área inferior izquierda
 * @param {React.ReactNode} [contentBottomRight] - Contenido del área inferior derecha
 * @param {string} [className] - Clases CSS adicionales
 * @param {boolean} [hideViewButtons=false] - Oculta los botones de cambio de vista
 * @param {boolean} [responsiveMode=false] - Indica si está en modo responsivo (solo lectura)
 */
const AzHeaderCardViews = React.memo(({
  title,
  description,
  // Badge simplificado
  badge,
  // Vista actual y cambio
  currentView = "0",
  onViewChange,
  views = ["table", "cards"],
  contents = [], // Array de contenidos adicionales
  // Slots de contenido
  contentTopRight,
  contentBottomLeft,
  contentBottomRight,
  // Configuración responsiva
  hideViewButtons = false,
  responsiveMode = false,
  isManualOverride = false,
  responsiveView,
  // Estilos opcionales
  className
}) => {

  // Normalizar vistas a objetos consistentes
  const normalizedViews = React.useMemo(() => {
    return views.map((view, index) => normalizeViewConfig(view, index));
  }, [views]);

  const renderViewButtons = React.useCallback(() => {
    // Ocultar botones si está configurado o si hay menos de 2 vistas
    if (hideViewButtons || normalizedViews.length < 2) return null;

    return (
      <div className="btn-group d-none d-md-flex me-2" role="group">
        {normalizedViews.map((viewConfig, index) => {
          const isActive = currentView === viewConfig.key;
          const isResponsiveMatch = responsiveView === viewConfig.key;

          return (
            <Button
              key={`${viewConfig.key}-${index}`}
              color={isActive ? 'primary' : 'light'}
              onClick={() => onViewChange && onViewChange(viewConfig.key)}
              size="sm"
              title={responsiveMode ?
                `${viewConfig.title} ${isResponsiveMatch ? '(Vista responsiva)' : '(Override manual)'}` :
                viewConfig.title
              }
              style={{
                position: 'relative'
              }}
            >
              <i className={`mdi ${viewConfig.icon}`}></i>
              <span className="d-none d-lg-inline ms-1">{viewConfig.name}</span>
            </Button>
          );
        })}
      </div>
    );
  }, [normalizedViews, currentView, responsiveView, hideViewButtons, onViewChange, responsiveMode]);

  // Determinar badge props (memoizado para rendimiento)
  const badgeProps = React.useMemo(() => {
    if (!badge) return {};

    if (typeof badge === 'string') {
      return {
        showBadge: true,
        badgeText: badge
      };
    }

    if (typeof badge === 'object') {
      return {
        showBadge: true,
        badgeText: badge.text,
        badgeCount: badge.count,
        badgeTotal: badge.total,
        badgeColor: badge.color || "info"
      };
    }

    return {};
  }, [badge]);

  // Renderizar contenido de la vista activa
  const renderActiveViewContent = React.useCallback(() => {
    const activeView = normalizedViews.find(view => view.key === currentView);
    if (activeView && activeView.content) {
      return (
        <div className="mt-3">
          {activeView.content}
        </div>
      );
    }
    return null;
  }, [normalizedViews, currentView]);

  // Combinar contenido superior derecho con botones de vista y contenidos adicionales
  const combinedContentTopRight = React.useMemo(() => {
    const elements = [];

    // Agregar botones de vista
    const viewButtons = renderViewButtons();
    if (viewButtons) {
      elements.push(viewButtons);
    }

    // Agregar contenido superior derecho
    if (contentTopRight) {
      elements.push(contentTopRight);
    }

    // Agregar primer elemento del array contents si existe
    if (contents && contents[0]) {
      elements.push(contents[0]);
    }

    return elements.length > 0 ? (
      <div className="d-flex flex-wrap gap-2 justify-content-lg-end justify-content-center">
        {elements.map((element, index) => (
          <React.Fragment key={index}>{element}</React.Fragment>
        ))}
      </div>
    ) : null;
  }, [renderViewButtons, contentTopRight, contents]);

  // Combinar contenido inferior izquierdo con elementos adicionales del array contents
  const combinedContentBottomLeft = React.useMemo(() => {
    if (contentBottomLeft && contents && contents[1]) {
      return (
        <div className="d-flex flex-wrap gap-2 align-items-center">
          {contentBottomLeft}
          {contents[1]}
        </div>
      );
    }
    return contentBottomLeft || (contents && contents[1]) || null;
  }, [contentBottomLeft, contents]);

  // Combinar contenido inferior derecho con elementos adicionales del array contents
  const combinedContentBottomRight = React.useMemo(() => {
    if (contentBottomRight && contents && contents[2]) {
      return (
        <div className="d-flex flex-wrap gap-2 align-items-center">
          {contentBottomRight}
          {contents[2]}
        </div>
      );
    }
    return contentBottomRight || (contents && contents[2]) || null;
  }, [contentBottomRight, contents]);

  return (
    <React.Fragment>
      <AzHeaderCard
        title={title}
        description={description}
        {...badgeProps}
        showBottomRow={!!(combinedContentBottomLeft || combinedContentBottomRight)}
        contentTopRight={combinedContentTopRight}
        bottomLeftSlot={combinedContentBottomLeft}
        bottomRightSlot={combinedContentBottomRight}
        className={className}
      />
      {renderActiveViewContent()}
    </React.Fragment>
  );
});

AzHeaderCardViews.propTypes = {
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
  views: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string, // Compatibilidad hacia atrás
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        key: PropTypes.string,
        title: PropTypes.string,
        content: PropTypes.node // Contenido a mostrar cuando se selecciona esta vista
      })
    ])
  ),
  contents: PropTypes.arrayOf(PropTypes.node), // Array de contenidos adicionales
  contentTopRight: PropTypes.node,
  contentBottomLeft: PropTypes.node,
  contentBottomRight: PropTypes.node,
  hideViewButtons: PropTypes.bool,
  responsiveMode: PropTypes.bool,
  isManualOverride: PropTypes.bool,
  responsiveView: PropTypes.string,
  className: PropTypes.string
};

AzHeaderCardViews.displayName = "AzHeaderCardViews";

export default AzHeaderCardViews;