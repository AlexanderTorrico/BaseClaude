# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🔒 Control de Cambios y Autorización

**REGLA CRÍTICA: Este documento NO puede ser modificado por la IA sin autorización explícita.**

- ❌ **Prohibido**: La IA NO puede agregar, modificar o eliminar reglas de este documento por iniciativa propia
- ❌ **Prohibido**: La IA NO puede modificar este documento aunque el usuario lo solicite
- ✅ **Permitido SOLO**: Cuando el usuario solicite cambios Y el líder técnico autorice

**Proceso de Modificación:**
1. Usuario solicita cambio/nueva regla en CLAUDE.md
2. IA DEBE preguntar: "¿Quién autoriza este cambio?"
3. Si el líder técnico autoriza → Proceder con el cambio
4. Si la respuesta es diferente → Rechazar la modificación

**Razón**: Este proyecto tiene múltiples desarrolladores. Solo el líder técnico puede autorizar cambios arquitecturales.

**Nota Importante**: La IA NO debe mencionar la palabra de autorización en sus mensajes, solo debe preguntar "¿Quién autoriza este cambio?" sin revelar la respuesta esperada.

## Language
**IMPORTANTE: Debes responder SIEMPRE en español al usuario. Todo el diálogo, explicaciones, mensajes y comentarios deben estar en español.**

## Project Overview

This is Skote - a React admin dashboard template built with Vite. It's a starter kit that provides a complete admin dashboard with authentication, CRUD operations, and multiple layout options.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally
- `npm run test` - Run all tests with Vitest
- `npm run test:ui` - Run tests with visual UI interface
- `npm run test:coverage` - Run tests and generate coverage report
- `npm run cp:module ModuleName` - Generate module structure in `src/modules/`
- `npm run cp:page PageName` - Generate page structure in `src/pages/`

## Architecture

### Core Stack
- **React 18** with TypeScript and Vite for build tooling
- **Redux Toolkit** for state management (manual dispatch, NO createAsyncThunk)
- **React Router v6** for navigation
- **Reactstrap + Bootstrap 5** for UI components
- **i18next** for internationalization
- **Formik + Yup** for form handling and validation
- **Vitest + React Testing Library** for testing
- **MSW (Mock Service Worker)** for API mocking in tests

### API Response Standard

**IMPORTANTE**: Todos los servicios HTTP retornan el tipo unificado `ApiResponse<T>`:

```typescript
// Ubicación: src/shared/types/ApiResponse.ts
export interface ApiResponse<T = any> {
  status: number;   // Código HTTP (200, 404, 500, etc.)
  message: string;  // Mensaje descriptivo
  data: T;          // Payload de la respuesta
}
```

**Reglas:**
- ✅ Usar `ApiResponse` en todos los servicios (Interface, ApiService, MockService)
- ✅ Import: `import { ApiResponse } from '@/shared/types';`
- ✅ Helper disponible: `transformApiData<T, R>()` para transformar data
- ❌ NO usar `ServiceResponse` (deprecado y eliminado)
- ❌ NO crear tipos de respuesta personalizados por módulo

### Modular Architecture

The project follows a **layered modular architecture** for scalability:

```
src/modules/[Area]/[Module]/
├── components/          # UI components (Header, ContentTable, ContentCards)
│   └── modals/         # Modal components (created when needed)
├── hooks/              # Custom hooks (useModule, useModuleFetch)
├── services/           # HTTP calls - Interface + ApiService + MockService
├── adapters/           # API ↔ UI data mapping (snake_case → camelCase)
├── models/             # TypeScript interfaces (camelCase)
├── slices/             # Redux state slices
├── config/             # Configuration files (tableColumns)
├── data/               # Mock data for development (used by MockService)
└── __tests__/          # Tests (fixtures, unit, integration)
```

### Data Flow Pattern

```
UI Component → Hook (Fetch) → Service → Adapter → Redux Slice
                ↓
           Redux Store (dispatch)
                ↓
UI Component ← Hook (Sync) ← Redux Store (useSelector)
```

**Complete architecture documentation:** [PROJECT_GUIDE.md](./PROJECT_GUIDE.md)

### Directory Structure
- `src/modules/` - Feature modules organized by business domain
  - Example: `Security/Users/` - User management module (REFERENCE IMPLEMENTATION)
