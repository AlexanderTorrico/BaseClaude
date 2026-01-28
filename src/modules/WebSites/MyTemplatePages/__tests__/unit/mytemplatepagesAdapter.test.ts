import { describe, it, expect } from 'vitest';
import {
  adaptMyTemplatePagesResponseToMyTemplatePagesModel,
  adaptMyTemplatePagesArrayToMyTemplatePagesModels,
} from '../../adapters/mytemplatepagesAdapter';
import { mockMyTemplatePages } from '../fixtures/mockMyTemplatePages';

describe('mytemplatepagesAdapter', () => {
  describe('adaptMyTemplatePagesResponseToMyTemplatePagesModel', () => {
    it('debe mapear correctamente un elemento del API', () => {
      const apiData = { id: 1 };
      const result = adaptMyTemplatePagesResponseToMyTemplatePagesModel(apiData);
      expect(result.id).toBe(1);
    });
  });

  describe('adaptMyTemplatePagesArrayToMyTemplatePagesModels', () => {
    it('debe mapear array de elementos', () => {
      const apiArray = [{ id: 1 }, { id: 2 }];
      const result = adaptMyTemplatePagesArrayToMyTemplatePagesModels(apiArray);
      expect(result).toHaveLength(2);
    });
  });
});
