import React, { useEffect } from 'react';
import { useUsers } from '../hooks/useUsers';
import { Button, Spinner, Alert } from 'reactstrap';

/**
 * Ejemplo de cómo usar el hook useUsers en un componente UI
 */
const UsersPageExample: React.FC = () => {
  const {
    // Estado desde Redux
    users,
    loading,
    error,

    // Funciones async
    fetchUsers,
    fetchUsersByCompany,
    createUser,
    updateUser,
    deleteUser,

    // Funciones sync
    getActiveUsers,
    getTotalUsers
  } = useUsers();

  // ==========================================
  // EFECTOS
  // ==========================================

  useEffect(() => {
    // Cargar usuarios al montar el componente
    loadUsers();
  }, []);

  // ==========================================
  // HANDLERS ASÍNCRONOS
  // ==========================================

  const loadUsers = async () => {
    const response = await fetchUsers();

    if (response.success) {
      console.log('✅ Usuarios cargados:', response.data);
    } else {
      console.error('❌ Error:', response.error);
    }
  };

  const loadUsersByCompany = async () => {
    const response = await fetchUsersByCompany(1);

    if (response.success) {
      console.log('✅ Usuarios de la compañía cargados:', response.data);
    } else {
      console.error('❌ Error:', response.error);
    }
  };

  const handleCreateUser = async () => {
    const response = await createUser({
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      privilege: 'user',
      phone: '123456789',
      language: 'es'
    });

    if (response.success) {
      console.log('✅ Usuario creado:', response.data);
      alert('Usuario creado exitosamente');
    } else {
      console.error('❌ Error:', response.error);
      alert(`Error: ${response.error}`);
    }
  };

  const handleUpdateUser = async (userId: string) => {
    const response = await updateUser(userId, {
      name: 'Jane',
      lastName: 'Smith'
    });

    if (response.success) {
      console.log('✅ Usuario actualizado:', response.data);
      alert('Usuario actualizado exitosamente');
    } else {
      console.error('❌ Error:', response.error);
      alert(`Error: ${response.error}`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    const response = await deleteUser(userId);

    if (response.success) {
      console.log('✅ Usuario eliminado');
      alert('Usuario eliminado exitosamente');
    } else {
      console.error('❌ Error:', response.error);
      alert(`Error: ${response.error}`);
    }
  };

  // ==========================================
  // LÓGICA SÍNCRONA
  // ==========================================

  const activeUsers = getActiveUsers();
  const totalUsers = getTotalUsers();

  // ==========================================
  // RENDER
  // ==========================================

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner color="primary" />
        <span className="ms-2">Cargando usuarios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert color="danger">
        <h5>Error al cargar usuarios</h5>
        <p>{error}</p>
        <Button color="primary" onClick={loadUsers}>Reintentar</Button>
      </Alert>
    );
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <h1>Gestión de Usuarios</h1>

        {/* Estadísticas síncronas */}
        <div className="mb-4">
          <p>Total de usuarios: <strong>{totalUsers}</strong></p>
          <p>Usuarios activos: <strong>{activeUsers.length}</strong></p>
        </div>

        {/* Acciones */}
        <div className="mb-4">
          <Button color="primary" onClick={loadUsers} className="me-2">
            Recargar Usuarios
          </Button>
          <Button color="success" onClick={handleCreateUser} className="me-2">
            Crear Usuario
          </Button>
          <Button color="info" onClick={loadUsersByCompany}>
            Cargar por Compañía
          </Button>
        </div>

        {/* Lista de usuarios */}
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Privilegio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.privilege}</td>
                  <td>
                    <span className={`badge bg-${user.isActive ? 'success' : 'danger'}`}>
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <Button
                      color="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleUpdateUser(user.id.toString())}
                    >
                      Editar
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id.toString())}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <Alert color="info">
            No hay usuarios para mostrar
          </Alert>
        )}
      </div>
    </div>
  );
};

export default UsersPageExample;
