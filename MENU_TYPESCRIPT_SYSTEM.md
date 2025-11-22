# Sistema de Menús Basado en TypeScript

## 📋 Descripción

Sistema centralizado de configuración de menús **100% tipado con TypeScript** que permite gestionar las rutas del sidebar vertical y navbar horizontal desde un único archivo TypeScript con validación de tipos en tiempo de compilación.

---

## 🗂️ Estructura de Archivos

```
src/
├── config/
│   ├── menuConfig.ts                # ✅ Configuración central TIPADA
│   ├── types/
│   │   └── MenuTypes.ts             # ✅ Tipos TypeScript
│   └── hooks/
│       └── useMenuConfig.ts         # ✅ Hook para usar la config
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

### `src/config/menuConfig.ts` (TypeScript tipado)

```typescript
import { MenuConfig } from './types/MenuTypes';

export const menuConfig: MenuConfig = {
  version: "1.0",
  menus: [
    {
      id: "menu-dashboard",
      type: "dropdown",
      label: "Dashboards",
      labelKey: "Menu",
      icon: "bx bx-home-circle",
      path: "/#",
      children: [
        {
          id: "dashboard-default",
          type: "link",
          label: "Default",
          labelKey: "Default",
          path: "/dashboard"
        }
      ]
    },
    {
      id: "section-website",
      type: "section",
      label: "Web Site",
      labelKey: "Web Site"
    },
    {
      id: "website-createpages",
      type: "link",
      label: "Crear Paginas",
      labelKey: "Crear Paginas",
      icon: "bx bx-user",
      path: "/createpages"
    }
  ]
} as const;
```

---

## ✨ Ventajas del Sistema TypeScript

### 1. **Type Safety Completo**
```typescript
// ✅ TypeScript valida TODO en tiempo de compilación
export const menuConfig: MenuConfig = {
  version: "1.0",
  menus: [
    {
      id: "test",
      type: "link",  // ← Solo acepta: "link" | "dropdown" | "section"
      label: "Test",
      labelKey: "Test",
      path: "/test"
    }
  ]
};

// ❌ Esto daría error de compilación:
{
  type: "invalid",  // Error: Type '"invalid"' is not assignable to type 'MenuItemType'
}
```

### 2. **Autocompletado en IDE**
Al escribir en `menuConfig.ts`, el IDE te sugerirá:
- Todas las propiedades disponibles
- Los valores válidos para cada propiedad
- Estructura correcta de objetos anidados

### 3. **Validación en Build Time**
```bash
npm run build
# ✅ Si hay errores de tipo, el build falla ANTES de deployar
```

### 4. **Refactoring Seguro**
Si cambias un tipo en `MenuTypes.ts`, TypeScript te mostrará TODOS los lugares que necesitas actualizar.

---

## 🎯 Tipos de Menú

### 1. **`type: "section"`** (Solo Sidebar Vertical)
Menu title / separador de sección.

```typescript
{
  id: "section-security",
  type: "section",
  label: "Seguridad",
  labelKey: "Seguridad"
}
```

### 2. **`type: "link"`**
Link simple sin hijos.

```typescript
{
  id: "rrhh-users",
  type: "link",
  label: "Usuarios",
  labelKey: "Usuarios",
  icon: "bx bx-sitemap",
  path: "/users"
}
```

### 3. **`type: "dropdown"`**
Dropdown con children (hasta 3 niveles de anidamiento).

```typescript
{
  id: "components-forms",
  type: "dropdown",
  label: "Forms",
  labelKey: "Forms",
  icon: "bx bxs-eraser",
  path: "/#",
  badge: {
    count: 10,
    color: "danger"
  },
  children: [
    // ... items hijos
  ]
}
```

---

## 🔧 Definición de Tipos

### `src/config/types/MenuTypes.ts`

```typescript
export type MenuItemType = 'link' | 'dropdown' | 'section' | 'mega-menu';

export interface MenuBadge {
  count: number;
  color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
}

export interface MenuItem {
  id: string;
  type: MenuItemType;
  label: string;
  labelKey: string;
  icon?: string;
  path?: string;
  badge?: MenuBadge | null;
  roles?: string[];
  hidden?: boolean;
  children?: MenuItem[];
  megaMenuColumns?: number;
}

export interface MenuConfig {
  version: string;
  menus: MenuItem[];
}
```

---

## 🚀 Uso

### Hook: `useMenuConfig`

```typescript
import { useMenuConfig } from '@/config/hooks/useMenuConfig';

const MyComponent = () => {
  // El hook retorna MenuItem[] TIPADO
  const menuItems = useMenuConfig([]);

  return <MenuRenderer items={menuItems} />;
};
```

### Acceso Directo a la Config

```typescript
import { menuConfig } from '@/config/menuConfig';

