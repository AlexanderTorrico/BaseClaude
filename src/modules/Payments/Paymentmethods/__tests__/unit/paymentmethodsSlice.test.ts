import { describe, it, expect } from 'vitest';
import paymentmethodsReducer, {
  setPaymentmethodss,
  clearPaymentmethodss,
} from '../../slices/paymentmethodsSlice';
import { mockPaymentmethodss } from '../fixtures/mockPaymentmethods';

describe('paymentmethodsSlice', () => {
  const initialState = {
    list: [],
    currentView: '0',
  };

  describe('setPaymentmethodss', () => {
    it('debe establecer la lista', () => {
      const newState = paymentmethodsReducer(initialState, setPaymentmethodss(mockPaymentmethodss));

      expect(newState.list).toEqual(mockPaymentmethodss);
      expect(newState.list).toHaveLength(2);
    });
  });

  describe('clearPaymentmethodss', () => {
    it('debe limpiar la lista', () => {
      const stateWithData = { list: mockPaymentmethodss, currentView: '0' };

      const newState = paymentmethodsReducer(stateWithData, clearPaymentmethodss());

      expect(newState.list).toEqual([]);
    });
  });
});
