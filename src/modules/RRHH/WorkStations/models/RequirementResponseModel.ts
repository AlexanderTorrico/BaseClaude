/**
 * Modelo de respuesta del API para Requirement (snake_case)
 */

export interface RequirementResponseModel {
  id: number;
  description: string;
  rhh_workstation_id: number;  // snake_case del API
  category?: string;
  is_required?: boolean;       // snake_case del API
}
