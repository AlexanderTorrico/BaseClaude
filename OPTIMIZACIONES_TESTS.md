# Análisis y Optimizaciones de Tests - Módulo Users

## Resumen Ejecutivo

Tu arquitectura es **excelente** y sigue buenas prácticas de Clean Architecture. Los tests están bien organizados. He identificado **5 áreas clave** para reducir código sin perder cobertura.

---

## 1. Duplicación de Datos de Fixtures (RESUELTO ✅)

### Problema Original
Tenías 28 líneas duplicadas entre `MOCK_USERS` y `MOCK_API_USERS` con datos casi idénticos.

### Solución Aplicada
```typescript
// Antes: 28 líneas de datos duplicados
const MOCK_API_USERS = [ /* ... datos manuales ... */ ];

// Después: 9 líneas generadas automáticamente
const toApiFormat = (user: UserModel) => ({
  id: user.id,
  name: user.name,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  avatar: user.avatar,
  workStation: { ...user.workStation, dependency_id: user.workStation.dependencyId },
});

const MOCK_API_USERS = MOCK_USERS.map(toApiFormat);
```

**Ahorro: 19 líneas (~68% reducción)**

---

## 2. Tests Redundantes en usersSice.test.ts

### Tests que se pueden combinar

#### A. Combinar tests de setUsers
```typescript
// ANTES: 3 tests separados (30 líneas)
it('debe actualizar la lista de usuarios', () => { /* ... */ });
it('debe limpiar el loading y error al setear usuarios', () => { /* ... */ });
it('debe reemplazar la lista existente con la nueva', () => { /* ... */ });

// DESPUÉS: 1 test completo (15 líneas)
it('debe actualizar lista, limpiar loading/error y reemplazar existentes', () => {
  const stateWithErrors = { list: [mockUserModel], loading: true, error: 'Some error' };
  const newUser = createMockUser({ id: 2, name: 'María' });

  const state = userSlice(stateWithErrors, setUsers([newUser]));

  expect(state.list).toHaveLength(1);
  expect(state.list[0].id).toBe(2);
  expect(state.loading).toBe(false);
  expect(state.error).toBeNull();
});
```

#### B. Combinar tests de addUser
```typescript
// ANTES: 2 tests (23 líneas)
it('debe agregar un usuario a la lista', () => { /* ... */ });
it('debe agregar un usuario sin afectar los existentes', () => { /* ... */ });

// DESPUÉS: 1 test (12 líneas)
it('debe agregar usuarios sin afectar existentes', () => {
  let state = userSlice(initialState, addUser(mockUserModel));
  expect(state.list).toHaveLength(1);

  const newUser = createMockUser({ id: 2, name: 'María' });
  state = userSlice(state, addUser(newUser));
  expect(state.list).toHaveLength(2);
  expect(state.list[0].id).toBe(1);
  expect(state.list[1].id).toBe(2);
});
```

**Ahorro potencial: ~26 líneas**

---

## 3. Tests Redundantes en userAdapter.test.ts

### Tests que verifican lo mismo

```typescript
// ANTES: Estos 2 tests verifican lo mismo
it('debe mapear correctamente un usuario del API al modelo de UI', () => {
  const result = adaptUserResponseToUserModel(mockApiUser);
  expect(result).toEqual(mockUserModel);
});

it('debe mapear correctamente workStation con snake_case a camelCase', () => {
  const result = adaptUserResponseToUserModel(mockApiUser);
  expect(result.workStation).toEqual({ /* ... */ });
});

it('debe manejar valores null en phone y avatar', () => {
  const result = adaptUserResponseToUserModel(mockApiUser);
  expect(result.phone).toBe('+1 555-0101');
  expect(result.avatar).toBeNull();
});

// DESPUÉS: 1 test completo
it('debe mapear correctamente usuario del API a UI (workStation, phone, avatar)', () => {
  const result = adaptUserResponseToUserModel(mockApiUser);

  expect(result).toEqual(mockUserModel);
  expect(result.workStation).toEqual({
    id: 1,
    name: 'Developer',
    level: 2,
    dependencyId: 5,
  });
  expect(result.phone).toBe('+1 555-0101');
  expect(result.avatar).toBeNull();
});
```

**Ahorro potencial: ~15 líneas**

---

## 4. Tests con Assertions Redundantes en adaptUsersArrayToUserModels

```typescript
// ANTES: 2 tests casi idénticos
it('debe mapear correctamente un array de usuarios', () => {
  const apiUsers = [mockApiUser, mockApiUserWithAvatar];
  const result = adaptUsersArrayToUserModels(apiUsers);

  expect(result).toHaveLength(2);
  expect(result[0].fullName).toBe('Juan Pérez');
  expect(result[1].fullName).toBe('María García');
});

it('debe procesar correctamente múltiples usuarios con datos variados', () => {
  const apiUsers = [mockApiUser, mockApiUserWithAvatar];
  const result = adaptUsersArrayToUserModels(apiUsers);

  expect(result[0].phone).toBe('+1 555-0101');
  expect(result[1].phone).toBe('+1 555-0102');
  expect(result[0].avatar).toBeNull();
  expect(result[1].avatar).toBe('https://example.com/avatar.jpg');
});

// DESPUÉS: 1 test completo
it('debe mapear array de usuarios con todos sus campos', () => {
  const apiUsers = [mockApiUser, mockApiUserWithAvatar];
  const result = adaptUsersArrayToUserModels(apiUsers);

  expect(result).toHaveLength(2);
  expect(result[0]).toMatchObject({
    fullName: 'Juan Pérez',
    phone: '+1 555-0101',
    avatar: null,
  });
  expect(result[1]).toMatchObject({
    fullName: 'María García',
    phone: '+1 555-0102',
    avatar: 'https://example.com/avatar.jpg',
  });
});
```

