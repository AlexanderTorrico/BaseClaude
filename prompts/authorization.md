# Sistema de Autorizacion - Roles y Permisos

Este documento describe el sistema de autorizacion del proyecto. Aplica a **todos los modulos**, no solo a usuarios.

---

## Resumen

El sistema implementa autorizacion basada en **Roles y Permisos**:
- **Roles:** Agrupan multiples permisos (ej: "Administrador", "Editor")
- **Permisos directos:** Asignables individualmente a usuarios
- **Herencia:** Los usuarios heredan permisos de sus roles
- **Proteccion de rutas:** Basada en permisos
- **Verificacion en componentes:** Control granular de UI

---

## 1. Como Verificar Permisos en Componentes

### Hook Principal: useUserPermissions

**Ubicacion:** `src/core/auth/hooks/useUserPermissions.ts`

```typescript
import { useUserPermissions } from '@/core/auth';
import { PRODUCT_PERMISSIONS } from '@/core/auth/constants/permissions';

const MyComponent = () => {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = useUserPermissions();

    return (
        <div>
            {/* Verificar UN permiso */}
            {hasPermission(PRODUCT_PERMISSIONS.EDIT) && (
                <Button>Editar</Button>
            )}

            {/* Verificar CUALQUIERA (OR) */}
            {hasAnyPermission([PRODUCT_PERMISSIONS.EDIT, PRODUCT_PERMISSIONS.DELETE]) && (
                <ActionsMenu />
            )}

            {/* Verificar TODOS (AND) */}
            {hasAllPermissions([PRODUCT_PERMISSIONS.SHOW, PRODUCT_PERMISSIONS.EDIT]) && (
                <FullAccessPanel />
            )}
        </div>
    );
};
```

### Metodos Disponibles

| Metodo | Parametros | Retorno | Descripcion |
|--------|------------|---------|-------------|
| `hasPermission` | `name: string` | `boolean` | Verifica un permiso |
| `hasAnyPermission` | `names: string[]` | `boolean` | Verifica si tiene al menos uno (OR) |
| `hasAllPermissions` | `names: string[]` | `boolean` | Verifica si tiene todos (AND) |
| `refreshPermissions` | - | `Promise<void>` | Recarga permisos del servidor |

---

## 2. Como Proteger Rutas

### ProtectedRoute Component

**Ubicacion:** `src/core/auth/components/ProtectedRoute.tsx`

```typescript
import { ProtectedRoute } from '@/core/auth';
import { PRODUCT_PERMISSIONS } from '@/core/auth/constants/permissions';

// En src/routes/index.tsx
const authProtectedRoutes = [
    {
        path: "/products",
        component: Products,
        permissions: [PRODUCT_PERMISSIONS.SHOW]  // Requiere este permiso
    },
    {
        path: "/products/edit/:id",
        component: ProductEdit,
        permissions: [PRODUCT_PERMISSIONS.EDIT]
    },
];
```

**Comportamiento:**
- Si el usuario NO tiene el permiso -> Redirige a `/dashboard`
- Si tiene el permiso -> Renderiza el componente

---

## 3. Constantes de Permisos

**Ubicacion:** `src/core/auth/constants/permissions.ts`

### Permisos Existentes

```typescript
// Usuarios
export const USER_PERMISSIONS = {
    SHOW: 'user.show',
    CREATE: 'user.create',
    EDIT: 'user.edit',
    DELETE: 'user.delete',
};

// Roles
export const ROLE_PERMISSIONS = {
    SHOW: 'role.show',
    CREATE: 'role.create',
    EDIT: 'role.edit',
};

// Permisos
export const PERMISSION_PERMISSIONS = {
    SHOW: 'permission.show',
    CREATE: 'permission.create',
    EDIT: 'permission.edit',
};

// Workstations
export const WORKSTATION_PERMISSIONS = {
    SHOW: 'workstation.show',
    CREATE: 'workstation.create',
    EDIT: 'workstation.edit',
};

// Empresa
export const COMPANY_PERMISSIONS = {
    SHOW: 'company.show',
    USER_MANAGEMENT: 'company.user_management',
};
```

### Como Agregar Nuevos Permisos

```typescript
// Agregar en src/core/auth/constants/permissions.ts

export const PRODUCT_PERMISSIONS = {
    SHOW: 'product.show',
    CREATE: 'product.create',
    EDIT: 'product.edit',
    DELETE: 'product.delete',
    EXPORT: 'product.export',        // Permisos personalizados
    IMPORT: 'product.import',
};

export const REPORT_PERMISSIONS = {
    SHOW: 'report.show',
    GENERATE: 'report.generate',
    DOWNLOAD: 'report.download',
};
```

