# PROJECT GUIDE

**Documento principal de arquitectura del proyecto Skote React Admin Dashboard**

Este documento define la arquitectura, patrones y convenciones que deben seguirse al trabajar con este proyecto. Todo agente IA debe leer y comprender este documento antes de realizar cualquier modificación en el código.

---

## Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Estructura de Módulos](#estructura-de-módulos)
3. [Flujo de Datos](#flujo-de-datos)
4. [Componentes AZ (Aziende)](#componentes-az-aziende)
5. [Componentes Shared](#componentes-shared)
6. [Patrones y Convenciones](#patrones-y-convenciones)
7. [Ejemplos de Uso](#ejemplos-de-uso)

---

## Arquitectura General

### Stack Tecnológico

- **React 18** con TypeScript
- **Vite** como build tool
- **Redux Toolkit** para state management (con dispatch manual, NO createAsyncThunk)
- **React Router v6** para navegación
- **Reactstrap + Bootstrap 5** para UI
- **Axios** para HTTP requests
- **i18next** para internacionalización

### Principio de Arquitectura

```
UI (index.tsx - Abstracto)
  ↓
Submódulos (Header.tsx, ContentTable.tsx - En raíz del módulo)
  ↓
Hooks (Operaciones sync + llamadas a Controllers)
  ↓
Controller (Lógica async + dispatch Redux)
  ↓ ↓ ↓
[Services, Adapters, Slices] (En paralelo)
  ↓
API
```

**Flujo de datos de retorno:**
```
API → Service (HTTP) → Adapter (mapeo) → Controller (dispatch Redux) → Hook (lee Redux) → UI (renderiza)
```

---

## Estructura de Módulos

### Estructura Ideal de un Módulo

```
src/modules/[Area]/[Modulo]/
├── index.tsx                    # Módulo principal (ABSTRACTO - solo renderiza submódulos)
├── components/                  # Submódulos y componentes de UI
│   ├── Header.tsx              # Submódulo principal (header del módulo)
│   ├── ContentTable.tsx        # Submódulo principal (tabla de contenido)
│   ├── UserAvatar.tsx          # Componente pequeño reutilizable
│   └── ActionButtons.tsx       # Componente pequeño reutilizable
├── hooks/
│   └── useUsers.ts             # Hook con lógica sync + llamadas a Controller
├── controllers/
│   └── UserController.ts       # Lógica async + dispatch Redux
├── services/
│   └── userServices.ts         # Solo HTTP calls (Axios)
├── adapters/
│   └── userAdapter.ts          # Mapeo API → UI models
├── models/
│   ├── UserModel.ts            # Modelo UI (camelCase)
│   └── UserResponseModel.ts    # Modelo API (snake_case) [RECOMENDADO]
├── slices/
│   └── usersSlice.ts           # Redux slice
├── config/
│   └── tableColumns.tsx        # Configuración de columnas para AzTable
└── __tests__/                   # Tests del módulo
    ├── fixtures/               # Mock data y helpers de testing
    ├── unit/                   # Tests unitarios (adapters, slices)
    ├── integration/            # Tests de integración (controllers, hooks)
    └── api/                    # Tests de API (services con MSW)
```

### Responsabilidades de Cada Capa

#### 1. **index.tsx** (Módulo Principal)
- **Responsabilidad:** Punto de entrada abstracto
- **Debe:** Solo renderizar submódulos (Header, ContentTable, etc.)
- **NO debe:** Contener lógica de negocio, llamadas a hooks, handlers

```typescript
// ✅ CORRECTO
const Users: React.FC = () => {
  return (
    <div className="page-content">
      <Container fluid>
        <Header />
        <ContentTable />
      </Container>
    </div>
  );
};
```

```typescript
// ❌ INCORRECTO - Tiene lógica
const Users: React.FC = () => {
  const { users, loading } = useUsers(); // ❌ No debe tener hooks
  const handleCreate = () => { ... };     // ❌ No debe tener handlers

  return <div>...</div>;
};
```

#### 2. **Submódulos** (Header.tsx, ContentTable.tsx)
- **Ubicación:** En la carpeta `components/` del módulo
- **Responsabilidad:** Lógica específica de UI, handlers, llamadas a hooks
- **Debe:** Manejar interacciones del usuario, renderizar componentes
- **NO debe:** Llamar directamente a Controllers o Services

```typescript
// ✅ CORRECTO - Submódulo en components/
// src/modules/Security/Users/components/Header.tsx
const Header: React.FC = () => {
  const { loading, fetchUsersByCompany, getTotalUsers } = useUsers(); // ✅ Llama al hook

  const handleRefresh = async () => {
    await fetchUsersByCompany(1, { force: true }); // ✅ Usa función del hook
  };

  return <AzHeaderCard ... />;
};
```

#### 3. **components/** (Submódulos y Componentes)
- **Responsabilidad:**
  - Submódulos principales del módulo (Header, ContentTable, etc.)
  - Componentes reutilizables pequeños usados por submódulos
- **Ejemplo Submódulos:** `Header.tsx`, `ContentTable.tsx`
- **Ejemplo Componentes:** `UserAvatar.tsx` (usado dentro de tableColumns), `ActionButtons.tsx`
- **NO debe:** Contener lógica de negocio (usar hooks para eso)

**Nota:** A diferencia de la convención ideal, en la implementación actual tanto submódulos grandes como componentes pequeños están en `components/`.

#### 4. **Hooks** (useUsers.ts)
- **Responsabilidad:**
  - Leer estado de Redux (operaciones sync)
  - Exponer funciones que llaman a Controllers (operaciones async)
  - Proporcionar funciones auxiliares (búsqueda, cálculos)
- **Debe:**
  - Usar `useSelector` para leer Redux
  - Llamar a Controllers para operaciones async
  - Implementar caché inteligente si es necesario
- **NO debe:**
  - Hacer llamadas HTTP directas
  - Mapear datos (eso es del Adapter)

```typescript
// ✅ Estructura correcta de un Hook (implementación real del proyecto)
export const useUsers = () => {
  // Lectura de Redux (sync)
  const users = useSelector((state: RootState) => state.users.list);
  const loading = useSelector((state: RootState) => state.users.loading);
  const error = useSelector((state: RootState) => state.users.error);

  // Función async que llama al Controller (con caché inteligente)
  const fetchUsersByCompany = async (
    companyId: number,
    options?: { force?: boolean }
  ): Promise<ControllerResponse<UserModel[]>> => {
    // Implementa caché: si ya hay datos y no se fuerza, retorna del cache
    if (users.length > 0 && !options?.force) {
      console.log('📦 Usando datos en caché (usuarios ya cargados)');
      return { loading: false, data: users, success: true };
    }

    console.log('🌐 Llamando al Controller para obtener usuarios...');
    return await UserController.getUsersByCompany(companyId);
  };

  // Funciones auxiliares (sync)
  const getTotalUsers = (): number => users.length;
  const findUserById = (id: number) => users.find(u => u.id === id);
  const findUserByEmail = (email: string) => users.find(u => u.email === email);

  return {
    // Estado
    users,
    loading,
    error,

    // Funciones async
    fetchUsersByCompany,

    // Funciones sync
    getTotalUsers,
    findUserById,
    findUserByEmail
  };
};
```

**Nota:** La implementación actual expone `fetchUsersByCompany` que retorna `ControllerResponse<T>`. Opcionalmente puedes agregar una función wrapper `loadUsers` que maneje la respuesta internamente para UIs más simples.

#### 5. **Controllers** (UserController.ts)
- **Responsabilidad:**
  - Lógica de negocio async
  - Llamar a Services (HTTP)
  - Llamar a Adapters (mapeo)
  - Dispatch a Redux slices
  - Manejo de errores
- **Debe:**
  - Retornar siempre `ControllerResponse<T>`
  - Usar `store.dispatch` para actualizar Redux
- **NO debe:**
  - Tener lógica de UI
  - Retornar datos sin tipo `ControllerResponse<T>`

```typescript
// ✅ Estructura correcta de un Controller
export class UserController {
  static async getUsersByCompany(companyId: number): Promise<ControllerResponse<UserModel[]>> {
    try {
      store.dispatch(setLoading(true));

      // 1. Llamar al Service (HTTP)
      const { call } = getUsersByCompanyCall(companyId);
      const response = await call;

      // 2. Llamar al Adapter (mapeo)
      const mappedUsers = adaptUsersArrayToUserModels(response.data.data ?? []);

      // 3. Dispatch a Redux
      store.dispatch(setUsers(mappedUsers));

      // 4. Retornar respuesta exitosa
      return createSuccessResponse(mappedUsers);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Error desconocido';
      store.dispatch(setError(errorMessage));
      return createErrorResponse(errorMessage);
    }
  }
}
```

#### 6. **Services** (userServices.ts)
- **Responsabilidad:** SOLO llamadas HTTP con Axios
- **Debe:**
  - Usar `createAuthenticatedCall()` para requests con token
  - Retornar `AxiosCallModel<T>`
- **NO debe:**
  - Mapear datos
  - Hacer dispatch a Redux
  - Contener lógica de negocio

```typescript
// ✅ CORRECTO - Solo HTTP
export const getUsersByCompanyCall = (companyId: number): AxiosCallModel<ApiResponse<UserResponseModel[]>> => {
  return createAuthenticatedCall<ApiResponse<UserResponseModel[]>>(
    'GET',
    `/rrhh/by_company_id/${companyId}`
  );
};
```

```typescript
// ❌ INCORRECTO - No debe mapear
export const getUsersByCompanyCall = (companyId: number) => {
  const response = await axios.get(...);
  return response.data.map(user => ({ ...user })); // ❌ Esto es del Adapter
};
```

#### 7. **Adapters** (userAdapter.ts)
- **Responsabilidad:**
  - Transformar datos de API (snake_case) a UI models (camelCase)
  - Mapeo de estructuras complejas
- **Debe:**
  - Recibir modelos de API (`UserResponseModel`)
  - Retornar modelos de UI (`UserModel`)
- **NO debe:**
  - Hacer llamadas HTTP
  - Modificar Redux

```typescript
// ✅ CORRECTO - Mapeo puro
export const adaptUserResponseToUserModel = (apiUser: UserResponseModel): UserModel => {
  return {
    id: apiUser.id,
    fullName: `${apiUser.name} ${apiUser.lastName}`.trim(),
    name: apiUser.name,
    lastName: apiUser.lastName,
    email: apiUser.email,
    phone: apiUser.phone,
    avatar: apiUser.avatar,
    workStation: {
      id: apiUser.workStation.id,
      name: apiUser.workStation.name,
      level: apiUser.workStation.level,
      dependencyId: apiUser.workStation.dependency_id  // snake_case → camelCase
    }
  };
};
```

#### 8. **Models**
- **UserModel.ts:** Modelo de UI (camelCase, campos calculados)
- **UserResponseModel.ts:** Modelo de API (snake_case, tal como viene de la API)

```typescript
// UserResponseModel.ts - Modelo API (snake_case)
export interface UserResponseModel {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  workStation: {
    id: number;
    name: string | null;
    level: number;
    dependency_id: number;  // snake_case
  };
}

// UserModel.ts - Modelo UI (camelCase)
export interface UserModel {
  id: number;
  fullName: string;  // Campo calculado
  name: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  workStation: WorkStationModel;  // Tipo anidado
}
```

#### 9. **Slices** (Redux)
- **Responsabilidad:** Estado global de Redux
- **Estructura estándar:**

```typescript
interface UsersState {
  list: UserModel[];
  loading: boolean;
  error: string | null;
}

const usersSlice = createSlice({
  name: 'users',
  initialState: { list: [], loading: false, error: null },
  reducers: {
    setUsers: (state, action) => { state.list = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; }
  }
});
```

---

## Flujo de Datos

### Diagrama de Flujo Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                         FLUJO ASYNC                              │
└─────────────────────────────────────────────────────────────────┘

1. UI (Header.tsx)
   │
   │ handleRefresh()
   │
   ▼
2. Hook (useUsers)
   │
   │ loadUsers(1, { force: true })
   │
   ▼
3. Controller (UserController)
   │
   │ getUsersByCompany(1)
   │
   ├──► Service (userServices)
   │    │
   │    │ getUsersByCompanyCall(1)
   │    │
   │    └──► API (GET /rrhh/by_company_id/1)
   │         │
   │         └──► UserResponseModel[] (snake_case)
   │
   ├──► Adapter (userAdapter)
   │    │
   │    │ adaptUsersArrayToUserModels(response.data)
   │    │
   │    └──► UserModel[] (camelCase)
   │
   └──► Slice (usersSlice)
        │
        │ dispatch(setUsers(mappedUsers))
        │
        └──► Redux Store Updated

┌─────────────────────────────────────────────────────────────────┐
│                      FLUJO SYNC (LECTURA)                        │
└─────────────────────────────────────────────────────────────────┘

1. UI (Header.tsx)
   │
   │ const { users, loading } = useUsers()
   │
   ▼
2. Hook (useUsers)
   │
   │ useSelector((state) => state.users.list)
   │
   ▼
3. Redux Store
   │
   └──► users, loading, error
        │
        ▼
4. UI renderiza
```

### Tipos de Respuesta del Controller

```typescript
// src/shared/controllers/ControllerResponse.ts
export interface ControllerResponse<T> {
  loading: boolean;
  data?: T;
  error?: string;
  success: boolean;
}

// Helpers
export const createSuccessResponse = <T>(data: T): ControllerResponse<T> => ({
  loading: false,
  data,
  success: true
});

export const createErrorResponse = <T>(error: string): ControllerResponse<T> => ({
  loading: false,
  error,
  success: false
});
```

---

## Componentes AZ (Aziende)

Los componentes **AZ (Aziende)** son componentes reutilizables de alto nivel diseñados para este proyecto. Se ubican en `src/components/aziende/`.

### 1. AzHeaderCard

**Ubicación:** `src/components/aziende/AzHeader`

**Propósito:** Header de página con título, descripción, badge y acciones personalizadas.

#### Props Principales

```typescript
interface AzHeaderCardProps {
  title: string;                    // Título principal
  description?: string;             // Descripción debajo del título
  showBadge?: boolean;              // Mostrar badge con contador
  badgeColor?: string;              // Color del badge (primary, success, danger, etc.)
  badgeCount?: number;              // Número a mostrar en el badge
  badgeTotal?: number;              // Total (opcional)
  contentTopRight?: React.ReactNode; // Contenido personalizado (botones, etc.)
}
```

#### Ejemplo de Uso

```typescript
<AzHeaderCard
  title="Gestión de Usuarios"
  description="Administra los usuarios del sistema"
  showBadge={true}
  badgeColor="primary"
  badgeCount={getTotalUsers()}
  badgeTotal={getTotalUsers()}
  contentTopRight={
    <div className="d-flex gap-2">
      <Button color="light" onClick={handleRefresh}>
        <i className="mdi mdi-refresh me-1"></i>
        Actualizar
      </Button>
      <Button color="warning" onClick={handleCreate}>
        <i className="mdi mdi-plus me-1"></i>
        Nuevo Usuario
      </Button>
    </div>
  }
/>
```

---

### 2. AzTable

**Ubicación:** `src/components/aziende/AzTable`

**Propósito:** Tabla avanzada con filtros, ordenamiento, paginación y acciones personalizables.

#### Props Principales

```typescript
interface AzTableProps {
  data: any[];                      // Datos a mostrar
  columns: ColumnConfig[];          // Configuración de columnas
  loading?: boolean;                // Estado de carga (muestra Loading component)
  pagination?: boolean;             // Habilitar paginación (default: true)
  filters?: Record<string, string>; // Filtros activos (controlado externamente)
  onFilterChange?: (column: string, value: string) => void;
  sorting?: { field: string; direction: string };
  onSortChange?: (config: { field: string; direction: string }) => void;
  selectedItems?: any[];            // Items seleccionados (para checkboxes)
  onSelectedChange?: (items: any[]) => void;
  className?: string;
  children?: React.ReactNode;       // Para AzTable.Actions
}
```

#### Configuración de Columnas

Las columnas se definen en un archivo de configuración (ej: `config/tableColumns.tsx`).

**Estructura de una columna:**

```typescript
interface ColumnConfig {
  key: string;                      // Identificador único (debe coincidir con propiedad del objeto)
  header: string;                   // Título visible de la columna
  sortable?: boolean;               // Habilitar ordenamiento (default: false)
  filterable?: boolean;             // Habilitar filtro (default: false)
  filterType?: 'text' | 'select';   // Tipo de filtro (default: 'text')
  filterOptions?: string[];         // Opciones para filtro tipo 'select'
  cell?: (props: { row: any }) => React.ReactNode; // Renderizado custom
}
```

#### Ejemplo de Configuración de Columnas

```typescript
// config/tableColumns.tsx
import { UserModel } from '../models/UserModel';

export const userTableColumns = [
  {
    key: 'fullName',
    header: 'Usuario',
    sortable: true,
    filterable: true,
    filterType: 'text',
    cell: ({ row }: { row: { original: UserModel } }) => {
      const user = row.original;
      return (
        <div className="d-flex align-items-center">
          {user.avatar ? (
            <img src={user.avatar} alt={user.fullName} className="avatar-xs rounded-circle me-2" />
          ) : (
            <div className="avatar-xs bg-primary rounded-circle d-flex align-items-center justify-content-center me-2">
              <span className="text-white font-size-10 fw-bold">
                {getInitials(user.fullName)}
              </span>
            </div>
          )}
          <span>{user.fullName}</span>
        </div>
      );
    }
  },
  {
    key: 'email',
    header: 'Email',
    sortable: true,
    filterable: true,
    filterType: 'text'
  },
  {
    key: 'phone',
    header: 'Teléfono',
    sortable: false,
    filterable: false
  },
  {
    key: 'workStation.name',  // Acceso a propiedades anidadas
    header: 'Estación de Trabajo',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: ['Gerencia', 'Ventas', 'Soporte', 'TI']
  }
];
```

#### Tipos de Filtros

**1. Filtro de Texto (`filterType: 'text'`)**
- Búsqueda case-insensitive
- Filtra mientras el usuario escribe

```typescript
{
  key: 'email',
  header: 'Email',
  filterable: true,
  filterType: 'text'  // Input de texto
}
```

**2. Filtro Select (`filterType: 'select'`)**
- Dropdown con opciones predefinidas
- Filtro exacto (no parcial)

```typescript
{
  key: 'status',
  header: 'Estado',
  filterable: true,
  filterType: 'select',
  filterOptions: ['Activo', 'Inactivo', 'Pendiente']
}
```

#### Uso del Componente AzTable.Actions

AzTable tiene un componente compuesto `AzTable.Actions` para definir acciones por fila.

```typescript
<AzTable
  data={filteredData}
  columns={userTableColumns}
  loading={loading}
  pagination={true}
>
  <AzTable.Actions>
    <Button
      size="sm"
      color="info"
      outline
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as UserModel;
        handleView(rowData.id);
      }}
      title="Ver detalles"
    >
      <i className="mdi mdi-eye"></i>
    </Button>

    <Button
      size="sm"
      color="primary"
      outline
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as UserModel;
        handleEdit(rowData.id);
      }}
      title="Editar"
    >
      <i className="mdi mdi-pencil"></i>
    </Button>

    <Button
      size="sm"
      color="danger"
      outline
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as UserModel;
        handleDelete(rowData.id);
      }}
      title="Eliminar"
    >
      <i className="mdi mdi-trash-can"></i>
    </Button>
  </AzTable.Actions>
