import { describe, it, expect } from 'vitest';
import {
  adaptReservationResponseToReservationModel,
  adaptReservationArrayToReservationModels,
} from '../../adapters/reservationAdapter';
import { mockReservation } from '../fixtures/mockReservation';

describe('reservationAdapter', () => {
  describe('adaptReservationResponseToReservationModel', () => {
    it('debe mapear correctamente un elemento del API', () => {
      const apiData = { id: 1 };
      const result = adaptReservationResponseToReservationModel(apiData);
      expect(result.id).toBe(1);
    });
  });

  describe('adaptReservationArrayToReservationModels', () => {
    it('debe mapear array de elementos', () => {
      const apiArray = [{ id: 1 }, { id: 2 }];
      const result = adaptReservationArrayToReservationModels(apiArray);
      expect(result).toHaveLength(2);
    });
  });
});
