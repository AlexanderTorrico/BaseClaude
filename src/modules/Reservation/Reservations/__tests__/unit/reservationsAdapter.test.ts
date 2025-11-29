import { describe, it, expect } from 'vitest';
import {
  adaptReservationsResponseToReservationsModel,
  adaptReservationsArrayToReservationsModels,
} from '../../adapters/reservationsAdapter';
import { mockReservations } from '../fixtures/mockReservations';

describe('reservationsAdapter', () => {
  describe('adaptReservationsResponseToReservationsModel', () => {
    it('debe mapear correctamente un elemento del API', () => {
      const apiData = { id: 1 };
      const result = adaptReservationsResponseToReservationsModel(apiData);
      expect(result.id).toBe(1);
    });
  });

  describe('adaptReservationsArrayToReservationsModels', () => {
    it('debe mapear array de elementos', () => {
      const apiArray = [{ id: 1 }, { id: 2 }];
      const result = adaptReservationsArrayToReservationsModels(apiArray);
      expect(result).toHaveLength(2);
    });
  });
});
