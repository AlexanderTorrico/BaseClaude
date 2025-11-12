import { ReservationModel, ReservationStatus, BookingHour } from '../models/ReservationModel';
import { Zone, Table, TableStatus } from '../models/TableModel';

// Horarios disponibles
export const bookingHours: BookingHour[] = [
  { id: 81, time: '12:00', available: true },
  { id: 82, time: '12:30', available: true },
  { id: 83, time: '13:00', available: true },
  { id: 84, time: '13:30', available: true },
  { id: 85, time: '14:00', available: true },
  { id: 86, time: '14:30', available: true },
  { id: 87, time: '15:00', available: true },
  { id: 88, time: '19:00', available: true },
  { id: 89, time: '19:30', available: true },
  { id: 90, time: '20:00', available: true },
  { id: 91, time: '20:30', available: true },
  { id: 92, time: '21:00', available: true },
  { id: 93, time: '21:30', available: true },
  { id: 94, time: '22:00', available: true },
  { id: 95, time: '22:30', available: true },
];

// Zonas del restaurante
export const zones: Zone[] = [
  { id: 1, name: 'Terraza', description: 'Área exterior con vista', color: '#4CAF50', capacity: 40 },
  { id: 2, name: 'Interior', description: 'Sala principal interior', color: '#2196F3', capacity: 60 },
  { id: 3, name: 'VIP', description: 'Zona exclusiva y privada', color: '#FF9800', capacity: 20 },
  { id: 4, name: 'Bar', description: 'Área de bar y lounge', color: '#9C27B0', capacity: 30 },
];

// Mesas del restaurante (coordenadas mejoradas para visualización en mapa 800x600)
export const tables: Table[] = [
  // Terraza (Zona 1) - Distribución tipo jardín
  { id: 1, table_number: 'T1', capacity: 2, zone_id: 1, status: 'Available', shape: 'round', x: 100, y: 80 },
  { id: 2, table_number: 'T2', capacity: 2, zone_id: 1, status: 'Available', shape: 'round', x: 300, y: 80 },
  { id: 3, table_number: 'T3', capacity: 4, zone_id: 1, status: 'Reserved', shape: 'square', x: 500, y: 80 },
  { id: 4, table_number: 'T4', capacity: 4, zone_id: 1, status: 'Available', shape: 'square', x: 100, y: 250 },
  { id: 5, table_number: 'T5', capacity: 6, zone_id: 1, status: 'Occupied', shape: 'rectangle', x: 350, y: 250 },

  // Interior (Zona 2) - Distribución formal tipo restaurante
  { id: 6, table_number: 'I1', capacity: 2, zone_id: 2, status: 'Available', shape: 'round', x: 80, y: 60 },
  { id: 7, table_number: 'I2', capacity: 2, zone_id: 2, status: 'Available', shape: 'round', x: 250, y: 60 },
  { id: 8, table_number: 'I3', capacity: 4, zone_id: 2, status: 'Available', shape: 'square', x: 420, y: 60 },
  { id: 9, table_number: 'I4', capacity: 4, zone_id: 2, status: 'Reserved', shape: 'square', x: 590, y: 60 },
  { id: 10, table_number: 'I5', capacity: 4, zone_id: 2, status: 'Available', shape: 'square', x: 80, y: 220 },
  { id: 11, table_number: 'I6', capacity: 6, zone_id: 2, status: 'Occupied', shape: 'rectangle', x: 250, y: 220 },
  { id: 12, table_number: 'I7', capacity: 8, zone_id: 2, status: 'Available', shape: 'rectangle', x: 480, y: 220 },
  { id: 21, table_number: 'I8', capacity: 4, zone_id: 2, status: 'Available', shape: 'square', x: 80, y: 380 },
  { id: 22, table_number: 'I9', capacity: 4, zone_id: 2, status: 'Available', shape: 'square', x: 300, y: 380 },

  // VIP (Zona 3) - Mesas espaciadas y grandes
  { id: 13, table_number: 'V1', capacity: 4, zone_id: 3, status: 'Available', shape: 'round', x: 150, y: 120 },
  { id: 14, table_number: 'V2', capacity: 6, zone_id: 3, status: 'Reserved', shape: 'rectangle', x: 450, y: 120 },
  { id: 15, table_number: 'V3', capacity: 8, zone_id: 3, status: 'Available', shape: 'rectangle', x: 280, y: 320 },

  // Bar (Zona 4) - Mesas altas estilo bar
  { id: 16, table_number: 'B1', capacity: 2, zone_id: 4, status: 'Occupied', shape: 'round', x: 100, y: 100 },
  { id: 17, table_number: 'B2', capacity: 2, zone_id: 4, status: 'Available', shape: 'round', x: 250, y: 100 },
  { id: 18, table_number: 'B3', capacity: 2, zone_id: 4, status: 'Available', shape: 'round', x: 400, y: 100 },
  { id: 19, table_number: 'B4', capacity: 4, zone_id: 4, status: 'Cleaning', shape: 'square', x: 150, y: 280 },
  { id: 20, table_number: 'B5', capacity: 4, zone_id: 4, status: 'Available', shape: 'square', x: 400, y: 280 },
  { id: 23, table_number: 'B6', capacity: 2, zone_id: 4, status: 'Available', shape: 'round', x: 550, y: 100 },
];

