import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaymentGatewayModel } from '../models/PaymentGatewayModel';

interface PaymentGatewayState {
  list: PaymentGatewayModel[];
  currentView: string;
}

const initialState: PaymentGatewayState = {
  list: [],
  currentView: '0'
};

export const paymentgatewaySlice = createSlice({
  name: 'paymentgateway',
  initialState,
  reducers: {
    setPaymentGateways: (state, action: PayloadAction<PaymentGatewayModel[]>) => {
      state.list = action.payload;
    },
    clearPaymentGateways: (state) => {
      state.list = [];
    },
    addPaymentGateway: (state, action: PayloadAction<PaymentGatewayModel>) => {
      state.list.push(action.payload);
    },
    updatePaymentGateway: (state, action: PayloadAction<PaymentGatewayModel>) => {
      const index = state.list.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removePaymentGateway: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(item => item.id !== action.payload);
    },
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    }
  }
});

export const {
  setPaymentGateways,
  clearPaymentGateways,
  addPaymentGateway,
  updatePaymentGateway,
  removePaymentGateway,
  setCurrentView
} = paymentgatewaySlice.actions;

export default paymentgatewaySlice.reducer;
