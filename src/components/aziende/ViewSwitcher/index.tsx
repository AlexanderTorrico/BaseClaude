import React, { createContext, useContext, useMemo } from 'react';
// Context para compartir la información de vista entre componentes
const ViewSwitcherContext = createContext({
  currentView: null,
  viewRenderers: {}
});

/**
 * Hook para acceder al contexto de vista
 */
export const useViewSwitcher = () => {
  const context = useContext(ViewSwitcherContext);
  if (!context) {
    throw new Error('useViewSwitcher must be used within ViewSwitcher');
  }
  return context;
};

/**
 * ViewSwitcher - Componente que maneja el cambio de vistas sin re-renderizar
 * el componente padre (como FilterSummary)
 */
const ViewSwitcher = ({ currentView, children }) => {
  const [viewRenderers, setViewRenderers] = React.useState({});

  // Funciones para configurar las vistas
  const setViewWeb = React.useCallback((renderer) => {
    setViewRenderers(prev => ({ ...prev, viewWeb: renderer }));
  }, []);

  const setViewTable = React.useCallback((renderer) => {
    setViewRenderers(prev => ({ ...prev, viewTable: renderer }));
  }, []);

  const setViewMovil = React.useCallback((renderer) => {
    setViewRenderers(prev => ({ ...prev, viewMovil: renderer }));
  }, []);

  // Determinar qué vista renderizar basada en currentView
  const getCurrentRenderer = () => {
    switch (currentView) {
      case '0': // Vista web (desktop)
      case 'web':
        return viewRenderers.viewWeb;
      case '1': // Vista tabla (tablet)
      case 'table':
        return viewRenderers.viewTable || viewRenderers.viewWeb;
      case '2': // Vista móvil
      case 'movil':
        return viewRenderers.viewMovil || viewRenderers.viewTable || viewRenderers.viewWeb;
      default:
        return viewRenderers.viewWeb;
    }
  };

  const contextValue = useMemo(() => ({
    currentView,
    viewRenderers,
    setViewWeb,
    setViewTable,
    setViewMovil,
    getCurrentRenderer
  }), [currentView, viewRenderers, setViewWeb, setViewTable, setViewMovil]);

  return (
    <ViewSwitcherContext.Provider value={contextValue}>
      {children}
    </ViewSwitcherContext.Provider>
  );
};

export default ViewSwitcher;

