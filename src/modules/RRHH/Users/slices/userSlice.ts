import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserModel } from '../models/UserModel';

// Interface para el estado del slice
// NOTA: Loading y error se manejan en ServiceWrapper, NO en Redux
interface UserState {
  list: UserModel[];
  currentView: string; // '0' = table, '1' = cards
}

// Pure initial state - no external dependencies
const initialState: UserState = {
  list: [],
  currentView: '0' // Por defecto vista tabla
};

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<UserModel[]>) => {
      state.list = action.payload;
    },
    clearUsers: (state) => {
      state.list = [];
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
  setUsers,
  clearUsers,
  addUser,
  updateUser,
  removeUser,
  setCurrentView
} = userSlice.actions;

export default userSlice.reducer;
