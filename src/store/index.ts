import { configureStore } from '@reduxjs/toolkit';

// Import reducers
import layoutReducer from './layoutSlice';
import { authReducer } from '../pages/Authentication/index';
import { userReducer } from '../pages/Login/slices';
import { registerReducer } from '../pages/Register/index';
import crudBasicReducer from '../modules/Components/Pages/CrudBasicResponsive/Hooks/crudBasicSlice';
import securityUsersReducer from '../modules/Security/Users/slices/userSlice';
import rrhhUsersReducer from '../modules/RRHH/Users/slices/userSlice';
import companyReducer from '../modules/Security/Company/slices/companySlice';
import workStationsReducer from '../modules/RRHH/WorkStations/slices/workStationsSlice';
import mypagesReducer from '../modules/WebSites/MyPages/slices/mypagesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    register: registerReducer,
    layout: layoutReducer,
    crudBasic: crudBasicReducer,
    security_user: securityUsersReducer,
    users: rrhhUsersReducer,
    rrhh_workStation: workStationsReducer,
    company: companyReducer,
    mypages: mypagesReducer,
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
