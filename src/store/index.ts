import { configureStore } from '@reduxjs/toolkit';

// Import reducers - usando rutas relativas
import usersReducer from './usersSlice';
import layoutReducer from './layoutSlice';

// Importar usando rutas relativas en lugar de alias
import { authReducer } from '../pages/Authentication/index';
import { userReducer } from '../pages/Login/index';
import { registerReducer } from '../pages/Register/index';
import crudBasicReducer from '../modules/Components/Pages/CrudBasicResponsive/Hooks/crudBasicSlice';

export const store = configureStore({
  reducer: {
    // Authentication modules
    auth: authReducer,           // Registration, forgot password, etc.
    user: userReducer,           // Current logged user state
    register: registerReducer,   // User registration state

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
          'user/logoutFailure',
          // Register module actions
          'register/registerStart',
          'register/registerSuccess',
          'register/registerFailure',
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
