import React from "react";
import PropTypes from "prop-types";
import { H4 } from "../../../../../components/Atoms";
import HeaderCard from "../../../../../components/HeaderCard";
import { HeaderCardViews } from "../../../../../components/HeaderCardViews";
import { 
  NewUserActions, 
  ProductActions, 
  CustomViewActions 
} from "../content/ActionButtons";

/**
 * BasicExamples - Ejemplos básicos de uso de HeaderCard y HeaderCardViews
 * Componente que demuestra los casos de uso fundamentales
 */
const BasicExamples = React.memo(({
  view1,
  setView1,
  view2,
  setView2,
  view3,
  setView3
}) => {
  // Handlers optimizados para los ejemplos básicos
  const handleNewUser = React.useCallback(() => {
    console.log('Nuevo usuario');
  }, []);

  const handleExport = React.useCallback(() => {
    console.log('Exportar datos');
  }, []);

  const handleAddProduct = React.useCallback(() => {
    console.log('Agregar producto');
  }, []);

  const handleSettings = React.useCallback(() => {
    console.log('Configuración');
  }, []);

  const handleConfigure = React.useCallback(() => {
    console.log('Configurar sistema');
  }, []);

  return (
    <React.Fragment>
      <H4 className="mb-3 text-primary">HeaderCard (Componente Base)</H4>
      
      {/* Ejemplo 1: Header básico */}
      <HeaderCard
        title="Header Básico"
        description="Ejemplo simple con solo título y descripción"
      />

      {/* Ejemplo 2: Header con badge */}
      <HeaderCard
        title="Header con Badge"
        description="Ejemplo con contador de resultados"
        showBadge={true}
        badgeCount={45}
        badgeTotal={120}
        badgeColor="success"
      />

      {/* Ejemplo 3: Header con acciones personalizadas */}
      <HeaderCard
        title="Header con Acciones Personalizadas"
        description="Ejemplo con botones personalizados en la parte superior derecha"
        showBadge={true}
        badgeText="🔥 Activo"
        badgeColor="warning"
        contentTopRight={
          <NewUserActions 
            onNew={handleNewUser}
            onExport={handleExport}
          />
        }
      />

      <H4 className="mb-3 mt-5 text-success">HeaderCardViews (Con Cambio de Vista)</H4>

      {/* Ejemplo 4: HeaderCardViews básico optimizado */}
      <HeaderCardViews
        title="Gestión de Usuarios"
        description={`Sistema de usuarios - Vista: ${view1}`}
        badge={{ count: 156, total: 500 }}
        currentView={view1}
        views={['web', 'table', 'movil']}
        onViewChange={setView1}
        contentTopRight={
          <NewUserActions 
            onNew={handleNewUser}
            onExport={handleExport}
          />
        }
      />

      {/* Ejemplo 5: HeaderCardViews con 3 vistas */}
      <HeaderCardViews
        title="Catálogo de Productos"
        description={`Gestión de inventario - Vista: ${view2}`}
        badge="🛒 En línea"
        currentView={view2}
        onViewChange={setView2}
        views={['web', 'table', 'movil']}
        contentTopRight={
          <ProductActions 
            onAdd={handleAddProduct}
            onSettings={handleSettings}
          />
        }
      />

      <H4 className="mb-3 mt-5 text-info">HeaderCardViews con Iconos Personalizados</H4>

      {/* Ejemplo 6: HeaderCardViews con iconos personalizados */}
      <HeaderCardViews
        title="Sistema con Vistas Personalizadas"
        description={`Ejemplo con iconos personalizados - Vista: ${view3}`}
        badge={{ count: 15, total: 30, color: "info" }}
        currentView={view3}
        onViewChange={setView3}
        views={['admin:mdi-shield-account', 'reportes:mdi-chart-line', 'config:mdi-cog']}
        contentTopRight={
          <CustomViewActions onConfigure={handleConfigure} />
        }
      />
    </React.Fragment>
  );
});

BasicExamples.propTypes = {
  view1: PropTypes.string.isRequired,
  setView1: PropTypes.func.isRequired,
  view2: PropTypes.string.isRequired,
  setView2: PropTypes.func.isRequired,
  view3: PropTypes.string.isRequired,
  setView3: PropTypes.func.isRequired
};

BasicExamples.displayName = "BasicExamples";

export default BasicExamples;