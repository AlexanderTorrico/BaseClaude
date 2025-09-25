// ==========================================
// USER SLICE - PURE REDUX TOOLKIT
// ==========================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser, LoginState } from '../models';

// Pure initial state - no external dependencies
const initialState: LoginState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  lastLogin: undefined
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action: PayloadAction<AuthUser>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
      state.lastLogin = new Date().toISOString();
    },

    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },

    // Logout actions
    logoutStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    logoutSuccess: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.lastLogin = undefined;
    },

    logoutFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      // Even if logout fails on server, clear local state
      state.isAuthenticated = false;
      state.user = null;
    },

    // Update user profile
    updateUserProfile: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Initialize user from data (pure action)
    initializeUser: (state, action: PayloadAction<{ user: AuthUser | null; lastLogin?: string }>) => {
      const { user, lastLogin } = action.payload;

      if (user && user.token) {
        state.user = user;
        state.isAuthenticated = true;
        state.lastLogin = lastLogin;
      } else {
        state.user = null;
        state.isAuthenticated = false;
        state.lastLogin = undefined;
      }
      state.loading = false;
      state.error = null;
    },

    // Reset state to initial (pure action)
    resetUserState: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
      state.lastLogin = undefined;
    }
  }
});

// Export actions
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
  updateUserProfile,
  clearError,
  setLoading,
  initializeUser,
  resetUserState
} = userSlice.actions;

// Selectors for easy state access - Compatible with RootState
export const selectUser = (state: any) => state.user?.user;
export const selectIsAuthenticated = (state: any) => state.user?.isAuthenticated || false;
export const selectIsLoading = (state: any) => state.user?.loading || false;
export const selectError = (state: any) => state.user?.error;
export const selectLastLogin = (state: any) => state.user?.lastLogin;

// Complex selectors
export const selectUserDisplayName = (state: any) => {
  const user = state.user?.user;
  if (!user) return 'Usuario';

  const firstName = user.name?.trim() || '';
  const lastName = user.lastName?.trim() || '';

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  return firstName || user.email || 'Usuario';
};

export const selectUserInitials = (state: any) => {
  const user = state.user?.user;
  if (!user) return 'U';

  const firstName = user.name?.trim() || '';
  const lastName = user.lastName?.trim() || '';

  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();

  if (firstInitial && lastInitial) {
    return `${firstInitial}${lastInitial}`;
  }

  if (firstInitial) {
    return firstInitial;
  }

  return user.email?.charAt(0).toUpperCase() || 'U';
};

export const selectIsUserActive = (state: any) => {
  const user = state.user?.user;
  return user?.status === 'active' || user?.status === 'activo';
};

// Export reducer
export default userSlice.reducer;