// Estados de Reserva
export type ReservationStatus = 'Pending' | 'Confirmed' | 'Seated' | 'Completed' | 'Cancelled' | 'NoShow';

// Tipo de origen
export type ReservationSource = 'web' | 'phone' | 'walk-in' | 'app';

// Parámetro especial
export interface SpecialParameter {
  id: number;
  data: string;
  type: string;
  category: number;
  active: number;
  gbl_company_id: number | null;
  pivot?: {
    act_request_id: number;
    act_parameter_id: number;
    data: string;
  };
}

// Horario de reserva
export interface BookingHour {
  id: number;
  time: string;
  available: boolean;
}

// Mesa asignada a la reserva
export interface AssignedTable {
  id: number;
  table_number: string;
  zone_name: string;
}

// Modelo principal de Reserva
export interface ReservationModel {
  id: number;
  date: string;
  detail: string;
  diners: number;
  name: string;
  last_name: string;
  phone: string;
  status: ReservationStatus;
  type: string;
  come_of: ReservationSource;
  boo_hour_id: number;
  boo_hour?: BookingHour; // Información del horario
  boo_tables: AssignedTable[];
  act_parameters: SpecialParameter[];
  zone_id?: number; // Zona asignada
  created_at?: string;
  updated_at?: string;
}

// Filtros de búsqueda
export interface ReservationFilters {
  date?: string;
  status?: ReservationStatus[];
  search?: string;
  zone_id?: number;
}

// DTO para actualizar reserva
export interface UpdateReservationDTO {
  status?: ReservationStatus;
  zone_id?: number;
  table_ids?: number[];
  detail?: string;
}
