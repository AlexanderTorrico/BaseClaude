import { describe, it, expect } from 'vitest';
import reservationsReducer, {
  setReservationss,
  clearReservationss,
} from '../../slices/reservationsSlice';
import { mockReservationss } from '../fixtures/mockReservations';

describe('reservationsSlice', () => {
  const initialState = {
    list: [],
    currentView: '0',
  };

  describe('setReservationss', () => {
    it('debe establecer la lista', () => {
      const newState = reservationsReducer(initialState, setReservationss(mockReservationss));

      expect(newState.list).toEqual(mockReservationss);
      expect(newState.list).toHaveLength(2);
    });
  });

  describe('clearReservationss', () => {
    it('debe limpiar la lista', () => {
      const stateWithData = { list: mockReservationss, currentView: '0' };

      const newState = reservationsReducer(stateWithData, clearReservationss());

      expect(newState.list).toEqual([]);
    });
  });
});