// Parámetros especiales predefinidos
const specialParameters = [
  {
    id: 1,
    data: '[{"name":"Con niños","type":"number","active":false},{"name":"Con mascota","type":"number","active":false},{"name":"Cerca a la ventana","type":"boolean","active":false},{"name":"Zona tranquila","type":"boolean","active":false},{"name":"Celebración cumpleaños","type":"boolean","active":false},{"name":"Clebracion aniversario","type":"boolean","active":false},{"name":"Zona fumadores","type":"boolean","active":false}]',
    type: 'booking',
    category: 1,
    active: 0,
    gbl_company_id: null,
    pivot: {
      act_request_id: 0,
      act_parameter_id: 1,
      data: '[]'
    }
  },
  {
    id: 2,
    data: '[{"name":"Sin Gluten","type":"boolean","active":false},{"name":"Sin Lactosa","type":"boolean","active":false},{"name":"Opcion vegana","type":"boolean","active":false},{"name":"Sin Opcion vegetairana","type":"boolean","active":false},{"name":"Bajo en calorias","type":"boolean","active":false},{"name":"Alimento organicos","type":"boolean","active":false},{"name":"Menu infantil","type":"boolean","active":false}]',
    type: 'booking',
    category: 2,
    active: 0,
    gbl_company_id: null,
    pivot: {
      act_request_id: 0,
      act_parameter_id: 2,
      data: '[]'
    }
  }
];

// Función para generar reservas fake
export const generateFakeReservations = (date: string): ReservationModel[] => {
  const statuses: ReservationStatus[] = ['Pending', 'Confirmed', 'Seated', 'Completed', 'Cancelled', 'NoShow'];
  const names = [
    { name: 'Luis Angel', last_name: 'Quispe Abendaño' },
    { name: 'María', last_name: 'González Pérez' },
    { name: 'Carlos', last_name: 'Rodríguez Silva' },
    { name: 'Ana', last_name: 'Martínez López' },
    { name: 'Pedro', last_name: 'Sánchez García' },
    { name: 'Laura', last_name: 'Fernández Torres' },
    { name: 'Jorge', last_name: 'López Ramírez' },
    { name: 'Sofia', last_name: 'Díaz Morales' },
    { name: 'Miguel', last_name: 'Ruiz Vargas' },
    { name: 'Carmen', last_name: 'Flores Herrera' },
  ];

  const reservations: ReservationModel[] = [];

  // Generar entre 8 y 15 reservas para el día
  const numReservations = Math.floor(Math.random() * 8) + 8;

  for (let i = 0; i < numReservations; i++) {
    const randomPerson = names[Math.floor(Math.random() * names.length)];
    const randomHour = bookingHours[Math.floor(Math.random() * bookingHours.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const diners = Math.floor(Math.random() * 6) + 2;

    // Asignar mesas si el estado es Confirmed, Seated o Completed
    const boo_tables = (randomStatus === 'Confirmed' || randomStatus === 'Seated' || randomStatus === 'Completed')
      ? (() => {
          const randomZone = zones[Math.floor(Math.random() * zones.length)];
          const zoneTables = tables.filter(t => t.zone_id === randomZone.id && t.capacity >= diners);
          if (zoneTables.length > 0) {
            const selectedTable = zoneTables[Math.floor(Math.random() * zoneTables.length)];
            return [{
              id: selectedTable.id,
              table_number: selectedTable.table_number,
              zone_name: randomZone.name
            }];
          }
          return [];
        })()
      : [];

    const zone_id = boo_tables.length > 0
      ? tables.find(t => t.id === boo_tables[0].id)?.zone_id
      : undefined;

    reservations.push({
      id: 500 + i,
      date: date,
      detail: i % 3 === 0 ? 'Cumpleaños' : i % 3 === 1 ? 'Aniversario' : 'Cena familiar',
      diners: diners,
      name: randomPerson.name,
      last_name: randomPerson.last_name,
      phone: `591${Math.floor(Math.random() * 90000000) + 10000000}`,
      status: randomStatus,
      type: 'booking',
      come_of: i % 4 === 0 ? 'phone' : i % 4 === 1 ? 'walk-in' : 'web',
      boo_hour_id: randomHour.id,
      boo_hour: randomHour,
      boo_tables: boo_tables,
      act_parameters: specialParameters.map(p => ({
        ...p,
        pivot: {
          ...p.pivot,
          act_request_id: 500 + i
        }
      })),
      zone_id: zone_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  // Ordenar por hora
  return reservations.sort((a, b) => {
    const timeA = a.boo_hour?.time || '00:00';
    const timeB = b.boo_hour?.time || '00:00';
    return timeA.localeCompare(timeB);
  });
};

// Obtener reserva por hora para el día actual
export const getReservationByHour = (reservations: ReservationModel[], hourId: number) => {
  return reservations.find(r => r.boo_hour_id === hourId);
};

// Función helper para obtener zona por ID
export const getZoneById = (zoneId: number): Zone | undefined => {
  return zones.find(z => z.id === zoneId);
};

// Función helper para obtener mesa por ID
export const getTableById = (tableId: number): Table | undefined => {
  return tables.find(t => t.id === tableId);
};

// Función helper para obtener mesas por zona
export const getTablesByZone = (zoneId: number): Table[] => {
  return tables.filter(t => t.zone_id === zoneId);
};
