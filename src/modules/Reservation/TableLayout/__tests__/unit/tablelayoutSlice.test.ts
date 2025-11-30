import { describe, it, expect } from 'vitest';
import tablelayoutReducer, {
  setTableLayouts,
  clearTableLayouts,
} from '../../slices/tablelayoutSlice';
import { mockTableLayouts } from '../fixtures/mockTableLayout';

describe('tablelayoutSlice', () => {
  const initialState = {
    list: [],
    currentView: '0',
  };

  describe('setTableLayouts', () => {
    it('debe establecer la lista', () => {
      const newState = tablelayoutReducer(initialState, setTableLayouts(mockTableLayouts));

      expect(newState.list).toEqual(mockTableLayouts);
      expect(newState.list).toHaveLength(2);
    });
  });

  describe('clearTableLayouts', () => {
    it('debe limpiar la lista', () => {
      const stateWithData = { list: mockTableLayouts, currentView: '0' };

      const newState = tablelayoutReducer(stateWithData, clearTableLayouts());

      expect(newState.list).toEqual([]);
    });
  });
});
