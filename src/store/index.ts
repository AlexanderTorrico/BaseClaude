import { configureStore } from '@reduxjs/toolkit';

// Use new Authentication module reducer instead of old authSlice
import { authReducer } from '@/pages/Authentication';
// Use new Login module user reducer for authenticated user state
import userReducer from '../pages/Login/slices/userSlice';
import layoutReducer from './layoutSlice';
import usersReducer from './usersSlice';
import crudBasicReducer from '../modules/Components/Pages/CrudBasicResponsive/Hooks/crudBasicSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    layout: layoutReducer,
    users: usersReducer,
    crudBasic: crudBasicReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'auth/loginUser/pending',
          'auth/loginUser/rejected',
          'auth/logoutUser/pending',
          'auth/socialLogin/pending',
          'auth/registerUser/rejected',
          'auth/forgotPassword/rejected',
          'auth/updateProfile/rejected',
          'user/loginStart',
          'user/loginSuccess',
          'user/loginFailure',
          'user/logoutStart',
          'user/logoutSuccess',
          'user/logoutFailure'
        ],
        ignoredActionPaths: ['meta.arg', 'payload'],
        ignoredPaths: ['auth.error', 'user.error', 'user.user'],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