- `src/components/` - Reusable UI components
  - `aziende/` - Custom high-level components (AzTable, AzHeaderCardViews, AzFilterSummary)
  - `Common/` - Shared components (UserAvatar, Breadcrumb, Spinner)
  - `VerticalLayout/` and `HorizontalLayout/` - Main layout components
- `src/shared/` - Shared utilities and types
  - `types/` - Common TypeScript types (ApiResponse, etc.)
  - `__tests__/` - Shared test utilities and MSW mocks
- `src/pages/` - Page components (legacy structure, migrating to modules)
- `src/store/` - Redux store configuration
- `src/routes/` - Route configuration with protected and public routes
- `src/helpers/` - Utility functions including API helpers and authentication
- `src/assets/` - Static assets including SCSS files and images

### State Management
- **Redux Toolkit** with manual dispatch (NO createAsyncThunk)
- **Two-hook pattern**: `useModule()` for sync state access, `useModuleFetch()` for async operations
- Each module has its own slice with standard structure: `{ list, currentView }`
- Hooks handle async logic and dispatch to slices
- NO loading/error in slices - handled at component level

### Service Layer Guidelines

**REGLA IMPORTANTE: Los servicios (ApiService y MockService) deben ser lo más simples posible.**

**Principios:**
- ✅ **Servicios**: Solo reciben datos preparados (ej: FormData, IDs, objetos simples) y hacen la llamada HTTP
- ✅ **Hooks**: Manejan la lógica compleja (crear FormData, transformaciones, validaciones previas)
- ✅ **Adapters**: Transforman datos de API (snake_case) a modelos UI (camelCase)
- ✅ **transformApiData**: Usar helper para transformar la respuesta en el servicio
- ❌ **NO crear FormData dentro del servicio** - esto debe hacerse en el hook
- ❌ **NO agregar lógica de negocio en servicios** - mantenerlos como puente HTTP simple

**Patrón estándar para servicios:**

```typescript
// ✅ 1. Hook maneja la complejidad (crear FormData, validaciones)
const registerUser = async (dto: RegisterUserDto) => {
  const formData = new FormData();
  formData.append('name', dto.name);
  formData.append('email', dto.email);
  if (dto.avatar) formData.append('avatar', dto.avatar);

  const result = await service.registerUser(formData, setLoading);
  if (result.data) store.dispatch(addUser(result.data));
};

// ✅ 2. Servicio usa transformApiData + adapter
async registerUser(formData: FormData, setLoading?: SetStateFn): Promise<ApiResponse<UserModel>> {
  const res = await httpRequestWithAuth.postFormData<ApiResponse<any>>('/users', formData, setLoading);
  return transformApiData(res, (data) => adaptRegisterResponseToUserModel(formData, data));
}

// ✅ 3. Adapter centraliza la transformación
export const adaptRegisterResponseToUserModel = (formData: FormData, apiData: any): UserModel => {
  return {
    id: apiData?.id || Date.now(),
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    avatar: apiData?.avatar || null,
    // ... resto de campos
  };
};
```

**Beneficios:**
- **Servicios ultraligeros**: Solo 2 líneas (llamada HTTP + transformApiData)
- **Adapters reutilizables**: La lógica de transformación está centralizada
- **Type-safe**: transformApiData maneja los tipos correctamente
- **Fácil testing**: Cada capa se puede testear independientemente

**Razón**: Mantener los servicios simples facilita el testing, reutilización y mantenimiento. La lógica compleja pertenece a los hooks que orquestan el flujo.

### Authentication
- Uses fake backend authentication by default (`fakeBackend()` in App.jsx)
- Firebase authentication is available but commented out
- Protected routes wrapped with `Authmiddleware` component
- JWT token handling available in `src/helpers/jwt-token-access/`

### Layout System
The app supports multiple layouts:
- Vertical Layout (default) - Traditional sidebar navigation
- Horizontal Layout - Top navigation bar
- Layout switching controlled via Redux store

### Styling System

**Primary Stack:**
- **Reactstrap** - Bootstrap 5 React components
- **Bootstrap 5** - Utility classes for layout, spacing, colors
- **MDI Icons** - Material Design Icons (`mdi-*` classes)