</AzTable>
```

**Importante:** Los botones dentro de `AzTable.Actions` reciben automáticamente el atributo `data-row` con el objeto completo serializado en JSON.

#### Estado de Carga (Loading)

Cuando `loading={true}`, AzTable muestra automáticamente el componente `Loading` en lugar de la tabla:

```typescript
<AzTable
  data={users}
  columns={userTableColumns}
  loading={loading}  // ← Muestra Loading component si es true
  pagination={true}
/>
```

---

### 3. AzFilterSummary

**Ubicación:** `src/components/aziende/AzFilterSummary`

**Propósito:** Componente wrapper que gestiona filtros y ordenamiento, y proporciona datos filtrados a sus hijos mediante render props.

#### Props Principales

```typescript
interface AzFilterSummaryProps {
  data: any[];                      // Datos originales
  columns: ColumnConfig[];          // Configuración de columnas
  alwaysVisible?: boolean;          // Mostrar siempre el resumen (default: false)
  showCount?: 'always' | 'filtered' | 'never'; // Cuándo mostrar contador
  countPosition?: 'top' | 'bottom'; // Posición del contador
  children: (props: FilterSummaryRenderProps) => React.ReactNode;
}

interface FilterSummaryRenderProps {
  filteredData: any[];              // Datos después de aplicar filtros
  originalData: any[];              // Datos originales
  filters: Record<string, string>;  // Filtros activos
  sorting: { field: string; direction: string }; // Ordenamiento activo
  onFilterChange: (column: string, value: string) => void;
  onSortChange: (config: { field: string; direction: string }) => void;
  onClearAll: () => void;           // Limpiar todos los filtros
  hasActiveFilters: boolean;
  hasActiveSorting: boolean;
  hasActiveItems: boolean;
  columns: ColumnConfig[];
}
```

#### Ejemplo de Uso con AzTable

```typescript
<AzFilterSummary
  data={users}
  columns={userTableColumns}
  alwaysVisible={true}
  showCount="always"
  countPosition="top"