**Convencion de nombres:** `modulo.accion`
- Ejemplos: `user.edit`, `product.delete`, `report.generate`

---

## 4. Herencia de Permisos

```
┌─────────────────────────────────────────┐
│               USUARIO                    │
│  - roleIds[] -> Hereda permisos de roles │
│  - permissionIds[] -> Permisos directos  │
└─────────────────────────────────────────┘
              │
              ├─── ROL "Admin" ────┬── user.show
              │                    ├── user.edit
              │                    └── user.delete
              │
              ├─── ROL "Editor" ───┬── product.show
              │                    └── product.edit
              │
              └─── Permiso directo: report.export
```

**Permisos finales del usuario:**
- user.show, user.edit, user.delete (de rol Admin)
- product.show, product.edit (de rol Editor)
- report.export (directo)

---

## 5. Modelos de Datos

### RoleModel
```typescript
interface RoleModel {
    id: number;
    name: string;
    detail: string;                    // Descripcion
    permissionIds?: number[];          // IDs de permisos
    permissions?: PermissionModel[];   // Permisos completos
}
```

### PermissionModel
```typescript
interface PermissionModel {
    id: number;
    name: string;                      // Ej: "user.edit"
    namePublic?: string;               // Nombre amigable para UI
    description?: string;
    gblModuleId?: number;              // ID del modulo
    module?: ModuleModel;              // Relacion con modulo
}
```

### ModuleModel
```typescript
interface ModuleModel {
    id: number;
    name: string;
    description?: string;
    icon?: string;
    path?: string;
}
```

---

## 6. Servicios API

### Endpoints de Roles

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/role-permission/roles` | Listar roles |
| POST | `/api/role-permission/roles` | Crear rol |
| PUT | `/api/role-permission/roles/{id}` | Actualizar rol |
| DELETE | `/api/role-permission/roles/{id}` | Eliminar rol |
| POST | `/api/role-permission/role-users/assign` | Asignar rol a usuario |
| POST | `/api/role-permission/role-users/remove` | Remover rol de usuario |

### Endpoints de Permisos

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/role-permission/permissions` | Listar permisos |
| POST | `/api/role-permission/permissions` | Crear permiso |
| POST | `/api/role-permission/permissions/user/{uuid}/assign` | Asignar permisos |
| POST | `/api/role-permission/permissions/user/{uuid}/remove` | Remover permisos |
| PUT | `/api/role-permission/permissions/user/{uuid}/sync` | Sincronizar (reemplazar) |
| GET | `/api/role-permission/permissions/user/{uuid}` | Obtener permisos usuario |

---

## 7. Componentes de UI para Gestion

### Modales de Asignacion

| Componente | Ubicacion | Proposito |
|------------|-----------|-----------|
| `UserRolesModal` | `modules/RRHH/Users/components/` | Asignar roles a usuario |
| `UserPermissionsModal` | `modules/RRHH/Users/components/` | Asignar permisos directos |
| `RoleFormModal` | `modules/RRHH/Roles/components/modals/` | Crear/editar rol |
| `PermissionFormModal` | `modules/RRHH/Permissions/components/modals/` | Crear permiso |

---

## 8. Hooks de Datos

### Hooks Sync (acceso a Redux)

| Hook | Ubicacion | Retorna |
|------|-----------|---------|
| `useRoles` | `modules/RRHH/Roles/hooks/` | roles, findRoleById, getTotal |
| `usePermissions` | `modules/RRHH/Permissions/hooks/` | permissions, findPermissionById |

### Hooks Async (operaciones CRUD)

| Hook | Ubicacion | Metodos |
|------|-----------|---------|
| `useRolesFetch` | `modules/RRHH/Roles/hooks/` | fetchAll, create, update, delete |
| `usePermissionsFetch` | `modules/RRHH/Permissions/hooks/` | fetchAll, create |

---

## 9. Guia Rapida de Implementacion

### Paso 1: Definir Constantes de Permisos

```typescript
// src/core/auth/constants/permissions.ts
export const INVOICE_PERMISSIONS = {
    SHOW: 'invoice.show',
    CREATE: 'invoice.create',
    EDIT: 'invoice.edit',
    DELETE: 'invoice.delete',
    VOID: 'invoice.void',           // Anular factura
    PRINT: 'invoice.print',         // Imprimir
};
```

