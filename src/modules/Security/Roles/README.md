# Módulo de Roles - UI/UX

## 📋 Descripción

Módulo de **Gestión de Roles** del sistema. Permite crear, editar, eliminar y gestionar roles, así como asignar permisos categorizados por módulos funcionales.

## 🎨 Características UI/UX

### ✅ Funcionalidades Implementadas

1. **CRUD Completo de Roles**
   - ✅ Crear nuevo rol
   - ✅ Editar rol existente
   - ✅ Eliminar rol (con validación de usuarios asignados)
   - ✅ Activar/Desactivar roles

2. **Gestión de Permisos Categorizados**
   - ✅ Vista de permisos agrupados por módulo (Users, Roles, RRHH, Productos, etc.)
   - ✅ Asignación masiva por módulo (select all)
   - ✅ Asignación individual de permisos
   - ✅ Indicadores visuales de permisos seleccionados
   - ✅ Tracking de cambios pendientes

3. **UI Avanzada**
   - ✅ Tabla con filtros y ordenamiento (AzTable + AzFilterSummary)
   - ✅ Badges informativos (permisos, usuarios, estado)
   - ✅ Modales con formularios validados (Formik + Yup)
   - ✅ Confirmaciones con SweetAlert2
   - ✅ Toasts de feedback (react-toastify)
   - ✅ Estados visuales: loading, empty, error
   - ✅ Responsive design

## 📁 Estructura de Archivos

```
src/modules/Security/Roles/
├── index.tsx                          # Módulo principal (abstracto)
├── models/                            # Interfaces TypeScript
│   ├── RoleModel.ts                   # Modelo de rol
│   └── PermissionModel.ts             # Modelo de permiso
├── data/                              # Datos mockeados
│   ├── mockRoles.ts                   # 8 roles de ejemplo
│   └── mockPermissions.ts             # 24 permisos categorizados
├── components/                        # Componentes UI
│   ├── Header.tsx                     # Header con badges y botones
│   ├── ContentTable.tsx               # Tabla de roles con acciones
│   ├── RoleFormModal.tsx              # Modal crear/editar rol
│   └── RolePermissionsModal.tsx       # Modal asignar permisos (categorizado)
├── config/                            # Configuración
│   └── tableColumns.tsx               # Columnas de AzTable
└── README.md                          # Este archivo
```

## 🎯 Componentes Principales

### 1. **Header.tsx**
Header del módulo con:
- Título y descripción
- Badge con total de roles activos/totales
- Botón "Actualizar" (simula reload)
- Botón "Nuevo Rol" (abre modal de creación)

### 2. **ContentTable.tsx**
Tabla principal con:
- **Columnas**: Rol, Descripción, Permisos, Usuarios, Estado, Fecha
- **Filtros**: Por nombre, descripción, estado
- **Ordenamiento**: Por cualquier columna
- **Acciones por fila**:
  - 🔑 Ver Permisos (abre RolePermissionsModal)
  - ✏️ Editar (abre RoleFormModal en modo edición)
  - ⚡ Activar/Desactivar
  - 🗑️ Eliminar (con confirmación)

### 3. **RoleFormModal.tsx**
Modal de formulario con:
- **Campos**:
  - Nombre del rol (requerido, 3-50 caracteres, solo letras)
  - Descripción (requerida, 10-200 caracteres)
  - Estado (switch: Activo/Inactivo)
- **Validación en tiempo real** con Formik + Yup
- **Contador de caracteres** en descripción
- **Info adicional** en modo edición (usuarios, permisos, fecha)

### 4. **RolePermissionsModal.tsx** ⭐ (Componente Estrella)
Modal avanzado para asignar permisos con:
- **Permisos agrupados por módulo**:
  - Users (6 permisos)
  - Roles (5 permisos)
  - Permissions (1 permiso)
  - RRHH (7 permisos)
  - Productos (5 permisos)