>
  {({ filteredData, onFilterChange, onSortChange, filters, sorting }) => (
    <AzTable
      data={filteredData}         // ← Usa filteredData, no users
      columns={userTableColumns}
      pagination={true}
      filters={filters}           // ← Pasa filtros controlados
      onFilterChange={onFilterChange}
      sorting={sorting}           // ← Pasa sorting controlado
      onSortChange={onSortChange}
      loading={loading}
    >
      <AzTable.Actions>
        {/* ... acciones ... */}
      </AzTable.Actions>
    </AzTable>
  )}
</AzFilterSummary>
```

**Beneficios de AzFilterSummary:**
- Gestión centralizada de filtros y ordenamiento
- Resumen visual de filtros activos
- Botón para limpiar todos los filtros
- Contador de resultados filtrados vs totales

---

## Componentes Shared

Componentes reutilizables ubicados en `src/shared/components/`.

### Loading Component

**Ubicación:** `src/shared/components/Loading.tsx`

**Propósito:** Indicador de carga con spinner y mensaje.

#### Props

```typescript
interface LoadingProps {
  size?: number | string;  // Altura del contenedor (default: 400px)
  message?: string;        // Mensaje a mostrar (default: "Cargando...")
  color?: string;          // Color del spinner (default: "primary")
}
```

#### Ejemplo de Uso

```typescript
<Loading size={400} message="Cargando usuarios..." color="primary" />
```

**Uso en AzTable:**
AzTable usa automáticamente el componente Loading cuando `loading={true}`.

---

## Patrones y Convenciones

### 1. Nomenclatura

#### Archivos y Carpetas
- **Componentes:** PascalCase (`Header.tsx`, `ContentTable.tsx`)
- **Hooks:** camelCase con prefijo `use` (`useUsers.ts`)
- **Controllers:** PascalCase con sufijo `Controller` (`UserController.ts`)
- **Services:** camelCase con sufijo `Services` (`userServices.ts`)
- **Adapters:** camelCase con sufijo `Adapter` (`userAdapter.ts`)
- **Models:** PascalCase con sufijo `Model` (`UserModel.ts`, `UserResponseModel.ts`)
- **Slices:** camelCase con sufijo `Slice` (`usersSlice.ts`)

#### Modelos
- **UI Models:** camelCase, nombres descriptivos (`UserModel`, `WorkStationModel`)
- **API Response Models:** snake_case conservado, sufijo `ResponseModel` (`UserResponseModel`)

#### Funciones
- **Controllers:** Métodos estáticos, PascalCase (`getUsersByCompany`)
- **Services:** camelCase con sufijo `Call` (`getUsersByCompanyCall`)
- **Adapters:** camelCase con prefijo `adapt` (`adaptUserResponseToUserModel`)
- **Hooks:** camelCase (`loadUsers`, `fetchUsersByCompany`)

### 2. Convenciones de Código

#### Imports
Usar alias `@/` para imports absolutos:

```typescript
// ✅ CORRECTO
import { UserController } from '@/modules/Security/Users/controllers/UserController';
import { createSuccessResponse } from '@/shared/controllers/ControllerResponse';

