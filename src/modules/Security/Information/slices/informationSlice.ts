import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InformationModel } from '../models/InformationModel';

interface InformationState {
  list: InformationModel[];
  currentView: string;
}

const initialState: InformationState = {
  list: [],
  currentView: '0'
};

export const informationSlice = createSlice({
  name: 'information',
  initialState,
  reducers: {
    setInformations: (state, action: PayloadAction<InformationModel[]>) => {
      state.list = action.payload;
    },
    clearInformations: (state) => {
      state.list = [];
    },
    addInformation: (state, action: PayloadAction<InformationModel>) => {
      state.list.push(action.payload);
    },
    updateInformation: (state, action: PayloadAction<InformationModel>) => {
      const index = state.list.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeInformation: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(item => item.id !== action.payload);
    },
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    },
    updateEcommerceSettings: (state, action: PayloadAction<{ id: number; ecommerce_enabled: boolean; payment_gateway_id?: number | null }>) => {
      const index = state.list.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = {
          ...state.list[index],
          ecommerce_enabled: action.payload.ecommerce_enabled,
          payment_gateway_id: action.payload.payment_gateway_id
        };
      }
    }
  }
});

export const {
  setInformations,
  clearInformations,
  addInformation,
  updateInformation,
  removeInformation,
  setCurrentView,
  updateEcommerceSettings
} = informationSlice.actions;

export default informationSlice.reducer;
