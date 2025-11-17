import { UserModel } from '../models/UserModel';
import { MOCK_ROLES } from '@/modules/Security/Roles/data/mockRoles';
import { MOCK_PERMISSIONS } from '@/modules/Security/Roles/data/mockPermissions';

/**
 * Datos mockeados de usuarios con roles y permisos asignados
 * Simula la estructura que vendría desde la API
 */
export const MOCK_USERS_WITH_ROLES: UserModel[] = [
  {
    id: 1,
    fullName: 'Juan Carlos Pérez',
    name: 'Juan Carlos',
    lastName: 'Pérez',
    email: 'juan.perez@empresa.com',
    phone: '+591 777-12345',
    avatar: null,
    workStation: {
      id: 1,
      name: 'Gerente General',
      department: 'Administración',
      description: 'Responsable de la gestión general de la empresa',
    },
    // Super Administrador - tiene todos los permisos
    roleIds: [1],
    roles: [MOCK_ROLES[0]], // Super Administrador
    permissionIds: [], // No tiene permisos directos, los hereda del rol
    permissions: [],
  },
  {
    id: 2,
    fullName: 'María Elena García',
    name: 'María Elena',
    lastName: 'García',
    email: 'maria.garcia@empresa.com',
    phone: '+591 777-23456',
    avatar: null,
    workStation: {
      id: 2,
      name: 'Jefe de Recursos Humanos',
      department: 'RRHH',
      description: 'Encargada del área de recursos humanos',
    },
    // Gerente de RRHH + permisos adicionales directos
    roleIds: [3],
    roles: [MOCK_ROLES[2]], // Gerente de RRHH
    permissionIds: [22], // products.view (permiso directo adicional)
    permissions: [MOCK_PERMISSIONS[21]],
  },
  {
    id: 3,
    fullName: 'Pedro Antonio Rodríguez',
    name: 'Pedro Antonio',
    lastName: 'Rodríguez',
    email: 'pedro.rodriguez@empresa.com',
    phone: '+591 777-34567',
    avatar: null,
    workStation: {
      id: 3,
      name: 'Supervisor de Inventario',
      department: 'Almacén',
      description: 'Supervisa el control de inventarios',
    },
    // Supervisor de Productos
    roleIds: [4],
    roles: [MOCK_ROLES[3]], // Supervisor de Productos
    permissionIds: [],
    permissions: [],
  },
  {
    id: 4,
    fullName: 'Ana Sofía López',
    name: 'Ana Sofía',
    lastName: 'López',
    email: 'ana.lopez@empresa.com',
    phone: '+591 777-45678',
    avatar: null,
    workStation: {
      id: 4,
      name: 'Asistente Administrativa',
      department: 'Administración',
      description: 'Apoyo en tareas administrativas',
    },
    // Múltiples roles: Empleado + Asistente de RRHH
    roleIds: [5, 8],
    roles: [MOCK_ROLES[4], MOCK_ROLES[7]], // Empleado + Asistente de RRHH
    permissionIds: [],
    permissions: [],
  },
  {
    id: 5,
    fullName: 'Carlos Enrique Fernández',
    name: 'Carlos Enrique',
    lastName: 'Fernández',
    email: 'carlos.fernandez@empresa.com',
    phone: '+591 777-56789',
    avatar: null,
    workStation: {
      id: 5,
      name: 'Administrador de Sistemas',
      department: 'TI',
      description: 'Administración de sistemas y seguridad',
    },
    // Administrador de Seguridad
    roleIds: [6],
    roles: [MOCK_ROLES[5]], // Administrador de Seguridad
    permissionIds: [],
    permissions: [],
  },
  {
    id: 6,
    fullName: 'Laura Patricia Martínez',
    name: 'Laura Patricia',
    lastName: 'Martínez',
    email: 'laura.martinez@empresa.com',
    phone: '+591 777-67890',
    avatar: null,
    workStation: {
      id: 6,
      name: 'Vendedora',
      department: 'Ventas',
      description: 'Atención al cliente y ventas',
    },
    // Solo permisos directos (sin roles)
    roleIds: [],
    roles: [],
    permissionIds: [22, 23, 24], // products.view, products.create, products.update
    permissions: [MOCK_PERMISSIONS[21], MOCK_PERMISSIONS[22], MOCK_PERMISSIONS[23]],
  },
  {
    id: 7,
    fullName: 'Roberto Miguel Sánchez',
    name: 'Roberto Miguel',
    lastName: 'Sánchez',
    email: 'roberto.sanchez@empresa.com',
    phone: '+591 777-78901',
    avatar: null,
    workStation: {
      id: 7,
      name: 'Contador',
      department: 'Contabilidad',
      description: 'Gestión contable y financiera',
    },
    // Gerente General (rol con muchos permisos)
    roleIds: [2],
    roles: [MOCK_ROLES[1]], // Gerente General
    permissionIds: [],
    permissions: [],
  },
  {
    id: 8,
    fullName: 'Carmen Rosa Gutiérrez',
    name: 'Carmen Rosa',
    lastName: 'Gutiérrez',
    email: 'carmen.gutierrez@empresa.com',
    phone: '+591 777-89012',
    avatar: null,
    workStation: {
      id: 8,
      name: 'Recepcionista',
      department: 'Administración',
      description: 'Atención en recepción',
    },
    // Empleado básico
    roleIds: [5],
    roles: [MOCK_ROLES[4]], // Empleado
    permissionIds: [],
    permissions: [],
  },
  {
    id: 9,
    fullName: 'Diego Alejandro Torres',
    name: 'Diego Alejandro',
    lastName: 'Torres',
    email: 'diego.torres@empresa.com',
    phone: null,
    avatar: null,
    workStation: {
      id: 9,
      name: 'Auditor Interno',
      department: 'Auditoría',
      description: 'Auditoría interna de procesos',
    },
    // Usuario sin roles ni permisos asignados (nuevo ingreso)
    roleIds: [],
    roles: [],
    permissionIds: [],
    permissions: [],
  },
  {
    id: 10,
    fullName: 'Valeria Fernanda Morales',
    name: 'Valeria Fernanda',
    lastName: 'Morales',
    email: 'valeria.morales@empresa.com',
    phone: '+591 777-90123',
    avatar: null,
    workStation: {
      id: 10,
      name: 'Jefe de Almacén',
      department: 'Logística',
      description: 'Gestión de almacén y logística',
    },
    // Múltiples roles + permisos directos
    roleIds: [4, 5], // Supervisor de Productos + Empleado
    roles: [MOCK_ROLES[3], MOCK_ROLES[4]],
    permissionIds: [15, 16], // rrhh.work_positions.view, rrhh.work_positions.create
    permissions: [MOCK_PERMISSIONS[14], MOCK_PERMISSIONS[15]],
  },
];

