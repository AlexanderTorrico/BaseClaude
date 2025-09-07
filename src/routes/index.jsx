import React from "react";
import { Navigate } from "react-router-dom";

// // Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";

// // Dashboard
import Dashboard from "../pages/Dashboard/index";
import CrudBasic from "../pages/CrudBasic/index";
import CrudModern from "../pages/CrudModern/index";
import CrudV1 from "../pages/CrudV1/index";
import CrudV2 from "../pages/CrudV2/index";
import Atomo from "../modules/Components/Atomo/index";

import User from "../pages/security/user/index";

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/crud_basic", component: <CrudBasic /> },
  { path: "/crud_modern", component: <CrudModern /> },
  { path: "/crud_v1", component: <CrudV1 /> },
  { path: "/crud_v2", component: <CrudV2 /> },
  { path: "/atomo", component: <Atomo /> },

  //Security
  { path: "/security-user", component: <User /> },

  //   // this route should be at the end of all other routes
  //   // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
];

// export { authProtectedRoutes, publicRoutes };
export { authProtectedRoutes, publicRoutes }
