import { Table, Zone, TableStatus, TableAvailability, ZoneStats } from '../models/TableModel';
import { zones, tables, getTablesByZone, getZoneById } from '../data/fakeData';
import { ReservationModel } from '../models/ReservationModel';

// Simular delay de red
const simulateNetworkDelay = (ms: number = 200) =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Obtener todas las zonas
 */
export const getAllZones = async (): Promise<Zone[]> => {
  await simulateNetworkDelay();
  return zones;
};

/**
 * Obtener una zona específica por ID
 */
export const getZone = async (zoneId: number): Promise<Zone | null> => {
  await simulateNetworkDelay();
  return getZoneById(zoneId) || null;
};

/**
 * Obtener todas las mesas
 */
export const getAllTables = async (): Promise<Table[]> => {
  await simulateNetworkDelay();

  // Añadir información de zona a cada mesa
  return tables.map(table => ({
    ...table,
    zone: getZoneById(table.zone_id)
  }));
};

/**
 * Obtener mesas por zona
 */
export const getTablesForZone = async (zoneId: number): Promise<Table[]> => {
  await simulateNetworkDelay();

  const zoneTables = getTablesByZone(zoneId);
  return zoneTables.map(table => ({
    ...table,
    zone: getZoneById(table.zone_id)
  }));
};

/**
 * Obtener mesa específica por ID
 */
export const getTableById = async (tableId: number): Promise<Table | null> => {
  await simulateNetworkDelay();

  const table = tables.find(t => t.id === tableId);
  if (!table) return null;

  return {
    ...table,
    zone: getZoneById(table.zone_id)
  };
};

/**
 * Obtener mesas disponibles para un número específico de comensales
 */
export const getAvailableTablesForDiners = async (
  diners: number,
  zoneId?: number
): Promise<Table[]> => {
  await simulateNetworkDelay();

  let availableTables = tables.filter(
    t => t.status === 'Available' && t.capacity >= diners
  );

  if (zoneId) {
    availableTables = availableTables.filter(t => t.zone_id === zoneId);
  }

  return availableTables.map(table => ({
    ...table,
    zone: getZoneById(table.zone_id)
  }));
};

/**
 * Verificar disponibilidad de mesa
 */
export const checkTableAvailability = async (
  tableId: number,
  reservations: ReservationModel[]
): Promise<TableAvailability> => {
  await simulateNetworkDelay();

  const table = tables.find(t => t.id === tableId);
  if (!table) {
    throw new Error('Table not found');
  }

  // Verificar si hay alguna reserva activa para esta mesa
  const activeReservation = reservations.find(r =>
    r.boo_tables.some(t => t.id === tableId) &&
    ['Confirmed', 'Seated'].includes(r.status)
  );

  const is_available = table.status === 'Available' && !activeReservation;

  const result: TableAvailability = {
    table: {
      ...table,
      zone: getZoneById(table.zone_id)
    },
    is_available
  };

  if (activeReservation) {
    result.next_reservation = {
      id: activeReservation.id,
      time: activeReservation.boo_hour?.time || '',
      name: `${activeReservation.name} ${activeReservation.last_name}`
    };
  }

  return result;
};

/**
 * Obtener estadísticas de una zona
 */
export const getZoneStatistics = async (
  zoneId: number,
  reservations: ReservationModel[]
): Promise<ZoneStats | null> => {
  await simulateNetworkDelay();

  const zone = getZoneById(zoneId);
  if (!zone) return null;

  const zoneTables = getTablesByZone(zoneId);

  const availableTables = zoneTables.filter(t => t.status === 'Available').length;
  const occupiedTables = zoneTables.filter(t => t.status === 'Occupied').length;
  const reservedTables = zoneTables.filter(t => t.status === 'Reserved').length;
  const totalCapacity = zoneTables.reduce((sum, t) => sum + t.capacity, 0);

  // Calcular comensales actuales (de reservas seated/confirmed en esta zona)
  const currentDiners = reservations
    .filter(r =>
      r.zone_id === zoneId &&
      ['Confirmed', 'Seated'].includes(r.status)
    )
    .reduce((sum, r) => sum + r.diners, 0);

  return {
    zone,
    total_tables: zoneTables.length,
    available_tables: availableTables,
    occupied_tables: occupiedTables,
    reserved_tables: reservedTables,
    total_capacity: totalCapacity,
    current_diners: currentDiners
  };
};

/**
 * Obtener estadísticas de todas las zonas
 */
export const getAllZonesStatistics = async (
  reservations: ReservationModel[]
): Promise<ZoneStats[]> => {
  await simulateNetworkDelay();

  const stats = await Promise.all(
    zones.map(zone => getZoneStatistics(zone.id, reservations))
  );

  return stats.filter((stat): stat is ZoneStats => stat !== null);
};

/**
 * Actualizar estado de mesa
 */
export const updateTableStatus = async (
  tableId: number,
  status: TableStatus
): Promise<Table> => {
  await simulateNetworkDelay();

  const tableIndex = tables.findIndex(t => t.id === tableId);
  if (tableIndex === -1) {
    throw new Error('Table not found');
  }

  tables[tableIndex].status = status;

  return {
    ...tables[tableIndex],
    zone: getZoneById(tables[tableIndex].zone_id)
  };
};

/**
 * Filtrar mesas por estado
 */
export const filterTablesByStatus = (
  tablesToFilter: Table[],
  statuses: TableStatus[]
): Table[] => {
  if (statuses.length === 0) return tablesToFilter;
  return tablesToFilter.filter(t => statuses.includes(t.status));
};

/**
 * Agrupar mesas por zona
 */
export const groupTablesByZone = (tablesToGroup: Table[]): Map<number, Table[]> => {
  const grouped = new Map<number, Table[]>();

  tablesToGroup.forEach(table => {
    const existing = grouped.get(table.zone_id) || [];
    grouped.set(table.zone_id, [...existing, table]);
  });

  return grouped;
};
