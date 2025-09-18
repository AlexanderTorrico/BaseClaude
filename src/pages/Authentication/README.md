# 🔐 Authentication Module

## Arquitectura Limpia - Autenticación Completa

Esta implementación sigue los principios SOLID y arquitectura limpia, con **todas las peticiones HTTP integradas directamente en el módulo**.

## 📁 Estructura

```
Authentication/
├── 📁 models/           # 🎯 Domain Layer - Entidades y contratos
├── 📁 hooks/            # 🪝 React Hooks - Estado UI
├── 📁 slices/           # 🗂️ Redux State - Estado global
├── 📁 usecases/         # 🏗️ Business Logic - Lógica de negocio
├── 📁 adapters/         # 🔄 Adapters - Traductores API ↔ Domain
├── 📁 services/         # 🌐 Services - HTTP y Factory
└── 📄 index.ts          # 🚀 Exports centralizados
```

## 🔧 Configuración HTTP

### Variables de Entorno (.env)
```bash
# API Configuration
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_APP_API_URL=http://localhost:8000/api  # Fallback
VITE_API_TIMEOUT=10000
VITE_DEBUG_API=true

# Authentication Type
VITE_APP_DEFAULTAUTH=real  # Usar HTTP real (no "api")
```

### Endpoints HTTP Configurados
- **POST** `/auth/login` - Login de usuario
- **POST** `/auth/register` - Registro de usuario
- **POST** `/auth/forgot-password` - Recuperar contraseña
- **GET** `/auth/profile` - Obtener perfil
- **PUT** `/auth/profile` - Actualizar perfil
- **POST** `/auth/refresh` - Renovar token
- **POST** `/auth/logout` - Logout

## 🚀 Uso Rápido

### 1. Hook de Login
```typescript
import { useLogin } from '@/pages/Authentication';

const LoginComponent = () => {
  const { login, isLoading, error, clearError } = useLogin();

  const handleSubmit = async (email: string, password: string) => {
    const result = await login(email, password, true); // rememberMe
    if (result.isSuccess()) {
      console.log('Login exitoso!');
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {isLoading && <div>Iniciando sesión...</div>}
      {/* Tu formulario aquí */}
    </div>
  );
};
```

### 2. Utilidades Directas
```typescript
import { AuthUtils } from '@/pages/Authentication';

// Verificar autenticación
const isAuth = await AuthUtils.isAuthenticated();

// Obtener usuario actual
const user = await AuthUtils.getCurrentUser();

// Logout
await AuthUtils.logout();
```

### 3. Servicio HTTP Directo (Avanzado)
```typescript
import { AuthHttpService } from '@/pages/Authentication';

// Crear instancia personalizada
const authHttp = new AuthHttpService({
  baseURL: 'https://mi-api.com/api',
  timeout: 15000,
  debug: true
});

// Usar directamente
const response = await authHttp.login({ email, password });
```

### 4. Redux Integration
```typescript
// En store/index.ts
import { authReducer } from '@/pages/Authentication';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // otros reducers...
  },
});
```

## 🔍 Debug y Logging

Cuando `VITE_DEBUG_API=true`, verás logs detallados:

```
🔧 AuthHttpService initialized with baseURL: http://127.0.0.1:8000/api
📤 Auth Request: { method: 'POST', url: '/auth/login', ... }
📥 Auth Response: { status: 200, data: {...} }
✅ Login successful: { success: true, user: {...} }
```

## 🛡️ Características de Seguridad

- ✅ **Interceptores automáticos** - Agregan token a headers
- ✅ **Manejo de errores 401** - Logout automático y redirección
- ✅ **Validación de dominio** - Reglas de negocio en entidades
- ✅ **Limpieza de sesión** - Remove tokens en logout/error
- ✅ **Logs de seguridad** - Debug de requests/responses

## 📋 Principios SOLID Aplicados

1. **SRP** - Cada clase tiene una responsabilidad única
2. **OCP** - Extensible sin modificar código existente
3. **LSP** - Interfaces permiten sustitución
4. **ISP** - Interfaces específicas y pequeñas
5. **DIP** - Dependencias invertidas

## 🔄 Flujo de Autenticación

```
UI Component
    ↓ (useLogin hook)
LoginUseCase
    ↓ (business logic)
AuthApiAdapter
    ↓ (translation)
AuthHttpService
    ↓ (HTTP request)
Backend API
```

## 📊 Estado vs Hooks

- **Redux (slices/)** - Estado global, para navegación/middleware
- **Hooks (hooks/)** - Estado local, para componentes específicos

Ambos usan la misma lógica de negocio (use cases) pero diferentes capas de presentación.