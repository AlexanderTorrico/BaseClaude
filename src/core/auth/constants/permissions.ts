/**
 * Constantes de permisos del sistema
 * 
 * Este archivo centraliza todos los nombres de permisos para:
 * - Evitar errores de tipeo
 * - Habilitar autocompletado del IDE
 * - Facilitar el mantenimiento
 * 
 * Los nombres deben coincidir exactamente con los del backend (gbl_permissions.name)
 */

// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO: COMPANY (gbl_module_id = 1)
// ═══════════════════════════════════════════════════════════════════════════
export const COMPANY_PERMISSIONS = {
    SHOW: 'company.show',
    USER_MANAGEMENT: 'company.user_management',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO: WEB SITES (gbl_module_id = 2)
// ═══════════════════════════════════════════════════════════════════════════
export const WEB_SITES_PERMISSIONS = {
    SHOW: 'web_sites.show',
    CREATE: 'web_sites.create',
    EDIT: 'web_sites.edit',
    DELETE: 'web_sites.delete',
    HOSTING: 'web_sites.hosting',
    DOMAIN: 'web_sites.domain',
    HOSTING_EDIT: 'web_sites.hosting_edit',
    DOMAIN_EDIT: 'web_sites.domain_edit',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO: MENU (gbl_module_id = 3)
// ═══════════════════════════════════════════════════════════════════════════
export const MENU_PERMISSIONS = {
    DISH_MANAGEMENT: 'menu.dish_management',
    CATEGORY_MANAGEMENT: 'menu.category_management',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO: VAULT (gbl_module_id = 4)
// ═══════════════════════════════════════════════════════════════════════════
export const VAULT_PERMISSIONS = {
    SHOW: 'vault.show',
    MANAGEMENT: 'vault.management',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO: USERS (gbl_module_id = 15)
// ═══════════════════════════════════════════════════════════════════════════
export const USER_PERMISSIONS = {
    SHOW: 'user.show',
    CREATE: 'user.create',
    EDIT: 'user.edit',
    DELETE: 'user.delete',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO: WORKSTATIONS (gbl_module_id = 16)
// ═══════════════════════════════════════════════════════════════════════════
export const WORKSTATION_PERMISSIONS = {
    SHOW: 'workstation.show',
    CREATE: 'workstation.create',
    EDIT: 'workstation.edit',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO: ROLES (gbl_module_id = 17)
// ═══════════════════════════════════════════════════════════════════════════
export const ROLE_PERMISSIONS = {
    SHOW: 'role.show',
    CREATE: 'role.create',
    EDIT: 'role.edit',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO: PERMISSIONS (gbl_module_id = 18)
// ═══════════════════════════════════════════════════════════════════════════
export const PERMISSION_PERMISSIONS = {
    SHOW: 'permission.show',
    CREATE: 'permission.create',
    EDIT: 'permission.edit',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO: ORDERS (gbl_module_id = 19)
// ═══════════════════════════════════════════════════════════════════════════
export const ORDERS_PERMISSIONS = {
    SHOW: 'orders.show',
    MANAGEMENT: 'orders.management',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO: ECOMMERCE (gbl_module_id = 20)
// ═══════════════════════════════════════════════════════════════════════════
export const ECOMMERCE_PERMISSIONS = {
    SHOW: 'ecommerce.show',
    MANAGEMENT: 'ecommerce.management',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO: RESERVATION (gbl_module_id = 21)
// ═══════════════════════════════════════════════════════════════════════════
export const RESERVATION_PERMISSIONS = {
    SHOW: 'reservation.show',
    MANAGEMENT: 'reservation.management',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO: PAYMENT (gbl_module_id = 22)
// ═══════════════════════════════════════════════════════════════════════════
export const PAYMENT_PERMISSIONS = {
    SHOW: 'payment.show',
    MANAGEMENT: 'payment.management',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO: INFORMATION (gbl_module_id = 23)
// ═══════════════════════════════════════════════════════════════════════════
export const INFORMATION_PERMISSIONS = {
    SHOW: 'information.show',
    MANAGEMENT: 'information.management',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTACIÓN AGRUPADA
// ═══════════════════════════════════════════════════════════════════════════
export const PERMISSIONS = {
    COMPANY: COMPANY_PERMISSIONS,
    WEB_SITES: WEB_SITES_PERMISSIONS,
    MENU: MENU_PERMISSIONS,
    VAULT: VAULT_PERMISSIONS,
    USER: USER_PERMISSIONS,
    WORKSTATION: WORKSTATION_PERMISSIONS,
    ROLE: ROLE_PERMISSIONS,
    PERMISSION: PERMISSION_PERMISSIONS,
    ORDERS: ORDERS_PERMISSIONS,
    ECOMMERCE: ECOMMERCE_PERMISSIONS,
    RESERVATION: RESERVATION_PERMISSIONS,
    PAYMENT: PAYMENT_PERMISSIONS,
    INFORMATION: INFORMATION_PERMISSIONS,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════════════════
type PermissionValues<T> = T[keyof T];
export type PermissionName = PermissionValues<typeof COMPANY_PERMISSIONS>
    | PermissionValues<typeof WEB_SITES_PERMISSIONS>
    | PermissionValues<typeof MENU_PERMISSIONS>
    | PermissionValues<typeof VAULT_PERMISSIONS>
    | PermissionValues<typeof USER_PERMISSIONS>
    | PermissionValues<typeof WORKSTATION_PERMISSIONS>
    | PermissionValues<typeof ROLE_PERMISSIONS>
    | PermissionValues<typeof PERMISSION_PERMISSIONS>
    | PermissionValues<typeof ORDERS_PERMISSIONS>
    | PermissionValues<typeof ECOMMERCE_PERMISSIONS>
    | PermissionValues<typeof RESERVATION_PERMISSIONS>
    | PermissionValues<typeof PAYMENT_PERMISSIONS>
    | PermissionValues<typeof INFORMATION_PERMISSIONS>;
