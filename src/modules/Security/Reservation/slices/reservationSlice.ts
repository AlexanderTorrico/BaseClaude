import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReservationModel } from '../models/ReservationModel';

interface ReservationState {
  list: ReservationModel[];
  currentView: string;
}

const initialState: ReservationState = {
  list: [],
  currentView: '0'
};

export const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    setReservations: (state, action: PayloadAction<ReservationModel[]>) => {
      state.list = action.payload;
    },
    clearReservations: (state) => {
      state.list = [];
    },
    addReservation: (state, action: PayloadAction<ReservationModel>) => {
      state.list.push(action.payload);
    },
    updateReservation: (state, action: PayloadAction<ReservationModel>) => {
      const index = state.list.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeReservation: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(item => item.id !== action.payload);
    },
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    }
  }
});

export const {
  setReservations,
  clearReservations,
  addReservation,
  updateReservation,
  removeReservation,
  setCurrentView
} = reservationSlice.actions;

export default reservationSlice.reducer;
