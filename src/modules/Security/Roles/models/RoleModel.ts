import { PermissionModel } from './PermissionModel';

/**
 * Modelo de Rol para la UI
 * Representa un rol del sistema con sus permisos asignados
 */
export interface RoleModel {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  permissionIds: number[]; // IDs de permisos asignados a este rol
  permissions?: PermissionModel[]; // Permisos completos (para visualización)
  userCount: number; // Cantidad de usuarios con este rol
  createdAt: string;
  updatedAt?: string;
}

/**
 * Datos para formulario de creación/edición de rol
 */
export interface RoleFormData {
  name: string;
  description: string;
  isActive: boolean;
}

/**
 * Estado del rol (para badges y filtros)
 */
export type RoleStatus = 'active' | 'inactive';
