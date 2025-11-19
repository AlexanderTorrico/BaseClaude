import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MyPagesModel } from '../models/MyPagesModel';

interface MyPagesState {
  list: MyPagesModel[];
  currentView: string;
}

const initialState: MyPagesState = {
  list: [],
  currentView: '0'
};

export const mypagesSlice = createSlice({
  name: 'mypages',
  initialState,
  reducers: {
    setMyPagess: (state, action: PayloadAction<MyPagesModel[]>) => {
      state.list = action.payload;
    },
    clearMyPagess: (state) => {
      state.list = [];
    },
    addMyPages: (state, action: PayloadAction<MyPagesModel>) => {
      state.list.push(action.payload);
    },
    updateMyPages: (state, action: PayloadAction<MyPagesModel>) => {
      const index = state.list.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    updateMyPagesName: (state, action: PayloadAction<{ id: number; name: string }>) => {
      const index = state.list.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.list[index].name = action.payload.name;
        state.list[index].updatedAt = new Date().toISOString();
      }
    },
    removeMyPages: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(item => item.id !== action.payload);
    },
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    }
  }
});

export const {
  setMyPagess,
  clearMyPagess,
  addMyPages,
  updateMyPages,
  updateMyPagesName,
  removeMyPages,
  setCurrentView
} = mypagesSlice.actions;

export default mypagesSlice.reducer;
