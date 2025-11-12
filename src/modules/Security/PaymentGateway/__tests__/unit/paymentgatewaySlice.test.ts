import { describe, it, expect } from 'vitest';
import paymentgatewayReducer, {
  setPaymentGateways,
  clearPaymentGateways,
} from '../../slices/paymentgatewaySlice';
import { mockPaymentGateways } from '../fixtures/mockPaymentGateway';

describe('paymentgatewaySlice', () => {
  const initialState = {
    list: [],
    currentView: '0',
  };

  describe('setPaymentGateways', () => {
    it('debe establecer la lista', () => {
      const newState = paymentgatewayReducer(initialState, setPaymentGateways(mockPaymentGateways));

      expect(newState.list).toEqual(mockPaymentGateways);
      expect(newState.list).toHaveLength(2);
    });
  });

  describe('clearPaymentGateways', () => {
    it('debe limpiar la lista', () => {
      const stateWithData = { list: mockPaymentGateways, currentView: '0' };

      const newState = paymentgatewayReducer(stateWithData, clearPaymentGateways());

      expect(newState.list).toEqual([]);
    });
  });
});
