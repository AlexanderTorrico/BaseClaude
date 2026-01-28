import { Navigate } from "react-router-dom";
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

// // Authentication related pages
import { LoginPage } from "../pages/Login";
import { RegisterPage } from "../pages/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import UserProfile from "../pages/Authentication/user-profile";

import CrudModern from "../pages/CrudModern/index";
import Dashboard from "../pages/Dashboard";

import User from "../pages/security/user/index";
import HeaderViewType from "../modules/Components/Molecules/HeaderViewType/index";
import Table from "../modules/Components/Molecules/Table/index";
import FilterSumaryInfo from "../modules/Components/Molecules/FilterSumaryInfo/index";


// RRHH
import WorkStations from "../modules/RRHH/WorkStations/index";
import Users from "../modules/RRHH/Users/index";
import Roles from "../modules/RRHH/Roles/index";
import Permissions from "../modules/RRHH/Permissions/index";

// -------------------------------------------------------------
import Landing from "../pages/Landing/Landing";
import LegalTerms from "../pages/Landing/Links/LegalTerms";
import LegalPrivacy from "../pages/Landing/Links/LegalPrivacy";
import LegalCookies from "../pages/Landing/Links/LegalCookies";
import LegalAcceptableUse from "../pages/Landing/Links/LegalAcceptableUse";
import LegalLicense from "../pages/Landing/Links/LegalLicense";
import Information from "@/modules/Security/Information";
import PaymentGateway from "@/modules/Security/PaymentGateway";
import Reservation from "@/modules/Security/Reservation";
import Company from "@/modules/Security/Company";
import MyPages from "@/modules/WebSites/MyPages";
import CreatePage from "@/modules/WebSites/CreatePage";
import MyTemplatePages from "@/modules/WebSites/MyTemplatePages";
import AIContent from "@/modules/WebSites/AIContent";
import RubroDetail from "@/modules/WebSites/AIContent/RubroDetail";
import SectionViewer from "@/modules/WebSites/AIContent/SectionViewer";
import PageViewer from "@/modules/WebSites/Viewer";
import Vault from "@/modules/Security/Vault";
import Orders from "@/modules/Security/Orders";
import TableLayout from "@/modules/Reservation/TableLayout";
import Reservations from "@/modules/Reservation/Reservations";
import Ecommerce from "@/pages/ecommerce";
import Mysales from "@/modules/Payments/Mysales";
import Paymentmethods from "@/modules/Payments/Paymentmethods";
// -------------------------------------------------------------

interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
  permissions?: string[];  // Permisos requeridos para acceder a la ruta
}

const authProtectedRoutes: RouteConfig[] = [
  { path: "/dashboard", component: Dashboard },  // Dashboard principal
  { path: "/profile", component: UserProfile },
  { path: "/crud_modern", component: CrudModern },

  // Web site - permisos granulares
  { path: "/createpages", component: CreatePage, permissions: [WEB_SITES_PERMISSIONS.CREATE] },
  { path: "/mypages", component: MyPages, permissions: [WEB_SITES_PERMISSIONS.SHOW] },
  { path: "/mytemplates", component: MyTemplatePages, permissions: [WEB_SITES_PERMISSIONS.SHOW] },

  // AI Content - dentro de WebSites
  { path: "/websites/ai-content", component: AIContent, permissions: [WEB_SITES_PERMISSIONS.SHOW] },
  { path: "/websites/ai-content/:rubroId", component: RubroDetail, permissions: [WEB_SITES_PERMISSIONS.SHOW] },
  { path: "/websites/ai-content/:rubroId/template/:templatePageId", component: SectionViewer, permissions: [WEB_SITES_PERMISSIONS.SHOW] },
  // Web site - permisos granulares
  { path: "/paymentmethods", component: Paymentmethods, permissions: [WEB_SITES_PERMISSIONS.CREATE] },
  { path: "/mysales", component: Mysales, permissions: [WEB_SITES_PERMISSIONS.SHOW] },

  // Molecules (componentes de desarrollo - sin restricción por ahora)
  { path: "/header_view_type", component: HeaderViewType },
  { path: "/table", component: Table },
  { path: "/molecules/filter-sumary-info", component: FilterSumaryInfo },


  // Security - permisos granulares con .show
  { path: "/security-user", component: User },
  { path: "/reservation", component: Reservation, permissions: [RESERVATION_PERMISSIONS.SHOW] },
  { path: "/information", component: Information, permissions: [INFORMATION_PERMISSIONS.SHOW] },
  { path: "/company", component: Company, permissions: [COMPANY_PERMISSIONS.SHOW] },
  { path: "/paymentgateway", component: PaymentGateway, permissions: [PAYMENT_PERMISSIONS.SHOW] },
  { path: "/vault", component: Vault, permissions: [VAULT_PERMISSIONS.SHOW] },
  { path: "/orders", component: Orders, permissions: [ORDERS_PERMISSIONS.SHOW] },
  { path: "/ecommerce", component: Ecommerce, permissions: [ECOMMERCE_PERMISSIONS.SHOW] },

  // RRHH - permisos granulares con .show
  { path: "/users", component: Users, permissions: [USER_PERMISSIONS.SHOW] },
  { path: "/workstations", component: WorkStations, permissions: [WORKSTATION_PERMISSIONS.SHOW] },
  { path: "/roles", component: Roles, permissions: [ROLE_PERMISSIONS.SHOW] },
  { path: "/permissions", component: Permissions, permissions: [PERMISSION_PERMISSIONS.SHOW] },

  // RESERVATION - permisos granulares
  { path: "/tablelayout", component: TableLayout, permissions: [RESERVATION_PERMISSIONS.SHOW] },
  { path: "/reservations", component: Reservations, permissions: [RESERVATION_PERMISSIONS.SHOW] },

  //   // this route should be at the end of all other routes
  //   // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Navigate to="/dashboard" /> },
];

const publicRoutes: RouteConfig[] = [
  { path: "/viewer/:viewKey", component: PageViewer },
  { path: "/login", component: LoginPage },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: RegisterPage },
  { path: "/", component: Landing },
  { path: "/terms", component: LegalTerms },
  { path: "/privacy", component: LegalPrivacy },
  { path: "/cookies-policy", component: LegalCookies },
  { path: "/acceptable-use", component: LegalAcceptableUse },
  { path: "/license", component: LegalLicense },
];

export { authProtectedRoutes, publicRoutes };
export type { RouteConfig };
