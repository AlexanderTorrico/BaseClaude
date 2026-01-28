/** @jsxImportSource react */
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useMyTemplatePages } from '../../hooks/useMyTemplatePages';
import { setMyTemplatePagess } from '../../slices/mytemplatepagesSlice';
import { mockMyTemplatePagess } from '../fixtures/mockMyTemplatePages';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('useMyTemplatePages Hook', () => {
  beforeEach(() => {
    store.dispatch({ type: 'mytemplatepages/clearMyTemplatePagess' });
  });

  describe('Lectura de estado', () => {
    it('debe leer datos vacíos inicialmente', () => {
      const { result } = renderHook(() => useMyTemplatePages(), { wrapper });

      expect(result.current.mytemplatepagess).toEqual([]);
    });

    it('debe leer datos cuando existen', () => {
      store.dispatch(setMyTemplatePagess(mockMyTemplatePagess));

      const { result } = renderHook(() => useMyTemplatePages(), { wrapper });

      expect(result.current.mytemplatepagess).toHaveLength(2);
    });
  });

  describe('getTotal', () => {
    it('debe retornar el total de elementos', () => {
      store.dispatch(setMyTemplatePagess(mockMyTemplatePagess));

      const { result } = renderHook(() => useMyTemplatePages(), { wrapper });

      expect(result.current.getTotal()).toBe(2);
    });
  });
});