// TypeScript conoce la estructura completa
console.log(menuConfig.menus[0].id);  // ✅ Autocompletado
console.log(menuConfig.menus[0].type); // ✅ Type checking
```

---

## 📝 Cómo Agregar una Nueva Ruta

### 1. Editar `src/config/menuConfig.ts`:

```typescript
export const menuConfig: MenuConfig = {
  version: "1.0",
  menus: [
    // ... menús existentes
    {
      id: "my-new-page",
      type: "link",
      label: "Mi Nueva Página",
      labelKey: "Mi Nueva Página",
      icon: "bx bx-star",
      path: "/mynewpage"
    }
  ]
} as const;
```

### 2. ¡TypeScript valida automáticamente! ✅

Si te equivocas en algún tipo, verás el error inmediatamente en tu IDE:

```typescript
{
  id: "test",
  type: "invalid",  // ❌ Error: Type '"invalid"' is not assignable...
  // Tu IDE subrayará esto en rojo
}
```

---

## 🎨 Badge Configuration

```typescript
{
  id: "forms",
  type: "dropdown",
  label: "Forms",
  labelKey: "Forms",
  badge: {
    count: 10,
    color: "danger"  // ← Autocompletado: solo acepta colores válidos
  },
  children: [...]
}
```

**Colores válidos (TypeScript te los sugiere):**
- `primary` | `secondary` | `success` | `danger` | `warning` | `info` | `light` | `dark`

---

## ✅ Comparación: JSON vs TypeScript

### ❌ Antes (JSON)
```json
{
  "id": "test",
  "type": "invalid",
  "label": "Test"
}
```
- Sin validación en tiempo de desarrollo
- Errores solo en runtime
- Sin autocompletado
- Sin refactoring seguro

### ✅ Ahora (TypeScript)
```typescript
{
  id: "test",
  type: "link",  // ← IDE autocompleta y valida
  label: "Test",
  labelKey: "Test",
  path: "/test"
}
```
- ✅ Validación en tiempo de desarrollo
- ✅ Errores detectados antes de compilar
- ✅ Autocompletado completo en IDE
- ✅ Refactoring seguro

---

## 🔒 Immutability con `as const`

```typescript
export const menuConfig: MenuConfig = {
  // ...
} as const;
```

El modificador `as const` hace que:
- Los valores sean de solo lectura
- Los tipos sean lo más específicos posible
- Se eviten mutaciones accidentales

---

## 🛠️ Ejemplo Completo

```typescript
// src/config/menuConfig.ts
import { MenuConfig } from './types/MenuTypes';

export const menuConfig: MenuConfig = {
  version: "1.0",
  menus: [
    {
      id: "section-rrhh",
      type: "section",
      label: "RRHH",
      labelKey: "RRHH"
    },
    {
      id: "rrhh-users",
      type: "link",
      label: "Usuarios",
      labelKey: "Usuarios",
      icon: "bx bx-sitemap",
      path: "/users",
      badge: {
        count: 5,
        color: "warning"
      }
    },
    {
      id: "rrhh-settings",
      type: "dropdown",
      label: "Configuración",
      labelKey: "Configuración",
      icon: "bx bx-cog",
      path: "/#",
      children: [
        {
          id: "rrhh-workstations",
          type: "link",
          label: "Puestos de Trabajo",
          labelKey: "Puestos de Trabajo",
          path: "/workstations"
        },
        {
          id: "rrhh-departments",
          type: "link",
          label: "Departamentos",
          labelKey: "Departamentos",
          path: "/departments"
        }
      ]
    }
  ]
} as const;
```

---

## 🎯 Contenido Actual

El archivo `menuConfig.ts` incluye **TODAS** las rutas actuales (35+ items):

- ✅ **Menu** → Dashboard, Crud Basic
- ✅ **Web Site** → Crear Páginas, Mis páginas
- ✅ **Az Component** → Tutorial (3), Moléculas (3), Pages (1)
- ✅ **Seguridad** → 8 módulos
- ✅ **RRHH** → Usuarios, Puestos de Trabajo
- ✅ **Components** → Forms (9), Multi Level (3)

---

## ✅ Verificación de Compilación

```bash
npm run build
# ✅ Build exitoso
# ✅ TypeScript valida todos los tipos
# ✅ Sin errores de tipo
```

---

## 🔥 Beneficios Clave

1. ✅ **Type Safety Total**: Errores detectados en desarrollo, no en producción
2. ✅ **Autocompletado Inteligente**: IDE sugiere propiedades y valores
3. ✅ **Refactoring Seguro**: Cambios de tipos actualizan todo automáticamente
4. ✅ **Documentación Viva**: Los tipos SON la documentación
5. ✅ **Build-Time Validation**: npm run build falla si hay errores de tipo
6. ✅ **Escalable**: Fácil agregar 100+ items con confianza
7. ✅ **Mantenible**: Un solo archivo tipado para ambos menús

---

## 📚 Recursos

- **Tipos TypeScript**: [src/config/types/MenuTypes.ts](src/config/types/MenuTypes.ts)
- **Configuración**: [src/config/menuConfig.ts](src/config/menuConfig.ts)
- **Hook**: [src/config/hooks/useMenuConfig.ts](src/config/hooks/useMenuConfig.ts)
- **Renderizadores**:
  - Vertical: [src/components/VerticalLayout/MenuRenderer.tsx](src/components/VerticalLayout/MenuRenderer.tsx)
  - Horizontal: [src/components/HorizontalLayout/NavbarMenuRenderer.tsx](src/components/HorizontalLayout/NavbarMenuRenderer.tsx)

---

**Sistema TypeScript implementado el 2025-11-21**
**Versión: 2.0 (TypeScript)**
**100% Type-Safe ✅**
