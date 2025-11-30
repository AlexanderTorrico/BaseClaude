export interface Position {
  x: number;
  y: number;
}

export interface TableModel {
  id: number;
  number: string;
  capacity: number;
  automaticReservationLevel: number;
  booZoneId: number;
  position: Position;
  shape: 'square' | 'circle' | 'rectangle';
  active: number;
  gblCompanyId: number;
}

export interface ZoneModel {
  id: number;
  name: string;
  active: number;
  gblCompanyId: number;
  booTables: TableModel[];
}

export interface CreateZoneDto {
  name: string;
  gblCompanyId: number;
}

export interface CreateTableDto {
  number: string;
  capacity: number;
  automaticReservationLevel: number;
  booZoneId: number;
  position: Position;
  shape: 'square' | 'circle' | 'rectangle';
  gblCompanyId: number;
}

export interface UpdateTablePositionDto {
  id: number;
  position: Position;
}

export interface UpdateTablePositionsDto {
  tables: TableModel[];
}