// ❌ INCORRECTO
import { UserController } from '../../../controllers/UserController';
```

#### Manejo de Errores en Controllers

```typescript
try {
  store.dispatch(setLoading(true));

  const { call } = getUsersByCompanyCall(companyId);
  const response = await call;
  const mappedUsers = adaptUsersArrayToUserModels(response.data.data ?? []);

  store.dispatch(setUsers(mappedUsers));
  return createSuccessResponse(mappedUsers);

} catch (error: any) {
  const errorMessage = error?.response?.data?.message || error?.message || 'Error desconocido';
  store.dispatch(setError(errorMessage));

  // Log de errores específicos
  if (error?.response?.status === 401) {
    console.warn('⚠️ Token inválido o expirado');
  }

  return createErrorResponse(errorMessage);
}
```

#### Serialización en Redux

⚠️ **IMPORTANTE:** Redux no puede serializar objetos complejos como `Date`.

```typescript
// ❌ INCORRECTO
interface UserModel {
  createdAt: Date;  // ❌ Causará warnings en Redux
}

// ✅ CORRECTO
interface UserModel {
  createdAt: string;  // ✅ Usar ISO string
}

// En el adapter
export const adaptUser = (apiUser: UserResponseModel): UserModel => ({
  ...apiUser,
  createdAt: apiUser.created_at  // Mantener como string, NO convertir a Date
});
```

### 3. Patrón de Caché Inteligente en Hooks

Los hooks pueden implementar caché para evitar llamadas innecesarias a la API:

```typescript
const fetchUsersByCompany = async (
  companyId: number,
  options?: { force?: boolean }
): Promise<ControllerResponse<UserModel[]>> => {
  // Si ya hay datos en Redux y no se fuerza recarga, usar caché
  if (users.length > 0 && !options?.force) {
    console.log('📦 Usando datos en caché (usuarios ya cargados)');
    return {
      loading: false,
      data: users,
      success: true
    };
  }

  // Si no hay datos o se fuerza, llamar al Controller
  console.log('🌐 Llamando al Controller para obtener usuarios...');
  return await UserController.getUsersByCompany(companyId);
};
```

**Uso:**
```typescript
// Primera llamada: hace petición a API
await loadUsers(1);

