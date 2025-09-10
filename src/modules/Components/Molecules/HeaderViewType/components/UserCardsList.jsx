import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";

// Datos mockeados optimizados con configuración de avatares
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
 * UserCardsList - Lista de cards horizontales de usuarios
 * Componente que muestra usuarios en formato cards con avatares
 * 
 * @param {Function} [onEdit] - Callback cuando se hace click en editar usuario
 * @param {Function} [onDelete] - Callback cuando se hace click en eliminar usuario
 * @param {Array} [users] - Array de usuarios personalizados (opcional)
 * @param {string} [className] - Clases CSS adicionales
 */
const UserCardsList = React.memo(({
  onEdit,
  onDelete,
  users = USERS_DATA,
  className = ""
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

  // Memoizar renderización de avatares
  const renderAvatar = React.useCallback((avatar) => (
    <div className={`avatar-sm rounded-circle bg-${avatar.bgColor} d-flex align-items-center justify-content-center`}>
      <span className="text-white">{avatar.initials}</span>
    </div>
  ), []);

  // Memoizar renderización de cards individuales
  const renderUserCard = React.useCallback((user) => (
    <div key={user.id} className="col-xl-4 col-md-6">
      <div className="card">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="flex-shrink-0 me-3">
              {renderAvatar(user.avatar)}
            </div>
            <div className="flex-grow-1">
              <h6 className="mb-1">{user.name}</h6>
              <p className="text-muted mb-2">{user.email}</p>
              <span className={`badge bg-${user.statusColor}`}>
                {user.status}
              </span>
            </div>
            <div className="flex-shrink-0">
              <Button 
                color="primary" 
                size="sm" 
                className="me-1"
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
          </div>
        </div>
      </div>
    </div>
  ), [handleEdit, handleDelete, renderAvatar]);

  return (
    <div className={`row ${className}`}>
      {users.map(renderUserCard)}
    </div>
  );
});

UserCardsList.propTypes = {
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
  className: PropTypes.string
};

UserCardsList.displayName = "UserCardsList";

export default UserCardsList;