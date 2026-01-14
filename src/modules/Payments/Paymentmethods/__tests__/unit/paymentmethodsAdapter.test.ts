import { describe, it, expect } from 'vitest';
import {
  adaptPaymentmethodsResponseToPaymentmethodsModel,
  adaptPaymentmethodsArrayToPaymentmethodsModels,
} from '../../adapters/paymentmethodsAdapter';
import { mockPaymentmethods } from '../fixtures/mockPaymentmethods';

describe('paymentmethodsAdapter', () => {
  describe('adaptPaymentmethodsResponseToPaymentmethodsModel', () => {
    it('debe mapear correctamente un elemento del API', () => {
      const apiData = { id: 1 };
      const result = adaptPaymentmethodsResponseToPaymentmethodsModel(apiData);
      expect(result.id).toBe(1);
    });
  });

  describe('adaptPaymentmethodsArrayToPaymentmethodsModels', () => {
    it('debe mapear array de elementos', () => {
      const apiArray = [{ id: 1 }, { id: 2 }];
      const result = adaptPaymentmethodsArrayToPaymentmethodsModels(apiArray);
      expect(result).toHaveLength(2);
    });
  });
});