// Segunda llamada: usa caché (no hace petición)
await loadUsers(1);

// Forzar recarga: hace petición aunque haya caché
await loadUsers(1, { force: true });
```

### 4. Patrón de Wrapper en Hooks

Los hooks deben exponer dos tipos de funciones:

1. **Función directa:** Retorna `ControllerResponse<T>` (para casos avanzados)
2. **Función wrapper:** Maneja la respuesta internamente (para UI simple)

```typescript
// 1. Función directa (retorna ControllerResponse)
const fetchUsersByCompany = async (companyId: number): Promise<ControllerResponse<UserModel[]>> => {
  return await UserController.getUsersByCompany(companyId);
};

// 2. Función wrapper (maneja respuesta internamente)
const loadUsers = async (companyId: number): Promise<void> => {
  const response = await fetchUsersByCompany(companyId);

  if (response.success) {
    console.log('✅ Usuarios cargados:', response.data);
  } else {
    console.error('❌ Error al cargar usuarios:', response.error);
  }
};

return {
  fetchUsersByCompany,  // Para casos que necesiten acceso a ControllerResponse
  loadUsers             // Para UI simple (no necesita .then())
};
```

**Uso en UI:**

```typescript
// ✅ UI simple - usa wrapper
useEffect(() => {
  loadUsers(1);  // No necesita .then()
}, []);

