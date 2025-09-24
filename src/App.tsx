import React from "react";
import { Routes, Route } from "react-router-dom";
import { createSelector } from "reselect";
import { BackendServiceFactory, BackendType } from "@/services";
import { LayoutType } from "@/models/layout.types";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store";

// Initialize our new Authentication architecture
import { AuthServiceFactory } from "@/pages/Authentication";

// Import Routes all
import { authProtectedRoutes, publicRoutes } from "./routes/index";

// Import all middleware
import Authmiddleware from "./routes/route";

// layouts Format
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

// Import scss
import "./assets/scss/theme.scss";

// Initialize backend service (for non-auth modules like users, etc.)
const backendType = import.meta.env.VITE_APP_DEFAULTAUTH === 'fake'
  ? BackendType.FAKE
  : BackendType.REAL;

BackendServiceFactory.initialize({
  type: backendType,
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 10000,
});

// Note: Authentication now uses its own AuthHttpService via AuthServiceFactory
// No additional initialization needed - it's self-contained

const App: React.FC = () => {
  const LayoutProperties = createSelector(
    (state: RootState) => state.layout,
    (layout) => ({
      layoutType: layout.layoutType,
    })
  );

  const { layoutType } = useAppSelector(LayoutProperties);

  function getLayout(layoutType: LayoutType) {
    let layoutCls = VerticalLayout;
    switch (layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  }

  const Layout = getLayout(layoutType);

  return (
    <React.Fragment>
      <Routes>
        {publicRoutes.map((route, idx) => {
          const Component = route.component;
          return (
            <Route
              path={route.path}
              element={<NonAuthLayout><Component /></NonAuthLayout>}
              key={idx}
            />
          );
        })}

        {authProtectedRoutes.map((route, idx) => {
          const Component = route.component;
          return (
            <Route
              path={route.path}
              element={
                <Authmiddleware>
                  <Layout><Component /></Layout>
                </Authmiddleware>
              }
              key={idx}
            />
          );
        })}
      </Routes>
    </React.Fragment>
  );
};

export default App;