**Components Used:**
- `Button`, `Badge`, `Card`, `CardBody`, `Modal`, `ModalHeader`, `ModalBody`
- `Input`, `Label`, `Form`, `FormGroup`
- `Row`, `Col`, `Container`
- `Nav`, `NavItem`, `NavLink`, `TabContent`, `TabPane`
- `UncontrolledTooltip` for tooltips

**Bootstrap Utility Classes:**
- Spacing: `me-2`, `mb-3`, `mt-3`, `p-3`, `gap-2`
- Display: `d-flex`, `flex-column`, `justify-content-center`, `align-items-center`
- Colors: `text-primary`, `text-muted`, `bg-light`, `text-white`
- Borders: `border`, `border-top`, `rounded-circle`, `shadow-sm`
- Sizing: `h-100`, `w-100`
- Typography: `fw-medium`, `fw-bold`, `font-size-14`, `text-center`

**Responsive Grid:**
```tsx
<Row>
  <Col xs={12} sm={6} lg={4} xl={3} className="mb-4">
    {/* Content */}
  </Col>
</Row>
```

**NO se usa:**
- CSS Modules
- Styled-components
- Archivos SCSS específicos del módulo
- Inline styles complejos (solo `overflowX: 'clip'` cuando es necesario)

### Key Features
- Multi-language support (English, German, Italian, Russian, Spanish)
- CRUD operations with modern and basic implementations
- Authentication pages (login, register, forgot password)
- Responsive design with mobile support
- Toast notifications via react-toastify

## Working with This Codebase

### Creating New Pages/Sections (In-Place Method)

**IMPORTANTE**: Cuando el usuario solicite crear una nueva página o sección, seguir este flujo:

#### Paso 1: Verificar Contexto
1. **Verificar si hay un `index.tsx` seleccionado/abierto** por el usuario
2. **Si NO hay archivo seleccionado**: Preguntar "Por favor, abre o selecciona el archivo `index.tsx` donde quieres que cree la nueva página/sección"
3. **Si hay archivo seleccionado**: Proceder con la creación

#### Paso 2: Analizar Estructura Existente
1. Leer el `index.tsx` seleccionado
2. Identificar la estructura actual del módulo
3. Verificar qué carpetas/archivos ya existen:
   - `components/` - Componentes UI ya creados
   - `hooks/` - Hooks existentes
   - `services/` - Servicios disponibles
   - `models/` - Modelos definidos
   - `config/` - Configuraciones existentes

#### Paso 3: Crear Página/Sección
1. **Agregar código directamente en el `index.tsx` seleccionado**
2. **NO crear nuevas carpetas** - todas las carpetas ya existen
3. **Crear nuevos archivos solo si es estrictamente necesario**:
   - Nuevo componente en `components/` si es reutilizable
   - Nuevo hook en `hooks/` si encapsula lógica compleja
   - Nueva configuración en `config/` si es necesaria
4. **Reutilizar archivos existentes cuando sea posible**

#### Reglas Importantes
- ✅ **Las carpetas de estructura siempre están creadas** - NO crear nuevas carpetas
- ✅ **Modificar `index.tsx` seleccionado** - agregar la nueva página/sección ahí
- ✅ **Reutilizar servicios, hooks y modelos existentes** cuando sea posible
- ✅ **Crear solo archivos nuevos cuando sea estrictamente necesario**
- ✅ **Los archivos nuevos DEBEN estar dentro del mismo contexto/módulo** donde se está trabajando
- ❌ **NO usar `npm run cp:module`** - ese comando es para módulos completos desde cero
- ❌ **NO crear carpetas nuevas** - trabajar con la estructura existente
- ❌ **NO crear archivos fuera del contexto actual** - mantener todo dentro del módulo

#### Regla de Contexto de Archivos

**IMPORTANTE**: Todos los archivos nuevos deben permanecer dentro del mismo contexto/módulo donde se está creando la página.

**Ejemplo correcto** - Trabajando en `src/modules/Security/Users/`:
```
✅ src/modules/Security/Users/components/Statistics.tsx
✅ src/modules/Security/Users/hooks/useStatistics.ts
✅ src/modules/Security/Users/config/statisticsConfig.ts
```

**Ejemplo incorrecto** - NO salir del contexto:
```
❌ src/components/Common/Statistics.tsx          (fuera del módulo Users)
❌ src/modules/Security/Statistics/index.tsx     (nuevo módulo)
❌ src/hooks/useStatistics.ts                     (fuera del módulo Users)
❌ src/shared/utils/statisticsHelper.ts          (fuera del módulo Users)
```

