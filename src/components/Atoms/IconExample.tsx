import React from 'react';
import { Icon, Avatar, Typography } from './index';

/**
 * Función helper para simplificar nombres a iniciales
 * @param {string} fullName - Nombre completo
 * @returns {string} Iniciales simplificadas
 */
const getSimplifiedName = (fullName) => {
  if (!fullName) return '?';
  
  const words = fullName.trim().split(' ').filter(word => word.length > 0);
  
  if (words.length === 0) return '?';
  if (words.length === 1) {
    // Si es una sola palabra, tomar las primeras 2 letras
    return words[0].substring(0, 2).toUpperCase();
  }
  
  // Si son múltiples palabras, tomar la primera letra de cada una (máximo 2)
  return words
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};

/**
 * Componente personalizado que combina Icon con texto simplificado
 */
const TextIcon = ({ name, size = 'md', color = 'primary', ...props }) => {
  const initials = getSimplifiedName(name);
  
  // Estilos de tamaño con tamaños correctos
  const sizeStyles = {
    xs: { width: '24px', height: '24px', fontSize: '0.75rem' },
    sm: { width: '32px', height: '32px', fontSize: '0.875rem' },
    md: { width: '40px', height: '40px', fontSize: '1rem' },
    lg: { width: '48px', height: '48px', fontSize: '1.125rem' },
    xl: { width: '56px', height: '56px', fontSize: '1.25rem' },
    '2xl': { width: '64px', height: '64px', fontSize: '1.5rem' }
  };

  const colorClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-success text-white',
    danger: 'bg-danger text-white',
    warning: 'bg-warning text-dark',
    info: 'bg-info text-white'
  };

  const textSizes = {
    xs: '0.65rem',
    sm: '0.75rem',
    md: '0.85rem',
    lg: '0.9rem',
    xl: '0.95rem',
    '2xl': '1rem'
  };
  
  return (
    <div className="d-inline-flex flex-column align-items-center gap-1">
      <div 
        className={`d-flex align-items-center justify-content-center rounded-circle fw-bold ${colorClasses[color]}`}
        style={sizeStyles[size]}
        {...props}
      >
        {initials}
      </div>
      <Typography 
        variant="small" 
        className="text-center text-muted"
        style={{ fontSize: textSizes[size] }}
      >
        {name}
      </Typography>
    </div>
  );
};

/**
 * Ejemplos de uso del sistema de íconos
 */
const IconExamples = () => {
  const nombres = [
    "Alexander Torrico",
    "Alexander",
    "María García López", 
    "Juan",
    "Ana Isabel Martín",
    "Carlos"
  ];

  return (
    <div className="p-4">
      <Typography variant="h4" className="mb-4">
        Ejemplos del Sistema de Íconos
      </Typography>

      {/* Ejemplo 1: Íconos con texto simplificado */}
      <div className="mb-5">
        <Typography variant="h5" className="mb-3">
          🔤 Íconos con Texto Simplificado
        </Typography>
        <div className="d-flex flex-wrap gap-3">
          {nombres.map((nombre, index) => (
            <TextIcon 
              key={index}
              name={nombre}
              size="lg"
              color={index % 2 === 0 ? 'primary' : 'success'}
            />
          ))}
        </div>
      </div>

      {/* Ejemplo 2: Diferentes tamaños */}
      <div className="mb-5">
        <Typography variant="h5" className="mb-3">
          📏 Diferentes Tamaños
        </Typography>
        <div className="d-flex flex-wrap gap-3 align-items-end">
          <TextIcon name="Alexander Torrico" size="xs" color="primary" />
          <TextIcon name="Alexander Torrico" size="sm" color="secondary" />
          <TextIcon name="Alexander Torrico" size="md" color="success" />
          <TextIcon name="Alexander Torrico" size="lg" color="danger" />
          <TextIcon name="Alexander Torrico" size="xl" color="warning" />
          <TextIcon name="Alexander Torrico" size="2xl" color="info" />
        </div>
      </div>

      {/* Ejemplo 3: Comparación con Avatar */}
      <div className="mb-5">
        <Typography variant="h5" className="mb-3">
          👤 Comparación: TextIcon vs Avatar
        </Typography>
        <div className="row">
          <div className="col-md-6">
            <Typography variant="h6" className="mb-2">TextIcon personalizado:</Typography>
            <div className="d-flex gap-2">
              <TextIcon name="Alexander Torrico" size="lg" color="primary" />
              <TextIcon name="María García" size="lg" color="success" />
              <TextIcon name="Juan" size="lg" color="danger" />
            </div>
          </div>
          <div className="col-md-6">
            <Typography variant="h6" className="mb-2">Avatar estándar:</Typography>
            <div className="d-flex gap-2">
              <Avatar name="Alexander Torrico" size="lg" variant="primary" />
              <Avatar name="María García" size="lg" variant="success" />
              <Avatar name="Juan" size="lg" variant="danger" />
            </div>
          </div>
        </div>
      </div>

      {/* Ejemplo 4: Con imágenes */}
      <div className="mb-5">
        <Typography variant="h5" className="mb-3">
          🖼️ Íconos con Imágenes
        </Typography>
        <div className="d-flex gap-3">
          <div className="d-flex flex-column align-items-center gap-1">
            <Avatar 
              src="https://via.placeholder.com/48/007bff/white?text=AT" 
              alt="Alexander Torrico"
              size="lg"
            />
            <Typography variant="small" className="text-muted">
              Alexander Torrico
            </Typography>
          </div>
          <div className="d-flex flex-column align-items-center gap-1">
            <Avatar 
              src="https://via.placeholder.com/48/28a745/white?text=MG" 
              alt="María García"
              size="lg"
            />
            <Typography variant="small" className="text-muted">
              María García
            </Typography>
          </div>
        </div>
      </div>

      {/* Ejemplo 5: Estados y funcionalidad */}
      <div className="mb-5">
        <Typography variant="h5" className="mb-3">
          🎯 Estados y Funcionalidad
        </Typography>
        <div className="d-flex gap-3">
          <TextIcon 
            name="Alexander Torrico" 
            size="lg" 
            color="primary"
            onClick={() => alert('¡Clicked Alexander Torrico!')}
            style={{ cursor: 'pointer' }}
            title="Click me!"
          />
          <Avatar 
            name="Usuario Online"
            size="lg"
            variant="success"
            status="online"
            showStatus
            onClick={() => alert('¡Usuario online!')}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
};

// Exportar tanto el componente de ejemplos como el helper
export { getSimplifiedName, TextIcon };
export default IconExamples;
