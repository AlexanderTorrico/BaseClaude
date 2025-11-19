import { describe, it, expect } from 'vitest';
import createpageReducer, {
  setCreatePages,
  clearCreatePages,
} from '../../slices/createpageSlice';
import { mockCreatePages } from '../fixtures/mockCreatePage';

describe('createpageSlice', () => {
  const initialState = {
    list: [],
    currentView: '0',
  };

  describe('setCreatePages', () => {
    it('debe establecer la lista', () => {
      const newState = createpageReducer(initialState, setCreatePages(mockCreatePages));

      expect(newState.list).toEqual(mockCreatePages);
      expect(newState.list).toHaveLength(2);
    });
  });

  describe('clearCreatePages', () => {
    it('debe limpiar la lista', () => {
      const stateWithData = { list: mockCreatePages, currentView: '0' };

      const newState = createpageReducer(stateWithData, clearCreatePages());

      expect(newState.list).toEqual([]);
    });
  });
});
