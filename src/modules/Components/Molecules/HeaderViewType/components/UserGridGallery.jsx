import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";

// Datos mockeados optimizados para vista grid
const USERS_DATA = [
  {
    id: "001",
    name: "Juan Pérez",
    email: "juan@example.com",
    status: "Activo",
    statusColor: "success",
    avatar: { initials: "JP", bgColor: "primary" }
  },
  {
    id: "002",
    name: "María González",
    email: "maria@example.com",
    status: "Pendiente", 
    statusColor: "warning",
    avatar: { initials: "MG", bgColor: "success" }
  },
  {
    id: "003",
    name: "Carlos López",
    email: "carlos@example.com",
    status: "Activo",
    statusColor: "success", 
    avatar: { initials: "CL", bgColor: "info" }
  }
];

/**
 * UserGridGallery - Galería de usuarios en formato grid
 * Componente que muestra usuarios en cards verticales centradas con avatares grandes
 * 
 * @param {Function} [onEdit] - Callback cuando se hace click en editar usuario
 * @param {Function} [onDelete] - Callback cuando se hace click en eliminar usuario
 * @param {Array} [users] - Array de usuarios personalizados (opcional)
 * @param {string} [className] - Clases CSS adicionales
 * @param {string} [gridCols] - Clases de columnas para responsive (default: "col-lg-3 col-md-4 col-sm-6")
 */
const UserGridGallery = React.memo(({
  onEdit,
  onDelete,
  users = USERS_DATA,
  className = "",
  gridCols = "col-lg-3 col-md-4 col-sm-6"
}) => {
  // Memoizar handlers para optimización
  const handleEdit = React.useCallback((user) => {
    if (onEdit) {
      onEdit(user);
    } else {
      console.log('Editar usuario:', user);
    }
  }, [onEdit]);

  const handleDelete = React.useCallback((user) => {
    if (onDelete) {
      onDelete(user);
    } else {
      console.log('Eliminar usuario:', user);
    }
  }, [onDelete]);

  // Memoizar renderización de avatares grandes
  const renderLargeAvatar = React.useCallback((avatar) => (
    <div className="avatar-lg mx-auto mb-3">
      <div className={`avatar-lg rounded bg-${avatar.bgColor} d-flex align-items-center justify-content-center`}>
        <span className="text-white fs-4">{avatar.initials}</span>
      </div>
    </div>
  ), []);

  // Memoizar renderización de acciones
  const renderActions = React.useCallback((user) => (
    <div className="d-flex justify-content-center gap-1">
      <Button 
        color="primary" 
        size="sm"
        onClick={() => handleEdit(user)}
        title={`Editar ${user.name}`}
      >
        <i className="mdi mdi-pencil"></i>
      </Button>
      <Button 
        color="danger" 
        size="sm"
        onClick={() => handleDelete(user)}
        title={`Eliminar ${user.name}`}
      >
        <i className="mdi mdi-delete"></i>
      </Button>
    </div>
  ), [handleEdit, handleDelete]);

  // Memoizar renderización de cards individuales
  const renderUserCard = React.useCallback((user) => (
    <div key={user.id} className={gridCols}>
      <div className="card text-center">
        <div className="card-body">
          {renderLargeAvatar(user.avatar)}
          <h6>{user.name}</h6>
          <p className="text-muted">{user.email}</p>
          <span className={`badge bg-${user.statusColor} mb-3`}>
            {user.status}
          </span>
          {renderActions(user)}
        </div>
      </div>
    </div>
  ), [gridCols, renderLargeAvatar, renderActions]);

  return (
    <div className={`row ${className}`}>
      {users.map(renderUserCard)}
    </div>
  );
});

UserGridGallery.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      statusColor: PropTypes.string.isRequired,
      avatar: PropTypes.shape({
        initials: PropTypes.string.isRequired,
        bgColor: PropTypes.string.isRequired
      }).isRequired
    })
  ),
  className: PropTypes.string,
  gridCols: PropTypes.string
};

UserGridGallery.displayName = "UserGridGallery";

export default UserGridGallery;