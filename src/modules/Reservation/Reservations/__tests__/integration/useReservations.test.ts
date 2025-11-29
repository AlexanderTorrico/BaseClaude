/** @jsxImportSource react */
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useReservations } from '../../hooks/useReservations';
import { setReservationss } from '../../slices/reservationsSlice';
import { mockReservationss } from '../fixtures/mockReservations';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('useReservations Hook', () => {
  beforeEach(() => {
    store.dispatch({ type: 'reservations/clearReservationss' });
  });

  describe('Lectura de estado', () => {
    it('debe leer datos vacíos inicialmente', () => {
      const { result } = renderHook(() => useReservations(), { wrapper });

      expect(result.current.reservationss).toEqual([]);
    });

    it('debe leer datos cuando existen', () => {
      store.dispatch(setReservationss(mockReservationss));

      const { result } = renderHook(() => useReservations(), { wrapper });

      expect(result.current.reservationss).toHaveLength(2);
    });
  });

  describe('getTotal', () => {
    it('debe retornar el total de elementos', () => {
      store.dispatch(setReservationss(mockReservationss));

      const { result } = renderHook(() => useReservations(), { wrapper });

      expect(result.current.getTotal()).toBe(2);
    });
  });
});
