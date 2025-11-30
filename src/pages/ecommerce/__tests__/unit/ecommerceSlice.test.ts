import { describe, it, expect } from 'vitest';
import ecommerceReducer, {
  setecommerces,
  clearecommerces,
} from '../../slices/ecommerceSlice';
import { mockecommerces } from '../fixtures/mockecommerce';

describe('ecommerceSlice', () => {
  const initialState = {
    list: [],
    currentView: '0',
  };

  describe('setecommerces', () => {
    it('debe establecer la lista', () => {
      const newState = ecommerceReducer(initialState, setecommerces(mockecommerces));

      expect(newState.list).toEqual(mockecommerces);
      expect(newState.list).toHaveLength(2);
    });
  });

  describe('clearecommerces', () => {
    it('debe limpiar la lista', () => {
      const stateWithData = { list: mockecommerces, currentView: '0' };

      const newState = ecommerceReducer(stateWithData, clearecommerces());

      expect(newState.list).toEqual([]);
    });
  });
});
