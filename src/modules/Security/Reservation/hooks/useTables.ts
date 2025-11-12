import { useState, useEffect, useCallback } from 'react';
import { Table, Zone, TableStatus, ZoneStats } from '../models/TableModel';
import { ReservationModel } from '../models/ReservationModel';
import * as tableService from '../services/tableService';

export const useTables = (reservations: ReservationModel[] = []) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<TableStatus[]>([]);

  // Cargar zonas y mesas
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [zonesData, tablesData] = await Promise.all([
        tableService.getAllZones(),
        tableService.getAllTables()
      ]);

      setZones(zonesData);
      setTables(tablesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading tables data');
      console.error('Error loading tables:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos al montar
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Obtener mesas filtradas
  const getFilteredTables = useCallback((): Table[] => {
    let filtered = tables;

    // Filtrar por zona
    if (selectedZone !== null) {
      filtered = filtered.filter(t => t.zone_id === selectedZone);
    }

    // Filtrar por estado
    if (filterStatus.length > 0) {
      filtered = tableService.filterTablesByStatus(filtered, filterStatus);
    }

    return filtered;
  }, [tables, selectedZone, filterStatus]);

  // Obtener mesas disponibles para número de comensales
  const getAvailableTablesForDiners = useCallback(async (
    diners: number,
    zoneId?: number
  ): Promise<Table[]> => {
    try {
      return await tableService.getAvailableTablesForDiners(diners, zoneId);
    } catch (err) {
      console.error('Error getting available tables:', err);
      return [];
    }
  }, []);

  // Obtener estadísticas de zona
  const getZoneStats = useCallback(async (zoneId: number): Promise<ZoneStats | null> => {
    try {
      return await tableService.getZoneStatistics(zoneId, reservations);
    } catch (err) {
      console.error('Error getting zone stats:', err);
      return null;
    }
  }, [reservations]);

  // Obtener estadísticas de todas las zonas
  const getAllZoneStats = useCallback(async (): Promise<ZoneStats[]> => {
    try {
      return await tableService.getAllZonesStatistics(reservations);
    } catch (err) {
      console.error('Error getting all zone stats:', err);
      return [];
    }
  }, [reservations]);

  // Actualizar estado de mesa
  const updateTableStatus = useCallback(async (
    tableId: number,
    status: TableStatus
  ): Promise<Table> => {
    try {
      const updated = await tableService.updateTableStatus(tableId, status);

      // Actualizar estado local
      setTables(prev =>
        prev.map(t => t.id === tableId ? updated : t)
      );

      return updated;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating table status';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Obtener mesas de una zona específica
  const getTablesByZone = useCallback((zoneId: number): Table[] => {
    return tables.filter(t => t.zone_id === zoneId);
  }, [tables]);

  // Obtener mesa por ID
  const getTableById = useCallback((tableId: number): Table | undefined => {
    return tables.find(t => t.id === tableId);
  }, [tables]);

  // Obtener zona por ID
  const getZoneById = useCallback((zoneId: number): Zone | undefined => {
    return zones.find(z => z.id === zoneId);
  }, [zones]);

  // Verificar disponibilidad de mesa
  const checkTableAvailability = useCallback(async (tableId: number) => {
    try {
      return await tableService.checkTableAvailability(tableId, reservations);
    } catch (err) {
      console.error('Error checking table availability:', err);
      return null;
    }
  }, [reservations]);

  // Agrupar mesas por zona
  const getTablesGroupedByZone = useCallback((): Map<number, Table[]> => {
    return tableService.groupTablesByZone(tables);
  }, [tables]);

  // Refrescar datos
  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    // Estado
    tables,
    zones,
    filteredTables: getFilteredTables(),
    loading,
    error,
    selectedZone,
    filterStatus,

    // Acciones
    updateTableStatus,
    setSelectedZone,
    setFilterStatus,

    // Consultas
    getTablesByZone,
    getTableById,
    getZoneById,
    getAvailableTablesForDiners,
    getZoneStats,
    getAllZoneStats,
    checkTableAvailability,
    getTablesGroupedByZone,

    // Utilidades
    refresh
  };
};
