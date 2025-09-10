import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";

// Datos mockeados para optimización (evitar recrear en cada render)
const USERS_DATA = [
  {
    id: "001",
    name: "Juan Pérez",
    email: "juan@example.com",
    status: "Activo",
    statusColor: "success"
  },
  {
    id: "002", 
    name: "María González",
    email: "maria@example.com",
    status: "Pendiente",
    statusColor: "warning"
  },
  {
    id: "003",
    name: "Carlos López", 
    email: "carlos@example.com",
    status: "Activo",
    statusColor: "success"
  }
];

/**
 * UserDataTable - Tabla responsiva de usuarios optimizada
 * Componente que muestra datos de usuarios en formato tabla
 * 
 * @param {Function} [onEdit] - Callback cuando se hace click en editar usuario
 * @param {Function} [onDelete] - Callback cuando se hace click en eliminar usuario
 * @param {Array} [users] - Array de usuarios personalizados (opcional)
 * @param {string} [className] - Clases CSS adicionales
 */
const UserDataTable = React.memo(({
  onEdit,
  onDelete,
  users = USERS_DATA,
  className = ""
}) => {
  // Memoizar handlers para evitar recreación en cada render
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

  // Memoizar la renderización de filas para optimización
  const renderUserRow = React.useCallback((user) => (
    <tr key={user.id}>
      <td>{user.id}</td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>
        <span className={`badge bg-${user.statusColor}`}>
          {user.status}
        </span>
      </td>
      <td>
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
      </td>
    </tr>
  ), [handleEdit, handleDelete]);

  return (
    <div className={`card ${className}`}>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(renderUserRow)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

UserDataTable.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      statusColor: PropTypes.string.isRequired
    })
  ),
  className: PropTypes.string
};

UserDataTable.displayName = "UserDataTable";

export default UserDataTable;