import { configureStore } from '@reduxjs/toolkit';

// Import reducers
import layoutReducer from './layoutSlice';
import { authReducer } from '../pages/Authentication/index';
import { userReducer } from '../pages/Login/slices';
import { registerReducer } from '../pages/Register/index';
// import crudBasicReducer from '../modules/Components/Pages/CrudBasicResponsive/Hooks/crudBasicSlice';
// import securityUsersReducer from '../modules/Security/Users/slices/userSlice';
import rrhhUsersReducer from '../modules/RRHH/Users/slices/userSlice';
import rrhhRolesReducer from '../modules/RRHH/Roles/slices/roleSlice';
import rrhhPermissionsReducer from '../modules/RRHH/Permissions/slices/permissionSlice';
import companyReducer from '../modules/Security/Company/slices/companySlice';
import workStationsReducer from '../modules/RRHH/WorkStations/slices/workStationsSlice';
import mypagesReducer from '../modules/WebSites/MyPages/slices/mypagesSlice';
import vaultReducer from '../modules/Security/Vault/slices/vaultSlice';
import tableLayoutReducer from '../modules/Reservation/TableLayout/slices/tablelayoutSlice';
import securityOrdersReducer from '../modules/Security/Orders/slices/orderSlice';
import ecommerceCartReducer from '../pages/ecommerce/slices/cartSlice';
import paymentmethodsReducer from '../modules/Payments/Paymentmethods/slices/paymentmethodsSlice';
import mysalesReducer from '../modules/Payments/Mysales/slices/mysalesSlice';
import paymentTestReducer from '../modules/Payments/PaymentTest/slices/paymentTestSlice';
import mytemplatepagesReducer from '../modules/WebSites/MyTemplatePages/slices/mytemplatepagesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    register: registerReducer,
    layout: layoutReducer,
    // crudBasic: crudBasicReducer,
    // security_user: securityUsersReducer,
    users: rrhhUsersReducer,
    roles: rrhhRolesReducer,
    permissions: rrhhPermissionsReducer,
    rrhh_workStation: workStationsReducer,
    company: companyReducer,
    mypages: mypagesReducer,
    vault: vaultReducer,
    reservation_tableLayout: tableLayoutReducer,
    security_orders: securityOrdersReducer,
    ecommerce_cart: ecommerceCartReducer,
    paymentmethods: paymentmethodsReducer,
    mysales: mysalesReducer,
    paymentTest: paymentTestReducer,
    mytemplatepages: mytemplatepagesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ['meta.arg', 'payload'],
        ignoredPaths: ['auth.error', 'user.error', 'user.user'],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
