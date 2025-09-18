/**
 * Componente de prueba para verificar optimizaciones de rendimiento
 * 
 * Este archivo contiene casos de prueba para validar que las optimizaciones
 * de React.memo, useMemo y useCallback están funcionando correctamente.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Button, Input, Avatar, Typography, Checkbox, Badge 
} from './index';

// Contador para rastrear renders
let renderCount = 0;

const PerformanceTest = () => {
  const [count, setCount] = useState(0);
  const [unrelatedState, setUnrelatedState] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);

  // Handler estable con useCallback
  const handleButtonClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const handleCheckboxChange = useCallback((e) => {
    setCheckboxValue(e.target.checked);
  }, []);

  // Contador de renders
  useEffect(() => {
    renderCount++;
    console.log(`PerformanceTest render count: ${renderCount}`);
  });

  return (
    <div className="container mt-4">
      <Typography variant="h2" className="mb-4">
        🚀 Pruebas de Rendimiento - Componentes Atoms
      </Typography>

      {/* Información de renders */}
      <div className="alert alert-info mb-4">
        <Typography variant="strong">Renders totales: {renderCount}</Typography>
        <br />
        <Typography variant="small">
          Los componentes optimizados no deberían re-renderizarse cuando cambia 'unrelatedState'
        </Typography>
      </div>

      {/* Controles de prueba */}
      <div className="row mb-4">
        <div className="col-md-4">
          <Button 
            variant="primary" 
            onClick={() => setUnrelatedState(Date.now().toString())}
            className="mb-2"
          >
            Cambiar Estado No Relacionado
          </Button>
          <br />
          <Typography variant="small" color="muted">
            Esto NO debería re-renderizar los componentes de abajo
          </Typography>
        </div>

        <div className="col-md-4">
          <Button 
            variant="success" 
            onClick={handleButtonClick}
            className="mb-2"
          >
            Incrementar Contador ({count})
          </Button>
          <br />
          <Typography variant="small" color="muted">
            Solo el botón debería re-renderizarse
          </Typography>
        </div>

        <div className="col-md-4">
          <Typography variant="small">
            Estado no relacionado: {unrelatedState.slice(-4)}
          </Typography>
        </div>
      </div>

      <hr />

      {/* Componentes bajo prueba */}
      <div className="row">
        <div className="col-lg-6">
          <Typography variant="h5" className="mb-3">
            🔘 Componentes Estáticos (No deberían re-renderizarse)
          </Typography>

          <div className="card p-3 mb-3">
            <Typography variant="h6">Button Estático</Typography>
            <StaticButton />
          </div>

          <div className="card p-3 mb-3">
            <Typography variant="h6">Avatar Estático</Typography>
            <StaticAvatar />
          </div>

          <div className="card p-3 mb-3">
            <Typography variant="h6">Badge Estático</Typography>
            <StaticBadge />
          </div>

          <div className="card p-3 mb-3">
            <Typography variant="h6">Typography Estático</Typography>
            <StaticTypography />
          </div>
        </div>

        <div className="col-lg-6">
          <Typography variant="h5" className="mb-3">
            🔄 Componentes Dinámicos (Deberían re-renderizarse solo cuando cambian sus props)
          </Typography>

          <div className="card p-3 mb-3">
            <Typography variant="h6">Input Dinámico</Typography>
            <DynamicInput value={inputValue} onChange={handleInputChange} />
          </div>

          <div className="card p-3 mb-3">
            <Typography variant="h6">Checkbox Dinámico</Typography>
            <DynamicCheckbox checked={checkboxValue} onChange={handleCheckboxChange} />
          </div>

          <div className="card p-3 mb-3">
            <Typography variant="h6">Button Dinámico</Typography>
            <DynamicButton count={count} onClick={handleButtonClick} />
          </div>
        </div>
      </div>

      {/* Instrucciones de prueba */}
      <div className="alert alert-warning mt-4">
        <Typography variant="h6">📋 Instrucciones de Prueba:</Typography>
        <ol>
          <li>Abre las DevTools de React (React Developer Tools)</li>
          <li>Ve a la pestaña "Profiler"</li>
          <li>Haz clic en "Cambiar Estado No Relacionado"</li>
          <li>Verifica que SOLO este componente padre se re-renderice</li>
          <li>Los componentes estáticos no deberían aparecer en el profiler</li>
          <li>Haz clic en "Incrementar Contador" y verifica que solo el botón dinámico cambie</li>
        </ol>
      </div>
    </div>
  );
};

