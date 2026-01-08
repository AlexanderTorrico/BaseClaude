import { IModuleService } from './IModuleService';
import { ModuleModel } from '../models/ModuleModel';
import { httpRequestWithAuth } from '@/services/httpService';
import { ApiResponse, transformApiData } from '@/shared/types';
import { SetStateFn } from '@/shared/types/commonTypes';

const BASE_URL = '/api/role-permission/modules';

/**
 * Adapta un módulo de la API al modelo
 */
const adaptModuleResponse = (apiModule: any): ModuleModel => ({
    id: apiModule.id,
    name: apiModule.name || '',
    description: apiModule.description || '',
    icon: apiModule.icon || '',
    path: apiModule.path || '',
    color: apiModule.color || '',
    img: apiModule.img || ''
});

export class ModuleApiService implements IModuleService {

    async getAllModules(setLoading?: SetStateFn): Promise<ApiResponse<ModuleModel[]>> {
        const res = await httpRequestWithAuth.get<ApiResponse<any>>(BASE_URL, setLoading);
        return transformApiData(res, (data) => {
            const modules = data?.data ?? data ?? [];
            if (!Array.isArray(modules)) return [];
            return modules.map(adaptModuleResponse);
        });
    }
}
