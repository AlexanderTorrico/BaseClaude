# Gestión de Roles y Permisos en Usuarios

Esta funcionalidad permite asignar **N roles** y/o **N permisos directos** a cada usuario del sistema.

## 📋 Características

### Asignación Flexible
- **N Roles por Usuario**: Un usuario puede tener múltiples roles asignados simultáneamente
- **N Permisos Directos**: Un usuario puede tener permisos específicos sin necesidad de un rol completo
- **Permisos Heredados**: Los permisos de los roles asignados se heredan automáticamente
- **Visualización Completa**: La tabla muestra roles y permisos de forma clara con tooltips informativos

### Interfaz de Usuario
- **Botón de Gestión**: Icono de escudo verde en cada fila de usuario
- **Modal con Tabs**: Interfaz dividida en "Roles" y "Permisos Directos"
- **Indicadores Visuales**: Badges que muestran cantidad de roles y permisos asignados
- **Tooltips Informativos**: Detalles al pasar el mouse sobre los badges

## 🎨 Componentes Creados

### 1. UserRolesPermissionsModal
**Ubicación**: `src/modules/Security/Users/components/UserRolesPermissionsModal.tsx`

Modal principal con dos pestañas:

#### Tab 1: Roles
- Lista de todos los roles activos disponibles
- Checkboxes para seleccionar múltiples roles
- Muestra cantidad de permisos que incluye cada rol
- Descripción de cada rol

#### Tab 2: Permisos Directos
- Permisos agrupados por módulo (Users, Roles, RRHH, Productos, etc.)
- Expandir/colapsar cada módulo
- Checkbox "Seleccionar todos" por módulo
- Indicador de permisos heredados de roles
- Indicador de permisos directos seleccionados

**Características especiales**:
- ✅ Tracking de cambios (muestra resumen antes de guardar)
- ✅ Permisos heredados marcados visualmente
- ✅ Validación de estado (permisos inactivos deshabilitados)
- ✅ Loading states durante guardado

### 2. Columnas de Tabla Actualizadas
**Ubicación**: `src/modules/Security/Users/config/tableColumns.tsx`

Se agregaron dos nuevas columnas:

#### Columna "Roles"
```tsx
- Badge con contador de roles
- Tooltip mostrando lista de roles asignados
- Estado "Sin roles" para usuarios sin asignación
```

#### Columna "Permisos"
```tsx
- Badge con contador total de permisos
- Tooltip con desglose:
  - Permisos directos
  - Permisos heredados
  - Total
- Estado "Sin permisos" para usuarios sin acceso
```

### 3. Datos Mock
**Ubicación**: `src/modules/Security/Users/data/mockUsersWithRoles.ts`

10 usuarios de ejemplo con diferentes configuraciones:

| Usuario | Roles | Permisos Directos | Caso de Uso |
|---------|-------|-------------------|-------------|
| Juan Carlos Pérez | Super Administrador | - | Usuario con todos los permisos |
| María Elena García | Gerente de RRHH | products.view | Rol + permisos adicionales |
| Pedro Antonio Rodríguez | Supervisor de Productos | - | Solo rol |
| Ana Sofía López | Empleado, Asistente RRHH | - | Múltiples roles |
| Carlos Enrique Fernández | Administrador de Seguridad | - | Rol específico |
| Laura Patricia Martínez | - | 3 permisos de productos | Solo permisos directos |
| Roberto Miguel Sánchez | Gerente General | - | Rol con muchos permisos |
| Carmen Rosa Gutiérrez | Empleado | - | Empleado básico |
| Diego Alejandro Torres | - | - | Sin acceso (nuevo ingreso) |
| Valeria Fernanda Morales | 2 roles | 2 permisos de RRHH | Mix de roles y permisos |

**Funciones helper incluidas**:
```typescript
getUserRoles(userId: number)           // Obtiene roles de un usuario
getUserPermissions(userId: number)      // Obtiene permisos directos
getUserAllPermissions(userId: number)   // Obtiene TODOS (heredados + directos)
getUserRoleStats()                      // Estadísticas generales
```

## 🔄 Flujo de Trabajo