/**
 * Obtiene los roles de un usuario por su ID
 */
export const getUserRoles = (userId: number): typeof MOCK_ROLES => {
  const user = MOCK_USERS_WITH_ROLES.find(u => u.id === userId);
  return user?.roles || [];
};

/**
 * Obtiene los permisos directos de un usuario por su ID
 */
export const getUserPermissions = (userId: number): typeof MOCK_PERMISSIONS => {
  const user = MOCK_USERS_WITH_ROLES.find(u => u.id === userId);
  return user?.permissions || [];
};

/**
 * Obtiene TODOS los permisos de un usuario (heredados de roles + directos)
 */
export const getUserAllPermissions = (userId: number): typeof MOCK_PERMISSIONS => {
  const user = MOCK_USERS_WITH_ROLES.find(u => u.id === userId);
  if (!user) return [];

  // Permisos de roles
  const rolePermissions = user.roles?.flatMap(role => role.permissions || []) || [];

  // Permisos directos
  const directPermissions = user.permissions || [];

  // Combinar y eliminar duplicados (por ID)
  const allPermissions = [...rolePermissions, ...directPermissions];
  const uniquePermissions = allPermissions.filter(
    (permission, index, self) =>
      index === self.findIndex(p => p.id === permission.id)
  );

  return uniquePermissions;
};

/**
 * Estadísticas de asignación de roles/permisos
 */
export const getUserRoleStats = () => {
  const usersWithRoles = MOCK_USERS_WITH_ROLES.filter(u => (u.roleIds?.length || 0) > 0).length;
  const usersWithDirectPermissions = MOCK_USERS_WITH_ROLES.filter(u => (u.permissionIds?.length || 0) > 0).length;
  const usersWithoutAccess = MOCK_USERS_WITH_ROLES.filter(
    u => (u.roleIds?.length || 0) === 0 && (u.permissionIds?.length || 0) === 0
  ).length;

  return {
    total: MOCK_USERS_WITH_ROLES.length,
    withRoles: usersWithRoles,
    withDirectPermissions: usersWithDirectPermissions,
    withoutAccess: usersWithoutAccess,
  };
};
