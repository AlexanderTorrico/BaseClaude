import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginRequest, RegisterRequest, AuthResponse } from '@/models/auth.types';
import { BackendServiceFactory } from '@/services';

// Initial state combining all auth states
const initialState: AuthState & {
  registrationSuccess: boolean;
  registrationError: string | null;
  forgetSuccessMsg: string | null;
  forgetError: string | null;
  profileSuccess: string | null;
  profileError: string | null;
} = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
  registrationSuccess: false,
  registrationError: null,
  forgetSuccessMsg: null,
  forgetError: null,
  profileSuccess: null,
  profileError: null,
};

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ user, history }: { user: LoginRequest; history: (path: string) => void }, { rejectWithValue }) => {
    try {
      const backendService = BackendServiceFactory.getInstance();
      const response = await backendService.login(user);

      if (response.success && response.data) {
        localStorage.setItem('authUser', JSON.stringify(response.data));
        localStorage.setItem('authToken', response.data.token);
        history('/dashboard');
        return response.data;
      }

      throw new Error(response.message || 'Login failed');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async ({ history }: { history: (path: string) => void }, { rejectWithValue }) => {
    try {
      localStorage.removeItem('authUser');
      localStorage.removeItem('authToken');
      history('/login');
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
)

export const socialLogin = createAsyncThunk(
  'auth/socialLogin',
  async ({ type, history }: { type: string; history: (path: string) => void }, { rejectWithValue }) => {
    try {
      // Social login functionality would be implemented here
      // For now, redirect to login
      history('/login');
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Social login failed');
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ user }: { user: RegisterRequest }, { rejectWithValue }) => {
    try {
      const backendService = BackendServiceFactory.getInstance();
      const response = await backendService.register(user);

      if (response.success && response.data) {
        localStorage.setItem('authUser', JSON.stringify(response.data));
        localStorage.setItem('authToken', response.data.token);
        return response.data;
      }

      throw new Error(response.message || 'Registration failed');
    } catch (error: any) {
      console.log('There was an error registering: ', error);
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
)

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const backendService = BackendServiceFactory.getInstance();
      const response = await backendService.forgotPassword(email);

      if (response.success) {
        return response.message || 'Reset link sent to your mailbox, check there first';
      }

      throw new Error(response.message || 'Failed to send reset email');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send reset email');
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ user }: { user: any }, { rejectWithValue }) => {
    try {
      const backendService = BackendServiceFactory.getInstance();
      const response = await backendService.updateProfile(user);

      if (response.success && response.data) {
        const updatedUser = JSON.parse(localStorage.getItem('authUser') || '{}');
        const newUserData = { ...updatedUser, ...response.data };
        localStorage.setItem('authUser', JSON.stringify(newUserData));
        return response.message || 'Profile updated successfully';
      }

      throw new Error(response.message || 'Profile update failed');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Profile update failed');
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous actions
    apiError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    clearError: (state) => {
      state.error = ''
      state.registrationError = null
      state.forgetError = null
      state.profileError = null
    },
    clearMessages: (state) => {
      state.forgetSuccessMsg = null
      state.profileSuccess = null
      state.registrationSuccess = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.error = ''
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Login failed'
      })
      
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.error = ''
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload?.message || 'Logout failed'
      })
      
      // Social login cases
      .addCase(socialLogin.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.error = ''
      })
      .addCase(socialLogin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Social login failed'
      })
      
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.registrationError = null
        state.registrationSuccess = false
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registrationSuccess = true
        state.registrationError = null
        state.user = action.payload
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationError = action.payload?.message || 'Registration failed'
        state.registrationSuccess = false
      })
      
      // Forgot password cases
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgetSuccessMsg = action.payload
        state.forgetError = null
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgetError = action.payload?.message || 'Password reset failed'
        state.forgetSuccessMsg = null
      })
      
      // Update profile cases
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileSuccess = action.payload
        state.profileError = null
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileError = action.payload?.message || 'Profile update failed'
        state.profileSuccess = null
      })
  },
})

export const { apiError, clearError, clearMessages } = authSlice.actions
export default authSlice.reducer