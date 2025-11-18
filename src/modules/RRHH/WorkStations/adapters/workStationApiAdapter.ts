import { WorkStationModel } from '../models/WorkStationModel';
import { RequirementModel } from '../models/RequirementModel';
import { ResponsabilityModel } from '../models/ResponsabilityModel';

/**
 * Adaptador para transformar datos del API real de Work Stations
 * Convierte snake_case del API a camelCase de la UI
 */

/**
 * Adaptar un requirement del API (snake_case) al modelo UI (camelCase)
 */
const adaptRequirementFromApi = (apiReq: any): RequirementModel => {
  return {
    id: apiReq.id,
    description: apiReq.description,
    isHidden: apiReq.is_hidden,
    isDelete: apiReq.is_delete,
    rhhWorkstationId: apiReq.rhh_workstation_id,
  };
};

/**
 * Adaptar una responsability del API (snake_case) al modelo UI (camelCase)
 */
const adaptResponsabilityFromApi = (apiResp: any): ResponsabilityModel => {
  return {
    id: apiResp.id,
    description: apiResp.description,
    isHidden: apiResp.is_hidden,
    isDelete: apiResp.is_delete,
    rhhWorkstationId: apiResp.rhh_workstation_id,
  };
};

/**
 * Adaptar un WorkStation del API real al modelo de UI
 * Formato API:
 * {
 *   id, name, description, active, gbl_company_id,
 *   requirements: [...], responsabilities: [...]
 * }
 */
export const adaptWorkStationFromApi = (apiWorkStation: any): WorkStationModel => {
  return {
    id: apiWorkStation.id,
    name: apiWorkStation.name,
    description: apiWorkStation.description,
    active: apiWorkStation.active,
    gblCompanyId: apiWorkStation.gbl_company_id,
    requirements: (apiWorkStation.requirements || []).map(adaptRequirementFromApi),
    responsabilities: (apiWorkStation.responsabilities || []).map(adaptResponsabilityFromApi),

    // Campos legacy para compatibilidad con organigrama
    // Si el API no envía estos campos, usar valores por defecto
    level: apiWorkStation.level ?? 1,           // Nivel 1 por defecto (raíz)
    dependencyId: apiWorkStation.dependency_id ?? 0,  // 0 = sin dependencia (raíz)
  };
};

/**
 * Adaptar array de WorkStations del API real
 */
export const adaptWorkStationsFromApi = (apiArray: any[]): WorkStationModel[] => {
  return apiArray.map(adaptWorkStationFromApi);
};

/**
 * Adaptar WorkStation de UI a formato API (para crear/actualizar)
 */
export const adaptWorkStationToApi = (
  uiWorkStation: Partial<WorkStationModel>
): any => {
  return {
    id: uiWorkStation.id,
    name: uiWorkStation.name,
    description: uiWorkStation.description,
    active: uiWorkStation.active,
    gbl_company_id: uiWorkStation.gblCompanyId,
    requirements: uiWorkStation.requirements?.map(req => ({
      id: req.id,
      description: req.description,
      is_hidden: req.isHidden,
      is_delete: req.isDelete,
      rhh_workstation_id: req.rhhWorkstationId,
    })),
    responsabilities: uiWorkStation.responsabilities?.map(resp => ({
      id: resp.id,
      description: resp.description,
      is_hidden: resp.isHidden,
      is_delete: resp.isDelete,
      rhh_workstation_id: resp.rhhWorkstationId,
    })),
  };
};
