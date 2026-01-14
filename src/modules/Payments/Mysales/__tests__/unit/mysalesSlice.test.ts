import { describe, it, expect } from 'vitest';
import mysalesReducer, {
  setMysaless,
  clearMysaless,
} from '../../slices/mysalesSlice';
import { mockMysaless } from '../fixtures/mockMysales';

describe('mysalesSlice', () => {
  const initialState = {
    list: [],
    currentView: '0',
  };

  describe('setMysaless', () => {
    it('debe establecer la lista', () => {
      const newState = mysalesReducer(initialState, setMysaless(mockMysaless));

      expect(newState.list).toEqual(mockMysaless);
      expect(newState.list).toHaveLength(2);
    });
  });

  describe('clearMysaless', () => {
    it('debe limpiar la lista', () => {
      const stateWithData = { list: mockMysaless, currentView: '0' };

      const newState = mysalesReducer(stateWithData, clearMysaless());

      expect(newState.list).toEqual([]);
    });
  });
});
