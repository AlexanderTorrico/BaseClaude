import { describe, it, expect } from 'vitest';
import {
  adaptPaymentGatewayResponseToPaymentGatewayModel,
  adaptPaymentGatewayArrayToPaymentGatewayModels,
} from '../../adapters/paymentgatewayAdapter';
import { mockPaymentGateway } from '../fixtures/mockPaymentGateway';

describe('paymentgatewayAdapter', () => {
  describe('adaptPaymentGatewayResponseToPaymentGatewayModel', () => {
    it('debe mapear correctamente un elemento del API', () => {
      const apiData = { id: 1 };
      const result = adaptPaymentGatewayResponseToPaymentGatewayModel(apiData);
      expect(result.id).toBe(1);
    });
  });

  describe('adaptPaymentGatewayArrayToPaymentGatewayModels', () => {
    it('debe mapear array de elementos', () => {
      const apiArray = [{ id: 1 }, { id: 2 }];
      const result = adaptPaymentGatewayArrayToPaymentGatewayModels(apiArray);
      expect(result).toHaveLength(2);
    });
  });
});
