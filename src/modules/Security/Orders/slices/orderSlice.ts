import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderModel, OrderStatus } from '../models/OrderModel';

interface OrderState {
  list: OrderModel[];
  currentView: string; // '0' = table, '1' = cards
  activeTab: OrderStatus; // Tab activo por estado
}

const initialState: OrderState = {
  list: [],
  currentView: '1', // Por defecto vista cards
  activeTab: OrderStatus.PENDING // Por defecto mostrar pendientes
};

export const orderSlice = createSlice({
  name: 'security_orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<OrderModel[]>) => {
      state.list = action.payload;
    },
    clearOrders: (state) => {
      state.list = [];
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: number; status: OrderStatus }>) => {
      const order = state.list.find(o => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    },
    updateOrder: (state, action: PayloadAction<OrderModel>) => {
      const index = state.list.findIndex(order => order.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<OrderStatus>) => {
      state.activeTab = action.payload;
    }
  }
});

export const {
  setOrders,
  clearOrders,
  updateOrderStatus,
  updateOrder,
  setCurrentView,
  setActiveTab
} = orderSlice.actions;

export default orderSlice.reducer;
