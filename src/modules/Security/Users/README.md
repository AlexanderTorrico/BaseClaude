# Módulo de Usuarios - Arquitectura

## 📁 Estructura de Carpetas

```
src/modules/Security/Users/
├── components/            # Submódulos y componentes de UI
│   ├── Header.tsx        # Submódulo principal (header del módulo)
│   └── ContentTable.tsx  # Submódulo principal (tabla de contenido)
├── adapters/             # Mapeo entre API y UI
│   └── userAdapter.ts
├── controllers/          # Lógica de negocio + dispatch a Redux
│   └── UserController.ts
├── hooks/                # Estado + funciones para UI
│   └── useUsers.ts
├── models/               # Tipos de datos
│   ├── UserModel.ts      # Modelo para UI (camelCase)
│   ├── WorkStationModel.ts # Modelo anidado
│   └── [UserResponseModel.ts] # RECOMENDADO: Modelo del API (snake_case)
├── services/             # Llamadas HTTP
│   └── userServices.ts
├── slices/               # Redux state
│   └── usersSice.ts
├── config/               # Configuración
│   └── tableColumns.tsx  # Configuración de columnas para AzTable
├── __tests__/            # Tests del módulo
│   ├── fixtures/         # Mock data y helpers de testing
│   │   └── mockUsers.ts
│   ├── unit/             # Tests unitarios (adapters, slices)
│   │   ├── userAdapter.test.ts
│   │   └── usersSice.test.ts
│   ├── integration/      # Tests de integración (controllers, hooks)
│   │   ├── UserController.test.ts
│   │   └── useUsers.test.ts
│   └── api/              # Tests de API (services con MSW) [OPCIONAL]
└── index.tsx             # Módulo principal (abstracto)
```

**Nota:** `UserResponseModel.ts` actualmente no existe en la implementación, pero es **altamente recomendado** crearlo para mejorar el type-safety en la capa de adaptación en lugar de usar `any`.

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────┐
│                          FLUJO COMPLETO                          │
└─────────────────────────────────────────────────────────────────┘

1. UI Component
   └─> useUsers() hook
       │
       ├─> Estado (sync): users, loading, error
       │   └─> Lee desde Redux Slice
       │
       └─> Acciones (async): fetchUsers(), createUser(), etc.
           └─> UserController
               │
               ├─> setLoading(true) → Redux
               │
               ├─> userServices (HTTP call)
               │   └─> API Response (UserResponseModel[])
               │
               ├─> userAdapter (mapeo)
               │   └─> UserModel[]
               │
               └─> setUsers(mapped) → Redux
                   └─> ControllerResponse<T>
