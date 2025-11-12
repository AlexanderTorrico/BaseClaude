import { describe, it, expect } from 'vitest';
import informationReducer, {
  setInformations,
  clearInformations,
} from '../../slices/informationSlice';
import { mockInformations } from '../fixtures/mockInformation';

describe('informationSlice', () => {
  const initialState = {
    list: [],
    currentView: '0',
  };

  describe('setInformations', () => {
    it('debe establecer la lista', () => {
      const newState = informationReducer(initialState, setInformations(mockInformations));

      expect(newState.list).toEqual(mockInformations);
      expect(newState.list).toHaveLength(2);
    });
  });

  describe('clearInformations', () => {
    it('debe limpiar la lista', () => {
      const stateWithData = { list: mockInformations, currentView: '0' };

      const newState = informationReducer(stateWithData, clearInformations());

      expect(newState.list).toEqual([]);
    });
  });
});
