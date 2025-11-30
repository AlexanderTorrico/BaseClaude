import { describe, it, expect } from 'vitest';
import {
  adaptTableLayoutResponseToTableLayoutModel,
  adaptTableLayoutArrayToTableLayoutModels,
} from '../../adapters/tablelayoutAdapter';
import { mockTableLayout } from '../fixtures/mockTableLayout';

describe('tablelayoutAdapter', () => {
  describe('adaptTableLayoutResponseToTableLayoutModel', () => {
    it('debe mapear correctamente un elemento del API', () => {
      const apiData = { id: 1 };
      const result = adaptTableLayoutResponseToTableLayoutModel(apiData);
      expect(result.id).toBe(1);
    });
  });

  describe('adaptTableLayoutArrayToTableLayoutModels', () => {
    it('debe mapear array de elementos', () => {
      const apiArray = [{ id: 1 }, { id: 2 }];
      const result = adaptTableLayoutArrayToTableLayoutModels(apiArray);
      expect(result).toHaveLength(2);
    });
  });
});
