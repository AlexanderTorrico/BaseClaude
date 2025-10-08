import { configureStore } from '@reduxjs/toolkit';

// Import reducers
import layoutReducer from './layoutSlice';
import { authReducer } from '../pages/Authentication/index';
import { userReducer } from '../pages/Login/slices';
import { registerReducer } from '../pages/Register/index';
import crudBasicReducer from '../modules/Components/Pages/CrudBasicResponsive/Hooks/crudBasicSlice';
import usersReducer from '../modules/Security/Users/slices/usersSice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    register: registerReducer,
    layout: layoutReducer,
    crudBasic: crudBasicReducer,
    users: usersReducer,
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
