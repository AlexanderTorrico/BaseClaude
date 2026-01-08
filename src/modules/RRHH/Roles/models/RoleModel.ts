import { PermissionModel } from './PermissionModel';

export interface RoleModel {
    id: number;
    name: string;
    detail: string;
    permissionIds?: number[];
    permissions?: PermissionModel[];
    createdAt?: string;
    updatedAt?: string;
}
