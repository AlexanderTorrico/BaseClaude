import { ReservationModel, UpdateReservationDTO, ReservationStatus } from '../models/ReservationModel';
import { generateFakeReservations } from '../data/fakeData';

// Simulación de almacenamiento en memoria
let reservationsCache: Map<string, ReservationModel[]> = new Map();

// Simular delay de red
const simulateNetworkDelay = (ms: number = 300) =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Obtener todas las reservas de una fecha específica
 */
export const getReservationsByDate = async (date: string): Promise<ReservationModel[]> => {
  await simulateNetworkDelay();

  // Si no hay datos en caché para esta fecha, generarlos
  if (!reservationsCache.has(date)) {
    const fakeReservations = generateFakeReservations(date);
    reservationsCache.set(date, fakeReservations);
  }

  return reservationsCache.get(date) || [];
};

/**
 * Obtener una reserva específica por ID
 */
export const getReservationById = async (id: number, date: string): Promise<ReservationModel | null> => {
  await simulateNetworkDelay();

  const reservations = await getReservationsByDate(date);
  return reservations.find(r => r.id === id) || null;
};

/**
 * Actualizar una reserva (cambiar estado, asignar mesas, etc.)
 */
export const updateReservation = async (
  id: number,
  date: string,
  updates: UpdateReservationDTO
): Promise<ReservationModel> => {
  await simulateNetworkDelay();

  const reservations = reservationsCache.get(date) || [];
  const index = reservations.findIndex(r => r.id === id);

  if (index === -1) {
    throw new Error('Reservation not found');
  }

  const updatedReservation: ReservationModel = {
    ...reservations[index],
    ...(updates.status && { status: updates.status }),
    ...(updates.zone_id && { zone_id: updates.zone_id }),
    ...(updates.detail && { detail: updates.detail }),
    updated_at: new Date().toISOString(),
  };

  // Si se asignan mesas, actualizar boo_tables
  if (updates.table_ids && updates.table_ids.length > 0) {
    const { getTableById } = await import('../data/fakeData');
    updatedReservation.boo_tables = updates.table_ids.map(tableId => {
      const table = getTableById(tableId);
      if (!table) throw new Error(`Table ${tableId} not found`);

      const { getZoneById } = require('../data/fakeData');
      const zone = getZoneById(table.zone_id);

      return {
        id: table.id,
        table_number: table.table_number,
        zone_name: zone?.name || 'Unknown'
      };
    });
  }

  reservations[index] = updatedReservation;
  reservationsCache.set(date, reservations);

  return updatedReservation;
};

/**
 * Filtrar reservas por estado
 */
export const filterReservationsByStatus = (
  reservations: ReservationModel[],
  statuses: ReservationStatus[]
): ReservationModel[] => {
  if (statuses.length === 0) return reservations;
  return reservations.filter(r => statuses.includes(r.status));
};

/**
 * Buscar reservas por nombre, teléfono o ID
 */
export const searchReservations = (
  reservations: ReservationModel[],
  searchTerm: string
): ReservationModel[] => {
  if (!searchTerm.trim()) return reservations;

  const term = searchTerm.toLowerCase();
  return reservations.filter(r =>
    r.name.toLowerCase().includes(term) ||
    r.last_name.toLowerCase().includes(term) ||
    r.phone.includes(term) ||
    r.id.toString().includes(term)
  );
};

/**
 * Obtener estadísticas de reservas por estado
 */
export const getReservationStats = (reservations: ReservationModel[]) => {
  return {
    total: reservations.length,
    pending: reservations.filter(r => r.status === 'Pending').length,
    confirmed: reservations.filter(r => r.status === 'Confirmed').length,
    seated: reservations.filter(r => r.status === 'Seated').length,
    completed: reservations.filter(r => r.status === 'Completed').length,
    cancelled: reservations.filter(r => r.status === 'Cancelled').length,
    noShow: reservations.filter(r => r.status === 'NoShow').length,
  };
};

/**
 * Cancelar reserva
 */
export const cancelReservation = async (id: number, date: string): Promise<ReservationModel> => {
  return updateReservation(id, date, { status: 'Cancelled' });
};

/**
 * Confirmar reserva
 */
export const confirmReservation = async (
  id: number,
  date: string,
  zoneId: number,
  tableIds: number[]
): Promise<ReservationModel> => {
  return updateReservation(id, date, {
    status: 'Confirmed',
    zone_id: zoneId,
    table_ids: tableIds
  });
};

/**
 * Marcar cliente como sentado
 */
export const markAsSeated = async (id: number, date: string): Promise<ReservationModel> => {
  return updateReservation(id, date, { status: 'Seated' });
};

/**
 * Completar reserva
 */
export const completeReservation = async (id: number, date: string): Promise<ReservationModel> => {
  return updateReservation(id, date, { status: 'Completed' });
};

/**
 * Marcar como no show
 */
export const markAsNoShow = async (id: number, date: string): Promise<ReservationModel> => {
  return updateReservation(id, date, { status: 'NoShow' });
};
