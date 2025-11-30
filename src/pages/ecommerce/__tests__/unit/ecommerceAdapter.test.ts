import { describe, it, expect } from 'vitest';
import {
  adaptecommerceResponseToecommerceModel,
  adaptecommerceArrayToecommerceModels,
} from '../../adapters/ecommerceAdapter';
import { mockecommerce } from '../fixtures/mockecommerce';

describe('ecommerceAdapter', () => {
  describe('adaptecommerceResponseToecommerceModel', () => {
    it('debe mapear correctamente un elemento del API', () => {
      const apiData = { id: 1 };
      const result = adaptecommerceResponseToecommerceModel(apiData);
      expect(result.id).toBe(1);
    });
  });

  describe('adaptecommerceArrayToecommerceModels', () => {
    it('debe mapear array de elementos', () => {
      const apiArray = [{ id: 1 }, { id: 2 }];
      const result = adaptecommerceArrayToecommerceModels(apiArray);
      expect(result).toHaveLength(2);
    });
  });
});
