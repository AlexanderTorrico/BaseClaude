import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaymentMethodModel, PaymentAccountModel } from '../models/PaymentmethodsModel';

interface PaymentmethodsState {
  methods: PaymentMethodModel[];
  accounts: PaymentAccountModel[];
  currentView: string;
}

const initialState: PaymentmethodsState = {
  methods: [],
  accounts: [],
  currentView: '0'
};

export const paymentmethodsSlice = createSlice({
  name: 'paymentmethods',
  initialState,
  reducers: {
    setPaymentMethods: (state, action: PayloadAction<PaymentMethodModel[]>) => {
      state.methods = action.payload;
    },
    setPaymentAccounts: (state, action: PayloadAction<PaymentAccountModel[]>) => {
      state.accounts = action.payload;
    },
    addPaymentAccount: (state, action: PayloadAction<PaymentAccountModel>) => {
      state.accounts.push(action.payload);
    },
    updatePaymentAccount: (state, action: PayloadAction<PaymentAccountModel>) => {
      const index = state.accounts.findIndex(item => item.uuid === action.payload.uuid);
      if (index !== -1) {
        state.accounts[index] = action.payload;
      }
    },
    removePaymentAccount: (state, action: PayloadAction<string>) => {
      state.accounts = state.accounts.filter(item => item.uuid !== action.payload);
    },
    toggleAccountActive: (state, action: PayloadAction<string>) => {
      const account = state.accounts.find(item => item.uuid === action.payload);
      if (account) {
        account.isActive = !account.isActive;
        account.updatedAt = new Date().toISOString();
      }
    },
    setAccountAsDefault: (state, action: PayloadAction<{ accountUuid: string; methodId: number }>) => {
      state.accounts.forEach(account => {
        if (account.paymentMethodId === action.payload.methodId) {
          account.isDefault = account.uuid === action.payload.accountUuid;
          account.updatedAt = new Date().toISOString();
        }
      });
    },
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    }
  }
});

export const {
  setPaymentMethods,
  setPaymentAccounts,
  addPaymentAccount,
  updatePaymentAccount,
  removePaymentAccount,
  toggleAccountActive,
  setAccountAsDefault,
  setCurrentView
} = paymentmethodsSlice.actions;

export default paymentmethodsSlice.reducer;
