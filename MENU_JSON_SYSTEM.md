# Sistema de Menús Basado en JSON

## 📋 Descripción

Sistema centralizado de configuración de menús que permite gestionar las rutas del sidebar vertical y navbar horizontal desde un único archivo JSON.

---

## 🗂️ Estructura de Archivos

```
src/
├── config/
│   ├── menuConfig.json              # ✅ Configuración central de menús
│   ├── types/
│   │   └── MenuTypes.ts             # ✅ Tipos TypeScript
│   └── hooks/
│       └── useMenuConfig.ts         # ✅ Hook para leer el JSON
└── components/
    ├── VerticalLayout/
    │   ├── SidebarContent.tsx       # ✅ Refactorizado
    │   └── MenuRenderer.tsx         # ✅ Renderizador recursivo
    └── HorizontalLayout/
        ├── Navbar.tsx               # ✅ Refactorizado
        └── NavbarMenuRenderer.tsx   # ✅ Renderizador recursivo
```

---

## 📄 Archivo de Configuración

### `src/config/menuConfig.json`

```json
{
  "version": "1.0",
  "menus": [
    {
      "id": "menu-dashboard",
      "type": "dropdown",
      "label": "Dashboards",
      "labelKey": "Menu",
      "icon": "bx bx-home-circle",
      "path": "/#",
      "children": [...]
    },
    {
      "id": "section-website",
      "type": "section",
      "label": "Web Site",
      "labelKey": "Web Site"
    },
    {
      "id": "website-createpages",
      "type": "link",
      "label": "Crear Paginas",
      "labelKey": "Crear Paginas",
      "icon": "bx bx-user",
      "path": "/createpages"
    }
  ]
}
```

---

## 🎯 Tipos de Menú

### 1. **`type: "section"`** (Solo Sidebar Vertical)
Menu title / separador de sección.

```json
{
  "id": "section-security",
  "type": "section",
  "label": "Seguridad",
  "labelKey": "Seguridad"
}
```

### 2. **`type: "link"`**
Link simple sin hijos.

```json
{
  "id": "rrhh-users",
  "type": "link",
  "label": "Usuarios",
  "labelKey": "Usuarios",
  "icon": "bx bx-sitemap",
  "path": "/users"
}
```

### 3. **`type: "dropdown"`**
Dropdown con children (hasta 3 niveles de anidamiento).

```json
{
  "id": "components-forms",
  "type": "dropdown",
  "label": "Forms",
  "labelKey": "Forms",
  "icon": "bx bxs-eraser",
  "path": "/#",
  "badge": {
    "count": 10,
    "color": "danger"
  },
  "children": [...]
}
```

---

## 🔧 Propiedades del MenuItem

| Propiedad | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | `string` | ✅ | Identificador único del item |
| `type` | `MenuItemType` | ✅ | Tipo: `link`, `dropdown`, `section` |
| `label` | `string` | ✅ | Texto a mostrar |
| `labelKey` | `string` | ✅ | Key para i18n (props.t) |
| `icon` | `string` | ❌ | Clase de icono (ej: `bx bx-user`) |
| `path` | `string` | ❌ | Ruta del link |
| `badge` | `MenuBadge` | ❌ | Badge con count y color |
| `roles` | `string[]` | ❌ | Roles permitidos (futuro) |
| `hidden` | `boolean` | ❌ | Ocultar item |
| `children` | `MenuItem[]` | ❌ | Items hijos (para dropdown) |

---

## 🎨 Badge Configuration

```json
{
  "badge": {
    "count": 10,
    "color": "danger"
  }
}
```

**Colores disponibles:** `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`

---

## 🚀 Uso

### Hook: `useMenuConfig`

```typescript
import { useMenuConfig } from '@/config/hooks/useMenuConfig';

const MyComponent = () => {
  const menuItems = useMenuConfig([]); // Pasar roles del usuario (futuro)

  return <MenuRenderer items={menuItems} />;
};
```

### Filtrar por roles (preparado para futuro)