**Ahorro potencial: ~12 líneas**

---

## 5. Simplificar Tests de UserController con Helper

### Crear helper para reducir boilerplate

```typescript
// NUEVO: Helper en fixtures/mockUsers.ts
export const createMockServiceResponse = (data: any, status = 200) => ({
  data: { data },
});

export const mockServiceCall = (response: any) => ({
  call: Promise.resolve(response),
  controller: new AbortController(),
});
```

```typescript
// ANTES: (10 líneas por test)
it('debe obtener usuarios exitosamente', async () => {
  const mockApiResponse = { data: { data: [mockApiUser] } };
  vi.mocked(userServices.getUsersByCompanyCall).mockReturnValue({
    call: Promise.resolve(mockApiResponse as any),
    controller: new AbortController(),
  });

  const response = await UserController.getUsersByCompany(1);
  // assertions...
});

// DESPUÉS: (5 líneas)
it('debe obtener usuarios exitosamente', async () => {
  vi.mocked(userServices.getUsersByCompanyCall)
    .mockReturnValue(mockServiceCall(createMockServiceResponse([mockApiUser])));

  const response = await UserController.getUsersByCompany(1);
  // assertions...
});
```

**Ahorro potencial: ~30 líneas en UserController.test.ts**

---

## 6. Optimizar Tests de useUsers con describe anidados

### Agrupar mejor los tests

```typescript
// ANTES: 3 bloques describe separados
describe('Estado sincrónico desde Redux', () => { /* 3 tests */ });
describe('fetchUsersByCompany - función asíncrona', () => { /* 5 tests */ });
describe('Funciones síncronas (lógica local)', () => { /* 6 tests */ });

// DESPUÉS: Mejor organización
describe('useUsers', () => {
  describe('Lectura de estado (sync)', () => {
    // Combinar tests similares
    it('debe leer users, loading y error desde Redux', () => {
      const wrapper = createWrapper({
        users: {
          list: [mockUserModel],
          loading: true,
          error: 'Error de prueba',
        },
      });

      const { result } = renderHook(() => useUsers(), { wrapper });

      expect(result.current.users).toHaveLength(1);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe('Error de prueba');
    });
  });

  describe('fetchUsersByCompany (async)', () => {
    // ... tests async
  });

  describe('Utilidades de búsqueda', () => {
    // Combinar findUserByEmail y findUserById
    it.each([
      ['email', 'juan@example.com', 'findUserByEmail'],
      ['id', 1, 'findUserById'],
    ])('debe buscar usuario por %s', (type, value, method) => {
      // ... test parametrizado
    });
  });
});
```

**Ahorro potencial: ~20 líneas**

---

## Resumen de Optimizaciones

| Área | Líneas Actuales | Líneas Optimizadas | Ahorro | Estado |
|------|-----------------|-------------------|---------|--------|
| Fixtures (duplicación) | 28 | 9 | -19 | ✅ Aplicado |
| usersSice.test.ts | 204 | 178 | -26 | ⏳ Recomendado |
| userAdapter.test.ts | 86 | 59 | -27 | ⏳ Recomendado |
| UserController.test.ts | 173 | 143 | -30 | ⏳ Recomendado |
| useUsers.test.ts | 247 | 227 | -20 | ⏳ Recomendado |
| **TOTAL** | **738** | **616** | **-122 líneas (-16.5%)** | |

---

## Recomendaciones Adicionales

### 1. Usa `it.each` para tests parametrizados
```typescript
// Reduce código cuando tienes múltiples tests similares
it.each([
  [mockApiUser, mockUserModel],
  [mockApiUserWithAvatar, mockUserWithAvatar],
])('debe adaptar usuario correctamente', (apiUser, expected) => {
  expect(adaptUserResponseToUserModel(apiUser)).toEqual(expected);
});
```

### 2. Usa `toMatchObject` en lugar de múltiples `expect`
```typescript
// ANTES: 5 líneas
expect(result.id).toBe(1);
expect(result.name).toBe('Juan');
expect(result.email).toBe('juan@example.com');

// DESPUÉS: 1 línea
expect(result).toMatchObject({ id: 1, name: 'Juan', email: 'juan@example.com' });
```

### 3. Evita `beforeEach` cuando no es necesario
```typescript
// Si solo limpias mocks, no necesitas beforeEach en cada test
// Vitest lo hace automáticamente con la config correcta
```

---

## Conclusión

Tu arquitectura es **excelente**. Las optimizaciones propuestas:
- ✅ Mantienen la misma cobertura
- ✅ Reducen código en ~17%
- ✅ Mejoran legibilidad
- ✅ Siguen mejores prácticas de Vitest

**Prioridad de implementación:**
1. ✅ Fixtures (ya aplicado) - Impacto alto, riesgo bajo
2. ⭐ UserAdapter.test.ts - Impacto medio, riesgo bajo
3. ⭐ usersSice.test.ts - Impacto medio, riesgo bajo
4. ⚡ Crear helpers en fixtures - Impacto alto, riesgo medio
5. 🔧 useUsers.test.ts - Impacto bajo, riesgo bajo

¿Quieres que aplique alguna de las optimizaciones recomendadas?
