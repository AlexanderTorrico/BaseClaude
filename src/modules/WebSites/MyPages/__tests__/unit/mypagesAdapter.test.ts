import { describe, it, expect } from 'vitest';
import {
  adaptMyPagesResponseToMyPagesModel,
  adaptMyPagesArrayToMyPagesModels,
} from '../../adapters/mypagesAdapter';
import { mockMyPages } from '../fixtures/mockMyPages';

describe('mypagesAdapter', () => {
  describe('adaptMyPagesResponseToMyPagesModel', () => {
    it('debe mapear correctamente un elemento del API', () => {
      const apiData = { id: 1 };
      const result = adaptMyPagesResponseToMyPagesModel(apiData);
      expect(result.id).toBe(1);
    });
  });

  describe('adaptMyPagesArrayToMyPagesModels', () => {
    it('debe mapear array de elementos', () => {
      const apiArray = [{ id: 1 }, { id: 2 }];
      const result = adaptMyPagesArrayToMyPagesModels(apiArray);
      expect(result).toHaveLength(2);
    });
  });
});
