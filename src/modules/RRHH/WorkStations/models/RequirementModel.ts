/**
 * Modelo de Requirement para la UI (camelCase)
 */

export interface RequirementModel {
  id: number;
  description: string;
  rhhWorkstationId: number;  // camelCase para UI
  category?: string;         // "Educación", "Experiencia", "Competencias", etc.
  isRequired?: boolean;      // camelCase para UI
}
