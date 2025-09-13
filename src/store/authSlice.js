import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Helper imports
import { getFirebaseBackend } from '../helpers/firebase_helper'
import {
  postFakeLogin,
  postJwtLogin,
  postFakeRegister,
  postJwtRegister,
  postFakeForgetPwd,
  postJwtForgetPwd,
  postFakeProfile,
  postJwtProfile,
} from '../helpers/fakebackend_helper'
import {
  postApiLogin,
  postApiRegister,
  postApiForgotPassword,
  postApiProfile,
  postApiLogout,
} from '../helpers/realBackendAuth'

const fireBaseBackend = getFirebaseBackend()

// Initial state combining all auth states
const initialState = {
  // Login state
  user: null,
  error: '',
  loading: false,
  
  // Register state
  registrationSuccess: false,
  registrationError: null,
  
  // Forget password state
  forgetSuccessMsg: null,
  forgetError: null,
  
  // Profile state
  profileSuccess: null,
  profileError: null,
}

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ user, history }, { rejectWithValue }) => {
    try {
      let response

      if (import.meta.env.VITE_APP_DEFAULTAUTH === 'firebase') {
        response = await fireBaseBackend.loginUser(user.email, user.password)
      } else if (import.meta.env.VITE_APP_DEFAULTAUTH === 'jwt') {
        response = await postJwtLogin({
          email: user.email,
          password: user.password,
        })
        localStorage.setItem('authUser', JSON.stringify(response))
      } else if (import.meta.env.VITE_APP_DEFAULTAUTH === 'api') {
        response = await postApiLogin({
          email: user.email,
          password: user.password,
        })
      } else if (import.meta.env.VITE_APP_DEFAULTAUTH === 'fake') {
        response = await postFakeLogin({
          email: user.email,
          password: user.password,
        })
        localStorage.setItem('authUser', JSON.stringify(response))
      }

      history('/dashboard')
      return response
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async ({ history }, { rejectWithValue }) => {
    try {
      if (import.meta.env.VITE_APP_DEFAULTAUTH === 'firebase') {
        await fireBaseBackend.logout()
      } else if (import.meta.env.VITE_APP_DEFAULTAUTH === 'api') {
        await postApiLogout()
      }

      localStorage.removeItem('authUser')
      history('/login')
      return true
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const socialLogin = createAsyncThunk(
  'auth/socialLogin',
  async ({ type, history }, { rejectWithValue }) => {
    try {
      if (import.meta.env.VITE_APP_DEFAULTAUTH === 'firebase') {
        const response = await fireBaseBackend.socialLoginUser(type)
        
        if (response) {
          localStorage.setItem('authUser', JSON.stringify(response))
          history('/dashboard')
          return response
        } else {
          history('/login')
          return null
        }
      }
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ user }, { rejectWithValue }) => {
    try {
      let response

      if (import.meta.env.VITE_APP_DEFAULTAUTH === 'firebase') {
        response = await fireBaseBackend.registerUser(user.email, user.password)
      } else if (import.meta.env.VITE_APP_DEFAULTAUTH === 'jwt') {
        response = await postJwtRegister('/post-jwt-register', user)
      } else if (import.meta.env.VITE_APP_DEFAULTAUTH === 'api') {
        response = await postApiRegister(user)
      } else if (import.meta.env.VITE_APP_DEFAULTAUTH === 'fake') {
        response = await postFakeRegister(user)
      }

      return response
    } catch (error) {
      console.log('There was an error registering: ', error)
      return rejectWithValue(error)
    }
  }
)

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ user }, { rejectWithValue }) => {
    try {
      let response

      if (import.meta.env.VITE_APP_DEFAULTAUTH === 'firebase') {
        response = await fireBaseBackend.forgetPassword(user.email)
      } else if (import.meta.env.VITE_APP_DEFAULTAUTH === 'jwt') {
        response = await postJwtForgetPwd('/jwt-forget-pwd', {
          email: user.email,
        })
      } else if (import.meta.env.VITE_APP_DEFAULTAUTH === 'api') {
        response = await postApiForgotPassword({
          email: user.email,
        })
      } else {
        await postFakeForgetPwd('/fake-forget-pwd', {
          email: user.email,
        })
      }

      return 'Reset link are sended to your mailbox, check there first'
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ user }, { rejectWithValue }) => {
    try {
      let response

      if (import.meta.env.VITE_APP_DEFAULTAUTH === 'firebase') {
        response = await fireBaseBackend.editProfileAPI(user.username, user.idx)
      } else if (import.meta.env.VITE_APP_DEFAULTAUTH === 'jwt') {
        response = await postJwtProfile('/post-jwt-profile', {
          username: user.username,
          idx: user.idx,
        })
      } else if (import.meta.env.VITE_APP_DEFAULTAUTH === 'api') {
        response = await postApiProfile({
          username: user.username,
          idx: user.idx,
        })
      } else if (import.meta.env.VITE_APP_DEFAULTAUTH === 'fake') {
        response = await postFakeProfile({
          username: user.username,
          idx: user.idx,
        })
      }

      return response
    } catch (error) {
      return rejectWithValue(error)
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