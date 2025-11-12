import { useState, useEffect, useCallback } from 'react';
import { ReservationModel, ReservationStatus, UpdateReservationDTO } from '../models/ReservationModel';
import * as reservationService from '../services/reservationService';

export const useReservations = (initialDate: string) => {
  const [reservations, setReservations] = useState<ReservationModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [filterStatus, setFilterStatus] = useState<ReservationStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Cargar reservas para la fecha seleccionada
  const loadReservations = useCallback(async (date: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await reservationService.getReservationsByDate(date);
      setReservations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading reservations');
      console.error('Error loading reservations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar reservas cuando cambia la fecha
  useEffect(() => {
    loadReservations(selectedDate);
  }, [selectedDate, loadReservations]);

  // Actualizar una reserva
  const updateReservation = useCallback(async (
    id: number,
    updates: UpdateReservationDTO
  ): Promise<ReservationModel> => {
    try {
      const updated = await reservationService.updateReservation(id, selectedDate, updates);

      // Actualizar el estado local
      setReservations(prev =>
        prev.map(r => r.id === id ? updated : r)
      );

      return updated;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating reservation';
      setError(errorMessage);
      throw err;
    }
  }, [selectedDate]);

  // Confirmar reserva con asignación de mesa
  const confirmReservation = useCallback(async (
    id: number,
    zoneId: number,
    tableIds: number[]
  ): Promise<ReservationModel> => {
    return updateReservation(id, {
      status: 'Confirmed',
      zone_id: zoneId,
      table_ids: tableIds
    });
  }, [updateReservation]);

  // Cancelar reserva
  const cancelReservation = useCallback(async (id: number): Promise<ReservationModel> => {
    return updateReservation(id, { status: 'Cancelled' });
  }, [updateReservation]);

  // Marcar como sentado
  const markAsSeated = useCallback(async (id: number): Promise<ReservationModel> => {
    return updateReservation(id, { status: 'Seated' });
  }, [updateReservation]);

  // Completar reserva
  const completeReservation = useCallback(async (id: number): Promise<ReservationModel> => {
    return updateReservation(id, { status: 'Completed' });
  }, [updateReservation]);

  // Marcar como no show
  const markAsNoShow = useCallback(async (id: number): Promise<ReservationModel> => {
    return updateReservation(id, { status: 'NoShow' });
  }, [updateReservation]);

  // Obtener reservas filtradas
  const getFilteredReservations = useCallback((): ReservationModel[] => {
    let filtered = reservations;

    // Filtrar por estado
    if (filterStatus.length > 0) {
      filtered = reservationService.filterReservationsByStatus(filtered, filterStatus);
    }

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      filtered = reservationService.searchReservations(filtered, searchTerm);
    }

    return filtered;
  }, [reservations, filterStatus, searchTerm]);

  // Obtener estadísticas
  const getStats = useCallback(() => {
    return reservationService.getReservationStats(reservations);
  }, [reservations]);

  // Cambiar fecha
  const changeDate = useCallback((newDate: string) => {
    setSelectedDate(newDate);
  }, []);

  // Navegar a día anterior
  const goToPreviousDay = useCallback(() => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  }, [selectedDate]);

  // Navegar a día siguiente
  const goToNextDay = useCallback(() => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  }, [selectedDate]);

  // Ir a hoy
  const goToToday = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  // Refrescar datos
  const refresh = useCallback(() => {
    loadReservations(selectedDate);
  }, [selectedDate, loadReservations]);

  return {
    // Estado
    reservations,
    filteredReservations: getFilteredReservations(),
    loading,
    error,
    selectedDate,
    filterStatus,
    searchTerm,

    // Acciones
    updateReservation,
    confirmReservation,
    cancelReservation,
    markAsSeated,
    completeReservation,
    markAsNoShow,

    // Filtros
    setFilterStatus,
    setSearchTerm,

    // Navegación de fecha
    changeDate,
    goToPreviousDay,
    goToNextDay,
    goToToday,

    // Utilidades
    getStats,
    refresh
  };
};
