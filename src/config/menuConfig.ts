import { MenuConfig } from './types/MenuTypes';

export const menuConfig: MenuConfig = {
  version: "1.0",
  menus: [
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
      id: "section-azcomponent",
      type: "section",
      label: "Az Component",
      labelKey: "Az Component"
    },
    {
      id: "azcomponent-tutorial",
      type: "dropdown",
      label: "Tutoria",
      labelKey: "Tutoria",
      icon: "bx bx-user-circle",
      path: "/#",
      children: [
        {
          id: "tutorial-crud-modern",
          type: "link",
          label: "Crud Moderno",
          labelKey: "Crud Moderno",
          path: "/crud_modern"
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
        }
      ]
    },
    {
      id: "azcomponent-pages",
      type: "dropdown",
      label: "Pages",
      labelKey: "Pages",
      icon: "bx bx-user-circle",
      path: "/#",
      children: [
        {
          id: "pages-crud-basic-responsive",
          type: "link",
          label: "Crud basic responsive",
          labelKey: "Crud basic responsive",
          path: "/pages/crud-basic-responsive"
        }
      ]
    },
    // SEGURIDAD ══════════════════════════════════════════════════════════════════
    {
      id: "section-security",
      type: "section",
      label: "Seguridad",
      labelKey: "Seguridad"
    },
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


    

  ]
} as const;
