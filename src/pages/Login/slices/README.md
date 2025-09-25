# User Slice Documentation - Clean Architecture

Este slice de Redux maneja el estado del usuario autenticado usando **Arquitectura Limpia Desacoplada** con Redux Toolkit y patrones funcionales.

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   userSlice.ts  │  │ useUserAuth.ts  │  │ Components  │ │
│  │   (Pure Redux)  │  │ (Hook)          │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ userStateUseCase│  │  loginUseCase   │  │logoutUseCase│ │
│  │ (Orchestration) │  │ (Domain Logic)  │  │(Domain Logic│ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ storageService  │  │loginHttpService │  │ API Adapters│ │
│  │ (localStorage)  │  │ (HTTP Client)   │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Características

- ✅ **Arquitectura Limpia**: Separación clara de responsabilidades
- ✅ **Desacoplamiento**: Cada capa independiente, fácil testing
- ✅ **Inversión de dependencias**: Use cases orquestan services
- ✅ **Estado puro**: Redux slice sin side effects
- ✅ **Servicios puros**: Functions sin dependencias externas
- ✅ **TypeScript completo**: Con tipos bien definidos

## Estado del Usuario

```typescript
interface LoginState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  lastLogin?: string;
}
```

## Uso Básico

### 1. En componentes con hook personalizado

```typescript
import { useUserAuth } from '@/pages/Login';

function MyComponent() {
  const {
    user,
    isAuthenticated,
    login,
    logout,
    isLoading,
    error
  } = useUserAuth();

  // Login
  const handleLogin = async () => {
    const result = await login({
      email: 'user@example.com',
      password: 'password123'
    });
  };

  // Logout
  const handleLogout = async () => {
    await logout();
  };
}
```

### 2. Con selectores directos

```typescript
import { useSelector } from 'react-redux';
import {
  selectUser,
  selectIsAuthenticated,
  selectUserDisplayName
} from '@/pages/Login';

function UserProfile() {
  const user = useSelector(selectUser);
  const isAuth = useSelector(selectIsAuthenticated);
  const displayName = useSelector(selectUserDisplayName);

  return (
    <div>
      {isAuth ? `Hola, ${displayName}` : 'No autenticado'}
    </div>
  );
}
```

## Acciones Disponibles

### Acciones de Login
- `loginStart()` - Inicia el proceso de login
- `loginSuccess(user)` - Login exitoso
- `loginFailure(error)` - Error en login

### Acciones de Logout
- `logoutStart()` - Inicia logout
- `logoutSuccess()` - Logout exitoso
- `logoutFailure(error)` - Error en logout

### Otras Acciones
- `updateUserProfile(userData)` - Actualiza perfil del usuario
- `clearError()` - Limpia errores
- `initializeFromStorage()` - Carga desde localStorage
- `resetUserState()` - Resetea todo el estado

## Selectores

### Selectores Básicos
- `selectUser` - Usuario actual
- `selectIsAuthenticated` - Estado de autenticación
- `selectIsLoading` - Estado de carga
- `selectError` - Error actual

### Selectores Calculados
- `selectUserDisplayName` - Nombre formateado del usuario
- `selectUserInitials` - Iniciales del usuario
- `selectIsUserActive` - Si el usuario está activo

## Persistencia

El slice automáticamente:
- **Guarda** en localStorage cuando el login es exitoso
- **Carga** desde localStorage al inicializar
- **Limpia** localStorage al hacer logout

## Integración con Store

```typescript
// store/index.ts
import { userReducer } from '@/pages/Login';

export const store = configureStore({
  reducer: {
    user: userReducer, // ← Nuestro slice
    // otros reducers...
  }
});
```

## Ejemplo de Uso Completo

```typescript
// LoginComponent.tsx
import React from 'react';
import { useUserAuth } from '@/pages/Login';

export const LoginComponent = () => {
  const {
    login,
    isLoading,
    error,
    clearAuthError
  } = useUserAuth();

  const handleSubmit = async (credentials) => {
    const result = await login(credentials);
    if (result.success) {
      console.log('Login exitoso!');
      // El usuario se redirige automáticamente
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger">
          {error}
          <button onClick={clearAuthError}>×</button>
        </div>
      )}
      {/* campos del formulario */}
      <button disabled={isLoading}>
        {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
};
```

## UserProfile Component

```typescript
// UserProfile.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectUserDisplayName, useUserAuth } from '@/pages/Login';

export const UserProfile = () => {
  const user = useSelector(selectUser);
  const displayName = useSelector(selectUserDisplayName);
  const { logout } = useUserAuth();

  if (!user) return <div>No autenticado</div>;

  return (
    <div>
      <h2>Perfil de {displayName}</h2>
      <p>Email: {user.email}</p>
      <p>Privilegios: {user.privilege}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
};
```

## Notas Importantes

- El slice se inicializa automáticamente con datos del localStorage
- Todas las acciones son serializables y compatibles con Redux DevTools
- Los errores se manejan de manera funcional con el patrón Result
- La persistencia es automática y transparente