### 1. Visualización en Tabla
```
Usuario ve la tabla de usuarios
└── Columna "Roles" muestra badge con contador
└── Columna "Permisos" muestra badge con contador
└── Tooltip con detalles al hover
```

### 2. Gestionar Accesos
```
Click en botón verde (shield-account) de la fila
└── Abre modal UserRolesPermissionsModal
    ├── Tab "Roles": Selecciona N roles
    │   └── Checkbox por cada rol activo
    │   └── Muestra descripción y cantidad de permisos
    │
    └── Tab "Permisos Directos": Selecciona N permisos
        ├── Agrupados por módulo
        ├── Expandir/colapsar módulo
        ├── Checkbox "todos" por módulo
        └── Indicador "Heredado" si viene de un rol
```

### 3. Guardar Cambios
```
Click en "Guardar Cambios"
└── Simula guardado (1.5s)
└── Muestra resumen de cambios en toast
└── Cierra modal
└── Recarga datos de tabla
```

## 📊 Modelo de Datos

### UserModel Extendido
```typescript
interface UserModel {
  // ... campos existentes

  // Nuevos campos para roles/permisos
  roleIds?: number[];              // IDs de roles asignados
  roles?: RoleModel[];             // Objetos completos de roles
  permissionIds?: number[];        // IDs de permisos directos
  permissions?: PermissionModel[]; // Objetos completos de permisos
}
```

### Estructura de Asignación
```
Usuario
├── Roles (N)
│   ├── Rol 1 → [Permiso 1, Permiso 2, Permiso 3]
│   └── Rol 2 → [Permiso 4, Permiso 5]
│
└── Permisos Directos (N)
    ├── Permiso 6
    └── Permiso 7

Total de permisos efectivos = Únicos(Rol1 + Rol2 + Directos)
```

## 🎯 Casos de Uso

### Caso 1: Usuario Solo con Roles
```
Usuario: Pedro Antonio Rodríguez
Roles: [Supervisor de Productos]
Permisos Directos: []
Permisos Efectivos: 4 (heredados del rol)
```

### Caso 2: Usuario Solo con Permisos Directos
```
Usuario: Laura Patricia Martínez
Roles: []
Permisos Directos: [products.view, products.create, products.update]
Permisos Efectivos: 3
```

### Caso 3: Usuario con Roles + Permisos
```
Usuario: María Elena García
Roles: [Gerente de RRHH]
Permisos Directos: [products.view]
Permisos Efectivos: 9 (8 heredados + 1 directo)
```

### Caso 4: Usuario con Múltiples Roles
```
Usuario: Ana Sofía López
Roles: [Empleado, Asistente de RRHH]
Permisos Directos: []
Permisos Efectivos: 7 (5 + 3, menos duplicados)
```

### Caso 5: Usuario Sin Acceso
```
Usuario: Diego Alejandro Torres
Roles: []
Permisos Directos: []
Permisos Efectivos: 0
Badge: "Sin roles" / "Sin permisos"
```

## 🔧 Integración con Backend

### Adapter Actualizado
El `userAdapter.ts` ahora mapea los campos de roles/permisos:

```typescript
adaptUserResponseToUserModel(apiUser) {
  return {
    // ... campos existentes
    roleIds: apiUser.roleIds || apiUser.role_ids || [],
    roles: apiUser.roles || [],
    permissionIds: apiUser.permissionIds || apiUser.permission_ids || [],
    permissions: apiUser.permissions || []
  };
}
```

### Formato Esperado de la API

**GET /users/{id}**
```json
{
  "id": 1,
  "name": "Juan",
  "lastName": "Pérez",
  "email": "juan@empresa.com",
  "roleIds": [1, 3],
  "roles": [
    {
      "id": 1,
      "name": "Super Administrador",
      "permissionIds": [1, 2, 3, ...]
    }
  ],
  "permissionIds": [5, 7],
  "permissions": [
    {
      "id": 5,
      "slug": "products.view",
      "name": "Ver productos"
    }
  ]
}
```

