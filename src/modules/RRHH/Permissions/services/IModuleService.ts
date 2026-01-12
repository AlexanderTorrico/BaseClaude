import { ModuleModel } from '../models/ModuleModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

/**
 * Interfaz del servicio de módulos
 */
export interface IModuleService {
    /**
     * Obtiene todos los módulos disponibles
     */
    getAllModules(setLoading?: SetStateFn): Promise<ApiResponse<ModuleModel[]>>;
}
