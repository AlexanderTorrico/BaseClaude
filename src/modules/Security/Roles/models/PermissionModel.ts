/**
 * Modelo de Permiso para la UI
 * Representa un permiso granular del sistema categorizado por módulo
 */
export interface PermissionModel {
  id: number;
  name: string;
  slug: string; // e.g., "users.create", "roles.delete"
  module: string; // e.g., "Users", "Roles", "RRHH", "Productos"
  description: string;
  isActive: boolean;
  createdAt?: string;
}

/**
 * Permisos agrupados por módulo para UI
 */
export interface PermissionsByModule {
  module: string;
  moduleIcon: string; // Icono MDI, e.g., "mdi-account-group"
  permissions: PermissionModel[];
  totalPermissions: number;
}
