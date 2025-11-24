import { useState } from 'react';
import store from '@/store';
import { ITableLayoutService } from '../services/ITableLayoutService';
import { setZones, addZone, addTable, updateTable } from '../slices/tablelayoutSlice';
import { CreateZoneDto, CreateTableDto, UpdateTablePositionDto, UpdateTablePositionsDto, TableModel } from '../models/TableLayoutModel';

export const useTableLayoutFetch = (service: ITableLayoutService) => {
  const [loading, setLoading] = useState(false);

  const fetchZonesByCompany = async (companyId: number): Promise<void> => {
    console.log('🔷 [useTableLayoutFetch] Fetching zones for company:', companyId);
    const result = await service.getZonesByCompany(companyId, setLoading);
    console.log('🔷 [useTableLayoutFetch] Service result:', result);
    console.log('🔷 [useTableLayoutFetch] Dispatching zones to Redux:', result.data);
    store.dispatch(setZones(result.data));
    console.log('🔷 [useTableLayoutFetch] Redux state after dispatch:', store.getState().reservation_tableLayout);
  };

  const createZone = async (dto: CreateZoneDto): Promise<{ success: boolean; message: string }> => {
    console.log('🔷 [createZone] Creating zone with dto:', dto);
    const result = await service.createZone(dto, setLoading);
    console.log('🔷 [createZone] Service result:', result);

    if (result.data) {
      console.log('🔷 [createZone] Dispatching addZone with:', result.data);
      store.dispatch(addZone(result.data));
      console.log('🔷 [createZone] Redux state after dispatch:', store.getState().reservation_tableLayout);
    } else {
      console.warn('🔷 [createZone] No data received from API');
    }

    return { success: result.status === 200, message: result.message };
  };

  const createTable = async (dto: CreateTableDto): Promise<{ success: boolean; message: string }> => {
    console.log('🔷 [createTable] Creating table with dto:', dto);
    const result = await service.createTable(dto, setLoading);
    console.log('🔷 [createTable] Service result:', result);

    if (result.data) {
      console.log('🔷 [createTable] Dispatching addTable with:', result.data);
      store.dispatch(addTable(result.data));
      console.log('🔷 [createTable] Redux state after dispatch:', store.getState().reservation_tableLayout);
    } else {
      console.warn('🔷 [createTable] No data received from API');
    }

    return { success: result.status === 200, message: result.message };
  };

  const updateTablePosition = async (dto: UpdateTablePositionDto): Promise<{ success: boolean; message: string }> => {
    const result = await service.updateTablePosition(dto, setLoading);

    if (result.data) {
      store.dispatch(updateTable(result.data));
    }

    return { success: result.status === 200, message: result.message };
  };

  const updateTablePositions = async (tables: TableModel[]): Promise<{ success: boolean; message: string }> => {
    const result = await service.updateTablePositions({ tables }, setLoading);

    if (result.data && result.data.length > 0) {
      result.data.forEach(table => {
        store.dispatch(updateTable(table));
      });
    }

    return { success: result.status === 200, message: result.message };
  };

  return {
    loading,
    fetchZonesByCompany,
    createZone,
    createTable,
    updateTablePosition,
    updateTablePositions,
  };
};
