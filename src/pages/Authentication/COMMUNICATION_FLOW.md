# 🔄 Flujo de Comunicación - Login Completo

## 📊 **Estructura de tu API**

### **Request** (Login):
```typescript
POST http://127.0.0.1:8000/api/login
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

### **Response** (Tu API):
```json
{
  "status": 200,
  "message": "success",
  "data": {
    "access_token": "24|ioRyrQzN5RafDEKC6Z6juLKteOLRv4R8J8wMQZVW1b235a16",
    "modules": [
      {
        "id": 6,
        "name": "TECNOLOGIC",
        "path": "tecnologic",
        "icon": "bx bx-book-open",
        // ... más campos
      }
    ],
    "roles": [],
    "direct_permissions": [],
    "data": {
      "id": 1,
      "name": "Alexander",
      "last_name": "Torrico",
      "last_name_mother": "Torrico",
      "email": "admin@gmail.com",
      "privilege": "0",
      "phone": null,
      "logo": null,
      "language": "en",
      "status": 1
      // ... más campos de usuario
    }
  }
}
```

## 🔄 **Flujo de Comunicación Completo**

### **1. UI Layer** (`Login.tsx`)
```typescript
// Usuario hace clic en "Log In"
const { login, isLoading, error } = useLogin();

// Formik submission
onSubmit: async (values) => {
  clearError();
  await login(values.email, values.password, false);
}
```

### **2. Hook Layer** (`useLogin.ts`)
```typescript
const login = async (email, password, rememberMe) => {
  setIsLoading(true);

  // Crea el Use Case con callbacks
  const loginUseCase = AuthServiceFactory.createLoginUseCase(
    (user) => {
      handleSuccess(user);
      navigate('/dashboard'); // ✅ Redirección automática
    },
    handleError
  );

  // Ejecuta la lógica de negocio
  return await loginUseCase.execute(email, password, rememberMe);
};
```

### **3. Use Case Layer** (`LoginUseCase.ts`)
```typescript
async execute(email, password, rememberMe) {
  // Crea entidad de dominio
  const loginEntity = new LoginEntity(email, password, rememberMe);

  // Valida reglas de negocio
  if (!loginEntity.isValid()) {
    return LoginResult.failure(errors);
  }

  // Delega al repositorio
  const result = await authRepository.authenticate(loginEntity);

  if (result.isSuccess()) {
    const user = result.getUser();

    // Guarda sesión si "remember me"
    if (rememberMe) {
      await authRepository.saveSession(user);
    }

    // Ejecuta callback de éxito
    onSuccess?.(user);
  }

  return result;
}
```

### **4. Adapter Layer** (`AuthApiAdapter.ts`)
```typescript
async authenticate(login: LoginEntity) {
  // Valida entidad de dominio
  if (!login.isValid()) {
    return LoginResult.failure(errors);
  }

  // Llama al servicio HTTP
  const response = await authHttpService.login(login.toRequest());

  // Verifica respuesta
  if (response.status === 200 && response.data) {
    // Adapta respuesta a entidad de dominio
    const authUser = adaptResponseToAuthUser(response.data);
    return LoginResult.success(authUser);
  }

  return LoginResult.failure(response.message);
}

// Mapeo específico para tu API
private adaptResponseToAuthUser(responseData) {
  const userData = responseData.data; // data.data
  return new AuthUser(
    userData.id,                    // 1
    userData.name,                  // "Alexander"
    userData.last_name,             // "Torrico"
    userData.last_name_mother,      // "Torrico"
    userData.email,                 // "admin@gmail.com"
    userData.privilege,             // "0"
    userData.phone,                 // null
    userData.logo,                  // null
    userData.language,              // "en"
    userData.status,                // 1
    responseData.access_token,      // "24|ioRyrQzN..."
    responseData.modules || [],     // [{ id: 6, name: "TECNOLOGIC", ... }]
    responseData.roles || [],       // []
    responseData.direct_permissions || [] // []
  );
}
```

### **5. HTTP Service Layer** (`AuthHttpService.ts`)
```typescript
async login(credentials: LoginRequest) {
  return this.handleRequest(
    this.api.post('/login', credentials), // ✅ POST /login (no /auth/login)
    'Login'
  );
}

// Con interceptores automáticos:
// - Agrega Content-Type: application/json
// - Debug logging si VITE_DEBUG_API=true
// - Manejo de errores 401
```

### **6. Network Request**
```bash
# Request real enviado:
POST http://127.0.0.1:8000/api/login
Content-Type: application/json

{
  "email": "admin@gmail.com",
  "password": "123456",
  "rememberMe": false
}
```

## 📦 **Transformación de Datos**

### **API Response → Domain Entity**
```typescript
// Tu API Response:
{
  status: 200,
  data: {
    access_token: "24|ioRyrQzN...",
    data: {
      id: 1,
      name: "Alexander",
      last_name: "Torrico",
      email: "admin@gmail.com",
      privilege: "0",
      status: 1
    },
    modules: [...],
    roles: [],
    direct_permissions: []
  }
}

// ↓ Transformer ↓

// Domain Entity (AuthUser):
{
  id: 1,
  name: "Alexander",
  lastName: "Torrico",
  lastNameMother: "Torrico",
  email: "admin@gmail.com",
  privilege: "0",
  status: 1,
  token: "24|ioRyrQzN...",
  modules: [...],
  roles: [],
  permissions: []
}
```

## 🎯 **Estados UI en Tiempo Real**

```typescript
// Durante el login:
isLoading: true  → Botón muestra "Logging in..."
error: null      → No alert de error

// Si error:
isLoading: false
error: "Invalid credentials" → Alert rojo visible

// Si éxito:
isLoading: false
error: null
user: AuthUser   → Usuario autenticado
// + navigate('/dashboard') automático
```

## 🔧 **Configuración Debug**

Con `VITE_DEBUG_API=true` verás en consola:
```
🔧 AuthHttpService initialized with baseURL: http://127.0.0.1:8000/api
📤 Auth Request: { method: 'POST', url: '/login', data: {...} }
📥 Auth Response: { status: 200, data: {...} }
✅ Login successful: { user: AuthUser {...} }
```

## 🚀 **Resultado Final**

1. **✅ Usuario autenticado** → `AuthUser` con toda tu estructura
2. **✅ Token guardado** → `localStorage.setItem('authToken', token)`
3. **✅ Sesión persistente** → `localStorage.setItem('authUser', userData)`
4. **✅ Redirección automática** → `navigate('/dashboard')`
5. **✅ Estado global actualizado** → Redux store con usuario

**Todo el flujo maneja correctamente tu estructura API específica.**