import { WorkStationModel } from '@/modules/RRHH/shared/models/WorkStationModel';
import { RoleModel } from '../../Roles/models/RoleModel';
import { PermissionModel } from '../../Roles/models/PermissionModel';


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
