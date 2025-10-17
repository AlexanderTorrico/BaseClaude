import { mockWorkStations, mockEmployeeCountByWorkStation } from '../data/mockWorkStations';
import { mockRequirements } from '../data/mockRequirements';
import { WorkStationResponseModel } from '../models/WorkStationResponseModel';
import { RequirementResponseModel } from '../models/RequirementResponseModel';

/**
 * Servicios HTTP para Work Stations
 * Por ahora usa datos mock, pero está preparado para conectar con API real
 */

// Simular delay de red
const simulateNetworkDelay = (ms: number = 300): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Obtener todos los Work Stations
 */
export const getWorkStations = async (): Promise<WorkStationResponseModel[]> => {
  await simulateNetworkDelay();

  // En producción sería:
  // const response = await axios.get('/api/rhh/workstations');
  // return response.data;

  return mockWorkStations;
};

/**
 * Obtener un Work Station por ID
 */
export const getWorkStationById = async (id: number): Promise<WorkStationResponseModel | null> => {
  await simulateNetworkDelay();

  const workStation = mockWorkStations.find(ws => ws.id === id);
  return workStation || null;
};

/**
 * Obtener Work Stations por nivel
 */
export const getWorkStationsByLevel = async (level: number): Promise<WorkStationResponseModel[]> => {
  await simulateNetworkDelay();

  return mockWorkStations.filter(ws => ws.level === level);
};

/**
 * Obtener Work Stations hijos de un padre específico
 */
export const getWorkStationsByParent = async (parentId: number): Promise<WorkStationResponseModel[]> => {
  await simulateNetworkDelay();

  return mockWorkStations.filter(ws => ws.dependency_id === parentId);
};

/**
 * Crear nuevo Work Station
 */
export const createWorkStation = async (
  data: Omit<WorkStationResponseModel, 'id'>
): Promise<WorkStationResponseModel> => {
  await simulateNetworkDelay();

  // En producción sería:
  // const response = await axios.post('/api/rhh/workstations', data);
  // return response.data;

  const newId = Math.max(...mockWorkStations.map(ws => ws.id)) + 1;
  const newWorkStation: WorkStationResponseModel = {
    id: newId,
    ...data
  };

  // Agregar al mock (solo en memoria, se pierde al recargar)
  mockWorkStations.push(newWorkStation);

  return newWorkStation;
};

/**
 * Actualizar Work Station existente
 */
export const updateWorkStation = async (
  id: number,
  data: Partial<WorkStationResponseModel>
): Promise<WorkStationResponseModel> => {
  await simulateNetworkDelay();

  // En producción sería:
  // const response = await axios.put(`/api/rhh/workstations/${id}`, data);
  // return response.data;

  const index = mockWorkStations.findIndex(ws => ws.id === id);
  if (index === -1) {
    throw new Error(`Work Station con id ${id} no encontrado`);
  }

  mockWorkStations[index] = {
    ...mockWorkStations[index],
    ...data
  };

  return mockWorkStations[index];
};

/**
 * Eliminar Work Station
 */
export const deleteWorkStation = async (id: number): Promise<void> => {
  await simulateNetworkDelay();

  // En producción sería:
  // await axios.delete(`/api/rhh/workstations/${id}`);

  const index = mockWorkStations.findIndex(ws => ws.id === id);
  if (index === -1) {
    throw new Error(`Work Station con id ${id} no encontrado`);
  }

  // Verificar que no tenga hijos
  const hasChildren = mockWorkStations.some(ws => ws.dependency_id === id);
  if (hasChildren) {
    throw new Error('No se puede eliminar un puesto que tiene puestos dependientes');
  }

  mockWorkStations.splice(index, 1);
};

/**
 * Obtener cantidad de empleados por Work Station
 */
export const getEmployeeCountByWorkStation = async (id: number): Promise<number> => {
  await simulateNetworkDelay();

  return mockEmployeeCountByWorkStation[id] || 0;
};

// ============================================================================
// SERVICIOS PARA REQUIREMENTS
// ============================================================================

/**
 * Obtener todos los Requirements
 */
export const getRequirements = async (): Promise<RequirementResponseModel[]> => {
  await simulateNetworkDelay();

  return mockRequirements;
};

/**
 * Obtener Requirements de un Work Station específico
 */
export const getRequirementsByWorkStation = async (
  workStationId: number
): Promise<RequirementResponseModel[]> => {
  await simulateNetworkDelay();

  return mockRequirements.filter(req => req.rhh_workstation_id === workStationId);
};

/**
 * Obtener un Requirement por ID
 */
export const getRequirementById = async (id: number): Promise<RequirementResponseModel | null> => {
  await simulateNetworkDelay();

  const requirement = mockRequirements.find(req => req.id === id);
  return requirement || null;
};

/**
 * Crear nuevo Requirement
 */
export const createRequirement = async (
  data: Omit<RequirementResponseModel, 'id'>
): Promise<RequirementResponseModel> => {
  await simulateNetworkDelay();

  const newId = Math.max(...mockRequirements.map(req => req.id)) + 1;
  const newRequirement: RequirementResponseModel = {
    id: newId,
    ...data
  };

  mockRequirements.push(newRequirement);

  return newRequirement;
};

/**
 * Actualizar Requirement existente
 */
export const updateRequirement = async (
  id: number,
  data: Partial<RequirementResponseModel>
): Promise<RequirementResponseModel> => {
  await simulateNetworkDelay();

  const index = mockRequirements.findIndex(req => req.id === id);
  if (index === -1) {
    throw new Error(`Requirement con id ${id} no encontrado`);
  }

  mockRequirements[index] = {
    ...mockRequirements[index],
    ...data
  };

  return mockRequirements[index];
};

/**
 * Eliminar Requirement
 */
export const deleteRequirement = async (id: number): Promise<void> => {
  await simulateNetworkDelay();

  const index = mockRequirements.findIndex(req => req.id === id);
  if (index === -1) {
    throw new Error(`Requirement con id ${id} no encontrado`);
  }

  mockRequirements.splice(index, 1);
};

/**
 * Contar Requirements por Work Station
 */
export const countRequirementsByWorkStation = async (workStationId: number): Promise<number> => {
  await simulateNetworkDelay();

  return mockRequirements.filter(req => req.rhh_workstation_id === workStationId).length;
};
