import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SaleTransactionModel } from '../models/MysalesModel';

interface MysalesState {
  list: SaleTransactionModel[];
  currentView: string;
}

const initialState: MysalesState = {
  list: [],
  currentView: '0'
};

export const mysalesSlice = createSlice({
  name: 'mysales',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<SaleTransactionModel[]>) => {
      state.list = action.payload;
    },
    clearTransactions: (state) => {
      state.list = [];
    },
    addTransaction: (state, action: PayloadAction<SaleTransactionModel>) => {
      state.list.unshift(action.payload);
    },
    updateTransaction: (state, action: PayloadAction<SaleTransactionModel>) => {
      const index = state.list.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeTransaction: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(item => item.id !== action.payload);
    },
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    }
  }
});

export const {
  setTransactions,
  clearTransactions,
  addTransaction,
  updateTransaction,
  removeTransaction,
  setCurrentView
} = mysalesSlice.actions;

export default mysalesSlice.reducer;
