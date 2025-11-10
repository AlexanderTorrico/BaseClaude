/** @jsxImportSource react */
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useUsers } from '../../hooks/useUsers';
import { setUsers } from '../../slices/userSlice';
import { mockUsers } from '../fixtures/mockUsers';

/**
 * Integration Tests para useUsers hook
 * Prueba la integración del hook con Redux store
 */

// Helper para renderizar hooks con Provider
const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('useUsers Hook', () => {
  beforeEach(() => {
    store.dispatch({ type: 'users/clearUsers' });
  });

  describe('Lectura de estado', () => {
    it('debe leer users vacío inicialmente', () => {
      const { result } = renderHook(() => useUsers(), { wrapper });

      expect(result.current.users).toEqual([]);
    });

    it('debe leer currentView por defecto', () => {
      const { result } = renderHook(() => useUsers(), { wrapper });

      expect(result.current.currentView).toBe('0');
    });

    it('debe leer users cuando hay datos', () => {
      store.dispatch(setUsers(mockUsers));

      const { result } = renderHook(() => useUsers(), { wrapper });

      expect(result.current.users).toHaveLength(2);
      expect(result.current.users[0]?.fullName).toBe('Juan Pérez');
    });
  });

  describe('getTotalUsers', () => {
    it('debe retornar 0 cuando no hay usuarios', () => {
      const { result } = renderHook(() => useUsers(), { wrapper });

      expect(result.current.getTotalUsers()).toBe(0);
    });

    it('debe retornar el número de usuarios', () => {
      store.dispatch(setUsers(mockUsers));

      const { result } = renderHook(() => useUsers(), { wrapper });

      expect(result.current.getTotalUsers()).toBe(2);
    });
  });

  describe('findUserByEmail', () => {
    beforeEach(() => {
      store.dispatch(setUsers(mockUsers));
    });

    it('debe encontrar usuario por email', () => {
      const { result } = renderHook(() => useUsers(), { wrapper });

      const user = result.current.findUserByEmail('juan@example.com');

      expect(user?.fullName).toBe('Juan Pérez');
    });

    it('debe retornar undefined si no existe', () => {
      const { result } = renderHook(() => useUsers(), { wrapper });

      const user = result.current.findUserByEmail('noexiste@example.com');

      expect(user).toBeUndefined();
    });
  });

  describe('findUserById', () => {
    beforeEach(() => {
      store.dispatch(setUsers(mockUsers));
    });

    it('debe encontrar usuario por ID', () => {
      const { result } = renderHook(() => useUsers(), { wrapper });

      const user = result.current.findUserById(1);

      expect(user?.fullName).toBe('Juan Pérez');
      expect(user?.id).toBe(1);
    });

    it('debe retornar undefined si no existe', () => {
      const { result } = renderHook(() => useUsers(), { wrapper });

      const user = result.current.findUserById(999);

      expect(user).toBeUndefined();
    });
  });
});
