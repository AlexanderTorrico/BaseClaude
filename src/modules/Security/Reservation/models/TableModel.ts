// Estados de Mesa
export type TableStatus = 'Available' | 'Reserved' | 'Occupied' | 'Cleaning' | 'Maintenance';

// Zona del restaurante
export interface Zone {
  id: number;
  name: string;
  description?: string;
  color?: string; // Color para identificación visual
  capacity?: number; // Capacidad total de la zona
}

// Mesa
export interface Table {
  id: number;
  table_number: string;
  capacity: number;
  zone_id: number;
  zone?: Zone;
  status: TableStatus;
  x?: number; // Posición X para layout visual
  y?: number; // Posición Y para layout visual
  shape?: 'square' | 'round' | 'rectangle'; // Forma de la mesa
  current_reservation_id?: number; // ID de reserva actual si está ocupada
}

// Vista de disponibilidad de mesa
export interface TableAvailability {
  table: Table;
  is_available: boolean;
  next_reservation?: {
    id: number;
    time: string;
    name: string;
  };
}

// Estadísticas de zona
export interface ZoneStats {
  zone: Zone;
  total_tables: number;
  available_tables: number;
  occupied_tables: number;
  reserved_tables: number;
  total_capacity: number;
  current_diners: number;
}
