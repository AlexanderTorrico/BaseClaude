import React from "react";
import PropTypes from "prop-types";
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
  view1 = "0",
  setView1,
  view2 = "0",
  setView2,
  view3 = "0",
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
      <h4 className="mb-3 text-primary">HeaderCard (Componente Base)</h4>
      
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

      <h4 className="mb-3 mt-5 text-success">HeaderCardViews (Con Cambio de Vista)</h4>

      {/* Ejemplo 4: HeaderCardViews con contenido dinámico */}
      <HeaderCardViews
        title="Gestión de Usuarios"
        description="Sistema de usuarios con pestañas"
        badge="156 usuarios"
        currentView={view1}
        onViewChange={setView1}
        views={[
          { 
            name: "Lista", 
            icon: "mdi-view-list", 
            content: <div className="p-3 bg-light rounded">Vista de lista de usuarios</div>
          },
          { 
            name: "Cards", 
            icon: "mdi-card-multiple", 
            content: <div className="p-3 bg-success bg-opacity-10 rounded">Vista de cards de usuarios</div>
          },
          { 
            name: "Grid", 
            icon: "mdi-view-grid", 
            content: <div className="p-3 bg-info bg-opacity-10 rounded">Vista de grid de usuarios</div>
          }
        ]}
        contentTopRight={
          <NewUserActions 
            onNew={handleNewUser}
            onExport={handleExport}
          />
        }
      />

      {/* Ejemplo 5: HeaderCardViews con pestañas de productos */}
      <HeaderCardViews
        title="Catálogo de Productos"
        description="Gestión de inventario con vistas"
        badge="🛒 En línea"
        currentView={view2}
        onViewChange={setView2}
        views={[
          { 
            name: "Catálogo", 
            icon: "mdi-storefront", 
            content: <div className="p-3 bg-primary bg-opacity-10 rounded">Catálogo completo de productos</div>
          },
          { 
            name: "Inventario", 
            icon: "mdi-package-variant", 
            content: <div className="p-3 bg-warning bg-opacity-10 rounded">Control de inventario y stock</div>
          },
          { 
            name: "Reportes", 
            icon: "mdi-chart-bar", 
            content: <div className="p-3 bg-secondary bg-opacity-10 rounded">Reportes de ventas y estadísticas</div>
          }
        ]}
        contentTopRight={
          <ProductActions 
            onAdd={handleAddProduct}
            onSettings={handleSettings}
          />
        }
      />

      <h4 className="mb-3 mt-5 text-info">HeaderCardViews con Iconos Personalizados</h4>

      {/* Ejemplo 6: HeaderCardViews con sistema completo */}
      <HeaderCardViews
        title="Sistema de Administración"
        description="Panel de control con múltiples secciones"
        badge="15 activos"
        currentView={view3}
        onViewChange={setView3}
        views={[
          { 
            name: "Dashboard", 
            icon: "mdi-view-dashboard", 
            content: <div className="p-4 bg-primary bg-opacity-10 rounded">
              <h6>Panel de Control</h6>
              <p className="mb-0">Resumen general del sistema</p>
            </div>
          },
          { 
            name: "Usuarios", 
            icon: "mdi-account-group", 
            content: <div className="p-4 bg-success bg-opacity-10 rounded">
              <h6>Gestión de Usuarios</h6>
              <p className="mb-0">Administrar cuentas y permisos</p>
            </div>
          },
          { 
            name: "Configuración", 
            icon: "mdi-cog", 
            content: <div className="p-4 bg-info bg-opacity-10 rounded">
              <h6>Configuración del Sistema</h6>
              <p className="mb-0">Ajustes generales y parámetros</p>
            </div>
          }
        ]}
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