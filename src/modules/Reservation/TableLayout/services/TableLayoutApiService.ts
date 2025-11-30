import { httpRequestWithAuth } from '@/services/httpService';
import { ITableLayoutService } from './ITableLayoutService';
import { ZoneModel, TableModel, CreateZoneDto, CreateTableDto, UpdateTablePositionDto, UpdateTablePositionsDto } from '../models/TableLayoutModel';
import { adaptZonesArrayResponse, adaptZoneResponseToZoneModel, adaptTableResponseToTableModel } from '../adapters/tablelayoutAdapter';
import { ApiResponse, transformApiData } from '@/shared/types';
import { SetStateFn } from '@/shared/types/commonTypes';

export class TableLayoutApiService implements ITableLayoutService {
  async getZonesByCompany(companyId: number, setLoading?: SetStateFn): Promise<ApiResponse<ZoneModel[]>> {
    const res = await httpRequestWithAuth.get<ApiResponse<any>>(
      `/api/booking/zone/gbl_company_id/${companyId}`,
      setLoading
    );

    console.log('🔵 [TableLayoutApiService] Raw API Response:', res);
    console.log('🔵 [TableLayoutApiService] res.data:', res.data);

    const transformed = transformApiData(res, (data) => {
      console.log('🟡 [Adapter] Received data:', data);
      const zones = adaptZonesArrayResponse(data?.data ?? []);
      console.log('🟢 [Adapter] Transformed zones:', zones);
      return zones;
    });

    console.log('🟢 [TableLayoutApiService] Final transformed:', transformed);

    return transformed;
  }

  async createZone(dto: CreateZoneDto, setLoading?: SetStateFn): Promise<ApiResponse<ZoneModel>> {
    const payload = {
      gbl_company_id: dto.gblCompanyId,
      name: dto.name,
    };

    const res = await httpRequestWithAuth.post<ApiResponse<any>>(
      '/api/booking/zone',
      payload,
      setLoading
    );

    console.log('🔵 [createZone] Raw API Response:', res);
    const transformed = transformApiData(res, (data) => {
      console.log('🟡 [createZone] Received data:', data);
      const zone = adaptZoneResponseToZoneModel(data?.data ?? data);
      console.log('🟢 [createZone] Transformed zone:', zone);
      return zone;
    });
    console.log('🟢 [createZone] Final result:', transformed);

    return transformed;
  }

  async createTable(dto: CreateTableDto, setLoading?: SetStateFn): Promise<ApiResponse<TableModel>> {
    const payload = {
      number: dto.number,
      capacity: dto.capacity,
      automatic_reservation_level: dto.automaticReservationLevel,
      boo_zone_id: dto.booZoneId,
      position: dto.position,
      shape: dto.shape,
      gbl_company_id: dto.gblCompanyId,
    };

    const res = await httpRequestWithAuth.post<ApiResponse<any>>(
      '/api/booking/table',
      payload,
      setLoading
    );

    console.log('🔵 [createTable] Raw API Response:', res);
    const transformed = transformApiData(res, (data) => {
      console.log('🟡 [createTable] Received data:', data);
      const table = adaptTableResponseToTableModel(data?.data ?? data);
      console.log('🟢 [createTable] Transformed table:', table);
      return table;
    });
    console.log('🟢 [createTable] Final result:', transformed);

    return transformed;
  }

  async updateTablePosition(dto: UpdateTablePositionDto, setLoading?: SetStateFn): Promise<ApiResponse<TableModel>> {
    const payload = {
      position: dto.position,
    };

    const res = await httpRequestWithAuth.put<ApiResponse<any>>(
      `/api/booking/table/${dto.id}/position`,
      payload,
      setLoading
    );

    return transformApiData(res, adaptTableResponseToTableModel);
  }

  async updateTablePositions(dto: UpdateTablePositionsDto, setLoading?: SetStateFn): Promise<ApiResponse<TableModel[]>> {
    const payload = dto.tables.map(table => ({
      id: table.id,
      number: table.number,
      capacity: table.capacity,
      automatic_reservation_level: table.automaticReservationLevel,
      boo_zone_id: table.booZoneId,
      position: table.position,
      shape: table.shape,
      active: table.active,
      gbl_company_id: table.gblCompanyId,
    }));

    const res = await httpRequestWithAuth.put<ApiResponse<any>>(
      '/api/booking/table/update_positions',
      payload,
      setLoading
    );

    return transformApiData(res, (data) => {
      const tablesArray = data?.data ?? data ?? [];
      if (Array.isArray(tablesArray)) {
        return tablesArray.map(adaptTableResponseToTableModel);
      }
      return [];
    });
  }
}
