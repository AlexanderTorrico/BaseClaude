import { useState, useCallback } from 'react';
import { Table, Zone } from '../models/TableModel';
import { ReservationModel } from '../models/ReservationModel';

interface TableAssignmentState {
  selectedZoneId: number | null;
  selectedTableIds: number[];
  isAssigning: boolean;
  error: string | null;
}

export const useTableAssignment = (
  reservation: ReservationModel | null,
  onAssignComplete?: (zoneId: number, tableIds: number[]) => Promise<void>
) => {
  const [state, setState] = useState<TableAssignmentState>({
    selectedZoneId: reservation?.zone_id || null,
    selectedTableIds: reservation?.boo_tables.map(t => t.id) || [],
    isAssigning: false,
    error: null
  });

  // Seleccionar zona
  const selectZone = useCallback((zoneId: number | null) => {
    setState(prev => ({
      ...prev,
      selectedZoneId: zoneId,
      selectedTableIds: [] // Limpiar selección de mesas al cambiar zona
    }));
  }, []);

  // Alternar selección de mesa
  const toggleTableSelection = useCallback((tableId: number) => {
    setState(prev => {
      const isSelected = prev.selectedTableIds.includes(tableId);
      return {
        ...prev,
        selectedTableIds: isSelected
          ? prev.selectedTableIds.filter(id => id !== tableId)
          : [...prev.selectedTableIds, tableId]
      };
    });
  }, []);

  // Seleccionar múltiples mesas
  const selectTables = useCallback((tableIds: number[]) => {
    setState(prev => ({
      ...prev,
      selectedTableIds: tableIds
    }));
  }, []);

  // Limpiar selección
  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedZoneId: null,
      selectedTableIds: []
    }));
  }, []);

  // Validar selección
  const validateSelection = useCallback((
    availableTables: Table[],
    requiredCapacity: number
  ): { valid: boolean; message: string } => {
    if (!state.selectedZoneId) {
      return { valid: false, message: 'Debe seleccionar una zona' };
    }

    if (state.selectedTableIds.length === 0) {
      return { valid: false, message: 'Debe seleccionar al menos una mesa' };
    }

    // Verificar que todas las mesas seleccionadas estén disponibles
    const selectedTables = availableTables.filter(t =>
      state.selectedTableIds.includes(t.id)
    );

    if (selectedTables.length !== state.selectedTableIds.length) {
      return { valid: false, message: 'Algunas mesas seleccionadas no están disponibles' };
    }

    // Verificar capacidad total
    const totalCapacity = selectedTables.reduce((sum, t) => sum + t.capacity, 0);
    if (totalCapacity < requiredCapacity) {
      return {
        valid: false,
        message: `La capacidad total (${totalCapacity}) es insuficiente para ${requiredCapacity} comensales`
      };
    }

    return { valid: true, message: 'Selección válida' };
  }, [state.selectedZoneId, state.selectedTableIds]);

  // Confirmar asignación
  const confirmAssignment = useCallback(async (
    availableTables: Table[],
    requiredCapacity: number
  ): Promise<boolean> => {
    // Validar antes de confirmar
    const validation = validateSelection(availableTables, requiredCapacity);
    if (!validation.valid) {
      setState(prev => ({ ...prev, error: validation.message }));
      return false;
    }

    setState(prev => ({ ...prev, isAssigning: true, error: null }));

    try {
      if (onAssignComplete && state.selectedZoneId) {
        await onAssignComplete(state.selectedZoneId, state.selectedTableIds);
      }
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al asignar mesas';
      setState(prev => ({ ...prev, error: errorMessage }));
      return false;
    } finally {
      setState(prev => ({ ...prev, isAssigning: false }));
    }
  }, [state.selectedZoneId, state.selectedTableIds, validateSelection, onAssignComplete]);

  // Obtener capacidad total seleccionada
  const getTotalSelectedCapacity = useCallback((tables: Table[]): number => {
    const selectedTables = tables.filter(t => state.selectedTableIds.includes(t.id));
    return selectedTables.reduce((sum, t) => sum + t.capacity, 0);
  }, [state.selectedTableIds]);

  // Verificar si una mesa está seleccionada
  const isTableSelected = useCallback((tableId: number): boolean => {
    return state.selectedTableIds.includes(tableId);
  }, [state.selectedTableIds]);

  // Sugerencia automática de mesas
  const suggestTables = useCallback((
    availableTables: Table[],
    diners: number,
    zoneId?: number
  ): number[] => {
    let tables = availableTables;

    // Filtrar por zona si se especifica
    if (zoneId) {
      tables = tables.filter(t => t.zone_id === zoneId);
    }

    // Filtrar solo mesas disponibles
    tables = tables.filter(t => t.status === 'Available');

    // Ordenar por capacidad (más cercana al número de comensales primero)
    const sorted = [...tables].sort((a, b) => {
      const diffA = Math.abs(a.capacity - diners);
      const diffB = Math.abs(b.capacity - diners);
      return diffA - diffB;
    });

    // Intentar encontrar una sola mesa que sea suficiente
    const singleTable = sorted.find(t => t.capacity >= diners);
    if (singleTable) {
      return [singleTable.id];
    }

    // Si no hay una sola mesa, combinar varias
    const selected: number[] = [];
    let totalCapacity = 0;

    for (const table of sorted) {
      if (totalCapacity >= diners) break;
      selected.push(table.id);
      totalCapacity += table.capacity;
    }

    return selected;
  }, []);

  // Aplicar sugerencia
  const applySuggestion = useCallback((
    availableTables: Table[],
    diners: number,
    zoneId?: number
  ) => {
    const suggested = suggestTables(availableTables, diners, zoneId);
    setState(prev => ({
      ...prev,
      selectedTableIds: suggested,
      selectedZoneId: zoneId || prev.selectedZoneId
    }));
  }, [suggestTables]);

  return {
    // Estado
    selectedZoneId: state.selectedZoneId,
    selectedTableIds: state.selectedTableIds,
    isAssigning: state.isAssigning,
    error: state.error,

    // Acciones
    selectZone,
    toggleTableSelection,
    selectTables,
    clearSelection,
    confirmAssignment,

    // Validación
    validateSelection,

    // Utilidades
    getTotalSelectedCapacity,
    isTableSelected,
    suggestTables,
    applySuggestion
  };
};
