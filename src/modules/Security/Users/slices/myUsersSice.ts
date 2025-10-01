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

  }
});