// ✅ UI avanzada - usa función directa
useEffect(() => {
  fetchUsersByCompany(1).then(response => {
    if (response.success) {
      // Lógica personalizada
    }
  });
}, []);
```

### 5. HTTP Service con Autenticación

Todas las llamadas HTTP autenticadas deben usar `createAuthenticatedCall`:

```typescript
import { createAuthenticatedCall } from '@/services/httpService';

export const getUsersByCompanyCall = (companyId: number) => {
  return createAuthenticatedCall<ApiResponse<UserResponseModel[]>>(
    'GET',                              // Método HTTP
    `/rrhh/by_company_id/${companyId}`, // URL
    undefined,                          // Body (opcional)
    { headers: { ... } }                // Config adicional (opcional)
  );
};
```

**Beneficios:**
- Agrega automáticamente el header `Authorization: Bearer <token>`
- Maneja aborting de requests
- Configuración centralizada

---

## Ejemplos de Uso

### Ejemplo Completo: Módulo Users

#### 1. index.tsx (Módulo Principal)

```typescript
// src/modules/Security/Users/index.tsx
import React from 'react';
import { Container } from 'reactstrap';
import Header from './components/Header';
import ContentTable from './components/ContentTable';

const Users: React.FC = () => {
  return (
    <div className="page-content">
      <Container fluid>
        <Header />
        <ContentTable />
      </Container>
    </div>
  );
};