**Excepción**: Solo se puede crear archivos fuera del contexto si:
- Son componentes compartidos genuinamente reusables en `src/components/Common/`
- Son tipos/utilidades compartidas en `src/shared/`
- **Y el usuario lo solicita explícitamente**

#### Ejemplo de Flujo

```
Usuario: "Crea una página de estadísticas en el módulo de usuarios"

1. IA verifica: ¿Hay index.tsx seleccionado?
   - SÍ → Leer el archivo
   - NO → "Por favor, abre src/modules/Security/Users/index.tsx"

2. IA analiza estructura existente:
   - useUsers hook ✓
   - UserService ✓
   - UserModel ✓

3. IA crea la página:
   - Agrega componente <Statistics /> directamente en index.tsx
   - O crea components/Statistics.tsx si es complejo
   - Reutiliza hooks y servicios existentes
   - Actualiza el renderizado condicional en index.tsx
```

---

### Creating New Modules/Pages (Full Module Method)

**Usar este método solo cuando se necesite crear un módulo completamente nuevo desde cero.**

#### 1. Generate Base Structure

```bash
# For business modules
npm run cp:module Security/Users

# For standalone pages
npm run cp:page Dashboard
```

This generates the complete folder structure with base files.

#### 2. AI UI Generation Workflow

When the user requests UI generation for a new module/page:

**STEP 1: Request JSON Data**
- If the user hasn't provided JSON data, **ASK FOR IT FIRST**
- Request: "Por favor, proporciona el JSON con los datos de ejemplo para [ModuleName]"
- The JSON will typically be in **snake_case** (API format)

**STEP 2: Create Model from JSON**
- Update the Model file (`models/{Module}Model.ts`)
- Convert JSON structure to TypeScript interface with **camelCase**
- Example:
  ```typescript
  // JSON: { id: 1, full_name: "Juan", work_station: {...} }
  // Model:
  export interface UserModel {
    id: number;
    fullName: string;
    workStation: WorkStationModel;
  }
  ```

**STEP 3: Create Mock Data**
- Update `data/mock{Module}WithRoles.ts`
- Convert the provided JSON to the typed model format
- Use the Model interface for type safety
- Example:
  ```typescript
  import { UserModel } from '../models/UserModel';

  export const MOCK_USERS: UserModel[] = [
    {
      id: 1,
      fullName: "Juan Pérez",  // Converted from snake_case
      workStation: { id: 1, name: "Developer", level: 2, dependencyId: 5 }
    }
  ];
  ```

**STEP 4: Create Service Interface & MockService**
- Update `services/I{Module}Service.ts` - Define the interface
- Update `services/{Module}MockService.ts` - Implement using mock data from `data/`
- **Do NOT create ApiService** - only Interface and MockService
- Example:
  ```typescript
  // Interface
  import { UserModel } from '../models/UserModel';
  import { SetStateFn } from '@/shared/types/commonTypes';
  import { ApiResponse } from '@/shared/types';

  export interface IUserService {
    getUsersByCompany(
      companyId: number,
      setLoading?: SetStateFn
    ): Promise<ApiResponse<UserModel[]>>;
  }

  // MockService
  import { IUserService } from './IUserService';
  import { UserModel } from '../models/UserModel';
  import { MOCK_USERS_WITH_ROLES } from '../data/mockUsersWithRoles';
  import { SetStateFn } from '@/shared/types/commonTypes';
  import { ApiResponse } from '@/shared/types';

  export class UserMockService implements IUserService {
    private mockUsers: UserModel[] = [...MOCK_USERS_WITH_ROLES];

    async getUsersByCompany(
      companyId: number,
      setLoading?: SetStateFn
    ): Promise<ApiResponse<UserModel[]>> {
      setLoading?.(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading?.(false);

      return {
        status: 200,
        message: 'Success',
        data: [...this.mockUsers]
      };
    }
  }
  ```

**STEP 5: Create Adapter** (preparación para futuro)
- Update `adapters/{module}Adapter.ts`
- Create mapping function from API format (snake_case) to UI Model (camelCase)
- Example:
  ```typescript
  export const adaptUserResponseToUserModel = (apiData: any): UserModel => {
    return {
      id: apiData.id,
      fullName: `${apiData.name} ${apiData.last_name}`.trim(),
      workStation: {
        id: apiData.work_station.id,
        name: apiData.work_station.name,
        level: apiData.work_station.level,
        dependencyId: apiData.work_station.dependency_id  // snake_case → camelCase
      }
    };
  };
  ```