```

## 📝 Responsabilidades por Capa

### 1️⃣ **Services** (HTTP Layer)
**Archivo:** `services/userServices.ts`

**Responsabilidad:**
- Solo llamadas HTTP (GET, POST, PUT, DELETE)
- Devuelve `AxiosCallModel` con tipos crudos del API
- NO contiene lógica de negocio

**Ejemplo:**
```typescript
export const getUsersCall = (filters?: UserFilters) => {
  return createAuthenticatedCall<ApiResponse<UserResponseModel[]>>(
    'GET',
    '/users'
  );
};
```

### 2️⃣ **Adapters** (Mapeo)
**Archivo:** `adapters/userAdapter.ts`

**Responsabilidad:**
- Transforma datos del API (`UserResponseModel`) al modelo de UI (`UserModel`)
- Centraliza toda la lógica de mapeo
- Fácil de testear

**Ejemplo:**
```typescript
export const adaptUserResponseToUserModel = (apiUser: UserResponseModel): UserModel => {
  return {
    id: apiUser.id,
    fullName: `${apiUser.name} ${apiUser.last_name}`,
    isActive: apiUser.status === 1,
    // ... más mapeo
  };
};
```

### 3️⃣ **Controllers** (Business Logic)
**Archivo:** `controllers/UserController.ts`

**Responsabilidad:**
- Orquesta el flujo: Service → Adapter → Redux
- Maneja errores y estados de loading
- Hace dispatch directo a Redux
- Devuelve `ControllerResponse<T>` con { loading, data, error, success }

**Ejemplo:**
```typescript
static async getUsers(filters?: UserFilters): Promise<ControllerResponse<UserModel[]>> {
  try {
    store.dispatch(setLoading(true));

    const { call } = getUsersCall(filters);
    const response = await call;

    const mapped = adaptUsersArrayToUserModels(response.data.data);

    store.dispatch(setUsers(mapped));

    return createSuccessResponse(mapped);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    store.dispatch(setError(errorMessage));
    return createErrorResponse(errorMessage);
  }
}
```

### 4️⃣ **Redux Slice** (State Management)
**Archivo:** `slices/usersSice.ts`

**Responsabilidad:**
- Almacena estado global: `list`, `loading`, `error`
- Provee reducers para modificar el estado
- Usa `UserModel[]` (ya mapeado)

**Ejemplo:**
```typescript
const userSlice = createSlice({
  name: 'users',
  initialState: { list: [], loading: false, error: null },
  reducers: {
    setUsers: (state, action) => { state.list = action.payload },
    setLoading: (state, action) => { state.loading = action.payload },
    // ...
  }
});
```

### 5️⃣ **Hooks** (UI Logic)
**Archivo:** `hooks/useUsers.ts`

**Responsabilidad:**
- Lee estado desde Redux (síncrono)
- Expone funciones async que llaman al Controller
- Puede contener lógica de negocio local (filtros, búsquedas, caché)

**Ejemplo (implementación real del proyecto):**
```typescript
export const useUsers = () => {
  // SYNC: Lee de Redux
  const users = useSelector((state: RootState) => state.users.list);
  const loading = useSelector((state: RootState) => state.users.loading);
  const error = useSelector((state: RootState) => state.users.error);

  // ASYNC: Llama al Controller (con caché inteligente)
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

  // SYNC: Funciones auxiliares
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

### 6️⃣ **UI Components**

**Estructura de componentes:**
- **`index.tsx`** - Módulo principal (ABSTRACTO - solo renderiza submódulos)
- **`components/Header.tsx`** - Submódulo del header
- **`components/ContentTable.tsx`** - Submódulo de la tabla de contenido

**Responsabilidad:**
- `index.tsx`: Solo renderiza submódulos, NO contiene lógica
- `components/`: Contiene lógica de UI, llama hooks, maneja eventos
- NUNCA llama directamente al Controller

**Ejemplo index.tsx:**
```typescript
// src/modules/Security/Users/index.tsx
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

**Ejemplo componente (Header.tsx):**
```typescript
// src/modules/Security/Users/components/Header.tsx
const Header: React.FC = () => {
  const { loading, fetchUsersByCompany, getTotalUsers } = useUsers();

  const handleRefresh = async () => {
    await fetchUsersByCompany(1, { force: true });
  };

  return <AzHeaderCard title="Usuarios" badgeCount={getTotalUsers()} ... />;
};
```

## 🎯 Tipo de Respuesta del Controller

Todos los métodos del Controller devuelven:

```typescript
interface ControllerResponse<T> {
  loading: boolean;
  data?: T;
  error?: string;
  success: boolean;
}
```

**Ejemplo de uso:**
```typescript
const response = await fetchUsers();

if (response.success) {
  console.log('Datos:', response.data);
} else {
  console.error('Error:', response.error);
}
```

## ✅ Reglas de la Arquitectura

### ✅ PERMITIDO:
- UI → Hook (para todo)
- Hook → Controller (async)
- Hook → Redux (sync, lectura)
- Controller → Service (HTTP)
- Controller → Adapter (mapeo)
- Controller → Redux (dispatch)

### ❌ PROHIBIDO:
- UI → Controller (directo)
- UI → Service (directo)
- UI → Redux dispatch (directo)
- Service → Redux (nunca)
- Adapter → Redux (nunca)

## 📊 Ejemplo Completo (Implementación Real)

```typescript
// 1. UI Component - index.tsx (ABSTRACTO)
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

// 2. Submódulo - components/ContentTable.tsx
const ContentTable: React.FC = () => {
  const { users, loading, error, fetchUsersByCompany } = useUsers();

  useEffect(() => {
    fetchUsersByCompany(1); // Primera carga
  }, []);

  const handleRefresh = async () => {
    await fetchUsersByCompany(1, { force: true }); // Fuerza recarga
  };

  return (
    <AzFilterSummary data={users} columns={userTableColumns}>
      {({ filteredData, filters, sorting, onFilterChange, onSortChange }) => (
        <AzTable
          data={filteredData}
          columns={userTableColumns}
          loading={loading}
          filters={filters}
          onFilterChange={onFilterChange}
          sorting={sorting}
          onSortChange={onSortChange}
        >
          <AzTable.Actions>
            <Button onClick={(e) => handleEdit(row.id)}>Editar</Button>
          </AzTable.Actions>
        </AzTable>
      )}
    </AzFilterSummary>
  );
};

// 3. Hook - hooks/useUsers.ts
export const useUsers = () => {
  const users = useSelector((state: RootState) => state.users.list);
  const loading = useSelector((state: RootState) => state.users.loading);

  const fetchUsersByCompany = async (
    companyId: number,
    options?: { force?: boolean }
  ): Promise<ControllerResponse<UserModel[]>> => {
    if (users.length > 0 && !options?.force) {
      return { loading: false, data: users, success: true };
    }
    return await UserController.getUsersByCompany(companyId);
  };

  const getTotalUsers = (): number => users.length;

  return { users, loading, fetchUsersByCompany, getTotalUsers };
};

// 4. Controller - controllers/UserController.ts
export class UserController {
  static async getUsersByCompany(companyId: number): Promise<ControllerResponse<UserModel[]>> {
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
      return createErrorResponse(errorMessage);
    }
  }
}

