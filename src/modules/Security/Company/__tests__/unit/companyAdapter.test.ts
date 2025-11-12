import { describe, it, expect } from 'vitest';
import {
  adaptCompanyResponseToCompanyModel,
  adaptCompanyArrayToCompanyModels,
} from '../../adapters/companyAdapter';
import { mockCompany } from '../fixtures/mockCompany';

describe('companyAdapter', () => {
  describe('adaptCompanyResponseToCompanyModel', () => {
    it('debe mapear correctamente un elemento del API', () => {
      const apiData = { id: 1 };
      const result = adaptCompanyResponseToCompanyModel(apiData);
      expect(result.id).toBe(1);
    });
  });

  describe('adaptCompanyArrayToCompanyModels', () => {
    it('debe mapear array de elementos', () => {
      const apiArray = [{ id: 1 }, { id: 2 }];
      const result = adaptCompanyArrayToCompanyModels(apiArray);
      expect(result).toHaveLength(2);
    });
  });
});
