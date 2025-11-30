import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ZoneModel, TableModel } from '../models/TableLayoutModel';

export const useTableLayout = () => {
  const zones = useSelector((state: RootState) => state.reservation_tableLayout.zones);
  const selectedZoneId = useSelector((state: RootState) => state.reservation_tableLayout.selectedZoneId);
  const selectedTableId = useSelector((state: RootState) => state.reservation_tableLayout.selectedTableId);

  const getZoneById = (zoneId: number): ZoneModel | undefined => {
    return zones.find(z => z.id === zoneId);
  };

  const getTableById = (tableId: number): TableModel | undefined => {
    for (const zone of zones) {
      const table = zone.booTables.find(t => t.id === tableId);
      if (table) return table;
    }
    return undefined;
  };

  const getSelectedZone = (): ZoneModel | undefined => {
    return selectedZoneId ? getZoneById(selectedZoneId) : undefined;
  };

  const getSelectedTable = (): TableModel | undefined => {
    return selectedTableId ? getTableById(selectedTableId) : undefined;
  };

  const getTotalZones = (): number => {
    return zones.length;
  };

  const getTotalTables = (): number => {
    return zones.reduce((sum, zone) => sum + zone.booTables.length, 0);
  };

  const getTablesForZone = (zoneId: number): TableModel[] => {
    const zone = getZoneById(zoneId);
    return zone?.booTables || [];
  };

  return {
    zones,
    selectedZoneId,
    selectedTableId,
    getZoneById,
    getTableById,
    getSelectedZone,
    getSelectedTable,
    getTotalZones,
    getTotalTables,
    getTablesForZone,
  };
};
