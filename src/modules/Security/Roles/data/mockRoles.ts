import { RoleModel } from '../models/RoleModel';
import { getPermissionsByIds } from './mockPermissions';

/**
 * Roles mockeados del sistema
 */
export const MOCK_ROLES: RoleModel[] = [
  {
    id: 1,
    name: 'Super Administrador',
    description: 'Acceso completo a todas las funcionalidades del sistema sin restricciones',
    isActive: true,
    permissionIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], // Todos los permisos
    permissions: getPermissionsByIds([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]),
    userCount: 2,
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'Gerente General',
    description: 'Gestión completa de RRHH, productos y supervisión de operaciones',
    isActive: true,
    permissionIds: [1, 3, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], // RRHH + Productos + Ver usuarios
    permissions: getPermissionsByIds([1, 3, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]),
    userCount: 5,
    createdAt: '2024-01-08T09:15:00Z',
    updatedAt: '2024-02-20T14:45:00Z',
  },
  {
    id: 3,
    name: 'Gerente de RRHH',
    description: 'Gestión completa del módulo de recursos humanos',
    isActive: true,
    permissionIds: [1, 13, 14, 15, 16, 17, 18, 19], // RRHH completo + Ver usuarios
    permissions: getPermissionsByIds([1, 13, 14, 15, 16, 17, 18, 19]),
    userCount: 3,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-03-05T11:20:00Z',
  },
  {
    id: 4,
    name: 'Supervisor de Productos',
    description: 'Gestión de productos e inventario',
    isActive: true,
    permissionIds: [20, 21, 22, 24], // Productos (sin eliminar)
    permissions: getPermissionsByIds([20, 21, 22, 24]),
    userCount: 8,
    createdAt: '2024-01-12T11:30:00Z',
  },
  {
    id: 5,
    name: 'Empleado',
    description: 'Acceso básico de solo lectura al sistema',
    isActive: true,
    permissionIds: [1, 12, 13, 17, 20], // Solo visualización
    permissions: getPermissionsByIds([1, 12, 13, 17, 20]),
    userCount: 45,
    createdAt: '2024-01-05T08:00:00Z',
  },
  {
    id: 6,
    name: 'Administrador de Seguridad',
    description: 'Gestión de usuarios, roles y permisos',
    isActive: true,
    permissionIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // Users + Roles + Permissions
    permissions: getPermissionsByIds([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    userCount: 2,
    createdAt: '2024-01-15T12:00:00Z',
  },
  {
    id: 7,
    name: 'Auditor',
    description: 'Solo lectura para auditoría y reportes',
    isActive: false, // Rol inactivo
    permissionIds: [1, 7, 12, 13, 17, 20], // Solo visualización en todos los módulos
    permissions: getPermissionsByIds([1, 7, 12, 13, 17, 20]),
    userCount: 0,
    createdAt: '2023-12-01T09:00:00Z',
    updatedAt: '2024-01-20T15:00:00Z',
  },
  {
    id: 8,
    name: 'Asistente de RRHH',
    description: 'Asistencia en gestión de horarios y consulta de puestos',
    isActive: true,
    permissionIds: [13, 17, 19], // Ver puestos, ver horarios, asignar horarios
    permissions: getPermissionsByIds([13, 17, 19]),
    userCount: 6,
    createdAt: '2024-02-01T08:30:00Z',
  },
];

/**
 * Helper para obtener un rol por ID
 */
export const getRoleById = (id: number): RoleModel | undefined => {
  return MOCK_ROLES.find(r => r.id === id);
};

/**
 * Helper para obtener roles activos
 */
export const getActiveRoles = (): RoleModel[] => {
  return MOCK_ROLES.filter(r => r.isActive);
};

/**
 * Helper para obtener roles por IDs
 */
export const getRolesByIds = (roleIds: number[]): RoleModel[] => {
  return MOCK_ROLES.filter(r => roleIds.includes(r.id));
};

/**
 * Helper para calcular estadísticas de roles
 */
export const getRoleStats = () => {
  return {
    total: MOCK_ROLES.length,
    active: MOCK_ROLES.filter(r => r.isActive).length,
    inactive: MOCK_ROLES.filter(r => !r.isActive).length,
    totalUsers: MOCK_ROLES.reduce((sum, r) => sum + r.userCount, 0),
  };
};