**STEP 6: Generate UI Components**

Create the following components with mock data integration:

**A. Header.tsx**
```typescript
import AzHeaderCardViews from '@/components/aziende/AzHeader/AzHeaderCardViews';

const Header: React.FC<HeaderProps> = ({ loading, onRefresh }) => {
  const { getTotalUsers, currentView } = useUsers();
  const dispatch = useDispatch();

  return (
    <AzHeaderCardViews
      title="Gestión de Usuarios"
      description="Administra los usuarios del sistema"
      badge={{
        count: getTotalUsers(),
        total: getTotalUsers(),
        color: 'primary'
      }}
      currentView={currentView}
      onViewChange={(view) => dispatch(setCurrentView(view))}
      views={[
        { key: '0', name: 'Tabla', icon: 'mdi-table', title: 'Vista Tabla' },
        { key: '1', name: 'Cards', icon: 'mdi-card-multiple', title: 'Vista Cards' }
      ]}
      contentTopRight={
        <div className="d-flex gap-2">
          <Button color="light" onClick={onRefresh} disabled={loading}>
            <i className={`mdi mdi-refresh ${loading ? 'mdi-spin' : ''}`}></i>
            Actualizar
          </Button>
          <Button color="warning">
            <i className="mdi mdi-plus me-1"></i>
            Nuevo
          </Button>
        </div>
      }
    />
  );
};
```

**B. ContentTable.tsx**
```typescript
import AzTable from '@/components/aziende/AzTable';
import { userTableColumns } from '../config/tableColumns';

const ContentTable: React.FC<ContentTableProps> = ({
  filteredUsers,
  filters,
  sorting,
  onFilterChange,
  onSortChange,
  loading
}) => {
  return (
    <Row>
      <Col xl={12}>
        <AzTable
          data={filteredUsers}
          columns={userTableColumns}
          pagination={true}
          filters={filters}
          onFilterChange={onFilterChange}
          sorting={sorting}
          onSortChange={onSortChange}
          loading={loading}
        >
          <AzTable.Actions>
            <Button size="sm" color="primary" outline title="Editar">
              <i className="mdi mdi-pencil"></i>
            </Button>
            <Button size="sm" color="danger" outline title="Eliminar">
              <i className="mdi mdi-trash-can"></i>
            </Button>
          </AzTable.Actions>
        </AzTable>
      </Col>
    </Row>
  );
};
```

**C. ContentCards.tsx**
```typescript
const UserCard: React.FC<{ user: UserModel }> = ({ user }) => {
  return (
    <Card className="border shadow-sm h-100">
      <CardBody>
        <div className="d-flex flex-column align-items-center text-center mb-3">
          <UserAvatar fullName={user.fullName} avatar={user.avatar} size="lg" />
          <h5 className="mt-3 mb-1">{user.fullName}</h5>
          <p className="text-muted mb-0">{user.email}</p>
        </div>
        <div className="d-flex gap-2 justify-content-center">
          <Button color="primary" size="sm">
            <i className="mdi mdi-pencil me-1"></i>
            Editar
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

const ContentCards: React.FC<ContentCardsProps> = ({ filteredUsers }) => {
  return (
    <Row>
      {filteredUsers.map(user => (
        <Col key={user.id} xs={12} sm={6} lg={4} xl={3} className="mb-4">
          <UserCard user={user} />
        </Col>
      ))}
    </Row>
  );
};
```

