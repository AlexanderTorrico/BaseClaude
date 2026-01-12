# Sistema de Rutas - Frontend

Este documento describe como funciona el sistema de routing en el proyecto React.

---

## 1. Estructura de Archivos

```
src/
├── routes/
│   ├── index.tsx              # Definicion de rutas (publicas + protegidas)
│   └── route.tsx              # Middleware de autenticacion (Authmiddleware)
├── App.tsx                    # Renderizado de rutas
├── main.tsx                   # Entry point con BrowserRouter
├── components/
│   ├── VerticalLayout/        # Layout con sidebar vertical
│   ├── HorizontalLayout/      # Layout con navbar horizontal
│   └── NonAuthLayout.tsx      # Layout para rutas publicas
└── core/auth/
    ├── components/
    │   └── ProtectedRoute.tsx # Proteccion por permisos
    └── constants/
        └── permissions.ts     # Constantes de permisos
```

---

## 2. Tipos de Rutas

### 2.1 Rutas Publicas

No requieren autenticacion. Usan `NonAuthLayout`.

```typescript
// src/routes/index.tsx
const publicRoutes: RouteConfig[] = [
    { path: "/login", component: LoginPage },
    { path: "/forgot-password", component: ForgetPwd },
    { path: "/register", component: RegisterPage },
    { path: "/", component: Landing },
    { path: "/terms", component: LegalTerms },
    { path: "/privacy", component: LegalPrivacy },
];
```

### 2.2 Rutas Protegidas (Solo Autenticacion)

Requieren login. Usan `VerticalLayout` o `HorizontalLayout`.

```typescript
const authProtectedRoutes: RouteConfig[] = [
    { path: "/dashboard", component: Dashboard },
    { path: "/profile", component: UserProfile },
];
```

### 2.3 Rutas Protegidas con Permisos

Requieren login + permisos especificos.

```typescript
import { USER_PERMISSIONS, ROLE_PERMISSIONS } from '@/core/auth';

const authProtectedRoutes: RouteConfig[] = [
    {
        path: "/users",
        component: Users,
        permissions: [USER_PERMISSIONS.SHOW]  // Requiere 'user.show'
    },
    {
        path: "/roles",
        component: Roles,
        permissions: [ROLE_PERMISSIONS.SHOW]  // Requiere 'role.show'
    },
];
```

---

## 3. Flujo de Acceso

```
Usuario accede a /users
        │
        ▼
┌───────────────────┐
│ ¿Tiene token?     │
└───────────────────┘
        │
   NO ──┴── SI
   │        │
   ▼        ▼
Redirect  ┌───────────────────┐
/login    │ ¿Ruta tiene       │
          │ permisos?         │
          └───────────────────┘
                  │
             NO ──┴── SI
             │        │
             ▼        ▼
          Renderiza  ┌───────────────────┐
          componente │ ¿Usuario tiene    │
                     │ permiso?          │
                     └───────────────────┘
                            │
                       NO ──┴── SI
                       │        │
                       ▼        ▼
                   Redirect  Renderiza
                   /dashboard componente
```

---

## 4. Como Agregar una Nueva Ruta

### Paso 1: Crear el Componente

```typescript
// src/modules/[AREA]/MiModulo/index.tsx
import React from 'react';
import { Container } from 'reactstrap';

const MiModulo: React.FC = () => {
    return (
        <div className="page-content">
            <Container fluid>
                {/* Contenido */}
            </Container>
        </div>
    );
};

export default MiModulo;
```

### Paso 2: Definir Permisos (si aplica)

```typescript
// src/core/auth/constants/permissions.ts
export const MI_MODULO_PERMISSIONS = {
    SHOW: 'mi_modulo.show',
    CREATE: 'mi_modulo.create',
    EDIT: 'mi_modulo.edit',
    DELETE: 'mi_modulo.delete',
};
```

### Paso 3: Registrar la Ruta

```typescript
// src/routes/index.tsx
import MiModulo from '@/modules/[AREA]/MiModulo';
import { MI_MODULO_PERMISSIONS } from '@/core/auth';

const authProtectedRoutes: RouteConfig[] = [
    // ... otras rutas
    {
        path: "/mi-modulo",
        component: MiModulo,
        permissions: [MI_MODULO_PERMISSIONS.SHOW]
    },
];
```

### Paso 4: Agregar al Menu (opcional)

```typescript
// src/config/menuConfig.ts o SidebarContent.tsx
{
    id: "mi-modulo",
    label: "Mi Modulo",
    icon: "mdi mdi-folder",
    link: "/mi-modulo",
}
```

---

## 5. Componentes del Sistema

### 5.1 Authmiddleware

**Ubicacion:** `src/routes/route.tsx`

Verifica si hay token de autenticacion.

```typescript
const Authmiddleware: React.FC<Props> = ({ children }) => {
    const isFakeAuth = import.meta.env.VITE_APP_DEFAULTAUTH === 'fake';

    if (!localStorage.getItem("authUser") && !isFakeAuth) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};
```

### 5.2 ProtectedRoute

**Ubicacion:** `src/core/auth/components/ProtectedRoute.tsx`

Verifica permisos especificos del usuario.

```typescript
interface ProtectedRouteProps {
    children: React.ReactNode;
    permissions?: string[];      // Permisos requeridos (OR logic)
    redirectTo?: string;         // Default: '/dashboard'
}
```

