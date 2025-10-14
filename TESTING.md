# Testing Guide - Skote React Template

Esta guía completa explica cómo funciona el sistema de testing del proyecto y cómo escribir tests efectivos.

## 📋 Tabla de Contenidos

1. [Stack de Testing](#stack-de-testing)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Tipos de Tests](#tipos-de-tests)
4. [Ejecutar Tests](#ejecutar-tests)
5. [Escribir Tests](#escribir-tests)
6. [Mejores Prácticas](#mejores-prácticas)
7. [Ejemplos Completos](#ejemplos-completos)

---

## Stack de Testing

### Herramientas Principales

| Herramienta | Propósito | Versión |
|------------|-----------|---------|
| **Vitest** | Test runner optimizado para Vite | ^3.2.4 |
| **React Testing Library** | Testing de componentes React | ^16.0.1 |
| **MSW (Mock Service Worker)** | Mockeo de APIs | ^2.11.5 |
| **@vitest/ui** | Interfaz visual para tests | ^3.2.4 |
| **@vitest/coverage-v8** | Reportes de cobertura | ^3.2.4 |
| **jsdom** | Entorno DOM para tests | ^27.0.0 |

### ¿Por qué Vitest?

- ✅ **Rápido**: 10-20x más rápido que Jest
- ✅ **Integración perfecta**: Comparte configuración con Vite
- ✅ **HMR para tests**: Re-ejecuta solo tests modificados
- ✅ **Compatible con Jest**: API similar, fácil migración
- ✅ **ESM nativo**: Sin problemas con módulos ES

---

## Estructura de Carpetas

### Estructura Global

```
Starterkit - ts/
├── test/                                    # Configuraciones de Vitest
│   ├── vitest.config.ts                    # Config base
│   ├── vitest.unit.config.ts               # Config unit tests
│   ├── vitest.integration.config.ts        # Config integration
│   └── vitest.api.config.ts                # Config API tests
│
├── src/
│   ├── shared/
│   │   └── __tests__/                      # Helpers globales
│   │       ├── setup/
│   │       │   └── vitest.setup.ts         # Setup global
│   │       ├── utils/
│   │       │   ├── renderWithProviders.tsx  # Wrapper RTL + Redux
│   │       │   ├── createMockStore.ts       # Store mock
│   │       │   └── testHelpers.ts           # Utilidades
│   │       └── mocks/
│   │           ├── handlers/                # MSW handlers
│   │           ├── server.ts                # MSW server (Node)
│   │           └── browser.ts               # MSW browser
│   │
│   └── modules/{Module}/
│       └── __tests__/                       # Tests del módulo
│           ├── fixtures/                    # Mock data
│           ├── unit/                        # Unit tests
│           ├── integration/                 # Integration tests
│           └── api/                         # API tests
│
└── coverage/                                # Reportes (generado)
```

### Ejemplo: Módulo Users

```
src/modules/Security/Users/
├── adapters/
│   └── userAdapter.ts
├── controllers/
│   └── UserController.ts
├── services/
│   └── userServices.ts
├── slices/
│   └── usersSice.ts
├── hooks/
│   └── useUsers.ts
└── __tests__/
    ├── fixtures/
    │   └── mockUsers.ts                    # Datos de prueba
    ├── unit/
    │   ├── userAdapter.test.ts             # Test del adapter
    │   └── usersSice.test.ts               # Test del slice
    ├── integration/
    │   ├── UserController.test.ts          # Test del controller
    │   └── useUsers.test.ts                # Test del hook
    └── api/
        └── userServices.test.ts            # Test del service
```

---

## Tipos de Tests

### 1. Unit Tests (Pruebas Unitarias)

**¿Qué testear?**
- Adapters (mapeo de datos)
- Redux Slices (reducers)
- Funciones puras
- Utilidades

**Características:**
- ✅ Rápidos
- ✅ Sin dependencias externas
- ✅ Fáciles de escribir
- ✅ Alta cobertura

**Ejemplo:**
```typescript
// userAdapter.test.ts
import { adaptUserResponseToUserModel } from '../../adapters/userAdapter';

describe('userAdapter', () => {
  it('debe mapear correctamente un usuario del API', () => {
    const apiUser = { id: 1, name: 'Juan', lastName: 'Pérez' };
    const result = adaptUserResponseToUserModel(apiUser);

    expect(result.fullName).toBe('Juan Pérez');
  });
});
```

### 2. Integration Tests (Pruebas de Integración)

**¿Qué testear?**
- Controllers (con Redux)
- Hooks (con Redux + Controller)
- Flujos completos entre capas

**Características:**
- ⚡ Moderadamente rápidos
- 🔗 Testa múltiples unidades juntas
- 📦 Mocks de dependencias externas

**Ejemplo:**
```typescript
// UserController.test.ts
import { UserController } from '../../controllers/UserController';
import { store } from '@/store';

describe('UserController', () => {
  it('debe actualizar Redux al obtener usuarios', async () => {
    const response = await UserController.getUsersByCompany(1);

    expect(response.success).toBe(true);
    expect(store.getState().users.list).toHaveLength(2);
  });
});
```

### 3. API Tests (Pruebas de API)

**¿Qué testear?**
- Services (llamadas HTTP)
- Manejo de errores (401, 500, network)
- Headers de autenticación
- Transformación de responses

**Características:**
- 🌐 Usa MSW para interceptar peticiones
- 🚀 No requiere backend real
- ✅ Tests determinísticos

**Ejemplo:**
```typescript
// userServices.test.ts
import { getUsersByCompanyCall } from '../../services/userServices';

describe('userServices', () => {
  it('debe hacer la petición GET correctamente', async () => {
    const { call } = getUsersByCompanyCall(1);
    const response = await call;

    expect(response.data.success).toBe(true);
  });
});
```

---

## Ejecutar Tests

### Comandos Básicos

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar con interfaz UI
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage

# Watch mode (re-ejecuta al guardar)
npm run test -- --watch

# Ejecutar un archivo específico
npm run test src/modules/Security/Users/__tests__/unit/userAdapter.test.ts
```

### Ejecutar por Tipo

```bash
# Solo unit tests
vitest --config test/vitest.unit.config.ts

# Solo integration tests
vitest --config test/vitest.integration.config.ts

# Solo API tests
vitest --config test/vitest.api.config.ts
```

### Watch Mode Inteligente

```bash
# Vitest en modo watch
npm run test -- --watch

# Solo tests relacionados a archivos cambiados
npm run test -- --watch --changed
```

### UI Visual

```bash
# Abrir interfaz visual
npm run test:ui
```

Esto abre una interfaz web en `http://localhost:51204` con:
- ✅ Lista de tests con resultados
- 📊 Gráficos de cobertura
- 🔍 Búsqueda y filtrado
- 📝 Ver código fuente
- ⚡ Re-ejecución en tiempo real

---

## Escribir Tests

### 1. Estructura de un Test

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Nombre del módulo', () => {
  // Setup antes de cada test
  beforeEach(() => {
    // Preparar estado inicial
  });

  // Cleanup después de cada test
  afterEach(() => {
    // Limpiar mocks, estado, etc.
  });

  describe('Funcionalidad específica', () => {
    it('debe hacer algo específico', () => {
      // Arrange (preparar)
      const input = 'dato de prueba';

      // Act (ejecutar)
      const result = funcionATestear(input);

      // Assert (verificar)
      expect(result).toBe('resultado esperado');
    });
  });
});
```

### 2. Unit Test de Adapter

```typescript
// src/modules/Security/Users/__tests__/unit/userAdapter.test.ts
import { describe, it, expect } from 'vitest';
import { adaptUserResponseToUserModel } from '../../adapters/userAdapter';

describe('userAdapter', () => {
  describe('adaptUserResponseToUserModel', () => {
    it('debe mapear correctamente los datos del API', () => {
      // Arrange
      const apiUser = {
        id: 1,
        name: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workStation: {
          id: 10,
          name: 'Developer',
          level: 2,
          dependency_id: 5,
        },
      };

      // Act
      const result = adaptUserResponseToUserModel(apiUser);

      // Assert
      expect(result).toEqual({
        id: 1,
        fullName: 'Juan Pérez',
        name: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workStation: {
          id: 10,
          name: 'Developer',
          level: 2,
          dependencyId: 5, // Nota: snake_case → camelCase
        },
      });
    });
  });
});
```

### 3. Integration Test de Controller

```typescript
// src/modules/Security/Users/__tests__/integration/UserController.test.ts
import { describe, it, expect, vi } from 'vitest';
import { UserController } from '../../controllers/UserController';
import * as userServices from '../../services/userServices';

// Mock del service
vi.mock('../../services/userServices');

describe('UserController', () => {
  it('debe obtener usuarios y actualizar Redux', async () => {
    // Arrange
    const mockResponse = {
      data: {
        data: [{ id: 1, name: 'Juan', lastName: 'Pérez' }],
      },
    };

    vi.mocked(userServices.getUsersByCompanyCall).mockReturnValue({
      call: Promise.resolve(mockResponse),
      controller: new AbortController(),
    });

    // Act
    const response = await UserController.getUsersByCompany(1);

    // Assert
    expect(response.success).toBe(true);
    expect(response.data).toHaveLength(1);
  });
});
```

### 4. API Test con MSW

```typescript
// src/modules/Security/Users/__tests__/api/userServices.test.ts
import { describe, it, expect } from 'vitest';
import { server } from '@/shared/__tests__/mocks/server';
import { http, HttpResponse } from 'msw';
import { getUsersByCompanyCall } from '../../services/userServices';

describe('userServices', () => {
  it('debe manejar error 401', async () => {
    // Arrange
    server.use(
      http.get('/api/rrhh/by_company_id/:id', () => {
        return new HttpResponse(null, { status: 401 });
      })
    );

    // Act & Assert
    const { call } = getUsersByCompanyCall(1);
    await expect(call).rejects.toThrow();
  });
});
```

### 5. Test de Hook con Redux

```typescript
// src/modules/Security/Users/__tests__/integration/useUsers.test.ts
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useUsers } from '../../hooks/useUsers';
import { createMockStore } from '@/shared/__tests__/utils/createMockStore';

describe('useUsers', () => {
  it('debe leer usuarios desde Redux', () => {
    // Arrange
    const store = createMockStore({
      users: {
        list: [{ id: 1, name: 'Juan' }],
        loading: false,
        error: null,
      },
    });

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    // Act
    const { result } = renderHook(() => useUsers(), { wrapper });

    // Assert
    expect(result.current.users).toHaveLength(1);
  });
});
```

---

## Mejores Prácticas

### ✅ DO (Hacer)

1. **Usar Arrange-Act-Assert**
   ```typescript
   it('debe sumar dos números', () => {
     // Arrange
     const a = 5, b = 3;

     // Act
     const result = sum(a, b);

     // Assert
     expect(result).toBe(8);
   });
   ```

2. **Tests descriptivos**
   ```typescript
   // ✅ BUENO
   it('debe retornar error si el email es inválido')

   // ❌ MALO
   it('test de validación')
   ```

3. **Un concepto por test**
   ```typescript
   // ✅ BUENO - Un test por comportamiento
   it('debe retornar error si email vacío')
   it('debe retornar error si email sin @')

   // ❌ MALO - Muchas cosas en un test
   it('debe validar email')
   ```

4. **Limpiar después de cada test**
   ```typescript
   afterEach(() => {
     vi.clearAllMocks();
     cleanup();
   });
   ```

### ❌ DON'T (No hacer)

1. **No testear implementación**
   ```typescript
   // ❌ MALO - Testa implementación
   expect(mockFn).toHaveBeenCalledWith(...)

   // ✅ BUENO - Testa resultado
   expect(result).toBe(...)
   ```

2. **No hacer tests frágiles**
   ```typescript
   // ❌ MALO - Se rompe con cambios de UI
   expect(screen.getByText('Submit')).toBeInTheDocument()

   // ✅ BUENO - Usa roles y labels
   expect(screen.getByRole('button', { name: /submit/i }))
   ```

3. **No usar magic numbers**
   ```typescript
   // ❌ MALO
   await waitFor(() => {}, { timeout: 3000 })

   // ✅ BUENO
   const ASYNC_TIMEOUT = 3000;
   await waitFor(() => {}, { timeout: ASYNC_TIMEOUT })
   ```

---

## Ejemplos Completos

### Coverage Goals

| Capa | Tipo de Test | Coverage Objetivo |
|------|--------------|-------------------|
| Adapters | Unit | 100% |
| Slices | Unit | 100% |
| Services | API | 90% |
| Controllers | Integration | 85% |
| Hooks | Integration | 80% |
| Components | Component | 70% |

### Ver Reporte de Coverage

```bash
npm run test:coverage
```

Abre `coverage/index.html` en el navegador para ver el reporte visual.

---

## Troubleshooting

### Problema: Tests lentos

**Solución:**
```bash
# Usar --no-coverage en desarrollo
npm run test -- --no-coverage

# Ejecutar solo tests modificados
npm run test -- --changed
```

### Problema: Mocks no funcionan

**Solución:**
```typescript
// Asegúrate de limpiar mocks
afterEach(() => {
  vi.clearAllMocks();
});

// Verifica que el mock esté antes del import
vi.mock('../../services/userServices');
import { getUsersByCompanyCall } from '../../services/userServices';
```

### Problema: Redux state no se actualiza

**Solución:**
```typescript
// Usa act() para actualizaciones async
import { act } from '@testing-library/react';

await act(async () => {
  await result.current.fetchUsers();
});
```

---

## Recursos Adicionales

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library Docs](https://testing-library.com/react)
- [MSW Docs](https://mswjs.io/)
- [Testing Best Practices](https://testingjavascript.com/)

---

**¿Preguntas?** Consulta el módulo `src/modules/Security/Users/__tests__/` para ejemplos completos de todos los tipos de tests.
