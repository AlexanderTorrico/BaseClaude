/** @jsxImportSource react */
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useCreatePage } from '../../hooks/useCreatePage';
import { setCreatePages } from '../../slices/createpageSlice';
import { mockCreatePages } from '../fixtures/mockCreatePage';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('useCreatePage Hook', () => {
  beforeEach(() => {
    store.dispatch({ type: 'createpage/clearCreatePages' });
  });

  describe('Lectura de estado', () => {
    it('debe leer datos vacíos inicialmente', () => {
      const { result } = renderHook(() => useCreatePage(), { wrapper });

      expect(result.current.createpages).toEqual([]);
    });

    it('debe leer datos cuando existen', () => {
      store.dispatch(setCreatePages(mockCreatePages));

      const { result } = renderHook(() => useCreatePage(), { wrapper });

      expect(result.current.createpages).toHaveLength(2);
    });
  });

  describe('getTotal', () => {
    it('debe retornar el total de elementos', () => {
      store.dispatch(setCreatePages(mockCreatePages));

      const { result } = renderHook(() => useCreatePage(), { wrapper });

      expect(result.current.getTotal()).toBe(2);
    });
  });
});
