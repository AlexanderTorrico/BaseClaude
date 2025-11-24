/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EJEMPLO DE USO: menuConfig.ts
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Este archivo muestra ejemplos de cómo agregar diferentes tipos de menús
 * con TOTAL TYPE SAFETY.
 *
 * ✅ TypeScript valida TODO en tiempo de compilación
 * ✅ Autocompletado completo en tu IDE
 * ✅ Errores detectados ANTES de compilar
 *
 * INSTRUCCIONES:
 * 1. Copia el código de ejemplo que necesites
 * 2. Pégalo en `menuConfig.ts` dentro del array `menus`
 * 3. ¡TypeScript te ayudará con el autocompletado!
 */

import { MenuConfig } from './types/MenuTypes';

// ═══════════════════════════════════════════════════════════════════════════
// EJEMPLO 1: Menu Section (Title/Separador)
// ═══════════════════════════════════════════════════════════════════════════
const exampleSection = {
  id: "section-my-area",
  type: "section" as const,  // ← Solo acepta: "link" | "dropdown" | "section"
  label: "Mi Área",
  labelKey: "Mi Área"
};

// ═══════════════════════════════════════════════════════════════════════════
// EJEMPLO 2: Simple Link (Sin hijos)
// ═══════════════════════════════════════════════════════════════════════════
const exampleLink = {
  id: "my-page",
  type: "link" as const,
  label: "Mi Página",
  labelKey: "Mi Página",
  icon: "bx bx-star",  // ← Iconos de Boxicons
  path: "/mypage"
};

