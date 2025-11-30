/** @jsxImportSource react */
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useecommerce } from '../../hooks/useecommerce';
import { setecommerces } from '../../slices/ecommerceSlice';
import { mockecommerces } from '../fixtures/mockecommerce';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('useecommerce Hook', () => {
  beforeEach(() => {
    store.dispatch({ type: 'ecommerce/clearecommerces' });
  });

  describe('Lectura de estado', () => {
    it('debe leer datos vacíos inicialmente', () => {
      const { result } = renderHook(() => useecommerce(), { wrapper });

      expect(result.current.ecommerces).toEqual([]);
    });

    it('debe leer datos cuando existen', () => {
      store.dispatch(setecommerces(mockecommerces));

      const { result } = renderHook(() => useecommerce(), { wrapper });

      expect(result.current.ecommerces).toHaveLength(2);
    });
  });

  describe('getTotal', () => {
    it('debe retornar el total de elementos', () => {
      store.dispatch(setecommerces(mockecommerces));

      const { result } = renderHook(() => useecommerce(), { wrapper });

      expect(result.current.getTotal()).toBe(2);
    });
  });
});
