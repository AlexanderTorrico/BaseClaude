# 🔧 Guía Completa de Configuración de APIs

## 📂 Estructura de Configuración

```
├── .env.local              # Tu configuración personal (git ignored)
├── .env.development        # Configuración de desarrollo
├── .env.staging            # Configuración de staging/testing  
├── .env.production         # Configuración de producción
├── src/config/api.js       # Configuración centralizada
├── src/helpers/api_helper.jsx       # Cliente axios
└── src/helpers/url_helper.jsx       # Endpoints
```

## 🚀 Comandos por Entorno

### Desarrollo
```bash
npm run dev                 # Usa .env.development + .env.local
# - Mock data habilitado
# - API: https://192.168.1.155/api
# - Debug habilitado
```

### Staging/Testing
```bash
npm run dev:staging         # Usa .env.staging
npm run build:staging       # Build para staging
# - API real a servidor de pruebas
# - Debug habilitado
```

### Producción
```bash
npm run build               # Usa .env.production
npm run build:production    # Build para producción
# - API real a servidor de producción
# - Debug deshabilitado
```

## ⚙️ Variables de Entorno

### Principales
```env
VITE_USE_MOCK_DATA=true|false     # Usar datos mock
VITE_API_BASE_URL=https://...     # URL base del servidor
VITE_APP_DEFAULTAUTH=fake|jwt     # Método de autenticación
VITE_DEBUG_API=true|false         # Debug de peticiones
```

## 🎯 Configuración por Escenario

### 1. Desarrollo con Mock (Actual)
**`.env.local`:**
```env
VITE_USE_MOCK_DATA=true
VITE_API_BASE_URL=https://192.168.1.155/api
```
- ✅ Funciona sin servidor
- ✅ Respuesta instantánea
- ✅ Credenciales: admin@themesbrand.com / 123456

### 2. Desarrollo con API Real Local
**`.env.local`:**
```env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=http://localhost:3001/api
```
- 🔗 Conecta a tu servidor local
- 📡 Peticiones HTTP reales

### 3. Testing/Staging
**`.env.staging`:**
```env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=https://staging-api.empresa.com/api
VITE_APP_DEFAULTAUTH=jwt
```

### 4. Producción
**`.env.production`:**
```env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=https://api.empresa.com/api
VITE_APP_DEFAULTAUTH=jwt
```

## 🔍 Debugging

### Ver configuración actual:
Abre la consola del navegador y verás:
```
🔧 API Configuration
├── Environment: development
├── Base URL: https://192.168.1.155/api
├── Use Mock: true
├── Auth Method: fake
└── Timeout: 10000ms
```

### Ver peticiones API:
Si `VITE_DEBUG_API=true`:
```
🚀 API Request: POST /post-fake-login
Data: {email: "admin@themesbrand.com", password: "123456"}
```

## 📝 Endpoints Disponibles

### Autenticación Fake
- `POST /post-fake-login` - Login
- `POST /post-fake-register` - Registro  
- `POST /fake-forget-pwd` - Olvidar contraseña
- `POST /post-fake-profile` - Actualizar perfil

### Autenticación JWT
- `POST /post-jwt-login` - Login con JWT
- `POST /post-jwt-register` - Registro con JWT
- `POST /jwt-forget-pwd` - Olvidar contraseña JWT
- `POST /post-jwt-profile` - Perfil JWT

## ⚡ Uso Rápido

### Para cambiar de mock a API real:
1. Edita `.env.local`:
   ```env
   VITE_USE_MOCK_DATA=false
   VITE_API_BASE_URL=https://tu-servidor.com/api
   ```
2. Reinicia el servidor: `npm run dev`

### Para cambiar entorno completo:
```bash
# Desarrollo
npm run dev

# Staging  
npm run dev:staging

# Producción
npm run build:production
```

## 🛠️ Personalización

### Agregar nuevo endpoint:
1. **url_helper.jsx**: `export const NEW_ENDPOINT = "/new-endpoint";`
2. **fakebackend_helper.jsx**: `const newFunction = data => post(url.NEW_ENDPOINT, data);`
3. **authSlice.js**: Crear nuevo thunk si es necesario

### Cambiar timeout:
```env
VITE_API_TIMEOUT=15000  # 15 segundos
```

## 🔒 Seguridad

- ✅ Tokens JWT automáticos en headers
- ✅ Variables sensibles en `.env.local` (git ignored)
- ✅ Fallback a mock si API falla (solo desarrollo)
- ✅ Diferentes configuraciones por entorno