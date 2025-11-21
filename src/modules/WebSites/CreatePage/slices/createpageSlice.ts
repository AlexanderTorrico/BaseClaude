import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CreatePageModel } from '../models/CreatePageModel';

interface CreatePageState {
  list: CreatePageModel[];
  currentView: string;
}

const initialState: CreatePageState = {
  list: [],
  currentView: '0'
};

export const createpageSlice = createSlice({
  name: 'createpage',
  initialState,
  reducers: {
    setCreatePages: (state, action: PayloadAction<CreatePageModel[]>) => {
      state.list = action.payload;
    },
    clearCreatePages: (state) => {
      state.list = [];
    },
    addCreatePage: (state, action: PayloadAction<CreatePageModel>) => {
      state.list.push(action.payload);
    },
    updateCreatePage: (state, action: PayloadAction<CreatePageModel>) => {
      const index = state.list.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeCreatePage: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(item => item.id !== action.payload);
    },
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    }
  }
});

export const {
  setCreatePages,
  clearCreatePages,
  addCreatePage,
  updateCreatePage,
  removeCreatePage,
  setCurrentView
} = createpageSlice.actions;

export default createpageSlice.reducer;
