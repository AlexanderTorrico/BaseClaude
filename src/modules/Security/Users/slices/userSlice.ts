import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserModel } from '../models/UserModel';

// Interface para el estado del slice
interface UserState {
  list: UserModel[];
  loading: boolean;
  error: string | null;
  currentView: string; // '0' = table, '1' = cards
}

// Pure initial state - no external dependencies
const initialState: UserState = {
  list: [],
  loading: false,
  error: null,
  currentView: '0' // Por defecto vista tabla
};

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUsers: (state, action: PayloadAction<UserModel[]>) => {
      state.list = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearUsers: (state) => {
      state.list = [];
      state.loading = false;
      state.error = null;
    },
    addUser: (state, action: PayloadAction<UserModel>) => {
      state.list.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<UserModel>) => {
      const index = state.list.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeUser: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(user => user.id !== action.payload);
    },
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    }
  }
});

export const {
  setLoading,
  setUsers,
  setError,
  clearUsers,
  addUser,
  updateUser,
  removeUser,
  setCurrentView
} = userSlice.actions;

export default userSlice.reducer;