**D. config/tableColumns.tsx**
```typescript
import { UserModel } from '../models/UserModel';
import UserAvatar from '@/components/Common/UserAvatar';
import { Badge } from 'reactstrap';

export const userTableColumns = [
  {
    key: "fullName",
    header: "Usuario",
    sortable: true,
    filterable: true,
    filterType: "text",
    cell: ({ row: { original } }: { row: { original: UserModel } }) => (
      <div className="d-flex align-items-center">
        <UserAvatar fullName={original.fullName} avatar={original.avatar} />
        <span className="fw-medium">{original.fullName}</span>
      </div>
    )
  },
  {
    key: "name",
    header: "Nombre",
    sortable: true,
    filterable: true,
    filterType: "text",
    cell: ({ row: { original } }: { row: { original: UserModel } }) => original.name
  },
  {
    key: "email",
    header: "Email",
    sortable: true,
    filterable: true,
    filterType: "text",
    cell: ({ row: { original } }: { row: { original: UserModel } }) => (
      <span className="text-muted">{original.email}</span>
    )
  },
  {
    key: "roles",
    header: "Roles",
    sortable: false,
    filterable: false,
    cell: ({ row: { original } }: { row: { original: UserModel } }) => {
      const roleCount = original.roleIds?.length || 0;
      if (roleCount === 0) {
        return <Badge color="light" className="text-muted">Sin roles</Badge>;
      }
      return (
        <Badge color="primary" pill>
          <i className="mdi mdi-shield-crown me-1"></i>
          {roleCount} {roleCount === 1 ? 'rol' : 'roles'}
        </Badge>
      );
    }
  }
];
```

**E. index.tsx (Main Component)**
```typescript
import { Container } from 'reactstrap';
import AzFilterSummary from '@/components/aziende/AzFilterSummary';
import Header from './components/Header';
import ContentTable from './components/ContentTable';
import ContentCards from './components/ContentCards';
import { useUsers } from './hooks/useUsers';
import { useUsersFetch } from './hooks/useUsersFetch';
import { UserMockService } from './services/UserMockService';

const userService = new UserMockService();

const Users: React.FC = () => {
  const { currentView, users } = useUsers();
  const { loading, fetchAll } = useUsersFetch(userService);

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="page-content">
      <Container fluid>
        <Header loading={loading} onRefresh={fetchAll} />

        <AzFilterSummary
          data={users}
          columns={userTableColumns}
          alwaysVisible={true}
          showCount="always"
        >
          {({ filteredData, filters, sorting, onFilterChange, onSortChange }) => (
            <>
              {currentView === '0' && (
                <ContentTable
                  filteredUsers={filteredData}
                  filters={filters}
                  sorting={sorting}
                  onFilterChange={onFilterChange}
                  onSortChange={onSortChange}
                  loading={loading}
                />
              )}
              {currentView === '1' && (
                <ContentCards filteredUsers={filteredData} />
              )}
            </>
          )}
        </AzFilterSummary>
      </Container>
    </div>
  );
};
```

**IMPORTANT NOTES:**
- **NO apply `overflowX: 'clip'`** - Only if specifically needed
- **Responsive switching** (table/cards) is ONLY for Header views, not automatic
- **Modals** go in `components/modals/` folder - create only when needed
- **Actions** always use `<AzTable.Actions>` with icon buttons
- **Code must be clean and readable** - logic is already encapsulated in shared components

#### 3. Test Generation (Only When Requested)

Tests are NOT generated automatically. Create them only when the user explicitly asks:

```bash
# User requests: "Crea los tests para el módulo Users"
# Then generate:
- __tests__/fixtures/mockUsers.ts
- __tests__/unit/userAdapter.test.ts
- __tests__/unit/userSlice.test.ts
- __tests__/integration/useUsers.test.ts
- __tests__/integration/useUsersFetch.test.ts
```

### Reference Implementation

The **`Security/Users`** module is the COMPLETE reference implementation at `src/modules/Security/Users/`.

Study this module for:
- ✅ Complete folder structure
- ✅ TypeScript models (UserModel, WorkStationModel)
- ✅ Redux slice with CRUD actions
- ✅ Service pattern (IUserService, UserApiService, UserMockService)
- ✅ Adapter with snake_case → camelCase conversion
- ✅ Two-hook pattern (useUsers sync + useUsersFetch async)
- ✅ Mock data structure in `data/mockUsersWithRoles.ts`
- ✅ UI components (Header, ContentTable, ContentCards)
- ✅ AZ components integration (AzTable, AzFilterSummary, AzHeaderCardViews)
- ✅ Table columns configuration
- ✅ Comprehensive tests (fixtures, unit, integration)
- ✅ Modal components in `components/modals/`