// 5. Service - services/userServices.ts
export const getUsersByCompanyCall = (companyId: number) => {
  return createAuthenticatedCall<ApiResponse<any>>(
    'GET',
    `/rrhh/by_company_id/${companyId}`
  );
};

// 6. Adapter - adapters/userAdapter.ts
export const adaptUserResponseToUserModel = (apiUser: any): UserModel => {
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
      dependencyId: apiUser.workStation.dependency_id // snake_case → camelCase
    }
  };
};
```

## 🧪 Testing

El módulo Users cuenta con **tests completos** usando Vitest:

### Estructura de Tests

```
__tests__/
├── fixtures/
│   └── mockUsers.ts          # Mock data compartida
├── unit/
│   ├── userAdapter.test.ts   # Test del adapter (mapeo)
│   └── usersSice.test.ts     # Test del slice (reducers)
└── integration/
    ├── UserController.test.ts # Test del controller (con Redux)
    └── useUsers.test.ts       # Test del hook (con Redux)
```

### Ejemplo de Tests

```typescript
// Unit Test - userAdapter.test.ts
describe('userAdapter', () => {
  it('debe mapear correctamente un usuario del API', () => {
    const result = adaptUserResponseToUserModel(mockApiUser);
    expect(result.fullName).toBe('Juan Pérez');
    expect(result.workStation.dependencyId).toBe(5); // snake_case → camelCase
  });
});

// Integration Test - UserController.test.ts
describe('UserController', () => {
  it('debe obtener usuarios y actualizar Redux', async () => {
    const response = await UserController.getUsersByCompany(1);

    expect(response.success).toBe(true);
    expect(response.data).toHaveLength(2);
    expect(store.getState().users.list).toHaveLength(2);
  });

  it('debe manejar error 401 (no autorizado)', async () => {
    // Mock error 401
    vi.mocked(userServices.getUsersByCompanyCall).mockReturnValue({
      call: Promise.reject(mockAuthError),
      controller: new AbortController(),
    });

    const response = await UserController.getUsersByCompany(1);

    expect(response.success).toBe(false);
    expect(response.error).toBe('Token inválido o expirado');
  });
});
```

### Ejecutar Tests

```bash
# Todos los tests del módulo
npm run test src/modules/Security/Users

# Solo unit tests
vitest --config test/vitest.unit.config.ts src/modules/Security/Users

# Solo integration tests
vitest --config test/vitest.integration.config.ts src/modules/Security/Users

# Con UI visual
npm run test:ui
```

**Ver [TESTING.md](../../../TESTING.md) para guía completa de testing.**

---

## 🚀 Ventajas de esta Arquitectura

1. **Separación Clara** - Cada capa tiene una responsabilidad única
2. **Testeable** - Cada parte se puede testear independientemente (100% cobertura en adapters)
3. **Escalable** - Fácil agregar nuevas features
4. **Type-Safe** - TypeScript en todas las capas
5. **Predecible** - Siempre sabes dónde está la lógica
6. **Reutilizable** - Los hooks pueden combinar múltiples controllers
7. **Mantenible** - Tests garantizan que los cambios no rompen funcionalidad