### Paso 2: Proteger la Ruta

```typescript
// src/routes/index.tsx
import { INVOICE_PERMISSIONS } from '@/core/auth/constants/permissions';

{
    path: "/invoices",
    component: Invoices,
    permissions: [INVOICE_PERMISSIONS.SHOW]
}
```

### Paso 3: Verificar en Componentes

```typescript
import { useUserPermissions } from '@/core/auth';
import { INVOICE_PERMISSIONS } from '@/core/auth/constants/permissions';

const InvoiceActions = ({ invoiceId }) => {
    const { hasPermission } = useUserPermissions();

    return (
        <div className="d-flex gap-2">
            {hasPermission(INVOICE_PERMISSIONS.EDIT) && (
                <Button color="primary" onClick={() => edit(invoiceId)}>
                    <i className="mdi mdi-pencil me-1"></i>
                    Editar
                </Button>
            )}

            {hasPermission(INVOICE_PERMISSIONS.VOID) && (
                <Button color="warning" onClick={() => voidInvoice(invoiceId)}>
                    <i className="mdi mdi-cancel me-1"></i>
                    Anular
                </Button>
            )}

            {hasPermission(INVOICE_PERMISSIONS.DELETE) && (
                <Button color="danger" onClick={() => remove(invoiceId)}>
                    <i className="mdi mdi-trash-can me-1"></i>
                    Eliminar
                </Button>
            )}
        </div>
    );
};
```

### Paso 4: Verificar en Header/Toolbar

```typescript
const InvoiceHeader = ({ onCreate }) => {
    const { hasPermission } = useUserPermissions();

    return (
        <AzHeaderCardViews
            title="Facturas"
            contentTopRight={
                <>
                    {hasPermission(INVOICE_PERMISSIONS.CREATE) && (
                        <Button color="primary" onClick={onCreate}>
                            <i className="mdi mdi-plus me-1"></i>
                            Nueva Factura
                        </Button>
                    )}
                </>
            }
        />
    );
};
```

---

## 10. Estructura de Archivos

```
src/
├── core/auth/
│   ├── components/
│   │   └── ProtectedRoute.tsx         # Guardia de rutas
│   ├── hooks/
│   │   └── useUserPermissions.ts      # Hook principal
│   └── constants/
│       └── permissions.ts             # Constantes de permisos
│
├── modules/RRHH/
│   ├── Users/components/
│   │   ├── UserRolesModal.tsx         # Asignar roles
│   │   └── UserPermissionsModal.tsx   # Asignar permisos
│   │
│   ├── Roles/
│   │   ├── services/RoleApiService.ts
│   │   ├── hooks/useRoles.ts
│   │   └── hooks/useRolesFetch.ts
│   │
│   └── Permissions/
│       ├── services/PermissionApiService.ts
│       ├── hooks/usePermissions.ts
│       └── hooks/usePermissionsFetch.ts
│
└── routes/
    └── index.tsx                      # Rutas protegidas
```

---

## 11. Notas para IA

Cuando el usuario pida implementar funcionalidades con autorizacion:

1. **Verificar permisos existentes** en `src/core/auth/constants/permissions.ts`
2. **Si no existe el permiso**, agregarlo siguiendo el patron `MODULO_PERMISSIONS`
3. **Usar `useUserPermissions`** para verificar en componentes
4. **Usar `ProtectedRoute`** para proteger rutas completas
5. **Patron de nombres:** `modulo.accion` (ej: `invoice.void`, `report.export`)
6. **No hardcodear strings de permisos** - siempre usar las constantes

### Ejemplo Completo

```typescript
// 1. Agregar constante
export const ORDER_PERMISSIONS = {
    SHOW: 'order.show',
    CREATE: 'order.create',
    APPROVE: 'order.approve',
    CANCEL: 'order.cancel',
};

// 2. Proteger ruta
{ path: "/orders", component: Orders, permissions: [ORDER_PERMISSIONS.SHOW] }

// 3. Verificar en componente
const { hasPermission } = useUserPermissions();
{hasPermission(ORDER_PERMISSIONS.APPROVE) && <ApproveButton />}
```

---

## Documentacion Relacionada

- **Sistema de rutas:** `prompts/routing.md`
- **Crear nuevas paginas:** `prompts/create_page.md`
- **Configuracion de APIs:** `API_CONFIGURATION.md`

---

*Ultima actualizacion: Enero 2026*
