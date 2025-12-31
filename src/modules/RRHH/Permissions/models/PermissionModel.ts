import { ModuleModel } from './ModuleModel';

export interface PermissionModel {
    id: number;
    name: string;
    namePublic?: string;
    description?: string;
    gblModuleId?: number;
    module?: ModuleModel;
    createdAt?: string;
    updatedAt?: string;
}
