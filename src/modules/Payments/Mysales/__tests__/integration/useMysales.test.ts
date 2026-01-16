/** @jsxImportSource react */
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useMysales } from '../../hooks/useMysales';
import { setMysaless } from '../../slices/mysalesSlice';
import { mockMysaless } from '../fixtures/mockMysales';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('useMysales Hook', () => {
  beforeEach(() => {
    store.dispatch({ type: 'mysales/clearMysaless' });
  });

  describe('Lectura de estado', () => {
    it('debe leer datos vacíos inicialmente', () => {
      const { result } = renderHook(() => useMysales(), { wrapper });

      expect(result.current.mysaless).toEqual([]);
    });

    it('debe leer datos cuando existen', () => {
      store.dispatch(setMysaless(mockMysaless));

      const { result } = renderHook(() => useMysales(), { wrapper });

      expect(result.current.mysaless).toHaveLength(2);
    });
  });

  describe('getTotal', () => {
    it('debe retornar el total de elementos', () => {
      store.dispatch(setMysaless(mockMysaless));

      const { result } = renderHook(() => useMysales(), { wrapper });

      expect(result.current.getTotal()).toBe(2);
    });
  });
});
