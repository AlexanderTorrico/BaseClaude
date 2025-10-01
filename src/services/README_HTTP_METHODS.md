# Métodos HTTP Globales

Este archivo explica cómo usar los métodos globales para realizar llamadas HTTP autenticadas y públicas.

## Métodos Disponibles

### 1. `createAuthenticatedCall<T>()` - Con Bearer Token
Para endpoints que requieren autenticación. Automáticamente agrega el token del localStorage.

```typescript
import { createAuthenticatedCall } from '@/services/httpService';

// GET autenticado
export const getUsers = () => {
  return createAuthenticatedCall<ApiResponse<User[]>>(
    'GET',
    '/api/users'
  );
};

// POST autenticado con datos
export const createUser = (userData: CreateUserRequest) => {
  return createAuthenticatedCall<ApiResponse<User>>(
    'POST',
    '/api/users',
    userData
  );
};

// PUT autenticado
export const updateUser = (id: number, userData: UpdateUserRequest) => {
  return createAuthenticatedCall<ApiResponse<User>>(
    'PUT',
    `/api/users/${id}`,
    userData
  );
};

// DELETE autenticado
export const deleteUser = (id: number) => {
  return createAuthenticatedCall<ApiResponse<void>>(
    'DELETE',
    `/api/users/${id}`
  );
};
```

### 2. `createPublicCall<T>()` - Sin Autenticación
Para endpoints públicos que no requieren token.

```typescript
import { createPublicCall } from '@/services/httpService';

// GET público
export const getPublicData = () => {
  return createPublicCall<ApiResponse<PublicData[]>>(
    'GET',
    '/api/public/data'
  );
};

// POST público (ej: registro, login)
export const registerUser = (credentials: RegisterRequest) => {
  return createPublicCall<ApiResponse<AuthResponse>>(
    'POST',
    '/api/register',
    credentials
  );
};
```

## Configuración Adicional

Ambos métodos aceptan un parámetro opcional de configuración:

```typescript
export const getUsersWithConfig = () => {
  return createAuthenticatedCall<ApiResponse<User[]>>(
    'GET',
    '/api/users',
    undefined, // no data for GET
    {
      timeout: 5000,
      headers: {
        'Custom-Header': 'value'
      }
    }
  );
};
```

## Uso en Controladores

```typescript
export class UserController {
  static async getUsers(): Promise<ApiResponse<User[]>> {
    try {
      const { call } = createAuthenticatedCall<ApiResponse<User[]>>(
        'GET',
        '/api/users'
      );
      const response = await call;
      return response.data;
    } catch (error: any) {
      // Manejo de errores (405 para redirect al login)
      if (error?.response?.status === 405) {
        // Redirect logic
      }
      throw error;
    }
  }
}
```

## Características

- ✅ **Auto Bearer Token**: `createAuthenticatedCall` agrega automáticamente `Authorization: Bearer ${token}`
- ✅ **Abort Controller**: Ambos métodos incluyen cancelación de requests
- ✅ **TypeScript**: Completamente tipado con generics
- ✅ **Flexibilidad**: Soporta GET, POST, PUT, DELETE
- ✅ **Configuración**: Headers, timeout y otras opciones de Axios
- ✅ **Reutilizable**: Una sola implementación para toda la aplicación