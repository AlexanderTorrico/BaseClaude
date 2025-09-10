import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";

/**
 * ActionButtons - Componentes de botones de acción reutilizables
 * Conjunto de botones optimizados para contentTopRight de Headers
 */

// Botón primario para agregar/crear nuevos elementos
export const NewButton = React.memo(({ 
  text = "Nuevo", 
  icon = "mdi-plus", 
  color = "primary", 
  onClick,
  size = "sm" 
}) => (
  <Button color={color} size={size} onClick={onClick}>
    <i className={`mdi ${icon} me-1`}></i>
    {text}
  </Button>
));

NewButton.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
  size: PropTypes.string
};

// Botón para exportar datos
export const ExportButton = React.memo(({ 
  text = "Exportar", 
  icon = "mdi-export", 
  color = "success", 
  outline = true,
  onClick,
  size = "sm" 
}) => (
  <Button color={color} outline={outline} size={size} onClick={onClick}>
    <i className={`mdi ${icon} me-1`}></i>
    {text}
  </Button>
));

ExportButton.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  outline: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.string
};

// Botón para actualizar/refrescar
export const RefreshButton = React.memo(({ 
  text = "Actualizar", 
  icon = "mdi-refresh", 
  color = "primary", 
  onClick,
  size = "sm" 
}) => (
  <Button color={color} size={size} onClick={onClick}>
    <i className={`mdi ${icon} me-1`}></i>
    {text}
  </Button>
));

RefreshButton.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
  size: PropTypes.string
};

// Botón de configuración/settings
export const SettingsButton = React.memo(({ 
  icon = "mdi-cog", 
  color = "secondary", 
  outline = true,
  onClick,
  size = "sm",
  title = "Configuración"
}) => (
  <Button color={color} outline={outline} size={size} onClick={onClick} title={title}>
    <i className={`mdi ${icon}`}></i>
  </Button>
));

SettingsButton.propTypes = {
  icon: PropTypes.string,
  color: PropTypes.string,
  outline: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.string,
  title: PropTypes.string
};

// Botón de descarga
export const DownloadButton = React.memo(({ 
  icon = "mdi-download", 
  color = "info", 
  outline = true,
  onClick,
  size = "sm",
  title = "Descargar"
}) => (
  <Button color={color} outline={outline} size={size} onClick={onClick} title={title}>
    <i className={`mdi ${icon}`}></i>
  </Button>
));

DownloadButton.propTypes = {
  icon: PropTypes.string,
  color: PropTypes.string,
  outline: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.string,
  title: PropTypes.string
};

// Grupo de botones predefinidos para casos comunes
export const NewUserActions = React.memo(({ onNew, onExport }) => (
  <div className="d-flex flex-wrap gap-2">
    <NewButton 
      text="Nuevo Usuario"
      onClick={onNew}
    />
    <ExportButton 
      onClick={onExport}
    />
  </div>
));

NewUserActions.propTypes = {
  onNew: PropTypes.func,
  onExport: PropTypes.func
};

export const ProductActions = React.memo(({ onAdd, onSettings }) => (
  <div className="d-flex flex-wrap gap-2">
    <NewButton 
      text="Agregar"
      onClick={onAdd}
    />
    <SettingsButton 
      onClick={onSettings}
    />
  </div>
));

ProductActions.propTypes = {
  onAdd: PropTypes.func,
  onSettings: PropTypes.func
};

export const DashboardActions = React.memo(({ onRefresh, onDownload }) => (
  <div className="d-flex flex-wrap gap-2">
    <RefreshButton 
      onClick={onRefresh}
    />
    <DownloadButton 
      onClick={onDownload}
    />
  </div>
));

DashboardActions.propTypes = {
  onRefresh: PropTypes.func,
  onDownload: PropTypes.func
};

// Botón personalizable genérico
export const CustomActionButton = React.memo(({ 
  text, 
  icon, 
  color = "primary", 
  outline = false,
  onClick,
  size = "sm",
  className = "" 
}) => (
  <Button 
    color={color} 
    outline={outline} 
    size={size} 
    onClick={onClick}
    className={className}
  >
    {icon && <i className={`mdi ${icon} me-1`}></i>}
    {text}
  </Button>
));

CustomActionButton.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  outline: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.string,
  className: PropTypes.string
};