export default Users;
```

#### 2. components/Header.tsx (Submódulo)

```typescript
// src/modules/Security/Users/components/Header.tsx
import React from 'react';
import { Button } from 'reactstrap';
import { AzHeaderCard } from '../../../../components/aziende/AzHeader';
import { useUsers } from '../hooks/useUsers';

const Header: React.FC = () => {
  const { loading, fetchUsersByCompany, getTotalUsers } = useUsers();

  const handleCreateUser = () => {
    console.log('Crear nuevo usuario');
  };

  const handleRefresh = async () => {
    await fetchUsersByCompany(1, { force: true });
    console.log('🔄 Datos actualizados desde la API');
  };

  return (
    <AzHeaderCard
      title="Gestión de Usuarios"
      description="Administra los usuarios del sistema"
      showBadge={true}
      badgeColor="primary"
      badgeCount={getTotalUsers()}
      badgeTotal={getTotalUsers()}
      contentTopRight={
        <div className="d-flex gap-2">
          <Button color="light" onClick={handleRefresh} disabled={loading}>
            <i className={`mdi mdi-refresh ${loading ? 'mdi-spin' : ''}`}></i>
            Actualizar
          </Button>
          <Button color="warning" onClick={handleCreateUser}>
            <i className="mdi mdi-plus"></i>
            Nuevo Usuario
          </Button>
        </div>
      }
    />
  );
};

export default Header;
```

#### 3. components/ContentTable.tsx (Submódulo)

```typescript
// src/modules/Security/Users/components/ContentTable.tsx
import React, { useEffect } from 'react';
import { Row, Col, Button, Alert } from 'reactstrap';
import AzFilterSummary from '../../../../components/aziende/AzFilterSummary';
import AzTable from '../../../../components/aziende/AzTable';
import { userTableColumns } from '../config/tableColumns';
import { useUsers } from '../hooks/useUsers';
import { UserModel } from '../models/UserModel';

const ContentTable: React.FC = () => {
  const { users, loading, error, fetchUsersByCompany } = useUsers();

  const handleView = (userId: number) => console.log('Ver detalles:', userId);
  const handleEdit = (userId: number) => console.log('Editar:', userId);
  const handleDelete = (userId: number) => console.log('Eliminar:', userId);

  useEffect(() => {
    fetchUsersByCompany(1);
  }, []);

  return (
    <>
      {/* Error Alert */}
      {error && (
        <Row className="mb-3">
          <Col>
            <Alert color="danger" className="d-flex align-items-center">
              <i className="mdi mdi-alert-circle-outline me-2"></i>
              <div>
                <strong>Error:</strong> {error}
              </div>
            </Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col xl={12}>
          <AzFilterSummary
            data={users}
            columns={userTableColumns}
            alwaysVisible={true}
            showCount="always"
            countPosition="top"
          >
            {({ filteredData, onFilterChange, onSortChange, filters, sorting }) => (
              <AzTable
                data={filteredData}
                columns={userTableColumns}
                loading={loading}
                pagination={true}
                filters={filters}
                onFilterChange={onFilterChange}
                sorting={sorting}
                onSortChange={onSortChange}
                className="table-centered"
              >
                <AzTable.Actions>
                  <Button size="sm" color="info" outline
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      const row = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as UserModel;
                      handleView(row.id);
                    }}
                    title="Ver detalles">
                    <i className="mdi mdi-eye"></i>
                  </Button>
                  <Button size="sm" color="primary" outline
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      const row = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as UserModel;
                      handleEdit(row.id);
                    }}
                    title="Editar usuario">
                    <i className="mdi mdi-pencil"></i>
                  </Button>
                  <Button size="sm" color="danger" outline
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      const row = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as UserModel;
                      handleDelete(row.id);
                    }}
                    title="Eliminar usuario">
                    <i className="mdi mdi-trash-can"></i>
                  </Button>
                </AzTable.Actions>
              </AzTable>
            )}
          </AzFilterSummary>
        </Col>
      </Row>
    </>
  );
};

export default ContentTable;
```

#### 4. config/tableColumns.tsx

```typescript
import React from 'react';
import { UserModel } from '../models/UserModel';

const getInitials = (fullName: string): string => {
  const names = fullName.trim().split(' ');
  if (names.length >= 2) {
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  }
  return fullName.charAt(0).toUpperCase();
};