- **Funcionalidades**:
  - ✅ Selección masiva por módulo (checkbox de módulo)
  - ✅ Selección individual de permisos
  - ✅ Expandir/colapsar módulos
  - ✅ Contador de permisos seleccionados por módulo
  - ✅ Indicador de cambios pendientes (agregados/removidos)
  - ✅ Descripción completa de cada permiso
  - ✅ Slug del permiso (ej: `users.create`)

## 📊 Datos Mockeados

### Roles de Ejemplo (8)
1. **Super Administrador** - 24 permisos, 2 usuarios
2. **Gerente General** - 14 permisos, 5 usuarios
3. **Gerente de RRHH** - 8 permisos, 3 usuarios
4. **Supervisor de Productos** - 4 permisos, 8 usuarios
5. **Empleado** - 5 permisos, 45 usuarios
6. **Administrador de Seguridad** - 12 permisos, 2 usuarios
7. **Auditor** (inactivo) - 6 permisos, 0 usuarios
8. **Asistente de RRHH** - 3 permisos, 6 usuarios

### Permisos Categorizados (24)

#### 📦 Users (6 permisos)
- `users.view` - Ver Usuarios
- `users.create` - Crear Usuarios
- `users.edit` - Editar Usuarios
- `users.delete` - Eliminar Usuarios
- `users.assign_roles` - Asignar Roles a Usuarios
- `users.assign_permissions` - Asignar Permisos Directos

#### 🛡️ Roles (5 permisos)
- `roles.view` - Ver Roles
- `roles.create` - Crear Roles
- `roles.edit` - Editar Roles
- `roles.delete` - Eliminar Roles
- `roles.assign_permissions` - Asignar Permisos a Roles

#### 🔑 Permissions (1 permiso)
- `permissions.view` - Ver Permisos

#### 💼 RRHH (7 permisos)
- `rrhh.view_positions` - Ver Puestos de Trabajo
- `rrhh.create_positions` - Crear Puestos
- `rrhh.edit_positions` - Editar Puestos
- `rrhh.delete_positions` - Eliminar Puestos
- `rrhh.view_schedules` - Ver Horarios
- `rrhh.manage_schedules` - Gestionar Horarios
- `rrhh.assign_schedules` - Asignar Horarios

#### 📦 Productos (5 permisos)
- `products.view` - Ver Productos
- `products.create` - Crear Productos
- `products.edit` - Editar Productos
- `products.delete` - Eliminar Productos
- `products.manage_inventory` - Gestionar Inventario

## 🎨 Flujos de Usuario

### Flujo 1: Crear Nuevo Rol
1. Usuario hace clic en **"Nuevo Rol"** (Header)
2. Se abre `RoleFormModal` vacío
3. Usuario completa:
   - Nombre del rol
   - Descripción
   - Estado (activo por defecto)
4. Validaciones en tiempo real
5. Usuario hace clic en **"Crear Rol"**
6. Loading spinner (2s simulado)
7. Toast de éxito
8. Modal se cierra
9. Tabla se recarga con el nuevo rol

### Flujo 2: Asignar Permisos a Rol
1. Usuario hace clic en botón **"Ver Permisos"** 🔑 de una fila
2. Se abre `RolePermissionsModal`
3. Se muestran permisos agrupados por módulo
4. Permisos ya asignados aparecen marcados
5. Usuario puede:
   - Seleccionar todo un módulo (checkbox de módulo)
   - Seleccionar permisos individuales
   - Expandir/colapsar módulos
6. Se muestra alerta con cambios pendientes
7. Usuario hace clic en **"Guardar Cambios"**
8. Loading spinner (2s simulado)
9. Toast de éxito
10. Modal se cierra
11. Badge de permisos se actualiza en la tabla

### Flujo 3: Eliminar Rol
1. Usuario hace clic en botón **"Eliminar"** 🗑️ de una fila
2. **Validación**: Si el rol tiene usuarios asignados:
   - SweetAlert2 advierte que no se puede eliminar
   - Indica cuántos usuarios tienen el rol
