import { describe, it, expect } from 'vitest';
import mypagesReducer, {
  setMyPagess,
  clearMyPagess,
} from '../../slices/mypagesSlice';
import { mockMyPagess } from '../fixtures/mockMyPages';

describe('mypagesSlice', () => {
  const initialState = {
    list: [],
    currentView: '0',
  };

  describe('setMyPagess', () => {
    it('debe establecer la lista', () => {
      const newState = mypagesReducer(initialState, setMyPagess(mockMyPagess));

      expect(newState.list).toEqual(mockMyPagess);
      expect(newState.list).toHaveLength(2);
    });
  });

  describe('clearMyPagess', () => {
    it('debe limpiar la lista', () => {
      const stateWithData = { list: mockMyPagess, currentView: '0' };

      const newState = mypagesReducer(stateWithData, clearMyPagess());

      expect(newState.list).toEqual([]);
    });
  });
});
