# Sistema de Gestión de Reservas de Restaurante

Sistema completo para gestionar reservas de restaurante, incluyendo asignación de mesas, seguimiento de estados y visualización de disponibilidad.

## Características

### Gestión de Reservas
- **Visualización de reservas por día**: Navegación entre días con selector de fecha
- **Estados de reserva**:
  - Pendiente (sin mesa asignada)
  - Confirmada (mesa asignada)
  - En Mesa (cliente sentado)
  - Completada (servicio finalizado)
  - Cancelada
  - No Show (no se presentó)
- **Filtros avanzados**: Por estado, búsqueda por nombre/teléfono/ID
- **Estadísticas en tiempo real**: Contador de reservas por estado

### Gestión de Mesas
- **Mapa Visual Interactivo**: Visualización de mesas en un plano 2D simulando el restaurante
  - Posicionamiento real según coordenadas X, Y
  - Diferentes formas: redondas, cuadradas, rectangulares
  - Colores según estado (verde=disponible, rojo=ocupada, etc.)
  - Escala responsiva que se adapta al tamaño de pantalla
  - Tooltips con información detallada al pasar el mouse
  - Click en mesa para ver más detalles
- **Visualización por zona**: Terraza, Interior, VIP, Bar (mapa independiente por zona)
- **Estados de mesa**:
  - Disponible (verde)
  - Reservada (azul)
  - Ocupada (amarillo)
  - En Limpieza (gris)
  - En Mantenimiento (rojo)
- **Estadísticas por zona**: Ocupación, capacidad, mesas disponibles

### Asignación de Mesas
- **Asignación manual**: Selección de zona y mesa(s)
- **Sugerencia automática**: El sistema sugiere mesas según número de comensales
- **Validación de capacidad**: Verifica que las mesas seleccionadas tengan capacidad suficiente
- **Multi-mesa**: Posibilidad de asignar múltiples mesas para grupos grandes

## Estructura del Proyecto

```
src/modules/Security/Reservation/
├── components/           # Componentes de UI
│   ├── DateSelector.tsx       # Selector de fecha
│   ├── ReservationList.tsx    # Lista de reservas
│   ├── ReservationDetail.tsx  # Panel detalle de reserva
│   ├── TableAssignment.tsx    # Modal asignación de mesas
│   ├── TableManagement.tsx    # Gestión de mesas
│   └── TableLayoutMap.tsx     # Mapa visual interactivo de mesas
├── hooks/                # Custom hooks
│   ├── useReservations.ts     # Lógica de reservas
│   ├── useTables.ts           # Lógica de mesas
│   └── useTableAssignment.ts  # Lógica asignación mesas
├── models/               # TypeScript interfaces
│   ├── ReservationModel.ts    # Tipos de reservas
│   └── TableModel.ts          # Tipos de mesas/zonas
├── services/             # Servicios de API
│   ├── reservationService.ts  # API de reservas
│   └── tableService.ts        # API de mesas
├── data/                 # Datos de prueba
│   └── fakeData.ts            # Datos fake para desarrollo
└── index.tsx             # Componente principal

```

## Uso

### Componente Principal

```tsx
import Reservation from './modules/Security/Reservation';

function App() {
  return <Reservation />;
}
```

### Hooks Personalizados

#### useReservations
```tsx
const {
  reservations,           // Todas las reservas
  filteredReservations,   // Reservas filtradas
  selectedDate,           // Fecha seleccionada
  confirmReservation,     // Confirmar con mesa
  cancelReservation,      // Cancelar reserva
  markAsSeated,          // Marcar como sentado
  completeReservation,   // Completar servicio
  goToPreviousDay,       // Día anterior
  goToNextDay,           // Día siguiente
  getStats,              // Estadísticas
} = useReservations(initialDate);
```

#### useTables
```tsx
const {
  tables,                      // Todas las mesas
  zones,                       // Todas las zonas
  getAvailableTablesForDiners, // Mesas disponibles
  getZoneStats,                // Stats por zona
  updateTableStatus,           // Cambiar estado mesa
} = useTables(reservations);
```

#### useTableAssignment
```tsx
const {
  selectedZoneId,        // Zona seleccionada
  selectedTableIds,      // Mesas seleccionadas
  toggleTableSelection,  // Alternar mesa
  confirmAssignment,     // Confirmar asignación
  suggestTables,        // Sugerir mesas
} = useTableAssignment(reservation, onAssignComplete);
```

## Datos de Prueba

El sistema incluye datos fake para desarrollo:

### Zonas
- Terraza (40 personas)
- Interior (60 personas)
- VIP (20 personas)
- Bar (30 personas)

### Horarios
- Almuerzo: 12:00 - 15:00
- Cena: 19:00 - 22:30

### Reservas Generadas
- 8-15 reservas aleatorias por día
- Diferentes estados
- Parámetros especiales (niños, mascotas, celebraciones, etc.)

## Integración con API Real

Para integrar con tu backend, reemplaza las funciones en `services/reservationService.ts` y `services/tableService.ts`:

```typescript
// Ejemplo: services/reservationService.ts
import axios from 'axios';

export const getReservationsByDate = async (date: string): Promise<ReservationModel[]> => {
  const response = await axios.get(`/api/reservations?date=${date}`);
  return response.data;
};

export const updateReservation = async (
  id: number,
  date: string,
  updates: UpdateReservationDTO
): Promise<ReservationModel> => {
  const response = await axios.put(`/api/reservations/${id}`, updates);
  return response.data;
};
```

## Características Adicionales

### Parámetros Especiales
- Con niños
- Con mascota
- Cerca a la ventana
- Zona tranquila
- Celebración cumpleaños
- Celebración aniversario
- Zona fumadores
- Restricciones dietéticas (sin gluten, vegano, etc.)

### Estadísticas en Tiempo Real
- Total de reservas del día
- Pendientes de asignar
- Confirmadas
- En mesa
- Completadas
- Canceladas / No Show

### Navegación de Fechas
- Botones anterior/siguiente
- Selector de fecha
- Botón "Ir a hoy"
- Formato amigable (Hoy, Mañana, Ayer)

## Mejoras Futuras

1. **Vista de calendario mensual**
2. **Notificaciones push** para nuevas reservas
3. **Impresión de reservas** del día
4. **Historial de cambios** de estado
5. **Reportes y analíticas**
6. **Integración con sistema de pagos**
7. **WhatsApp/SMS** confirmación automática
8. **Layout visual del restaurante** (plano interactivo)

## Tecnologías Utilizadas

- **React 18** con TypeScript
- **Reactstrap** para UI
- **Lucide React** para iconos
- **Custom Hooks** para lógica reutilizable
- **Simulación de API** con delays realistas
