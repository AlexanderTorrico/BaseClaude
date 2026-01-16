/** @jsxImportSource react */
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { usePaymentmethods } from '../../hooks/usePaymentmethods';
import { setPaymentmethodss } from '../../slices/paymentmethodsSlice';
import { mockPaymentmethodss } from '../fixtures/mockPaymentmethods';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('usePaymentmethods Hook', () => {
  beforeEach(() => {
    store.dispatch({ type: 'paymentmethods/clearPaymentmethodss' });
  });

  describe('Lectura de estado', () => {
    it('debe leer datos vacíos inicialmente', () => {
      const { result } = renderHook(() => usePaymentmethods(), { wrapper });

      expect(result.current.paymentmethodss).toEqual([]);
    });

    it('debe leer datos cuando existen', () => {
      store.dispatch(setPaymentmethodss(mockPaymentmethodss));

      const { result } = renderHook(() => usePaymentmethods(), { wrapper });

      expect(result.current.paymentmethodss).toHaveLength(2);
    });
  });

  describe('getTotal', () => {
    it('debe retornar el total de elementos', () => {
      store.dispatch(setPaymentmethodss(mockPaymentmethodss));

      const { result } = renderHook(() => usePaymentmethods(), { wrapper });

      expect(result.current.getTotal()).toBe(2);
    });
  });
});
