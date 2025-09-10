import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";

/**
 * ViewActionButtons - Botones especializados para vistas específicas
 * Componentes que combinan múltiples acciones para casos específicos
 */

// Botones para vista de usuarios
export const UserViewActions = React.memo(({ onNew, onExport }) => (
  <Button color="primary" size="sm" onClick={onNew}>
    <i className="mdi mdi-plus me-1"></i>
    Nuevo Usuario
  </Button>
));

UserViewActions.propTypes = {
  onNew: PropTypes.func,
  onExport: PropTypes.func
};

// Botones para vista de productos/catálogo
export const ProductViewActions = React.memo(({ onAdd, onSettings }) => (
  <div className="d-flex flex-wrap gap-2">
    <Button color="primary" size="sm" onClick={onAdd}>
      <i className="mdi mdi-plus me-1"></i>
      Agregar
    </Button>
    <Button color="secondary" outline size="sm" onClick={onSettings}>
      <i className="mdi mdi-cog"></i>
    </Button>
  </div>
));

ProductViewActions.propTypes = {
  onAdd: PropTypes.func,
  onSettings: PropTypes.func
};

// Botones para vista personalizada con iconos
export const CustomViewActions = React.memo(({ onConfigure }) => (
  <Button color="info" size="sm" onClick={onConfigure}>
    <i className="mdi mdi-settings me-1"></i>
    Configurar
  </Button>
));

CustomViewActions.propTypes = {
  onConfigure: PropTypes.func
};

// Botones para dashboard/panel de control
export const DashboardViewActions = React.memo(({ onRefresh, onDownload }) => (
  <div className="d-flex flex-wrap gap-2">
    <Button color="primary" size="sm" onClick={onRefresh}>
      <i className="mdi mdi-refresh me-1"></i>
      Actualizar
    </Button>
    <Button color="info" outline size="sm" onClick={onDownload}>
      <i className="mdi mdi-download"></i>
    </Button>
  </div>
));

DashboardViewActions.propTypes = {
  onRefresh: PropTypes.func,
  onDownload: PropTypes.func
};

// Botones para sistema responsivo
export const ResponsiveViewActions = React.memo(({ onNew }) => (
  <Button color="primary" size="sm" onClick={onNew}>
    <i className="mdi mdi-plus me-1"></i>
    Nuevo
  </Button>
));

ResponsiveViewActions.propTypes = {
  onNew: PropTypes.func
};

// Grupo de botones para barra de búsqueda (contentBottomLeft)
export const SearchViewGroup = React.memo(({ 
  searchValue,
  onSearchChange,
  placeholder = "Buscar elementos..."
}) => {
  const handleChange = React.useCallback((e) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  }, [onSearchChange]);

  return (
    <div className="input-group input-group-sm">
      <span className="input-group-text">
        <i className="mdi mdi-magnify"></i>
      </span>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
      />
    </div>
  );
});

SearchViewGroup.propTypes = {
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func,
  placeholder: PropTypes.string
};

// Grupo de botones para filtros avanzados (contentBottomRight)
export const FilterViewGroup = React.memo(({ 
  onFilter, 
  onSort, 
  filterText = "Filtros",
  sortText = "Ordenar"
}) => (
  <div className="d-flex gap-2 align-items-center justify-content-sm-end">
    <Button color="light" outline size="sm" onClick={onFilter}>
      <i className="mdi mdi-filter"></i>
      <span className="d-none d-lg-inline ms-1">{filterText}</span>
    </Button>
    <Button color="secondary" outline size="sm" onClick={onSort}>
      <i className="mdi mdi-sort"></i>
      <span className="d-none d-lg-inline ms-1">{sortText}</span>
    </Button>
  </div>
));

FilterViewGroup.propTypes = {
  onFilter: PropTypes.func,
  onSort: PropTypes.func,
  filterText: PropTypes.string,
  sortText: PropTypes.string
};

// Grupo específico para el ejemplo responsivo completo
export const ResponsiveFilterGroup = React.memo(({ onFilter }) => (
  <Button color="primary" outline size="sm" onClick={onFilter}>
    <i className="mdi mdi-filter"></i>
    <span className="d-none d-lg-inline ms-1">Filtrar</span>
  </Button>
));

ResponsiveFilterGroup.propTypes = {
  onFilter: PropTypes.func
};

// Componente de acciones combinadas para casos específicos
export const CombinedViewActions = React.memo(({ 
  type = "basic",
  onNew,
  onExport,
  onRefresh,
  onDownload,
  onSettings,
  onConfigure
}) => {
  const renderActions = React.useMemo(() => {
    switch (type) {
      case "users":
        return <UserViewActions onNew={onNew} onExport={onExport} />;
      case "products":
        return <ProductViewActions onAdd={onNew} onSettings={onSettings} />;
      case "dashboard":
        return <DashboardViewActions onRefresh={onRefresh} onDownload={onDownload} />;
      case "custom":
        return <CustomViewActions onConfigure={onConfigure} />;
      case "responsive":
        return <ResponsiveViewActions onNew={onNew} />;
      default:
        return <ResponsiveViewActions onNew={onNew} />;
    }
  }, [type, onNew, onExport, onRefresh, onDownload, onSettings, onConfigure]);

  return renderActions;
});

CombinedViewActions.propTypes = {
  type: PropTypes.oneOf(['basic', 'users', 'products', 'dashboard', 'custom', 'responsive']),
  onNew: PropTypes.func,
  onExport: PropTypes.func,
  onRefresh: PropTypes.func,
  onDownload: PropTypes.func,
  onSettings: PropTypes.func,
  onConfigure: PropTypes.func
};