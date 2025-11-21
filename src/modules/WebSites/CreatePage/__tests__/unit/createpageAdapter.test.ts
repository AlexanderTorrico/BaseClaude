import { describe, it, expect } from 'vitest';
import {
  adaptCreatePageResponseToCreatePageModel,
  adaptCreatePageArrayToCreatePageModels,
} from '../../adapters/createpageAdapter';
import { mockCreatePage } from '../fixtures/mockCreatePage';

describe('createpageAdapter', () => {
  describe('adaptCreatePageResponseToCreatePageModel', () => {
    it('debe mapear correctamente un elemento del API', () => {
      const apiData = { id: 1 };
      const result = adaptCreatePageResponseToCreatePageModel(apiData);
      expect(result.id).toBe(1);
    });
  });

  describe('adaptCreatePageArrayToCreatePageModels', () => {
    it('debe mapear array de elementos', () => {
      const apiArray = [{ id: 1 }, { id: 2 }];
      const result = adaptCreatePageArrayToCreatePageModels(apiArray);
      expect(result).toHaveLength(2);
    });
  });
});
