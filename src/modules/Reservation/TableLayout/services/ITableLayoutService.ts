import { ZoneModel, TableModel, CreateZoneDto, CreateTableDto, UpdateTablePositionDto, UpdateTablePositionsDto } from '../models/TableLayoutModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

export interface ITableLayoutService {
  getZonesByCompany(companyId: number, setLoading?: SetStateFn): Promise<ApiResponse<ZoneModel[]>>;
  createZone(dto: CreateZoneDto, setLoading?: SetStateFn): Promise<ApiResponse<ZoneModel>>;
  createTable(dto: CreateTableDto, setLoading?: SetStateFn): Promise<ApiResponse<TableModel>>;
  updateTablePosition(dto: UpdateTablePositionDto, setLoading?: SetStateFn): Promise<ApiResponse<TableModel>>;
  updateTablePositions(dto: UpdateTablePositionsDto, setLoading?: SetStateFn): Promise<ApiResponse<TableModel[]>>;
}
