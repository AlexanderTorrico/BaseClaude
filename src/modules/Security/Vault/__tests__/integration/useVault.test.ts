/** @jsxImportSource react */
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useVault } from '../../hooks/useVault';
import { setVaults } from '../../slices/vaultSlice';
import { mockVaults } from '../fixtures/mockVault';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('useVault Hook', () => {
  beforeEach(() => {
    store.dispatch({ type: 'vault/clearVaults' });
  });

  describe('Lectura de estado', () => {
    it('debe leer datos vacíos inicialmente', () => {
      const { result } = renderHook(() => useVault(), { wrapper });

      expect(result.current.vaults).toEqual([]);
    });

    it('debe leer datos cuando existen', () => {
      store.dispatch(setVaults(mockVaults));

      const { result } = renderHook(() => useVault(), { wrapper });

      expect(result.current.vaults).toHaveLength(2);
    });
  });

  describe('getTotal', () => {
    it('debe retornar el total de elementos', () => {
      store.dispatch(setVaults(mockVaults));

      const { result } = renderHook(() => useVault(), { wrapper });

      expect(result.current.getTotal()).toBe(2);
    });
  });
});
