/** @jsxImportSource react */
import React from 'vitest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useMyPagesFetch } from '../../hooks/useMyPagesFetch';
import { IMyPagesService } from '../../services/IMyPagesService';
import { mockMyPagess } from '../fixtures/mockMyPages';

const createMockService = (): IMyPagesService => ({
  getAll: vi.fn(),
});

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('useMyPagesFetch Hook', () => {
  let mockService: IMyPagesService;

  beforeEach(() => {
    mockService = createMockService();
    store.dispatch({ type: 'mypages/clearMyPagess' });
    vi.clearAllMocks();
  });

  it('debe obtener datos exitosamente', async () => {
    vi.mocked(mockService.getAll).mockResolvedValue({
      status: 200,
      message: 'Success',
      data: mockMyPagess,
    });

    const { result } = renderHook(() => useMyPagesFetch(mockService), { wrapper });

    await act(async () => {
      await result.current.fetchAll();
    });

    expect(mockService.getAll).toHaveBeenCalled();
    expect(store.getState().mypages.list).toHaveLength(2);
  });

  it('debe manejar errores', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(mockService.getAll).mockResolvedValue({
      status: 500,
      message: 'Error',
      data: [],
    });

    const { result } = renderHook(() => useMyPagesFetch(mockService), { wrapper });

    await act(async () => {
      await result.current.fetchAll();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
