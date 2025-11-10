# Integración de Backend Real - Skote

> **Nota**: Este documento cubre la configuración de autenticación global del template. Para la arquitectura modular de features (Security/Users, etc.), consulta [CLAUDE.md](./CLAUDE.md) que documenta el patrón Service Interface + ApiService + MockService.

## Descripción

Este documento describe la implementación de autenticación con backend real en el template Skote, permitiendo el uso tanto del fakeBackend original como de una API externa.

## Configuración

### Variables de Entorno (.env)

```env
# API Configuration
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_API_TIMEOUT=10000
VITE_DEBUG_API=true

# Authentication (fake | jwt | firebase | api)
VITE_APP_DEFAULTAUTH=api
```

### Opciones de Autenticación

- `fake`: Usa el fakeBackend original (mocks)
- `jwt`: Autenticación JWT local
- `firebase`: Autenticación con Firebase
- `api`: **NUEVO** - Autenticación con backend real

## Archivos Modificados

### 1. `src/helpers/realBackendAuth.js` (renombrado de apiAuth.js)

Contiene las funciones para comunicarse con el backend real:

- `postApiLogin(data)` - Login con API externa
- `postApiRegister(data)` - Registro de usuario
- `postApiForgotPassword(data)` - Recuperación de contraseña
- `postApiProfile(data)` - Actualización de perfil
- `postApiLogout()` - Logout
- Funciones de manejo de tokens: `setAuthToken`, `getAuthToken`, `clearAuthToken`

### 2. `src/store/authSlice.js`

Modificado para incluir la opción 'api' en todos los métodos de autenticación:
- `loginUser` - Ahora soporta backend real
- `logoutUser` - Incluye llamada a API de logout
- `registerUser` - Soporta registro con API
- `forgotPassword` - Recuperación de contraseña con API
- `updateProfile` - Actualización de perfil con API

### 3. `src/App.jsx`

Modificado para activar el fakeBackend solo cuando `VITE_APP_DEFAULTAUTH=fake`:

```jsx
// Conditionally activate fake backend only if not using real API
if (import.meta.env.VITE_APP_DEFAULTAUTH === 'fake') {
  fakeBackend();
}
```

## API Endpoints Esperados

El backend debe implementar los siguientes endpoints:

### Autenticación
- `POST /login` - Login de usuario
  - Body: `{ email: string, password: string }`
  - Response: `{ status: 200, data: { access_token: string, data: { name: string, email: string } } }`

- `POST /api/auth/logout` - Logout de usuario
  - Headers: `Authorization: Bearer {token}`

### Registro y Recuperación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/forgot-password` - Recuperación de contraseña

### Perfil
- `PUT /api/auth/profile` - Actualizar perfil
- `GET /api/auth/profile` - Obtener perfil

### Utilidades
- `POST /api/auth/refresh-token` - Refrescar token
- `POST /api/auth/validate-token` - Validar token
- `POST /api/auth/social/{loginType}` - Login social

## Manejo de Tokens

El sistema maneja automáticamente:
- Almacenamiento del token en localStorage como 'bearerToken'
- Información del usuario en localStorage como 'authUser'
- Limpieza automática en logout
- Interceptors de axios para incluir token en requests (configurado en api_helper.js)

## Cómo Cambiar entre Backends

1. **Para usar fakeBackend**: Cambiar `VITE_APP_DEFAULTAUTH=fake` en .env
2. **Para usar backend real**: Cambiar `VITE_APP_DEFAULTAUTH=api` en .env
3. **Configurar URL del backend**: Modificar `VITE_API_BASE_URL` en .env

## Testing

Para probar la integración:

1. Configurar variables de entorno
2. Ejecutar `npm run dev`
3. Intentar login en `/login`
4. Verificar que el token se almacene correctamente
5. Probar logout y verificar limpieza de datos

## Nota Importante

Esta implementación mantiene la compatibilidad completa con el sistema original de fakeBackend, permitiendo alternar entre ambos modos sin modificar código de componentes.