```typescript
const menuItems = useMenuConfig(['admin', 'user']);
```

Los items con `roles: ["admin"]` solo se mostrarán si el usuario tiene el rol "admin".

---

## ✅ Ventajas

1. ✅ **Centralizado**: Un solo archivo JSON para ambos layouts
2. ✅ **Type-safe**: Tipos TypeScript completos
3. ✅ **i18n ready**: Integrado con react-i18next
4. ✅ **Escalable**: Fácil agregar nuevas rutas
5. ✅ **Mantenible**: Cambios en un solo lugar
6. ✅ **Preparado para roles**: Sistema de permisos listo

---

## 📝 Cómo Agregar una Nueva Ruta

### 1. Editar `menuConfig.json`:

```json
{
  "id": "new-module",
  "type": "link",
  "label": "Nuevo Módulo",
  "labelKey": "Nuevo Módulo",
  "icon": "bx bx-star",
  "path": "/newmodule"
}
```

### 2. ¡Listo! ✅

El menú se actualizará automáticamente en:
- ✅ Sidebar Vertical (SidebarContent.tsx)
- ✅ Navbar Horizontal (Navbar.tsx)

---

## 🔄 Migración Completada

### Antes (Hardcoded):
```tsx
<li>
  <Link to="/users">
    <i className="bx bx-user"></i>
    <span>Usuarios</span>
  </Link>
</li>
```

### Después (JSON):
```json
{
  "id": "rrhh-users",
  "type": "link",
  "label": "Usuarios",
  "labelKey": "Usuarios",
  "icon": "bx bx-user",
  "path": "/users"
}
```

---

## 🎯 Contenido Actual del JSON

El archivo incluye **TODAS** las rutas actuales:

- ✅ **Menu** (Dashboard, Crud Basic)
- ✅ **Web Site** (Crear Páginas, Mis páginas)
- ✅ **Az Component** (Tutorial, Moléculas, Pages)
- ✅ **Seguridad** (8 módulos)
- ✅ **RRHH** (Usuarios, Puestos de Trabajo)
- ✅ **Components** (Forms, Multi Level)

Total: **~30 items de menú** configurados.

---

## 🛠️ Mantenimiento

### Agregar Badge a un Item:

```json
{
  "id": "security-users",
  "type": "link",
  "label": "Usuarios",
  "labelKey": "Usuarios",
  "icon": "bx bx-user",
  "path": "/users-test",
  "badge": {
    "count": 5,
    "color": "warning"
  }
}
```

### Crear Dropdown Multinivel:

```json
{
  "id": "parent",
  "type": "dropdown",
  "label": "Parent",
  "labelKey": "Parent",
  "path": "/#",
  "children": [
    {
      "id": "child-dropdown",
      "type": "dropdown",
      "label": "Child Dropdown",
      "labelKey": "Child Dropdown",
      "path": "/#",
      "children": [
        {
          "id": "grandchild",
          "type": "link",
          "label": "Grandchild",
          "labelKey": "Grandchild",
          "path": "/grandchild"
        }
      ]
    }
  ]
}
```

### Ocultar un Item Temporalmente:

```json
{
  "id": "temp-hidden",
  "type": "link",
  "label": "Hidden Item",
  "labelKey": "Hidden Item",
  "path": "/hidden",
  "hidden": true
}
```

---

## 📚 Recursos

- **Tipos TypeScript**: `src/config/types/MenuTypes.ts`
- **Hook**: `src/config/hooks/useMenuConfig.ts`
- **Configuración**: `src/config/menuConfig.json`
- **Renderizadores**:
  - Vertical: `src/components/VerticalLayout/MenuRenderer.tsx`
  - Horizontal: `src/components/HorizontalLayout/NavbarMenuRenderer.tsx`

---

## ✨ Compilación Verificada

```bash
npm run build
# ✅ Build exitoso - Sin errores
```

---

**Sistema implementado el 2025-11-21**
**Versión: 1.0**
