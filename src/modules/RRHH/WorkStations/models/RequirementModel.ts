/**
 * Modelo de Requirement para la UI (camelCase)
 */

export interface RequirementModel {
  id: number;
  description: string;
  isHidden: number;          // camelCase para UI (0 o 1)
  isDelete: number;          // camelCase para UI (0 o 1)
  rhhWorkstationId: number;  // camelCase para UI

  // Campos legacy/adicionales (opcionales)
  category?: string;         // "Educación", "Experiencia", "Competencias", etc.
  isRequired?: boolean;      // camelCase para UI
}
