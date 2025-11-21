import { RequirementModel } from '@/modules/RRHH/WorkStations/models/RequirementModel';
import { ResponsabilityModel } from '@/modules/RRHH/WorkStations/models/ResponsabilityModel';

/**
 * Modelo unificado de WorkStation para todos los módulos RRHH
 * Usado por: Users, WorkStations, y cualquier módulo que necesite WorkStations
 */
export interface WorkStationModel {
  id: number;
  name: string;
  description: string;
  active: number;
  gblCompanyId: number;
  requirements?: RequirementModel[];
  responsabilities?: ResponsabilityModel[];
  level?: number;
  dependencyId?: number;
  dependencyName?: string;
  employeeCount?: number;
  requirementCount?: number;
  children?: WorkStationModel[];
  levelName?: string;
  levelColor?: string;
  levelBgColor?: string;
  levelTextColor?: string;
}

/**
 * Tipo simplificado para pickers/dropdowns
 * Solo campos esenciales para UI de selección
 */
export interface WorkStationPickerModel {
  id: number;
  name: string;
  description?: string;
  level?: number;
}
