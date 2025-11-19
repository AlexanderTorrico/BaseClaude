/** @jsxImportSource react */
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useMyPages } from '../../hooks/useMyPages';
import { setMyPagess } from '../../slices/mypagesSlice';
import { mockMyPagess } from '../fixtures/mockMyPages';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('useMyPages Hook', () => {
  beforeEach(() => {
    store.dispatch({ type: 'mypages/clearMyPagess' });
  });

  describe('Lectura de estado', () => {
    it('debe leer datos vacíos inicialmente', () => {
      const { result } = renderHook(() => useMyPages(), { wrapper });

      expect(result.current.mypagess).toEqual([]);
    });

    it('debe leer datos cuando existen', () => {
      store.dispatch(setMyPagess(mockMyPagess));

      const { result } = renderHook(() => useMyPages(), { wrapper });

      expect(result.current.mypagess).toHaveLength(2);
    });
  });

  describe('getTotal', () => {
    it('debe retornar el total de elementos', () => {
      store.dispatch(setMyPagess(mockMyPagess));

      const { result } = renderHook(() => useMyPages(), { wrapper });

      expect(result.current.getTotal()).toBe(2);
    });
  });
});
