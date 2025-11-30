import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ecommerceModel } from '../models/ecommerceModel';

interface ecommerceState {
  list: ecommerceModel[];
  currentView: string;
}

const initialState: ecommerceState = {
  list: [],
  currentView: '0'
};

export const ecommerceSlice = createSlice({
  name: 'ecommerce',
  initialState,
  reducers: {
    setecommerces: (state, action: PayloadAction<ecommerceModel[]>) => {
      state.list = action.payload;
    },
    clearecommerces: (state) => {
      state.list = [];
    },
    addecommerce: (state, action: PayloadAction<ecommerceModel>) => {
      state.list.push(action.payload);
    },
    updateecommerce: (state, action: PayloadAction<ecommerceModel>) => {
      const index = state.list.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeecommerce: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(item => item.id !== action.payload);
    },
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    }
  }
});

export const {
  setecommerces,
  clearecommerces,
  addecommerce,
  updateecommerce,
  removeecommerce,
  setCurrentView
} = ecommerceSlice.actions;

export default ecommerceSlice.reducer;
