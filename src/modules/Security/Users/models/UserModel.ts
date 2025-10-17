import { WorkStationModel } from './WorkStationModel';
import { RoleModel } from '../../Roles/models/RoleModel';
import { PermissionModel } from '../../Roles/models/PermissionModel';

/**
 * Modelo de Usuario para la UI (mapeado desde la API)
 */
export interface UserModel {
  id: number;
  fullName: string;
  name: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  workStation: WorkStationModel;
  // Asignación de roles y permisos
  roleIds?: number[];
  roles?: RoleModel[];
  permissionIds?: number[];
  permissions?: PermissionModel[];
}
