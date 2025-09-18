import React from 'react';
import { useViewSwitcher } from './index';

/**
 * ViewRenderer - Componente que renderiza la vista actual basada en el contexto
 */
const ViewRenderer = ({ children, ...props }) => {
  const { getCurrentRenderer } = useViewSwitcher();

  const currentRenderer = getCurrentRenderer();

  if (!currentRenderer) {
    return null;
  }

  // Si el renderer es una función, ejecutarla con las props
  if (typeof currentRenderer === 'function') {
    return currentRenderer(props);
  }

  // Si es un componente, renderizarlo
  return currentRenderer;
};

export default ViewRenderer;
