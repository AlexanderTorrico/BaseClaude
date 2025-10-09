import React from 'react';
import { Spinner } from 'reactstrap';

interface LoadingProps {
  /**
   * Altura del contenedor de loading
   * @default 400
   */
  size?: number | string;
  /**
   * Mensaje personalizado
   * @default "Cargando..."
   */
  message?: string;
  /**
   * Color del spinner
   * @default "primary"
   */
  color?: string;
}

/**
 * Componente de Loading compartido
 * Muestra un spinner centrado con mensaje
 */
export const Loading: React.FC<LoadingProps> = ({
  size = 400,
  message = "Cargando...",
  color = "primary"
}) => {
  const height = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height, minHeight: '200px' }}
    >
      <Spinner color={color} style={{ width: '3rem', height: '3rem' }} />
      <p className="mt-3 text-muted">{message}</p>
    </div>
  );
};

export default Loading;
