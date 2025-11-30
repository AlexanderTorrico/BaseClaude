import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReservationsModel } from '../models/ReservationsModel';

interface ReservationsState {
  list: ReservationsModel[];
  currentView: string;
}

const initialState: ReservationsState = {
  list: [],
  currentView: '0'
};

export const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    setReservationss: (state, action: PayloadAction<ReservationsModel[]>) => {
      state.list = action.payload;
    },
    clearReservationss: (state) => {
      state.list = [];
    },
    addReservations: (state, action: PayloadAction<ReservationsModel>) => {
      state.list.push(action.payload);
    },
    updateReservations: (state, action: PayloadAction<ReservationsModel>) => {
      const index = state.list.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeReservations: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(item => item.id !== action.payload);
    },
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    }
  }
});

export const {
  setReservationss,
  clearReservationss,
  addReservations,
  updateReservations,
  removeReservations,
  setCurrentView
} = reservationsSlice.actions;

export default reservationsSlice.reducer;
