import { WorkStationResponseModel } from '../models/WorkStationResponseModel';
import { WorkStationModel } from '../models/WorkStationModel';
import { mockEmployeeCountByWorkStation } from '../data/mockWorkStations';
import { mockRequirements } from '../data/mockRequirements';
import { getDependencyName } from '../utils/treeHelpers';
import { getLevelColor } from '../utils/levelHelpers';

/**
 * Adaptador para transformar datos de Work Station
 * Convierte snake_case del API a camelCase de la UI
 * Agrega campos calculados y metadata
 */

/**
 * Adaptar un WorkStation del API al modelo de UI
 */
export const adaptWorkStationResponseToModel = (
  apiWorkStation: WorkStationResponseModel,
  allWorkStations?: WorkStationResponseModel[]
): WorkStationModel => {
  const levelConfig = getLevelColor(apiWorkStation.level);

  // Calcular campos extendidos
  const employeeCount = mockEmployeeCountByWorkStation[apiWorkStation.id] || 0;
  const requirementCount = mockRequirements.filter(
    req => req.rhh_workstation_id === apiWorkStation.id
  ).length;

  // Obtener nombre del puesto padre
  let dependencyName: string | undefined;
  if (allWorkStations && apiWorkStation.dependency_id !== 0) {
    const parent = allWorkStations.find(ws => ws.id === apiWorkStation.dependency_id);
    dependencyName = parent?.name;
  }

  return {
    id: apiWorkStation.id,
    name: apiWorkStation.name,
    level: apiWorkStation.level,
    dependencyId: apiWorkStation.dependency_id, // snake_case → camelCase

    // Campos calculados
    dependencyName,
    employeeCount,
    requirementCount,

    // Metadata de nivel
    levelName: levelConfig.name,
    levelColor: levelConfig.bg,
    levelBgColor: levelConfig.bg,
    levelTextColor: levelConfig.text
  };
};

/**
 * Adaptar array de WorkStations del API
 */
export const adaptWorkStationsArray = (
  apiArray: WorkStationResponseModel[]
): WorkStationModel[] => {
  // Pasar el array completo a cada adaptación para resolver dependencias
  return apiArray.map(apiWs =>
    adaptWorkStationResponseToModel(apiWs, apiArray)
  );
};

/**
 * Adaptar WorkStation de UI a formato API (para crear/actualizar)
 */
export const adaptWorkStationModelToRequest = (
  uiWorkStation: Partial<WorkStationModel>
): Partial<WorkStationResponseModel> => {
  return {
    id: uiWorkStation.id,
    name: uiWorkStation.name,
    level: uiWorkStation.level,
    dependency_id: uiWorkStation.dependencyId // camelCase → snake_case
  };
};

/**
 * Enriquecer WorkStation con información adicional
 * Útil para actualizar un modelo existente con nueva metadata
 */
export const enrichWorkStation = (
  workStation: WorkStationModel,
  allWorkStations: WorkStationModel[]
): WorkStationModel => {
  const levelConfig = getLevelColor(workStation.level);

  return {
    ...workStation,
    dependencyName: workStation.dependencyId === 0
      ? undefined
      : getDependencyName(workStation.dependencyId, allWorkStations),
    levelName: levelConfig.name,
    levelColor: levelConfig.bg,
    levelBgColor: levelConfig.bg,
    levelTextColor: levelConfig.text
  };
};

/**
 * Adaptar WorkStation con información de hijos (para árbol)
 */
export const adaptWorkStationWithChildren = (
  apiWorkStation: WorkStationResponseModel,
  allWorkStations: WorkStationResponseModel[]
): WorkStationModel => {
  const baseModel = adaptWorkStationResponseToModel(apiWorkStation, allWorkStations);

  // Encontrar hijos
  const children = allWorkStations
    .filter(ws => ws.dependency_id === apiWorkStation.id)
    .map(childWs => adaptWorkStationWithChildren(childWs, allWorkStations));

  return {
    ...baseModel,
    children: children.length > 0 ? children : undefined
  };
};
