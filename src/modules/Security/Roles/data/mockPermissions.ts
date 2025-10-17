import { PermissionModel, PermissionsByModule } from '../models/PermissionModel';

/**
 * Permisos mockeados del sistema
 * Categorizados por módulos funcionales
 */
export const MOCK_PERMISSIONS: PermissionModel[] = [
  // ==================== MÓDULO: USERS ====================
  {
    id: 1,
    slug: 'users.view',
    name: 'Ver Usuarios',
    module: 'Users',
    description: 'Permite visualizar la lista de usuarios del sistema',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 2,
    slug: 'users.create',
    name: 'Crear Usuarios',
    module: 'Users',
    description: 'Permite crear nuevos usuarios en el sistema',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 3,
    slug: 'users.edit',
    name: 'Editar Usuarios',
    module: 'Users',
    description: 'Permite modificar información de usuarios existentes',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 4,
    slug: 'users.delete',
    name: 'Eliminar Usuarios',
    module: 'Users',
    description: 'Permite eliminar usuarios del sistema',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 5,
    slug: 'users.assign_roles',
    name: 'Asignar Roles a Usuarios',
    module: 'Users',
    description: 'Permite asignar y remover roles de usuarios',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 6,
    slug: 'users.assign_permissions',
    name: 'Asignar Permisos Directos',
    module: 'Users',
    description: 'Permite asignar permisos directos a usuarios (sin rol)',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },

  // ==================== MÓDULO: ROLES ====================
  {
    id: 7,
    slug: 'roles.view',
    name: 'Ver Roles',
    module: 'Roles',
    description: 'Permite visualizar la lista de roles del sistema',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 8,
    slug: 'roles.create',
    name: 'Crear Roles',
    module: 'Roles',
    description: 'Permite crear nuevos roles en el sistema',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 9,
    slug: 'roles.edit',
    name: 'Editar Roles',
    module: 'Roles',
    description: 'Permite modificar roles existentes',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 10,
    slug: 'roles.delete',
    name: 'Eliminar Roles',
    module: 'Roles',
    description: 'Permite eliminar roles del sistema',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 11,
    slug: 'roles.assign_permissions',
    name: 'Asignar Permisos a Roles',
    module: 'Roles',
    description: 'Permite asignar y remover permisos de roles',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },

  // ==================== MÓDULO: PERMISSIONS ====================
  {
    id: 12,
    slug: 'permissions.view',
    name: 'Ver Permisos',
    module: 'Permissions',
    description: 'Permite visualizar la lista de permisos del sistema',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },

  // ==================== MÓDULO: RRHH ====================
  {
    id: 13,
    slug: 'rrhh.view_positions',
    name: 'Ver Puestos de Trabajo',
    module: 'RRHH',
    description: 'Permite visualizar el catálogo de puestos laborales',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 14,
    slug: 'rrhh.create_positions',
    name: 'Crear Puestos de Trabajo',
    module: 'RRHH',
    description: 'Permite crear nuevos puestos laborales',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 15,
    slug: 'rrhh.edit_positions',
    name: 'Editar Puestos de Trabajo',
    module: 'RRHH',
    description: 'Permite modificar puestos laborales existentes',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 16,
    slug: 'rrhh.delete_positions',
    name: 'Eliminar Puestos de Trabajo',
    module: 'RRHH',
    description: 'Permite eliminar puestos laborales',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 17,
    slug: 'rrhh.view_schedules',
    name: 'Ver Horarios de Trabajo',
    module: 'RRHH',
    description: 'Permite visualizar horarios laborales',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 18,
    slug: 'rrhh.manage_schedules',
    name: 'Gestionar Horarios',
    module: 'RRHH',
    description: 'Permite crear, editar y eliminar horarios laborales',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 19,
    slug: 'rrhh.assign_schedules',
    name: 'Asignar Horarios a Empleados',
    module: 'RRHH',
    description: 'Permite asignar horarios a empleados',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },

  // ==================== MÓDULO: PRODUCTOS ====================
  {
    id: 20,
    slug: 'products.view',
    name: 'Ver Productos',
    module: 'Productos',
    description: 'Permite visualizar el catálogo de productos',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 21,
    slug: 'products.create',
    name: 'Crear Productos',
    module: 'Productos',
    description: 'Permite agregar nuevos productos al catálogo',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 22,
    slug: 'products.edit',
    name: 'Editar Productos',
    module: 'Productos',
    description: 'Permite modificar productos existentes',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 23,
    slug: 'products.delete',
    name: 'Eliminar Productos',
    module: 'Productos',
    description: 'Permite eliminar productos del catálogo',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 24,
    slug: 'products.manage_inventory',
    name: 'Gestionar Inventario',
    module: 'Productos',
    description: 'Permite gestionar stock y movimientos de inventario',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },
];

/**
 * Helper para agrupar permisos por módulo
 */
export const groupPermissionsByModule = (): PermissionsByModule[] => {
  const modules = Array.from(new Set(MOCK_PERMISSIONS.map(p => p.module)));

  const moduleIcons: Record<string, string> = {
    'Users': 'mdi-account-group',
    'Roles': 'mdi-shield-account',
    'Permissions': 'mdi-key',
    'RRHH': 'mdi-briefcase',
    'Productos': 'mdi-package-variant',
  };

  return modules.map(module => ({
    module,
    moduleIcon: moduleIcons[module] || 'mdi-folder',
    permissions: MOCK_PERMISSIONS.filter(p => p.module === module),
    totalPermissions: MOCK_PERMISSIONS.filter(p => p.module === module).length,
  }));
};

/**
 * Helper para obtener permisos por IDs
 */
export const getPermissionsByIds = (permissionIds: number[]): PermissionModel[] => {
  return MOCK_PERMISSIONS.filter(p => permissionIds.includes(p.id));
};

/**
 * Helper para obtener un permiso por ID
 */
export const getPermissionById = (id: number): PermissionModel | undefined => {
  return MOCK_PERMISSIONS.find(p => p.id === id);
};
