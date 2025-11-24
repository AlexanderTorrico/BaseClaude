import { describe, it, expect } from 'vitest';
import {
  adaptVaultResponseToVaultModel,
  adaptVaultArrayToVaultModels,
} from '../../adapters/vaultAdapter';
import { mockVault } from '../fixtures/mockVault';

describe('vaultAdapter', () => {
  describe('adaptVaultResponseToVaultModel', () => {
    it('debe mapear correctamente un elemento del API', () => {
      const apiData = { id: 1 };
      const result = adaptVaultResponseToVaultModel(apiData);
      expect(result.id).toBe(1);
    });
  });

  describe('adaptVaultArrayToVaultModels', () => {
    it('debe mapear array de elementos', () => {
      const apiArray = [{ id: 1 }, { id: 2 }];
      const result = adaptVaultArrayToVaultModels(apiArray);
      expect(result).toHaveLength(2);
    });
  });
});
