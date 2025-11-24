import { describe, it, expect } from 'vitest';
import vaultReducer, {
  setVaults,
  clearVaults,
} from '../../slices/vaultSlice';
import { mockVaults } from '../fixtures/mockVault';

describe('vaultSlice', () => {
  const initialState = {
    list: [],
    currentView: '0',
  };

  describe('setVaults', () => {
    it('debe establecer la lista', () => {
      const newState = vaultReducer(initialState, setVaults(mockVaults));

      expect(newState.list).toEqual(mockVaults);
      expect(newState.list).toHaveLength(2);
    });
  });

  describe('clearVaults', () => {
    it('debe limpiar la lista', () => {
      const stateWithData = { list: mockVaults, currentView: '0' };

      const newState = vaultReducer(stateWithData, clearVaults());

      expect(newState.list).toEqual([]);
    });
  });
});