**Comportamiento:**
- Carga permisos del usuario desde API
- Muestra spinner mientras carga
- Si tiene AL MENOS UN permiso -> renderiza
- Si no tiene ninguno -> redirige a dashboard

### 5.3 Layouts

| Layout | Uso | Descripcion |
|--------|-----|-------------|
| `VerticalLayout` | Rutas protegidas | Sidebar izquierdo + header |
| `HorizontalLayout` | Rutas protegidas | Navbar horizontal + header |
| `NonAuthLayout` | Rutas publicas | Sin navegacion |

**Seleccion de layout:**
```typescript
// src/App.tsx
const { layoutType } = useAppSelector(state => state.layout);

function getLayout(layoutType: LayoutType) {
    switch (layoutType) {
        case "horizontal":
            return HorizontalLayout;
        default:
            return VerticalLayout;
    }
}
```

---

## 6. Interface de Configuracion

```typescript
interface RouteConfig {
    path: string;                    // Ruta URL (ej: "/users")
    component: React.ComponentType;  // Componente a renderizar
    exact?: boolean;                 // Match exacto (deprecated en v6)
    permissions?: string[];          // Permisos requeridos
}
```

---

## 7. Rutas Actuales del Sistema

### Rutas Publicas

| Path | Componente | Descripcion |
|------|------------|-------------|
| `/` | Landing | Pagina principal |
| `/login` | LoginPage | Inicio de sesion |
| `/register` | RegisterPage | Registro |
| `/forgot-password` | ForgetPwd | Recuperar contrasena |
| `/terms` | LegalTerms | Terminos y condiciones |
| `/privacy` | LegalPrivacy | Politica de privacidad |

### Rutas Protegidas (RRHH)

| Path | Componente | Permiso |
|------|------------|---------|
| `/dashboard` | Dashboard | - |
| `/profile` | UserProfile | - |
| `/users` | Users | `user.show` |
| `/roles` | Roles | `role.show` |
| `/permissions` | Permissions | `permission.show` |
| `/workstations` | WorkStations | `workstation.show` |

### Rutas Protegidas (Web Sites)

| Path | Componente | Permiso |
|------|------------|---------|
| `/mypages` | MyPages | `web_sites.show` |
| `/createpages` | CreatePage | `web_sites.create` |

---

## 8. Renderizado en App.tsx

```typescript
const App: React.FC = () => {
    const Layout = getLayout(layoutType);

    return (
        <Routes>
            {/* Rutas Publicas */}
            {publicRoutes.map((route, idx) => (
                <Route
                    key={idx}
                    path={route.path}
                    element={
                        <NonAuthLayout>
                            <route.component />
                        </NonAuthLayout>
                    }
                />
            ))}

            {/* Rutas Protegidas */}
            {authProtectedRoutes.map((route, idx) => (
                <Route
                    key={idx}
                    path={route.path}
                    element={
                        <Authmiddleware>
                            <Layout>
                                {route.permissions?.length ? (
                                    <ProtectedRoute permissions={route.permissions}>
                                        <route.component />
                                    </ProtectedRoute>
                                ) : (
                                    <route.component />
                                )}
                            </Layout>
                        </Authmiddleware>
                    }
                />
            ))}
        </Routes>
    );
};
```

---

## 9. Redirects

### Redirect sin Autenticacion

```typescript
// En Authmiddleware
if (!localStorage.getItem("authUser")) {
    return <Navigate to="/login" />;
}
```

### Redirect sin Permisos

```typescript
// En ProtectedRoute
if (!hasPermission) {
    return <Navigate to="/dashboard" replace />;
}
```

### Redirect desde Raiz

```typescript
// Si se accede a "/" estando autenticado
{ path: "/", component: () => <Navigate to="/dashboard" /> }
```

---

## 10. Notas para IA

Cuando se pida crear una nueva ruta:

1. **Crear el componente** en `src/modules/[AREA]/[Nombre]/`
2. **Definir permisos** en `src/core/auth/constants/permissions.ts` (si aplica)
3. **Registrar ruta** en `src/routes/index.tsx`
4. **Importar permisos** si la ruta es protegida
5. **Agregar al menu** en la configuracion de sidebar (si aplica)

### Ejemplo Completo

```typescript
// 1. Crear componente: src/modules/Sales/Orders/index.tsx

// 2. Definir permisos
export const ORDER_PERMISSIONS = {
    SHOW: 'order.show',
    CREATE: 'order.create',
};

// 3. Registrar ruta
import Orders from '@/modules/Sales/Orders';
import { ORDER_PERMISSIONS } from '@/core/auth';

const authProtectedRoutes = [
    {
        path: "/orders",
        component: Orders,
        permissions: [ORDER_PERMISSIONS.SHOW]
    },
];

// 4. Agregar al menu
{
    id: "orders",
    label: "Ordenes",
    icon: "mdi mdi-cart",
    link: "/orders",
}
```

---

## Documentacion Relacionada

- **Crear nuevas paginas:** `prompts/create_page.md`
- **Sistema de autorizacion:** `prompts/authorization.md`
- **Configuracion de APIs:** `API_CONFIGURATION.md`

---

*Ultima actualizacion: Enero 2026*
