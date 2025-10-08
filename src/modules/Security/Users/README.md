# Módulo de Usuarios - Arquitectura

## 📁 Estructura de Carpetas

```
src/modules/Security/Users/
├── adapters/               # Mapeo entre API y UI
│   └── userAdapter.ts
├── controllers/            # Lógica de negocio + dispatch a Redux
│   └── UserController.ts
├── hooks/                  # Estado + funciones para UI
│   └── useUsers.ts
├── models/                 # Tipos de datos
│   ├── UserModel.ts       # Modelo para UI (mapeado)
│   ├── UserResponseModel.ts # Modelo del API (crudo)
│   └── ControllerResponse.ts # Respuesta estándar del Controller
├── services/              # Llamadas HTTP
│   └── userServices.ts
├── slices/                # Redux state
│   └── usersSice.ts
└── examples/              # Ejemplos de uso
    └── UsersPageExample.tsx
```

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
- Puede contener lógica de negocio local (filtros, búsquedas)

**Ejemplo:**
```typescript
export const useUsers = () => {
  // SYNC: Lee de Redux
  const users = useSelector(state => state.users.list);
  const loading = useSelector(state => state.users.loading);

  // ASYNC: Llama al Controller
  const fetchUsers = async (filters) => {
    return await UserController.getUsers(filters);
  };

  // SYNC: Lógica local
  const getActiveUsers = () => users.filter(u => u.isActive);

  return { users, loading, fetchUsers, getActiveUsers };
};
```

### 6️⃣ **UI Components**
**Archivo:** `index.tsx` o cualquier componente

**Responsabilidad:**
- Solo presentación
- Llama al hook `useUsers()`
- NUNCA llama directamente al Controller

**Ejemplo:**
```typescript
const UsersPage = () => {
  const { users, loading, fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, []);

  return <UserTable users={users} loading={loading} />;
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

## 📊 Ejemplo Completo

```typescript
// 1. UI Component
const UsersPage = () => {
  const { users, loading, fetchUsers } = useUsers();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const response = await fetchUsers({ status: 'active' });

    if (response.success) {
      console.log('✅ Datos cargados:', response.data);
    } else {
      alert(`Error: ${response.error}`);
    }
  };

  return <div>{users.map(u => <UserCard user={u} />)}</div>;
};

// 2. Hook
const useUsers = () => {
  const users = useSelector(state => state.users.list);
  const fetchUsers = async (filters) => {
    return await UserController.getUsers(filters);
  };
  return { users, fetchUsers };
};

// 3. Controller
class UserController {
  static async getUsers(filters) {
    store.dispatch(setLoading(true));
    const { call } = getUsersCall(filters);
    const response = await call;
    const mapped = adaptUsersArrayToUserModels(response.data.data);
    store.dispatch(setUsers(mapped));
    return createSuccessResponse(mapped);
  }
}

// 4. Service
const getUsersCall = (filters) => {
  return createAuthenticatedCall('GET', '/users');
};
```

## 🚀 Ventajas de esta Arquitectura

1. **Separación Clara** - Cada capa tiene una responsabilidad única
2. **Testeable** - Cada parte se puede testear independientemente
3. **Escalable** - Fácil agregar nuevas features
4. **Type-Safe** - TypeScript en todas las capas
5. **Predecible** - Siempre sabes dónde está la lógica
6. **Reutilizable** - Los hooks pueden combinar múltiples controllers
