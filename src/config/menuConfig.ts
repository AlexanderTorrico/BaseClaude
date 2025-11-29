import { MenuConfig } from './types/MenuTypes';

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
      icon: "bx bx-user-circle",
      path: "/#",
      children: [
        {
          id: "website-createpages",
          type: "link",
          label: "Crear Paginas",
          labelKey: "Crear Paginas",
          path: "/createpages"
        },
        {
          id: "website-mypages",
          type: "link",
          label: "Mis paginas",
          labelKey: "Mis paginas",
          path: "/mypages"
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
          path: "/users"
        },
        {
          id: "rrhh-workstations",
          type: "link",
          label: "Puestos de Trabajo",
          labelKey: "Puestos de Trabajo",
          path: "/workstations"
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
      icon: "bx bx-user-circle",
      path: "/reservation",
      children: [
        {
          id: "reservation-tablelayout",
          type: "link",
          label: "Disposicion de Mesas",
          labelKey: "Disposicion de Mesas",
          path: "/tablelayout"
        },
        {
          id: "reservation-reservations",
          type: "link",
          label: "Reservaciones",
          labelKey: "Reservaciones",
          path: "/reservations"
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
      path: "/orders"
    },

    // SEGURIDAD ══════════════════════════════════════════════════════════════════

    {
      id: "security-company",
      type: "link",
      label: "company",
      labelKey: "company",
      icon: "bx bx-user",
      path: "/company"
    },
    {
      id: "security-reservation",
      type: "link",
      label: "Reservation",
      labelKey: "Reservation",
      icon: "bx bx-user",
      path: "/reservation"
    },
    {
      id: "security-information",
      type: "link",
      label: "Information",
      labelKey: "Information",
      icon: "bx bx-user",
      path: "/information"
    },
    {
      id: "security-payment-gateway",
      type: "link",
      label: "Payment gateway",
      labelKey: "Payment gateway",
      icon: "bx bx-user",
      path: "/paymentgateway"
    },
    {
      id: "security-vault",
      type: "link",
      label: "Vault",
      labelKey: "Vault",
      icon: "bx bx-user",
      path: "/vault"
    },




  ]
} as const;
