import React from "react";
import { Routes, Route } from "react-router-dom";
import { createSelector } from "reselect";
import { BackendServiceFactory, BackendType } from "@/services";
import { LayoutType } from "@/models/layout.types";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store";

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

// Initialize backend service
const backendType = import.meta.env.VITE_APP_DEFAULTAUTH === 'fake'
  ? BackendType.FAKE
  : BackendType.REAL;

BackendServiceFactory.initialize({
  type: backendType,
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 10000,
});

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
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={<NonAuthLayout>{route.component}</NonAuthLayout>}
            key={idx}
          />
        ))}

        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <Authmiddleware>
                <Layout>{route.component}</Layout>
              </Authmiddleware>
            }
            key={idx}
          />
        ))}
      </Routes>
    </React.Fragment>
  );
};

export default App;