export const userTableColumns = [
  {
    key: 'fullName',
    header: 'Usuario',
    sortable: true,
    filterable: true,
    filterType: 'text',
    cell: ({ row }: { row: { original: UserModel } }) => {
      const user = row.original;
      return (
        <div className="d-flex align-items-center">
          {user.avatar ? (
            <img src={user.avatar} alt={user.fullName} className="avatar-xs rounded-circle me-2" />
          ) : (
            <div className="avatar-xs bg-primary rounded-circle d-flex align-items-center justify-content-center me-2">
              <span className="text-white font-size-10 fw-bold">
                {getInitials(user.fullName)}
              </span>
            </div>
          )}
          <span>{user.fullName}</span>
        </div>
      );
    }
  },
  {
    key: 'email',
    header: 'Email',
    sortable: true,
    filterable: true,
    filterType: 'text'
  },
  {
    key: 'phone',
    header: 'Teléfono',
    sortable: false,
    filterable: false
  }
];
```

---

## Scripts de Generación (Conocimiento)

Existe un script `npm run create_page:module --name=NombreModulo` para generar estructura de módulos.

**⚠️ IMPORTANTE:**
- **NO se debe usar este script para crear módulos** ya que podría salir de la arquitectura establecida
- Solo se menciona para conocimiento de que existe
- La creación de módulos debe hacerse manualmente siguiendo la estructura documentada en este guía

---

## Reglas Importantes

### ✅ Hacer (DO)

1. **Estructura de módulos:**
   - index.tsx abstracto (solo renderiza submódulos)
   - Submódulos en raíz (Header.tsx, ContentTable.tsx)
   - Componentes pequeños en carpeta `components/`

2. **Flujo de datos:**
   - UI → Hook → Controller → [Service, Adapter, Slice]
   - Nunca saltarse capas

3. **Nomenclatura:**
   - Seguir las convenciones de nombres establecidas
   - Usar alias `@/` para imports

4. **Controllers:**
   - Siempre retornar `ControllerResponse<T>`
   - Manejar errores con try/catch
   - Dispatch a Redux antes de retornar

5. **Adapters:**
   - Transformar snake_case → camelCase
   - Mapeo puro de datos (sin side effects)

6. **Models:**
   - Usar string para fechas (no Date)
   - Separar API models de UI models

7. **Hooks:**
   - Implementar caché inteligente
   - Exponer funciones wrapper y directas
   - Solo lectura de Redux (useSelector)

### ❌ No Hacer (DON'T)

1. **NO poner lógica en index.tsx** (debe ser abstracto)
2. **NO llamar a Services desde Hooks** (usar Controllers)
3. **NO mapear datos en Services** (usar Adapters)
4. **NO hacer dispatch desde Hooks** (usar Controllers)
5. **NO usar Date en Redux** (usar string ISO)
6. **NO omitir ControllerResponse** en Controllers
7. **NO crear módulos con scripts** (hacerlo manualmente)
8. **NO usar tipos `any` en Adapters** (crear modelos tipados para API)

---

## Checklist para Crear un Nuevo Módulo

### Estructura Base
- [ ] Crear estructura de carpetas siguiendo el patrón establecido
- [ ] `index.tsx` abstracto (solo renderiza submódulos desde `components/`)
- [ ] Submódulos en `components/` (Header.tsx, ContentTable.tsx, etc.)
- [ ] Componentes pequeños reutilizables en `components/` (si son necesarios)

### Lógica de Negocio
- [ ] Hook con funciones sync (lectura Redux) y async (llamadas a Controller)
- [ ] Controller con lógica async, retorna `ControllerResponse<T>`
- [ ] Service con solo llamadas HTTP usando `createAuthenticatedCall`
- [ ] Adapter para mapeo snake_case → camelCase

### Modelos y Estado
- [ ] Models separados: `*Model.ts` (UI) y `*ResponseModel.ts` (API - RECOMENDADO)
- [ ] Slice de Redux con estructura estándar (`list`, `loading`, `error`)

### UI y Configuración
- [ ] Configuración de columnas en `config/tableColumns.tsx`
- [ ] Usar componentes AZ (AzHeaderCard, AzTable, AzFilterSummary)
- [ ] Manejar estados de loading con `loading` prop en AzTable
- [ ] Implementar manejo de errores con Alert components

### Testing
- [ ] Crear estructura `__tests__/` con subdirectorios
- [ ] Agregar fixtures en `__tests__/fixtures/`
- [ ] Tests unitarios en `__tests__/unit/` (adapters, slices)
- [ ] Tests de integración en `__tests__/integration/` (controllers, hooks)
- [ ] Tests de API en `__tests__/api/` (services con MSW)

### Optimizaciones
- [ ] Implementar caché inteligente en hooks si es necesario
- [ ] Evitar usar `any`, crear tipos específicos

---

**Última actualización:** 2025-01-09

**Versión del documento:** 1.0.0
