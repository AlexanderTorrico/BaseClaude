import { MenuConfig } from './types/MenuTypes';
import {
  WEB_SITES_PERMISSIONS,
  USER_PERMISSIONS,
  WORKSTATION_PERMISSIONS,
  ROLE_PERMISSIONS,
  PERMISSION_PERMISSIONS,
  RESERVATION_PERMISSIONS,
  ORDERS_PERMISSIONS,
  ECOMMERCE_PERMISSIONS,
  COMPANY_PERMISSIONS,
  INFORMATION_PERMISSIONS,
  PAYMENT_PERMISSIONS,
  VAULT_PERMISSIONS
} from '@/core/auth';

export const menuConfig: MenuConfig = {
  version: "1.0",
  menus: [
    {
      id: "section-security",
      type: "section",
      label: "Seguridad",
      labelKey: "Secciones"
    },
    // PÁGINAS WEB ═══════════════════════════════════════════════════════════════════
    {
      id: "design-website",
      type: "dropdown",
      label: "Paginas Web",
      labelKey: "Paginas Web",
      icon: "bx bx-world",
      path: "/#",
      children: [
        {
          id: "website-createpages",
          type: "link",
          label: "Crear Paginas",
          labelKey: "Crear Paginas",
          path: "/createpages",
          permissions: [WEB_SITES_PERMISSIONS.CREATE]
        },
        {
          id: "website-mypages",
          type: "link",
          label: "Mis paginas",
          labelKey: "Mis paginas",
          path: "/mypages",
          permissions: [WEB_SITES_PERMISSIONS.SHOW]
        },
      ]
    },
    // Cobros ═══════════════════════════════════════════════════════════════════
    {
      id: "section-payments",
      type: "dropdown",
      label: "Cobros",
      labelKey: "Cobros",
      icon: "bx bx-coins",
      path: "/#",
      children: [
        {
          id: "payments-paymentMethods",
          type: "link",
          label: "Métodos de cobro",
          labelKey: "Métodos de cobro",
          path: "/paymentmethods",
          permissions: [WEB_SITES_PERMISSIONS.CREATE]
        },
        {
          id: "payments-mySales",
          type: "link",
          label: "Mis ventas",
          labelKey: "Mis ventas",
          path: "/mysales",
          permissions: [WEB_SITES_PERMISSIONS.SHOW]
        },
        {
          id: "payments-test",
          type: "link",
          label: "Pruebas de Pago",
          labelKey: "Pruebas de Pago",
          path: "/payment-test",
          permissions: [WEB_SITES_PERMISSIONS.SHOW]
        },
      ]
    },

    // RRHH ═══════════════════════════════════════════════════════════════════════════

    {
      id: "section-rrhh",
      type: "dropdown",
      label: "RRHH",
      labelKey: "RRHH",
      icon: "bx bx-sitemap",
      path: "/#",
      children: [
        {
          id: "rrhh-users",
          type: "link",
          label: "Usuarios",
          labelKey: "Usuarios",
          path: "/users",
          permissions: [USER_PERMISSIONS.SHOW]
        },
        {
          id: "rrhh-workstations",
          type: "link",
          label: "Puestos de Trabajo",
          labelKey: "Puestos de Trabajo",
          path: "/workstations",
          permissions: [WORKSTATION_PERMISSIONS.SHOW]
        },
        {
          id: "rrhh-roles",
          type: "link",
          label: "Roles",
          labelKey: "Roles",
          path: "/roles",
          permissions: [ROLE_PERMISSIONS.SHOW]
        },
        {
          id: "rrhh-permissions",
          type: "link",
          label: "Permisos",
          labelKey: "Permisos",
          path: "/permissions",
          permissions: [PERMISSION_PERMISSIONS.SHOW]
        },
      ]
    },

    {
      id: "azcomponent-molecules",
      type: "dropdown",
      label: "Moleculas",
      labelKey: "Moleculas",
      icon: "bx bx-user-circle",
      path: "/#",
      hidden: true,  // Oculto - solo para desarrollo
      children: [
        {
          id: "molecules-headers",
          type: "link",
          label: "Headers",
          labelKey: "Headers",
          path: "/header_view_type"
        },
        {
          id: "molecules-table",
          type: "link",
          label: "Table",
          labelKey: "Table",
          path: "/table"
        },
        {
          id: "molecules-filter-summary",
          type: "link",
          label: "Filter Sumary Info",
          labelKey: "Filter Sumary Info",
          path: "/molecules/filter-sumary-info"
        },
        {
          id: "tutorial-crud-modern",
          type: "link",
          label: "Crud Moderno",
          labelKey: "Crud Moderno",
          path: "/crud_modern"
        },
      ]
    },

    // RESERVA ═══════════════════════════════════════════════════════════════════
    {
      id: "section-reservation",
      type: "dropdown",
      label: "Reservacion",
      labelKey: "Reservacion",
      icon: "bx bx-calendar",
      path: "/#",
      children: [
        {
          id: "reservation-tablelayout",
          type: "link",
          label: "Disposicion de Mesas",
          labelKey: "Disposicion de Mesas",
          path: "/tablelayout",
          permissions: [RESERVATION_PERMISSIONS.SHOW]
        },
        {
          id: "reservation-reservations",
          type: "link",
          label: "Reservaciones",
          labelKey: "Reservaciones",
          path: "/reservations",
          permissions: [RESERVATION_PERMISSIONS.SHOW]
        }
      ]
    },
    // ORDENES ═══════════════════════════════════════════════════════════════════

    {
      id: "security-orders",
      type: "link",
      label: "Pedidos Web",
      labelKey: "Pedidos Web",
      icon: "bx bx-package",
      path: "/orders",
      permissions: [ORDERS_PERMISSIONS.SHOW]
    },

    // E-COMMERCE ═════════════════════════════════════════════════════════════════

    {
      id: "security-ecommerce",
      type: "link",
      label: "E-commerce",
      labelKey: "E-commerce",
      icon: "bx bx-store",
      path: "/ecommerce",
      permissions: [ECOMMERCE_PERMISSIONS.SHOW]
    },

    // SEGURIDAD ══════════════════════════════════════════════════════════════════

    {
      id: "security-company",
      type: "link",
      label: "Company",
      labelKey: "Company",
      icon: "bx bx-buildings",
      path: "/company",
      permissions: [COMPANY_PERMISSIONS.SHOW]
    },
    {
      id: "security-reservation",
      type: "link",
      label: "Reservation",
      labelKey: "Reservation",
      icon: "bx bx-calendar-check",
      path: "/reservation",
      permissions: [RESERVATION_PERMISSIONS.SHOW]
    },
    {
      id: "security-information",
      type: "link",
      label: "Information",
      labelKey: "Information",
      icon: "bx bx-info-circle",
      path: "/information",
      permissions: [INFORMATION_PERMISSIONS.SHOW]
    },
    {
      id: "security-payment-gateway",
      type: "link",
      label: "Payment gateway",
      labelKey: "Payment gateway",
      icon: "bx bx-credit-card",
      path: "/paymentgateway",
      permissions: [PAYMENT_PERMISSIONS.SHOW]
    },
    {
      id: "security-vault",
      type: "link",
      label: "Vault",
      labelKey: "Vault",
      icon: "bx bx-lock-alt",
      path: "/vault",
      permissions: [VAULT_PERMISSIONS.SHOW]
    },
  ]
};
