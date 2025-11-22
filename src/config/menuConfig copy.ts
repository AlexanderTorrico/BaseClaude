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
        },
        {
          id: "dashboard-crud-basic",
          type: "link",
          label: "Crud Basic",
          labelKey: "Crud Basic",
          path: "/crud_basic"
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
    },
    {
      id: "website-mypages",
      type: "link",
      label: "Mis paginas",
      labelKey: "Mis paginas",
      icon: "bx bx-user",
      path: "/mypages"
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
        {
          id: "tutorial-crud-v1",
          type: "link",
          label: "CRUD V1",
          labelKey: "CRUD V1",
          path: "/crud_v1"
        },
        {
          id: "tutorial-crud-v2",
          type: "link",
          label: "CRUD V2",
          labelKey: "CRUD V2",
          path: "/crud_v2"
        }
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
    {
      id: "section-security",
      type: "section",
      label: "Seguridad",
      labelKey: "Seguridad"
    },
    {
      id: "security-users",
      type: "link",
      label: "Usuarios",
      labelKey: "Usuarios",
      icon: "bx bx-user",
      path: "/users-test"
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
    {
      id: "security-roles",
      type: "link",
      label: "Roles",
      labelKey: "Roles",
      icon: "bx bx-user",
      path: "/roles"
    },
    {
      id: "security-page-test",
      type: "link",
      label: "Page Test",
      labelKey: "Page Test",
      icon: "bx bx-user",
      path: "/test"
    },
    {
      id: "security-page-api",
      type: "link",
      label: "Page Api",
      labelKey: "Page Api",
      icon: "bx bx-calendar",
      path: "/page-api"
    },
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
      path: "/users"
    },
    {
      id: "rrhh-workstations",
      type: "link",
      label: "Puestos de Trabajo",
      labelKey: "Puestos de Trabajo",
      icon: "bx bx-sitemap",
      path: "/workstations"
    },
    {
      id: "section-components",
      type: "section",
      label: "Components",
      labelKey: "Components"
    },
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
        {
          id: "forms-elements",
          type: "link",
          label: "Form Elements",
          labelKey: "Form Elements",
          path: "#"
        },
        {
          id: "forms-layouts",
          type: "link",
          label: "Form Layouts",
          labelKey: "Form Layouts",
          path: "#"
        },
        {
          id: "forms-validation",
          type: "link",
          label: "Form Validation",
          labelKey: "Form Validation",
          path: "#"
        },
        {
          id: "forms-advanced",
          type: "link",
          label: "Form Advanced",
          labelKey: "Form Advanced",
          path: "#"
        },
        {
          id: "forms-editors",
          type: "link",
          label: "Form Editors",
          labelKey: "Form Editors",
          path: "#"
        },
        {
          id: "forms-file-upload",
          type: "link",
          label: "Form File Upload",
          labelKey: "Form File Upload",
          path: "#"
        },
        {
          id: "forms-repeater",
          type: "link",
          label: "Form Repeater",
          labelKey: "Form Repeater",
          path: "#"
        },
        {
          id: "forms-wizard",
          type: "link",
          label: "Form Wizard",
          labelKey: "Form Wizard",
          path: "#"
        },
        {
          id: "forms-mask",
          type: "link",
          label: "Form Mask",
          labelKey: "Form Mask",
          path: "#"
        }
      ]
    },
    {
      id: "components-multilevel",
      type: "dropdown",
      label: "Multi Level",
      labelKey: "Multi Level",
      icon: "bx bx-share-alt",
      path: "/#",
      children: [
        {
          id: "multilevel-1-1",
          type: "link",
          label: "Level 1.1",
          labelKey: "Level 1.1",
          path: "/#"
        },
        {
          id: "multilevel-1-2",
          type: "dropdown",
          label: "Level 1.2",
          labelKey: "Level 1.2",
          path: "/#",
          children: [
            {
              id: "multilevel-2-1",
              type: "link",
              label: "Level 2.1",
              labelKey: "Level 2.1",
              path: "/#"
            },
            {
              id: "multilevel-2-2",
              type: "link",
              label: "Level 2.2",
              labelKey: "Level 2.2",
              path: "/#"
            }
          ]
        }
      ]
    }
  ]
} as const;
