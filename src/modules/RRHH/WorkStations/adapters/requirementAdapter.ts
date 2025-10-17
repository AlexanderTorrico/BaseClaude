import { RequirementResponseModel } from '../models/RequirementResponseModel';
import { RequirementModel } from '../models/RequirementModel';

/**
 * Adaptador para transformar datos de Requirement
 * Convierte snake_case del API a camelCase de la UI
 */

/**
 * Adaptar un Requirement del API al modelo de UI
 */
export const adaptRequirementResponseToModel = (
  apiRequirement: RequirementResponseModel
): RequirementModel => {
  return {
    id: apiRequirement.id,
    description: apiRequirement.description,
    workStationId: apiRequirement.rhh_workstation_id, // snake_case → camelCase
    category: apiRequirement.category,
    isRequired: apiRequirement.is_required ?? true // snake_case → camelCase, default true
  };
};

/**
 * Adaptar array de Requirements del API
 */
export const adaptRequirementsArray = (
  apiArray: RequirementResponseModel[]
): RequirementModel[] => {
  return apiArray.map(adaptRequirementResponseToModel);
};

/**
 * Adaptar Requirement de UI a formato API (para crear/actualizar)
 */
export const adaptRequirementModelToRequest = (
  uiRequirement: Partial<RequirementModel>
): Partial<RequirementResponseModel> => {
  return {
    id: uiRequirement.id,
    description: uiRequirement.description,
    rhh_workstation_id: uiRequirement.workStationId, // camelCase → snake_case
    category: uiRequirement.category,
    is_required: uiRequirement.isRequired // camelCase → snake_case
  };
};

/**
 * Agrupar Requirements por categoría
 */
export const groupRequirementsByCategory = (
  requirements: RequirementModel[]
): Record<string, RequirementModel[]> => {
  const grouped: Record<string, RequirementModel[]> = {};

  requirements.forEach(req => {
    const category = req.category || 'Sin categoría';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(req);
  });

  return grouped;
};

/**
 * Filtrar Requirements por obligatoriedad
 */
export const filterRequiredRequirements = (
  requirements: RequirementModel[]
): RequirementModel[] => {
  return requirements.filter(req => req.isRequired);
};

/**
 * Filtrar Requirements opcionales
 */
export const filterOptionalRequirements = (
  requirements: RequirementModel[]
): RequirementModel[] => {
  return requirements.filter(req => !req.isRequired);
};

/**
 * Contar Requirements por categoría
 */
export const countRequirementsByCategory = (
  requirements: RequirementModel[]
): Record<string, number> => {
  const counts: Record<string, number> = {};

  requirements.forEach(req => {
    const category = req.category || 'Sin categoría';
    counts[category] = (counts[category] || 0) + 1;
  });

  return counts;
};

/**
 * Obtener estadísticas de Requirements
 */
export const getRequirementStatistics = (
  requirements: RequirementModel[]
): {
  total: number;
  required: number;
  optional: number;
  byCategory: Record<string, number>;
} => {
  return {
    total: requirements.length,
    required: filterRequiredRequirements(requirements).length,
    optional: filterOptionalRequirements(requirements).length,
    byCategory: countRequirementsByCategory(requirements)
  };
};
