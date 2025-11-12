/** @jsxImportSource react */
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useCompany } from '../../hooks/useCompany';
import { setCompanys } from '../../slices/companySlice';
import { mockCompanys } from '../fixtures/mockCompany';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('useCompany Hook', () => {
  beforeEach(() => {
    store.dispatch({ type: 'company/clearCompanys' });
  });

  describe('Lectura de estado', () => {
    it('debe leer datos vacíos inicialmente', () => {
      const { result } = renderHook(() => useCompany(), { wrapper });

      expect(result.current.companys).toEqual([]);
    });

    it('debe leer datos cuando existen', () => {
      store.dispatch(setCompanys(mockCompanys));

      const { result } = renderHook(() => useCompany(), { wrapper });

      expect(result.current.companys).toHaveLength(2);
    });
  });

  describe('getTotal', () => {
    it('debe retornar el total de elementos', () => {
      store.dispatch(setCompanys(mockCompanys));

      const { result } = renderHook(() => useCompany(), { wrapper });

      expect(result.current.getTotal()).toBe(2);
    });
  });
});
