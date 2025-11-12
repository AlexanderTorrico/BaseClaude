import { describe, it, expect } from 'vitest';
import {
  adaptInformationResponseToInformationModel,
  adaptInformationArrayToInformationModels,
} from '../../adapters/informationAdapter';
import { mockInformation } from '../fixtures/mockInformation';

describe('informationAdapter', () => {
  describe('adaptInformationResponseToInformationModel', () => {
    it('debe mapear correctamente un elemento del API', () => {
      const apiData = { id: 1 };
      const result = adaptInformationResponseToInformationModel(apiData);
      expect(result.id).toBe(1);
    });
  });

  describe('adaptInformationArrayToInformationModels', () => {
    it('debe mapear array de elementos', () => {
      const apiArray = [{ id: 1 }, { id: 2 }];
      const result = adaptInformationArrayToInformationModels(apiArray);
      expect(result).toHaveLength(2);
    });
  });
});
