import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TestTransactionModel, TransactionStats } from '../models/PaymentTestModel';
import { PaymentConfigModel } from '../../Paymentmethods/models/PaymentmethodsModel';

interface PaymentTestState {
  transactions: TestTransactionModel[];
  currentTransaction: TestTransactionModel | null;
  paypalConfigs: PaymentConfigModel[];
  selectedConfigUuid: string | null;
  stats: TransactionStats | null;
  currentView: 'form' | 'history';
}

const initialState: PaymentTestState = {
  transactions: [],
  currentTransaction: null,
  paypalConfigs: [],
  selectedConfigUuid: null,
  stats: null,
  currentView: 'form',
};

const paymentTestSlice = createSlice({
  name: 'paymentTest',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<TestTransactionModel[]>) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action: PayloadAction<TestTransactionModel>) => {
      state.transactions.unshift(action.payload);
    },
    updateTransaction: (state, action: PayloadAction<TestTransactionModel>) => {
      const index = state.transactions.findIndex(t => t.uuid === action.payload.uuid);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
      if (state.currentTransaction?.uuid === action.payload.uuid) {
        state.currentTransaction = action.payload;
      }
    },
    setCurrentTransaction: (state, action: PayloadAction<TestTransactionModel | null>) => {
      state.currentTransaction = action.payload;
    },
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
    },
    setPayPalConfigs: (state, action: PayloadAction<PaymentConfigModel[]>) => {
      state.paypalConfigs = action.payload;
      // Auto-seleccionar la primera config si no hay ninguna seleccionada
      if (!state.selectedConfigUuid && action.payload.length > 0) {
        state.selectedConfigUuid = action.payload[0].uuid;
      }
    },
    setSelectedConfigUuid: (state, action: PayloadAction<string | null>) => {
      state.selectedConfigUuid = action.payload;
    },
    setStats: (state, action: PayloadAction<TransactionStats | null>) => {
      state.stats = action.payload;
    },
    setCurrentView: (state, action: PayloadAction<'form' | 'history'>) => {
      state.currentView = action.payload;
    },
    clearState: () => initialState,
  },
});

export const {
  setTransactions,
  addTransaction,
  updateTransaction,
  setCurrentTransaction,
  clearCurrentTransaction,
  setPayPalConfigs,
  setSelectedConfigUuid,
  setStats,
  setCurrentView,
  clearState,
} = paymentTestSlice.actions;

export default paymentTestSlice.reducer;
