import { describe, it, expect } from 'vitest';
import companyReducer, {
  setCompanys,
  clearCompanys,
} from '../../slices/companySlice';
import { mockCompanys } from '../fixtures/mockCompany';

describe('companySlice', () => {
  const initialState = {
    list: [],
    currentView: '0',
  };

  describe('setCompanys', () => {
    it('debe establecer la lista', () => {
      const newState = companyReducer(initialState, setCompanys(mockCompanys));

      expect(newState.list).toEqual(mockCompanys);
      expect(newState.list).toHaveLength(2);
    });
  });

  describe('clearCompanys', () => {
    it('debe limpiar la lista', () => {
      const stateWithData = { list: mockCompanys, currentView: '0' };

      const newState = companyReducer(stateWithData, clearCompanys());

      expect(newState.list).toEqual([]);
    });
  });
});
