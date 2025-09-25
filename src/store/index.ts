import { configureStore } from '@reduxjs/toolkit';

// Import modern modular reducers
import { authReducer } from '@/pages/Authentication';
import { userReducer } from '@/pages/Login';
import layoutReducer from './layoutSlice';
import usersReducer from './usersSlice';
import crudBasicReducer from '../modules/Components/Pages/CrudBasicResponsive/Hooks/crudBasicSlice';

export const store = configureStore({
  reducer: {
    // Authentication modules
    auth: authReducer,           // Registration, forgot password, etc.
    user: userReducer,           // Current logged user state

    // Application modules
    layout: layoutReducer,       // UI layout state
    users: usersReducer,         // Users CRUD operations
    crudBasic: crudBasicReducer, // Basic CRUD functionality
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in these actions
        ignoredActions: [
          // Auth module actions
          'auth/loginUser/pending',
          'auth/loginUser/rejected',
          'auth/logoutUser/pending',
          'auth/socialLogin/pending',
          'auth/registerUser/rejected',
          'auth/forgotPassword/rejected',
          'auth/updateProfile/rejected',
          // User module actions
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
