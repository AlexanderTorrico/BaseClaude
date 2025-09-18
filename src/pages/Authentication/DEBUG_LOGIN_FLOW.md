# 🔧 Debug del Flujo de Login

## 🧪 **Testing Checklist**

### 1. **Verificar en Consola del Navegador:**
Cuando hagas login, deberías ver estos logs:
```
🚀 Login successful! User: Alexander Torrico
📦 Token saved: 24|ioRyrQz...
🔄 Navigating to dashboard...
```

### 2. **Verificar en localStorage:**
Abre DevTools → Application → Local Storage:
```
authUser: {"id":1,"name":"Alexander","lastName":"Torrico",...}
authToken: "24|ioRyrQzN5RafDEKC6Z6juLKteOLRv4R8J8wMQZVW1b235a16"
```

### 3. **Verificar Flujo Completo:**

#### ✅ **Login Exitoso:**
1. Usuario ingresa credenciales
2. Clic en "Log In"
3. Botón cambia a "Logging in..."
4. Request POST a `http://127.0.0.1:8000/api/login`
5. Response 200 con estructura de tu API
6. Se guarda en localStorage
7. **🎯 Navegación automática a `/dashboard`**

#### ❌ **Login Fallido:**
1. Usuario ingresa credenciales incorrectas
2. Clic en "Log In"
3. Botón cambia a "Logging in..."
4. Request POST a `http://127.0.0.1:8000/api/login`
5. Response error (400/401)
6. Alert rojo con mensaje de error
7. **🔄 Se mantiene en `/login`**

### 4. **Verificar AuthMiddleware:**
Si todo funciona bien:
- Al ir a `/dashboard` después del login → ✅ Permitido
- Al ir a `/dashboard` sin login → ❌ Redirige a `/login`

## 🔍 **Debug Steps**

### Si NO navega al dashboard:

1. **Verificar Network Tab:**
   - ¿El request va a la URL correcta?
   - ¿La respuesta es 200?
   - ¿La estructura coincide con tu API?

2. **Verificar Console:**
   - ¿Aparecen los logs de éxito?
   - ¿Hay algún error en rojo?

3. **Verificar localStorage:**
   - ¿Se guardó `authUser`?
   - ¿Se guardó `authToken`?

4. **Verificar rutas:**
   - ¿Existe la ruta `/dashboard` en authProtectedRoutes?
   - ¿El componente Dashboard se importa correctamente?

## 🎯 **Expected Behavior**

```
[Login Page]
    ↓ (credenciales válidas + click "Log In")
[Loading State] ("Logging in...")
    ↓ (HTTP request success)
[Navigation] (automática)
    ↓
[Dashboard Page]
```

## 🚨 **Troubleshooting**

### Problema: "Se queda en login"
**Causa posible:** localStorage no se está guardando
**Solución:** Verificar que `authRepository.saveSession()` funciona

### Problema: "Navega pero vuelve a login"
**Causa posible:** Authmiddleware no encuentra `authUser` en localStorage
**Solución:** Verificar que el objeto se serializa correctamente

### Problema: "Error de red"
**Causa posible:** URL incorrecta o servidor no disponible
**Solución:** Verificar `VITE_API_BASE_URL` en `.env`

### Problema: "401 Unauthorized"
**Causa posible:** Credenciales incorrectas o endpoint wrong
**Solución:** Verificar que el endpoint sea `/login` no `/auth/login`