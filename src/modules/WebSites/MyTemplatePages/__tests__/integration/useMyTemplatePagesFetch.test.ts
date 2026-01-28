/** @jsxImportSource react */
import React from 'vitest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useMyTemplatePagesFetch } from '../../hooks/useMyTemplatePagesFetch';
import { IMyTemplatePagesService } from '../../services/IMyTemplatePagesService';
import { mockMyTemplatePagess } from '../fixtures/mockMyTemplatePages';

const createMockService = (): IMyTemplatePagesService => ({
  getAll: vi.fn(),
});

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('useMyTemplatePagesFetch Hook', () => {
  let mockService: IMyTemplatePagesService;

  beforeEach(() => {
    mockService = createMockService();
    store.dispatch({ type: 'mytemplatepages/clearMyTemplatePagess' });
    vi.clearAllMocks();
  });

  it('debe obtener datos exitosamente', async () => {
    vi.mocked(mockService.getAll).mockResolvedValue({
      status: 200,
      message: 'Success',
      data: mockMyTemplatePagess,
    });

    const { result } = renderHook(() => useMyTemplatePagesFetch(mockService), { wrapper });

    await act(async () => {
      await result.current.fetchAll();
    });

    expect(mockService.getAll).toHaveBeenCalled();
    expect(store.getState().mytemplatepages.list).toHaveLength(2);
  });

  it('debe manejar errores', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(mockService.getAll).mockResolvedValue({
      status: 500,
      message: 'Error',
      data: [],
    });

    const { result } = renderHook(() => useMyTemplatePagesFetch(mockService), { wrapper });

    await act(async () => {
      await result.current.fetchAll();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