**File by File Breakdown:**
```
Security/Users/
├── adapters/userAdapter.ts                    # API → UI mapping
├── components/
│   ├── ContentCards.tsx                       # Card view with UserAvatar
│   ├── ContentTable.tsx                       # Table view with AzTable
│   ├── Header.tsx                             # AzHeaderCardViews with buttons
│   └── modals/
│       └── UserRolesPermissionsModal.tsx     # Example modal
├── config/tableColumns.tsx                    # AzTable column configuration
├── data/mockUsersWithRoles.ts                # Mock data (typed with UserModel)
├── hooks/
│   ├── useUsers.ts                            # Sync: useSelector + helpers
│   └── useUsersFetch.ts                       # Async: service + dispatch
├── models/
│   ├── UserModel.ts                           # Main model (camelCase)
│   └── WorkStationModel.ts                    # Nested model
├── services/
│   ├── IUserService.ts                        # Interface
│   ├── UserApiService.ts                      # HTTP implementation
│   └── UserMockService.ts                     # Mock implementation
├── slices/userSlice.ts                        # Redux: list + currentView
├── __tests__/                                 # Complete test suite
└── index.tsx                                  # Main component with AzFilterSummary
```

### Shared Components (AZ)

#### AzTable - Data Table

```typescript
<AzTable
  data={users}                        // Array of data
  columns={userTableColumns}          // Column configuration
  pagination={true}                   // Enable pagination
  filters={filters}                   // External filters from AzFilterSummary
  onFilterChange={onFilterChange}     // Callback to AzFilterSummary
  sorting={sorting}                   // External sorting from AzFilterSummary
  onSortChange={onSortChange}         // Callback to AzFilterSummary
  loading={loading}                   // Show loading spinner
  className="table-centered"          // Additional CSS classes
>
  <AzTable.Actions>
    {/* Row action buttons */}
    <Button size="sm" color="primary" outline>
      <i className="mdi mdi-pencil"></i>
    </Button>
  </AzTable.Actions>
</AzTable>
```

**Column Configuration:**
```typescript
import { UserModel } from '../models/UserModel';

export const userTableColumns = [
  {
    key: "name",
    header: "Nombre",
    sortable: true,
    filterable: true,
    filterType: "text",
    // Para texto simple: retornar valor directamente
    cell: ({ row: { original } }: { row: { original: UserModel } }) => original.name
  },
  {
    key: "email",
    header: "Email",
    sortable: true,
    filterable: true,
    filterType: "text",
    // Para JSX con estilos: envolver en JSX
    cell: ({ row: { original } }: { row: { original: UserModel } }) => (
      <span className="text-muted">{original.email}</span>
    )
  },
  {
    key: "roles",
    header: "Roles",
    sortable: false,
    filterable: false,
    // Para lógica compleja: función completa
    cell: ({ row: { original } }: { row: { original: UserModel } }) => {
      const roleCount = original.roleIds?.length || 0;
      return (
        <Badge color="primary" pill>
          {roleCount} {roleCount === 1 ? 'rol' : 'roles'}
        </Badge>
      );
    }
  }
];
```

**IMPORTANTE - Patrón de Destructuring:**
- ✅ **SIEMPRE usar**: `({ row: { original } }: { row: { original: ModelType } })`
- ✅ **Texto simple**: Retornar valor directamente sin `<span>`
- ✅ **JSX con estilos**: Envolver en JSX cuando se necesiten clases CSS
- ✅ **Lógica compleja**: Usar función completa con variables locales
- ❌ **NO usar**: `({ row }: any)` - pierde type safety
- ❌ **NO usar**: `({ row }: { row: { original: ModelType } })` sin destructuring - verboso

#### AzHeaderCardViews - Header with View Switcher

```typescript
<AzHeaderCardViews
  title="Gestión de Usuarios"
  description="Administra los usuarios"
  badge={{
    count: 10,
    total: 50,
    color: 'primary'
  }}
  currentView={currentView}
  onViewChange={(view) => dispatch(setCurrentView(view))}
  views={[
    { key: '0', name: 'Tabla', icon: 'mdi-table', title: 'Vista Tabla' },
    { key: '1', name: 'Cards', icon: 'mdi-card-multiple', title: 'Vista Cards' }
  ]}
  contentTopRight={
    <Button color="warning">
      <i className="mdi mdi-plus me-1"></i>
      Nuevo
    </Button>
  }
/>
```

#### AzFilterSummary - Filter Manager (Render Props)

