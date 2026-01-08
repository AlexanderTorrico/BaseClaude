import { WorkStationModel } from '@/modules/RRHH/shared/models/WorkStationModel';
import { RoleModel } from '../../Roles/models/RoleModel';
import { PermissionModel } from '../../Permissions/models/PermissionModel';


export interface UserModel {
  uuid: string;  // Ahora usamos UUID en lugar de id numérico
  id?: number;   // Mantenemos id como opcional para retrocompatibilidad
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
