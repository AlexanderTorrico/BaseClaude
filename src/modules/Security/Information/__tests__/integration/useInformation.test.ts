/** @jsxImportSource react */
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useInformation } from '../../hooks/useInformation';
import { setInformations } from '../../slices/informationSlice';
import { mockInformations } from '../fixtures/mockInformation';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('useInformation Hook', () => {
  beforeEach(() => {
    store.dispatch({ type: 'information/clearInformations' });
  });

  describe('Lectura de estado', () => {
    it('debe leer datos vacíos inicialmente', () => {
      const { result } = renderHook(() => useInformation(), { wrapper });

      expect(result.current.informations).toEqual([]);
    });

    it('debe leer datos cuando existen', () => {
      store.dispatch(setInformations(mockInformations));

      const { result } = renderHook(() => useInformation(), { wrapper });

      expect(result.current.informations).toHaveLength(2);
    });
  });

  describe('getTotal', () => {
    it('debe retornar el total de elementos', () => {
      store.dispatch(setInformations(mockInformations));

      const { result } = renderHook(() => useInformation(), { wrapper });

      expect(result.current.getTotal()).toBe(2);
    });
  });
});
