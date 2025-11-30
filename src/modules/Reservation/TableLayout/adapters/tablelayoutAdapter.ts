import { ZoneModel, TableModel } from '../models/TableLayoutModel';

export const adaptTableResponseToTableModel = (apiData: any): TableModel => {
  return {
    id: apiData.id,
    number: apiData.number,
    capacity: typeof apiData.capacity === 'string' ? parseInt(apiData.capacity, 10) : apiData.capacity,
    automaticReservationLevel: typeof apiData.automatic_reservation_level === 'string'
      ? parseInt(apiData.automatic_reservation_level, 10)
      : apiData.automatic_reservation_level,
    booZoneId: apiData.boo_zone_id,
    position: apiData.position,
    shape: apiData.shape,
    active: apiData.active ?? 1,
    gblCompanyId: apiData.gbl_company_id,
  };
};

export const adaptZoneResponseToZoneModel = (apiData: any): ZoneModel => {
  return {
    id: apiData.id,
    name: apiData.name,
    active: apiData.active,
    gblCompanyId: apiData.gbl_company_id,
    booTables: apiData.boo_tables?.map(adaptTableResponseToTableModel) || [],
  };
};

export const adaptZonesArrayResponse = (apiData: any[]): ZoneModel[] => {
  return apiData.map(adaptZoneResponseToZoneModel);
};
