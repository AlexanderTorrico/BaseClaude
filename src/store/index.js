import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import layoutReducer from './layoutSlice';
import usersReducer from './usersSlice';
import crudBasicReducer from '../modules/Components/Pages/CrudBasicResponsive/Hooks/crudBasicSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
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
          'auth/updateProfile/rejected'
        ],
        ignoredActionPaths: ['meta.arg', 'payload'],
        ignoredPaths: ['auth.error'],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
});

export default store;
