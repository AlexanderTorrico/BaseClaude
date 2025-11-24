import { ITableLayoutService } from './ITableLayoutService';
import { ZoneModel, TableModel, CreateZoneDto, CreateTableDto, UpdateTablePositionDto, UpdateTablePositionsDto } from '../models/TableLayoutModel';
import { MOCK_ZONES } from '../data/mockTableLayoutWithRoles';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

export class TableLayoutMockService implements ITableLayoutService {
  private mockZones: ZoneModel[] = JSON.parse(JSON.stringify(MOCK_ZONES));
  private nextZoneId = 4;
  private nextTableId = 6;

  async getZonesByCompany(companyId: number, setLoading?: SetStateFn): Promise<ApiResponse<ZoneModel[]>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading?.(false);

    return {
      status: 200,
      message: 'success',
      data: JSON.parse(JSON.stringify(this.mockZones)),
    };
  }

  async createZone(dto: CreateZoneDto, setLoading?: SetStateFn): Promise<ApiResponse<ZoneModel>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading?.(false);

    const newZone: ZoneModel = {
      id: this.nextZoneId++,
      name: dto.name,
      active: 1,
      gblCompanyId: dto.gblCompanyId,
      booTables: [],
    };

    this.mockZones.push(newZone);

    return {
      status: 200,
      message: 'Zona creada exitosamente',
      data: JSON.parse(JSON.stringify(newZone)),
    };
  }

  async createTable(dto: CreateTableDto, setLoading?: SetStateFn): Promise<ApiResponse<TableModel>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading?.(false);

    const zone = this.mockZones.find(z => z.id === dto.booZoneId);

    if (!zone) {
      return {
        status: 404,
        message: 'Zona no encontrada',
        data: {} as TableModel,
      };
    }

    const newTable: TableModel = {
      id: this.nextTableId++,
      number: dto.number,
      capacity: dto.capacity,
      automaticReservationLevel: dto.automaticReservationLevel,
      booZoneId: dto.booZoneId,
      position: dto.position,
      shape: dto.shape,
      active: 1,
      gblCompanyId: dto.gblCompanyId,
    };

    zone.booTables.push(newTable);

    return {
      status: 200,
      message: 'Mesa creada exitosamente',
      data: JSON.parse(JSON.stringify(newTable)),
    };
  }

  async updateTablePosition(dto: UpdateTablePositionDto, setLoading?: SetStateFn): Promise<ApiResponse<TableModel>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading?.(false);

    for (const zone of this.mockZones) {
      const table = zone.booTables.find(t => t.id === dto.id);
      if (table) {
        table.position = dto.position;
        return {
          status: 200,
          message: 'Posición actualizada exitosamente',
          data: JSON.parse(JSON.stringify(table)),
        };
      }
    }

    return {
      status: 404,
      message: 'Mesa no encontrada',
      data: {} as TableModel,
    };
  }

  async updateTablePositions(dto: UpdateTablePositionsDto, setLoading?: SetStateFn): Promise<ApiResponse<TableModel[]>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading?.(false);

    const updatedTables: TableModel[] = [];

    for (const tableUpdate of dto.tables) {
      for (const zone of this.mockZones) {
        const table = zone.booTables.find(t => t.id === tableUpdate.id);
        if (table) {
          table.position = tableUpdate.position;
          updatedTables.push(JSON.parse(JSON.stringify(table)));
          break;
        }
      }
    }

    return {
      status: 200,
      message: `${updatedTables.length} posiciones actualizadas exitosamente`,
      data: updatedTables,
    };
  }
}
