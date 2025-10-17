/**
 * Modelo de respuesta del API para Work Station (snake_case)
 * Representa el formato tal como viene del backend
 */

export interface WorkStationResponseModel {
  id: number;
  name: string;
  level: number;
  dependency_id: number;  // snake_case del API
}
