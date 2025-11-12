/** @jsxImportSource react */
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useReservation } from '../../hooks/useReservation';
import { setReservations } from '../../slices/reservationSlice';
import { mockReservations } from '../fixtures/mockReservation';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('useReservation Hook', () => {
  beforeEach(() => {
    store.dispatch({ type: 'reservation/clearReservations' });
  });

  describe('Lectura de estado', () => {
    it('debe leer datos vacíos inicialmente', () => {
      const { result } = renderHook(() => useReservation(), { wrapper });

      expect(result.current.reservations).toEqual([]);
    });

    it('debe leer datos cuando existen', () => {
      store.dispatch(setReservations(mockReservations));

      const { result } = renderHook(() => useReservation(), { wrapper });

      expect(result.current.reservations).toHaveLength(2);
    });
  });

  describe('getTotal', () => {
    it('debe retornar el total de elementos', () => {
      store.dispatch(setReservations(mockReservations));

      const { result } = renderHook(() => useReservation(), { wrapper });

      expect(result.current.getTotal()).toBe(2);
    });
  });
});
