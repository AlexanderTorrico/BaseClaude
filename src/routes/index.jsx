import React from "react";
import { Navigate } from "react-router-dom";

// // Authentication related pages
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import UserProfile from "../pages/Authentication/user-profile";

// // Dashboard
import Dashboard from "../pages/Dashboard/index";
import CrudBasic from "../pages/CrudBasic/index";
import CrudModern from "../pages/CrudModern/index";
import CrudV1 from "../pages/CrudV1/index";
import CrudV2 from "../pages/CrudV2/index";
import Atomo from "../modules/Components/Atomo/index";

import User from "../pages/security/user/index";
import HeaderViewType from "../modules/Components/Molecules/HeaderViewType/index";
import Table from "../modules/Components/Molecules/Table/index";

import CrudBasicResponsive from "../modules/Components/Pages/CrudBasicResponsive/index";
import PageApi from "../modules/Components/PageApi/index";


const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/profile", component: <UserProfile /> },
  { path: "/crud_basic", component: <CrudBasic /> },
  { path: "/crud_modern", component: <CrudModern /> },
  { path: "/crud_v1", component: <CrudV1 /> },
  { path: "/crud_v2", component: <CrudV2 /> },
  { path: "/atomo", component: <Atomo /> },


  // Molecules
  { path: "/header_view_type", component: <HeaderViewType /> },
  { path: "/table", component: <Table /> },

  // Pages
  { path: "/pages/crud-basic-responsive", component: <CrudBasicResponsive /> },

  { path: "/page-api", component: <PageApi /> },
  //Security
  { path: "/security-user", component: <User /> },

  //   // this route should be at the end of all other routes
  //   // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
];

// export { authProtectedRoutes, publicRoutes };
export { authProtectedRoutes, publicRoutes }
