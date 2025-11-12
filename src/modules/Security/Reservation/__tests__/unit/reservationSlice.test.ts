import { describe, it, expect } from 'vitest';
import reservationReducer, {
  setReservations,
  clearReservations,
} from '../../slices/reservationSlice';
import { mockReservations } from '../fixtures/mockReservation';

describe('reservationSlice', () => {
  const initialState = {
    list: [],
    currentView: '0',
  };

  describe('setReservations', () => {
    it('debe establecer la lista', () => {
      const newState = reservationReducer(initialState, setReservations(mockReservations));

      expect(newState.list).toEqual(mockReservations);
      expect(newState.list).toHaveLength(2);
    });
  });

  describe('clearReservations', () => {
    it('debe limpiar la lista', () => {
      const stateWithData = { list: mockReservations, currentView: '0' };

      const newState = reservationReducer(stateWithData, clearReservations());

      expect(newState.list).toEqual([]);
    });
  });
});
