import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RegisterState } from '../types/registerTypes';

const initialState: RegisterState = {
  isRegistered: false,
  user: null,
  loading: false,
  error: null,
  registrationDate: undefined,
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    registerSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.isRegistered = true;
      state.user = action.payload;
      state.error = null;
      state.registrationDate = new Date().toISOString();
    },

    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isRegistered = false;
      state.user = null;
      state.error = action.payload;
    },

    clearRegisterError: (state) => {
      state.error = null;
    },

    clearRegistration: (state) => {
      state.isRegistered = false;
      state.user = null;
      state.error = null;
      state.loading = false;
      state.registrationDate = undefined;
    },

    resetRegisterState: () => initialState,
  },
});

export const {
  registerStart,
  registerSuccess,
  registerFailure,
  clearRegisterError,
  clearRegistration,
  resetRegisterState,
} = registerSlice.actions;

export const selectIsRegistered = (state: any) => state.register.isRegistered;
export const selectRegisteredUser = (state: any) => state.register.user;
export const selectRegisterLoading = (state: any) => state.register.loading;
export const selectRegisterError = (state: any) => state.register.error;
export const selectRegistrationDate = (state: any) => state.register.registrationDate;

export default registerSlice.reducer;