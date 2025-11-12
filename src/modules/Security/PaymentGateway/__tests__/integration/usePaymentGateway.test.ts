/** @jsxImportSource react */
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { usePaymentGateway } from '../../hooks/usePaymentGateway';
import { setPaymentGateways } from '../../slices/paymentgatewaySlice';
import { mockPaymentGateways } from '../fixtures/mockPaymentGateway';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('usePaymentGateway Hook', () => {
  beforeEach(() => {
    store.dispatch({ type: 'paymentgateway/clearPaymentGateways' });
  });

  describe('Lectura de estado', () => {
    it('debe leer datos vacíos inicialmente', () => {
      const { result } = renderHook(() => usePaymentGateway(), { wrapper });

      expect(result.current.paymentgateways).toEqual([]);
    });

    it('debe leer datos cuando existen', () => {
      store.dispatch(setPaymentGateways(mockPaymentGateways));

      const { result } = renderHook(() => usePaymentGateway(), { wrapper });

      expect(result.current.paymentgateways).toHaveLength(2);
    });
  });

  describe('getTotal', () => {
    it('debe retornar el total de elementos', () => {
      store.dispatch(setPaymentGateways(mockPaymentGateways));

      const { result } = renderHook(() => usePaymentGateway(), { wrapper });

      expect(result.current.getTotal()).toBe(2);
    });
  });
});