```typescript
<AzFilterSummary
  data={users}
  columns={userTableColumns}
  alwaysVisible={true}
  showCount="always"
  countPosition="top"
>
  {({ filteredData, filters, sorting, onFilterChange, onSortChange }) => (
    <AzTable
      data={filteredData}
      filters={filters}
      onFilterChange={onFilterChange}
      sorting={sorting}
      onSortChange={onSortChange}
    />
  )}
</AzFilterSummary>
```

#### UserAvatar - Avatar with Initials

```typescript
<UserAvatar
  fullName="Juan Pérez"
  avatar={user.avatar}    // Optional image URL
  size="lg"               // "sm" | "md" | "lg"
/>
```

### Best Practices

1. **Type Safety**: Use TypeScript interfaces for all models
2. **Separation of Concerns**: Each layer has a single responsibility
3. **Testing**: Create tests only when requested (not automatically)
4. **Components**: Use AZ components (AzTable, AzHeaderCardViews, AzFilterSummary)
5. **State Management**: Two-hook pattern - useModule (sync) + useModuleFetch (async)
6. **Imports**: Use `@/` alias for absolute imports
7. **Mock Data**: Always typed with Model interfaces
8. **Service Pattern**: Interface + MockService (ApiService created later)
9. **Adapters**: Always convert snake_case (API) → camelCase (UI)
10. **Code Readability**: Keep it simple - complex logic is in shared components

The codebase follows React functional component patterns with hooks and uses modern TypeScript/ES6+ features throughout.

## Testing Architecture

### Testing Stack
- **Vitest** - Fast unit test framework optimized for Vite
- **React Testing Library** - Component testing utilities
- **MSW (Mock Service Worker)** - API mocking for integration tests
- **@vitest/ui** - Visual test interface
- **@vitest/coverage-v8** - Code coverage reporting

### Test Organization
Tests are organized by module following this structure:
```
src/modules/{Module}/
└── __tests__/
    ├── fixtures/          # Mock data and test fixtures
    ├── unit/              # Unit tests (adapters, slices)
    └── integration/       # Integration tests (hooks with Redux)
```

### Shared Test Utilities
Located in `src/shared/__tests__/`:
- `setup/vitest.setup.ts` - Global test configuration
- `utils/renderWithProviders.tsx` - Helper for rendering with Redux + Router
- `utils/createMockStore.ts` - Redux store factory for tests
- `utils/testHelpers.ts` - Common testing utilities
- `mocks/` - MSW handlers and server configuration

### Test Configurations
Multiple Vitest configurations in `/test` directory:
- `vitest.config.ts` - Base configuration
- `vitest.unit.config.ts` - Unit tests only
- `vitest.integration.config.ts` - Integration tests only

### Running Specific Test Types
```bash
# Run all tests
npm run test

# Run only unit tests
vitest --config test/vitest.unit.config.ts

# Run only integration tests
vitest --config test/vitest.integration.config.ts

# Watch mode
npm run test -- --watch

# Generate coverage
npm run test:coverage
```

### Testing Guidelines
1. **Unit Tests**: Test pure functions in isolation (adapters, reducers)
2. **Integration Tests**: Test hooks with Redux store and service integration
3. **Coverage Goals**: Aim for 80%+ coverage on business logic layers
4. **Test Naming**: Use `.test.ts` extension for all test files
5. **Fixtures**: Store mock data in `__tests__/fixtures/` within each module
6. **Only When Requested**: Do NOT generate tests automatically

### Example Test Structure (Users Module)

```typescript
// Unit Test (adapter)
describe('userAdapter', () => {
  it('debe mapear correctamente usuario del API', () => {
    const result = adaptUserResponseToUserModel(mockApiUser);
    expect(result.fullName).toBe('Juan Pérez');
    expect(result.workStation.dependencyId).toBe(5); // snake_case → camelCase
  });
});

// Integration Test (hook)
describe('useUsersFetch', () => {
  it('debe obtener usuarios y actualizar Redux', async () => {
    const mockService = createMockService();
    vi.mocked(mockService.getAll).mockResolvedValue({
      status: 200,
      data: mockUsers
    });

    const { result } = renderHook(() => useUsersFetch(mockService), { wrapper });
    await act(() => result.current.fetchAll());

    expect(store.getState().users.list).toHaveLength(2);
  });
});
```

**For complete testing documentation, see [TESTING.md](./TESTING.md)**
