/** @jsxImportSource react */
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useTableLayout } from '../../hooks/useTableLayout';
import { setTableLayouts } from '../../slices/tablelayoutSlice';
import { mockTableLayouts } from '../fixtures/mockTableLayout';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('useTableLayout Hook', () => {
  beforeEach(() => {
    store.dispatch({ type: 'tablelayout/clearTableLayouts' });
  });

  describe('Lectura de estado', () => {
    it('debe leer datos vacíos inicialmente', () => {
      const { result } = renderHook(() => useTableLayout(), { wrapper });

      expect(result.current.tablelayouts).toEqual([]);
    });

    it('debe leer datos cuando existen', () => {
      store.dispatch(setTableLayouts(mockTableLayouts));

      const { result } = renderHook(() => useTableLayout(), { wrapper });

      expect(result.current.tablelayouts).toHaveLength(2);
    });
  });

  describe('getTotal', () => {
    it('debe retornar el total de elementos', () => {
      store.dispatch(setTableLayouts(mockTableLayouts));

      const { result } = renderHook(() => useTableLayout(), { wrapper });

      expect(result.current.getTotal()).toBe(2);
    });
  });
});
