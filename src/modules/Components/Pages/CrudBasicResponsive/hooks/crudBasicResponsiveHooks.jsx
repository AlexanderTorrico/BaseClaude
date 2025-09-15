import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  openDeleteModal,
  closeDeleteModal,
  clearError,
  setSelectedUser
} from '../../../../../store/usersSlice';

/**
 * Hook personalizado para manejar la lógica del CRUD de usuarios
 * Centraliza toda la lógica de estado y operaciones
 */
export const useCrudBasicResponsive = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Selectors del estado
  const {
    users,
    loading,
    error,
    selectedUser,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    creating,
    updating,
    deleting
  } = useSelector(state => state.users);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Mostrar errores como toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Mostrar mensajes de éxito
  const showSuccessMessage = useCallback((message) => {
    toast.success(message);
  }, []);

  // === OPERACIONES CRUD ===

  // Crear usuario
  const handleCreateUser = useCallback(async (userData) => {
    try {
      await dispatch(createUser(userData)).unwrap();
      showSuccessMessage(t('Usuario creado exitosamente') || 'Usuario creado exitosamente');
      return true;
    } catch (error) {
      // El error ya se maneja en el slice y se muestra via toast
      return false;
    }
  }, [dispatch, showSuccessMessage, t]);

  // Actualizar usuario
  const handleUpdateUser = useCallback(async (userData) => {
    try {
      await dispatch(updateUser({ id: selectedUser.id, ...userData })).unwrap();
      showSuccessMessage(t('Usuario actualizado exitosamente') || 'Usuario actualizado exitosamente');
      return true;
    } catch (error) {
      return false;
    }
  }, [dispatch, selectedUser, showSuccessMessage, t]);

  // Eliminar usuario
  const handleDeleteUser = useCallback(async () => {
    if (!selectedUser) return false;

    try {
      await dispatch(deleteUser(selectedUser.id)).unwrap();
      showSuccessMessage(t('Usuario eliminado exitosamente') || 'Usuario eliminado exitosamente');
      return true;
    } catch (error) {
      return false;
    }
  }, [dispatch, selectedUser, showSuccessMessage, t]);

  // Refrescar lista de usuarios
  const handleRefreshUsers = useCallback(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // === OPERACIONES DE MODALES ===

  // Abrir modal de crear
  const handleOpenCreateModal = useCallback(() => {
    dispatch(openCreateModal());
  }, [dispatch]);

  // Cerrar modal de crear
  const handleCloseCreateModal = useCallback(() => {
    dispatch(closeCreateModal());
  }, [dispatch]);

  // Abrir modal de editar
  const handleOpenEditModal = useCallback((user) => {
    dispatch(openEditModal(user));
  }, [dispatch]);

  // Cerrar modal de editar
  const handleCloseEditModal = useCallback(() => {
    dispatch(closeEditModal());
  }, [dispatch]);

  // Abrir modal de eliminar
  const handleOpenDeleteModal = useCallback((user) => {
    dispatch(openDeleteModal(user));
  }, [dispatch]);

  // Cerrar modal de eliminar
  const handleCloseDeleteModal = useCallback(() => {
    dispatch(closeDeleteModal());
  }, [dispatch]);

  // === CONFIGURACIÓN DE COLUMNAS PARA AzTable ===
  const tableColumns = useMemo(() => [
    {
      key: "nombre",
      header: "Usuario",
      sortable: true,
      filterable: true,
      cell: ({ row }) => (
        <div className="d-flex align-items-center">
          <div className="avatar-xs me-3">
            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
              {row.original.nombre.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h5 className="text-truncate font-size-14 mb-1">{row.original.nombre}</h5>
            <p className="text-muted mb-0">{row.original.email}</p>
          </div>
        </div>
      )
    },
    {
      key: "departamento",
      header: "Departamento",
      sortable: true,
      filterable: true,
      cell: ({ row }) => (
        <span className="badge bg-soft-info text-info px-2 py-1">
          {row.original.departamento}
        </span>
      )
    },
    {
      key: "rol",
      header: "Rol",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: ["Administrador", "Usuario", "Editor"],
      cell: ({ row }) => {
        const colorMap = {
          "Administrador": "danger",
          "Editor": "warning",
          "Usuario": "success"
        };
        return (
          <span className={`badge bg-soft-${colorMap[row.original.rol]} text-${colorMap[row.original.rol]}`}>
            {row.original.rol}
          </span>
        );
      }
    },
    {
      key: "estado",
      header: "Estado",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: ["Activo", "Inactivo"],
      cell: ({ row }) => (
        <span className={`badge bg-soft-${row.original.estado === 'Activo' ? 'success' : 'danger'} text-${row.original.estado === 'Activo' ? 'success' : 'danger'}`}>
          {row.original.estado}
        </span>
      )
    },
    {
      key: "telefono",
      header: "Teléfono",
      sortable: false,
      filterable: true,
      cell: ({ row }) => (
        <span className="text-muted">{row.original.telefono}</span>
      )
    },
    {
      key: "fechaCreacion",
      header: "Fecha Creación",
      sortable: true,
      filterable: true,
      cell: ({ row }) => (
        <span className="text-muted">
          {new Date(row.original.fechaCreacion).toLocaleDateString('es-ES')}
        </span>
      )
    }
  ], []);

  // === CONFIGURACIÓN DE ACCIONES PARA AzTable ===
  const tableActions = useMemo(() => [
    {
      label: "Editar",
      icon: "mdi mdi-pencil",
      color: "primary",
      onClick: handleOpenEditModal
    },
    {
      label: "Eliminar",
      icon: "mdi mdi-delete",
      color: "danger",
      onClick: handleOpenDeleteModal
    }
  ], [handleOpenEditModal, handleOpenDeleteModal]);

  // === ESTADÍSTICAS PARA EL HEADER ===
  const userStats = useMemo(() => {
    const activeUsers = users.filter(user => user.estado === 'Activo').length;
    const totalUsers = users.length;

    return {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
      percentage: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
    };
  }, [users]);

  return {
    // Estado
    users,
    loading,
    error,
    selectedUser,
    userStats,

    // Estados de modales
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,

    // Estados de operaciones
    creating,
    updating,
    deleting,

    // Operaciones CRUD
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleRefreshUsers,

    // Operaciones de modales
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleOpenEditModal,
    handleCloseEditModal,
    handleOpenDeleteModal,
    handleCloseDeleteModal,

    // Configuración de tabla
    tableColumns,
    tableActions
  };
};