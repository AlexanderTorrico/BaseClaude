import { describe, it, expect } from 'vitest';
import mytemplatepagesReducer, {
  setMyTemplatePagess,
  clearMyTemplatePagess,
} from '../../slices/mytemplatepagesSlice';
import { mockMyTemplatePagess } from '../fixtures/mockMyTemplatePages';

describe('mytemplatepagesSlice', () => {
  const initialState = {
    list: [],
    currentView: '0',
  };

  describe('setMyTemplatePagess', () => {
    it('debe establecer la lista', () => {
      const newState = mytemplatepagesReducer(initialState, setMyTemplatePagess(mockMyTemplatePagess));

      expect(newState.list).toEqual(mockMyTemplatePagess);
      expect(newState.list).toHaveLength(2);
    });
  });

  describe('clearMyTemplatePagess', () => {
    it('debe limpiar la lista', () => {
      const stateWithData = { list: mockMyTemplatePagess, currentView: '0' };

      const newState = mytemplatepagesReducer(stateWithData, clearMyTemplatePagess());

      expect(newState.list).toEqual([]);
    });
  });
});