// ═══════════════════════════════════════════════════════════════════════════
// EJEMPLO 3: Link con Badge
// ═══════════════════════════════════════════════════════════════════════════
const exampleLinkWithBadge = {
  id: "notifications",
  type: "link" as const,
  label: "Notificaciones",
  labelKey: "Notificaciones",
  icon: "bx bx-bell",
  path: "/notifications",
  badge: {
    count: 10,
    color: "danger" as const  // ← Autocompletado: primary | secondary | success | danger | warning | info | light | dark
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// EJEMPLO 4: Dropdown Simple (1 nivel)
// ═══════════════════════════════════════════════════════════════════════════
const exampleDropdown = {
  id: "my-dropdown",
  type: "dropdown" as const,
  label: "Mi Dropdown",
  labelKey: "Mi Dropdown",
  icon: "bx bx-folder",
  path: "/#",
  children: [
    {
      id: "child-1",
      type: "link" as const,
      label: "Opción 1",
      labelKey: "Opción 1",
      path: "/option1"
    },
    {
      id: "child-2",
      type: "link" as const,
      label: "Opción 2",
      labelKey: "Opción 2",
      path: "/option2"
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// EJEMPLO 5: Dropdown con Badge
// ═══════════════════════════════════════════════════════════════════════════
const exampleDropdownWithBadge = {
  id: "reports",
  type: "dropdown" as const,
  label: "Reportes",
  labelKey: "Reportes",
  icon: "bx bx-file",
  path: "/#",
  badge: {
    count: 3,
    color: "warning" as const
  },
  children: [
    {
      id: "report-sales",
      type: "link" as const,
      label: "Ventas",
      labelKey: "Ventas",
      path: "/reports/sales"
    },
    {
      id: "report-inventory",
      type: "link" as const,
      label: "Inventario",
      labelKey: "Inventario",
      path: "/reports/inventory"
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// EJEMPLO 6: Dropdown Multinivel (3 niveles)
// ═══════════════════════════════════════════════════════════════════════════
const exampleMultilevel = {
  id: "admin",
  type: "dropdown" as const,
  label: "Administración",
  labelKey: "Administración",
  icon: "bx bx-shield",
  path: "/#",
  children: [
    {
      id: "admin-users",
      type: "link" as const,
      label: "Usuarios",
      labelKey: "Usuarios",
      path: "/admin/users"
    },
    {
      id: "admin-settings",
      type: "dropdown" as const,  // ← Nivel 2
      label: "Configuración",
      labelKey: "Configuración",
      path: "/#",
      children: [
        {
          id: "settings-general",
          type: "link" as const,
          label: "General",
          labelKey: "General",
          path: "/admin/settings/general"
        },
        {
          id: "settings-advanced",
          type: "dropdown" as const,  // ← Nivel 3
          label: "Avanzado",
          labelKey: "Avanzado",
          path: "/#",
          children: [
            {
              id: "advanced-security",
              type: "link" as const,
              label: "Seguridad",
              labelKey: "Seguridad",
              path: "/admin/settings/advanced/security"
            }
          ]
        }
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// EJEMPLO 7: Menu con Roles (Preparado para futuro)
// ═══════════════════════════════════════════════════════════════════════════
const exampleWithRoles = {
  id: "admin-panel",
  type: "link" as const,
  label: "Panel Admin",
  labelKey: "Panel Admin",
  icon: "bx bx-cog",
  path: "/admin",
  roles: ["admin", "superadmin"]  // ← Solo usuarios con estos roles verán este item
};

// ═══════════════════════════════════════════════════════════════════════════
// EJEMPLO 8: Menu Oculto Temporalmente
// ═══════════════════════════════════════════════════════════════════════════
const exampleHidden = {
  id: "coming-soon",
  type: "link" as const,
  label: "Próximamente",
  labelKey: "Próximamente",
  icon: "bx bx-time",
  path: "/coming-soon",
  hidden: true  // ← Este item no se mostrará en el menú
};

// ═══════════════════════════════════════════════════════════════════════════
// EJEMPLO 9: Módulo Completo (Section + Links + Dropdown)
// ═══════════════════════════════════════════════════════════════════════════
const exampleCompleteModule = {
  // Primero la sección
  section: {
    id: "section-crm",
    type: "section" as const,
    label: "CRM",
    labelKey: "CRM"
  },
  // Luego los items
  items: [
    {
      id: "crm-dashboard",
      type: "link" as const,
      label: "Dashboard",
      labelKey: "Dashboard",
      icon: "bx bx-home",
      path: "/crm/dashboard"
    },
    {
      id: "crm-contacts",
      type: "link" as const,
      label: "Contactos",
      labelKey: "Contactos",
      icon: "bx bx-user",
      path: "/crm/contacts",
      badge: {
        count: 25,
        color: "info" as const
      }
    },
    {
      id: "crm-reports",
      type: "dropdown" as const,
      label: "Reportes",
      labelKey: "Reportes",
      icon: "bx bx-bar-chart",
      path: "/#",
      children: [
        {
          id: "crm-report-sales",
          type: "link" as const,
          label: "Ventas",
          labelKey: "Ventas",
          path: "/crm/reports/sales"
        },
        {
          id: "crm-report-leads",
          type: "link" as const,
          label: "Leads",
          labelKey: "Leads",
          path: "/crm/reports/leads"
        }
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// EJEMPLO 10: Configuración Completa de Ejemplo
// ═══════════════════════════════════════════════════════════════════════════
export const exampleMenuConfig: MenuConfig = {
  version: "1.0",
  menus: [
    // Section
    {
      id: "section-example",
      type: "section",
      label: "Ejemplos",
      labelKey: "Ejemplos"
    },
    // Simple Link
    {
      id: "example-link",
      type: "link",
      label: "Link Simple",
      labelKey: "Link Simple",
      icon: "bx bx-link",
      path: "/example"
    },
    // Link con Badge
    {
      id: "example-badge",
      type: "link",
      label: "Con Badge",
      labelKey: "Con Badge",
      icon: "bx bx-bell",
      path: "/badge",
      badge: {
        count: 5,
        color: "danger"
      }
    },
    // Dropdown
    {
      id: "example-dropdown",
      type: "dropdown",
      label: "Dropdown",
      labelKey: "Dropdown",
      icon: "bx bx-folder",
      path: "/#",
      children: [
        {
          id: "dropdown-child-1",
          type: "link",
          label: "Opción 1",
          labelKey: "Opción 1",
          path: "/dropdown/option1"
        },
        {
          id: "dropdown-child-2",
          type: "link",
          label: "Opción 2",
          labelKey: "Opción 2",
          path: "/dropdown/option2"
        }
      ]
    }
  ]
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CÓMO USAR EN menuConfig.ts
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 1. Abre: src/config/menuConfig.ts
 *
 * 2. En el array `menus`, agrega tu item:
 *
 *    export const menuConfig: MenuConfig = {
 *      version: "1.0",
 *      menus: [
 *        // ... items existentes
 *
 *        // ✅ Copia y pega cualquier ejemplo de arriba
 *        {
 *          id: "mi-nuevo-item",
 *          type: "link",  // ← Tu IDE te sugerirá los valores válidos
 *          label: "Mi Item",
 *          labelKey: "Mi Item",
 *          icon: "bx bx-star",  // ← Busca iconos en: https://boxicons.com/
 *          path: "/mi-ruta"
 *        }
 *      ]
 *    } as const;
 *
 * 3. ¡Listo! TypeScript valida todo automáticamente ✅
 */
