/**
 * Modelo de Responsability para la UI (camelCase)
 */

export interface ResponsabilityModel {
  id: number;
  description: string;
  isHidden: number;          // camelCase para UI (0 o 1)
  isDelete: number;          // camelCase para UI (0 o 1)
  rhhWorkstationId: number;  // camelCase para UI
}