**PUT /users/{id}/roles-permissions**
```json
{
  "roleIds": [1, 3, 5],
  "permissionIds": [7, 9, 12]
}
```

## 🎨 Estilos y UX

### Colores por Tipo
- **Roles**: Badge azul (`color="primary"`) con icono `mdi-shield-crown`
- **Permisos**: Badge info (`color="info"`) con icono `mdi-key-variant`
- **Sin acceso**: Badge gris (`color="light"`) con texto muted
- **Heredado**: Badge secundario (`color="secondary"`)
- **Cambios**: Badge amarillo (`color="warning"`)

### Iconos Utilizados
- `mdi-shield-account`: Botón principal de gestión
- `mdi-shield-crown`: Roles
- `mdi-key-variant`: Permisos
- `mdi-chevron-up/down`: Expandir/colapsar módulos
- `mdi-loading mdi-spin`: Loading state
- `mdi-check`: Confirmar
- `mdi-alert-outline`: Alertas

### Estados Visuales
- **Hover en cards de roles**: Resalta con borde azul
- **Permisos heredados**: Badge gris con texto "Heredado"
- **Permisos inactivos**: Deshabilitados con badge rojo "Inactivo"
- **Cambios pendientes**: Alert amarillo con resumen

## 🧪 Testing

Para probar la funcionalidad:

1. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```

2. **Navegar al módulo Users** (configurar ruta en router si aún no existe)

3. **Ver tabla de usuarios**:
   - Observar columnas "Roles" y "Permisos"
   - Pasar mouse sobre badges para ver tooltips

4. **Gestionar accesos**:
   - Click en botón verde (shield-account)
   - Seleccionar roles en tab 1
   - Seleccionar permisos en tab 2
   - Observar cambios en resumen
   - Guardar y ver toast de confirmación

5. **Casos a probar**:
   - Usuario sin acceso → Asignar primer rol
   - Usuario con roles → Agregar permisos directos
   - Usuario con todo → Remover algunos accesos
   - Seleccionar/deseleccionar todos de un módulo
   - Verificar que permisos heredados no se puedan quitar desde tab de permisos

## 📝 Notas Técnicas

### Arquitectura UI-Only
Esta implementación sigue el enfoque **UI/UX only**:
- ✅ Todos los datos son mockeados
- ✅ No hay controllers, services ni Redux updates reales
- ✅ Simula delays de red (1.5s en guardado)
- ✅ Usa `useState` local para manejo de estado
- ✅ Toast notifications con react-toastify
- ✅ Compatible con módulo Roles existente

### Dependencias
Todas las dependencias ya existen en el proyecto:
- `reactstrap`: Componentes UI
- `react-toastify`: Notificaciones
- `classnames`: Clases condicionales
- `mdi`: Iconos Material Design

### Performance
- **Permisos agrupados por módulo**: Evita listas largas
- **Expandir/colapsar**: Solo renderiza módulos expandidos
- **Tooltips on-demand**: No afecta rendimiento de tabla
- **Memoización recomendada**: Si la lista de usuarios crece mucho

## 🚀 Próximos Pasos

1. **Conectar con backend real**: Reemplazar funciones mock en modal
2. **Agregar validaciones**: Roles mínimos requeridos, permisos dependientes
3. **Historial de cambios**: Log de asignaciones/revocaciones
4. **Búsqueda y filtros**: Filtrar usuarios por roles/permisos
5. **Exportación**: Reporte de accesos por usuario
6. **Tests unitarios**: Agregar en `__tests__/` siguiendo estructura existente

## 📚 Referencias

- [UserRolesPermissionsModal.tsx](./components/UserRolesPermissionsModal.tsx) - Componente principal
- [mockUsersWithRoles.ts](./data/mockUsersWithRoles.ts) - Datos de ejemplo
- [tableColumns.tsx](./config/tableColumns.tsx) - Configuración de columnas
- [UserModel.ts](./models/UserModel.ts) - Modelo extendido
- [userAdapter.ts](./adapters/userAdapter.ts) - Adapter actualizado

---

**Autor**: Generado con Claude Code
**Fecha**: 2025-10-16
**Versión**: 1.0.0
