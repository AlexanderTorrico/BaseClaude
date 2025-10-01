import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserResponseModel } from '../models/UserResponseModel';

// Interface para el estado del slice
interface UserState {
  list: UserResponseModel[];
}

// Pure initial state - no external dependencies
const initialState: UserState = {
  list: [],
};

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<UserResponseModel[]>) => {
      state.list = action.payload;
    },
    clearUsers: (state) => {
      state.list = [];
    }
  }
});

export const { setUsers, clearUsers } = userSlice.actions;
export default userSlice.reducer;