// Componentes de prueba estáticos
const StaticButton = React.memo(() => {
  console.log('🔘 StaticButton rendered');
  return (
    <Button variant="outline-primary" fontWeight="normal">
      Botón Estático
    </Button>
  );
});

const StaticAvatar = React.memo(() => {
  console.log('👤 StaticAvatar rendered');
  return (
    <Avatar 
      name="Usuario Test" 
      variant="primary" 
      size="md"
      status="online"
      showStatus
    />
  );
});

const StaticBadge = React.memo(() => {
  console.log('🏷️ StaticBadge rendered');
  return (
    <Badge variant="success">Estático</Badge>
  );
});

const StaticTypography = React.memo(() => {
  console.log('📝 StaticTypography rendered');
  return (
    <Typography variant="p" color="muted">
      Este texto es estático y no debería re-renderizarse
    </Typography>
  );
});

// Componentes de prueba dinámicos
const DynamicInput = React.memo(({ value, onChange }) => {
  console.log('📝 DynamicInput rendered with value:', value);
  return (
    <Input
      label="Input de Prueba"
      value={value}
      onChange={onChange}
      placeholder="Escribe algo..."
    />
  );
});

const DynamicCheckbox = React.memo(({ checked, onChange }) => {
  console.log('☑️ DynamicCheckbox rendered with checked:', checked);
  return (
    <Checkbox
      label="Checkbox de Prueba"
      checked={checked}
      onChange={onChange}
    />
  );
});

const DynamicButton = React.memo(({ count, onClick }) => {
  console.log('🔘 DynamicButton rendered with count:', count);
  return (
    <Button 
      variant="info" 
      onClick={onClick}
      fontWeight="normal"
    >
      Clicks: {count}
    </Button>
  );
});

// Test de stress - muchos componentes
export const StressTest = () => {
  const [trigger, setTrigger] = useState(0);

  return (
    <div className="container mt-4">
      <Typography variant="h2" className="mb-4">
        💪 Stress Test - 1000 Componentes
      </Typography>

      <Button 
        variant="danger" 
        onClick={() => setTrigger(prev => prev + 1)}
        className="mb-3"
      >
        Trigger Re-render ({trigger})
      </Button>

      <div className="row">
        {Array.from({ length: 1000 }, (_, index) => (
          <div key={index} className="col-1">
            <Avatar 
              name={`User${index}`}
              size="xs"
              variant={['primary', 'success', 'danger', 'warning', 'info'][index % 5]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Test de responsividad
export const ResponsiveTest = () => {
  return (
    <div className="container mt-4">
      <Typography variant="h2" className="mb-4">
        📱 Responsive Test
      </Typography>

      <div className="alert alert-info">
        <Typography>
          Redimensiona la ventana para ver cómo se adaptan los componentes
        </Typography>
      </div>

      <div className="row">
        <div className="col-12 col-md-6 col-lg-4">
          <Button fullWidth variant="primary" className="mb-2">
            Botón Responsivo
          </Button>
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input 
            label="Input Responsivo"
            placeholder="Se adapta al tamaño"
            className="mb-2"
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <div className="d-flex align-items-center">
            <Avatar name="Responsive User" className="me-2" />
            <Typography truncate>
              Avatar con texto que se trunca en pantallas pequeñas
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTest;
