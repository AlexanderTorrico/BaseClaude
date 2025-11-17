/**
 * Modelo de WorkStation para la UI
 */
export interface WorkStationModel {
  id: number;
  name: string | null;
  level?: number;
  dependencyId?: number;
  department?: string;
  description?: string;
}