3. Si no tiene usuarios:
   - SweetAlert2 pide confirmación
4. Si usuario confirma:
   - Loading simulado
   - Rol se remueve de la tabla
   - Toast de éxito

### Flujo 4: Editar Rol
1. Usuario hace clic en botón **"Editar"** ✏️ de una fila
2. Se abre `RoleFormModal` con datos pre-cargados
3. Usuario modifica campos
4. Validaciones en tiempo real
5. Usuario guarda
6. Loading spinner
7. Toast de éxito
8. Modal se cierra
9. Fila se actualiza en la tabla

## 🎨 Elementos Visuales

### Iconos (MDI)
- Rol: `mdi-shield-account`
- Permisos: `mdi-key-variant`
- Usuarios: `mdi-account-group`
- Crear: `mdi-plus-circle`
- Editar: `mdi-pencil`
- Eliminar: `mdi-trash-can`
- Activar/Desactivar: `mdi-power`
- Refresh: `mdi-refresh`
- Check: `mdi-check-circle`
- Close: `mdi-close-circle`

### Colores de Badges
- **Activo**: `success` (verde)
- **Inactivo**: `danger` (rojo)
- **Permisos**: `primary` (azul) / `info` / `success` según cantidad
- **Usuarios**: `secondary` / `info` / `primary` / `warning` según cantidad

### Estados Visuales
- **Loading**: Componente `<Loading />` del proyecto
- **Empty State**: Card con icono, mensaje y sugerencia
- **Error State**: Alert rojo con mensaje y botón reintentar

## 🔧 Uso del Módulo

### Importar y usar
```typescript
import Roles from '@/modules/Security/Roles';

// En tu router
<Route path="/security/roles" element={<Roles />} />
```

### Acceder a datos mockeados
```typescript
import { MOCK_ROLES, getRoleById, getActiveRoles } from '@/modules/Security/Roles/data/mockRoles';
import { MOCK_PERMISSIONS, groupPermissionsByModule } from '@/modules/Security/Roles/data/mockPermissions';

// Obtener rol por ID
const role = getRoleById(1);

// Obtener solo roles activos
const activeRoles = getActiveRoles();

// Obtener permisos agrupados
const permissionsByModule = groupPermissionsByModule();
```

## ⚙️ Configuración

### Agregar nuevos permisos
Edita `data/mockPermissions.ts` y agrega:
```typescript
{
  id: 25,
  slug: 'nuevo.permiso',
  name: 'Nuevo Permiso',
  module: 'NuevoModulo',
  description: 'Descripción del permiso',
  isActive: true,
  createdAt: '2024-01-10T08:00:00Z',
}
```

### Personalizar columnas de tabla
Edita `config/tableColumns.tsx` para modificar columnas.

## 🚀 Próximos Pasos

Cuando esté listo el backend:
1. Crear `controllers/RoleController.ts`
2. Crear `services/roleServices.ts`
3. Crear `adapters/roleAdapter.ts`
4. Crear `slices/rolesSlice.ts`
5. Reemplazar datos mockeados con llamadas reales
6. Conectar Redux state

## 📝 Notas Importantes

- ⚠️ Este módulo usa **datos mockeados exclusivamente**
- ⚠️ No hay Controllers, Services, Adapters ni Redux implementados
- ⚠️ Toda la lógica es visual con `useState` local
- ⚠️ Los cambios NO persisten al recargar la página
- ✅ Perfecto para demos, prototipos y desarrollo de UI

## 🎯 Integración Futura con Users

Este módulo está diseñado para integrarse con `Security/Users`:
- Los usuarios podrán tener múltiples roles asignados
- Los roles definen permisos que heredan los usuarios
- Los usuarios también podrán tener permisos directos

---

**Módulo creado:** 2025-01-XX
**Versión:** 1.0.0 (UI/UX Only)
**Status:** ✅ Completo y funcional
