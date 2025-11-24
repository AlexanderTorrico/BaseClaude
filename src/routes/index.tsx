import { Navigate } from "react-router-dom";

// // Authentication related pages
import { LoginPage } from "../pages/Login";
import { RegisterPage } from "../pages/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import UserProfile from "../pages/Authentication/user-profile";

// // Dashboard
import Dashboard from "../pages/Dashboard/index";
import CrudBasic from "../pages/CrudBasic/index";
import CrudModern from "../pages/CrudModern/index";
import CrudV1 from "../pages/CrudV1/index";
import CrudV2 from "../pages/CrudV2/index";

import User from "../pages/security/user/index";
import HeaderViewType from "../modules/Components/Molecules/HeaderViewType/index";
import Table from "../modules/Components/Molecules/Table/index";
import FilterSumaryInfo from "../modules/Components/Molecules/FilterSumaryInfo/index";

import CrudBasicResponsive from "../modules/Components/Pages/CrudBasicResponsive/index";
import PageApi from "../modules/Components/PageApi/index";

import UsersTest from "../modules/Security/Users/index";
import Roles from "../modules/Security/Roles/index";

// RRHH
import WorkStations from "../modules/RRHH/WorkStations/index";
import Users from "../modules/RRHH/Users/index";

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
import Vault from "@/modules/Security/Vault";
// -------------------------------------------------------------


const authProtectedRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/profile", component: UserProfile },
  { path: "/crud_basic", component: CrudBasic },
  { path: "/crud_modern", component: CrudModern },
  { path: "/crud_v1", component: CrudV1 },
  { path: "/crud_v2", component: CrudV2 },

  // Web site
  { path: "/createpages", component: CreatePage },
  { path: "/mypages", component: MyPages },

  // Molecules  
  { path: "/header_view_type", component: HeaderViewType },
  { path: "/table", component: Table },
  { path: "/molecules/filter-sumary-info", component: FilterSumaryInfo },

  // Pages
  { path: "/pages/crud-basic-responsive", component: CrudBasicResponsive },

  { path: "/page-api", component: PageApi },

  //Security
  { path: "/security-user", component: User },
  { path: "/users-test", component: UsersTest },
  { path: "/reservation", component: Reservation },
  { path: "/information", component: Information },
  { path: "/company", component: Company },
  { path: "/paymentgateway", component: PaymentGateway },
  { path: "/roles", component: Roles },
  { path: "/vault", component: Vault },

  // RRHH
  { path: "/users", component: Users },
  { path: "/workstations", component: WorkStations },

  //   // this route should be at the end of all other routes
  //   // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Navigate to="/dashboard" /> },
];

const publicRoutes = [
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

// export { authProtectedRoutes, publicRoutes };
export { authProtectedRoutes, publicRoutes }
