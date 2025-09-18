// ==========================================
// AUTHENTICATION REDUX SLICE
// ==========================================

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginRequest, RegisterRequest, AuthResponse } from '../models';
import { AuthServiceFactory } from '../services';

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  registrationSuccess: false,
  registrationError: null,
  forgetSuccessMsg: null,
  forgetError: null,
  profileSuccess: null,
  profileError: null,
};

// ==========================================
// ASYNC THUNKS
// ==========================================

// Login thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ user, history }: { user: LoginRequest; history: (path: string) => void }, { rejectWithValue }) => {
    try {
      const loginUseCase = AuthServiceFactory.createLoginUseCase();
      const result = await loginUseCase.execute(user.email, user.password, user.rememberMe);

      if (result.isSuccess()) {
        const authUser = result.getUser();
        history('/dashboard');
        return authUser.toPersistence();
      }

      throw new Error(result.getError());
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Register thunk
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ user }: { user: RegisterRequest }, { rejectWithValue }) => {
    try {
      const registerUseCase = AuthServiceFactory.createRegisterUseCase();
      const result = await registerUseCase.execute(
        user.name,
        user.email,
        user.password,
        user.confirmPassword
      );

      if (result.isSuccess()) {
        const authUser = result.getUser();
        return authUser.toPersistence();
      }

      throw new Error(result.getError());
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Forgot password thunk
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ user }: { user: { email: string } }, { rejectWithValue }) => {
    try {
      const forgotPasswordUseCase = AuthServiceFactory.createForgotPasswordUseCase();
      const result = await forgotPasswordUseCase.execute(user.email);

      if (result.success) {
        return result.message || 'Reset link sent to your mailbox';
      }

      throw new Error(result.message || 'Failed to send reset email');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send reset email');
    }
  }
);

// Logout thunk
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async ({ history }: { history: (path: string) => void }, { rejectWithValue }) => {
    try {
      const loginUseCase = AuthServiceFactory.createLoginUseCase();
      await loginUseCase.logout();
      history('/login');
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

// Social login thunk
export const socialLogin = createAsyncThunk(
  'auth/socialLogin',
  async ({ type, history }: { type: string; history: (path: string) => void }, { rejectWithValue }) => {
    try {
      // Social login implementation would go here
      history('/login');
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Social login failed');
    }
  }
);

// Update profile thunk
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ user }: { user: any }, { rejectWithValue }) => {
    try {
      const profileUseCase = AuthServiceFactory.createProfileUseCase();
      const updatedUser = await profileUseCase.updateProfile(user);
      return 'Profile updated successfully';
    } catch (error: any) {
      return rejectWithValue(error.message || 'Profile update failed');
    }
  }
);

// ==========================================
// SLICE DEFINITION
// ==========================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous actions
    apiError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
      state.registrationError = null;
      state.forgetError = null;
      state.profileError = null;
    },
    clearMessages: (state) => {
      state.forgetSuccessMsg = null;
      state.profileSuccess = null;
      state.registrationSuccess = false;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.registrationError = null;
        state.registrationSuccess = false;
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registrationSuccess = true;
        state.registrationError = null;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationError = action.payload as string;
        state.registrationSuccess = false;
        state.loading = false;
      })

      // Forgot password cases
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgetSuccessMsg = action.payload;
        state.forgetError = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgetError = action.payload as string;
        state.forgetSuccessMsg = null;
      })

      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Social login cases
      .addCase(socialLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(socialLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update profile cases
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileSuccess = action.payload;
        state.profileError = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileError = action.payload as string;
        state.profileSuccess = null;
      });
  },
});

export const {
  apiError,
  clearError,
  clearMessages,
  setAuthenticated,
  setUser
} = authSlice.actions;

export default authSlice.reducer;