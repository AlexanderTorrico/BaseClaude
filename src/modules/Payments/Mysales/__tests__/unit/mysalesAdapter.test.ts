import { describe, it, expect } from 'vitest';
import {
  adaptMysalesResponseToMysalesModel,
  adaptMysalesArrayToMysalesModels,
} from '../../adapters/mysalesAdapter';
import { mockMysales } from '../fixtures/mockMysales';

describe('mysalesAdapter', () => {
  describe('adaptMysalesResponseToMysalesModel', () => {
    it('debe mapear correctamente un elemento del API', () => {
      const apiData = { id: 1 };
      const result = adaptMysalesResponseToMysalesModel(apiData);
      expect(result.id).toBe(1);
    });
  });

  describe('adaptMysalesArrayToMysalesModels', () => {
    it('debe mapear array de elementos', () => {
      const apiArray = [{ id: 1 }, { id: 2 }];
      const result = adaptMysalesArrayToMysalesModels(apiArray);
      expect(result).toHaveLength(2);
    });
  });
});
