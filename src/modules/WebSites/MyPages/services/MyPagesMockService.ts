import { IMyPagesService } from './IMyPagesService';
import { MyPagesModel } from '../models/MyPagesModel';
import { MOCK_MY_PAGES } from '../data/mockMyPagesWithRoles';
import { ApiResponse } from '@/shared/types';

type SetStateFn = (loading: boolean) => void;

export class MyPagesMockService implements IMyPagesService {
  private mockPages: MyPagesModel[] = [...MOCK_MY_PAGES];

  async getAll(setLoading?: SetStateFn): Promise<ApiResponse<MyPagesModel[]>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simula latencia de red
    setLoading?.(false);

    return {
      status: 200,
      message: 'Success (mock)',
      data: [...this.mockPages],
    };
  }

  async updatePageName(pageId: number, newName: string, setLoading?: SetStateFn): Promise<ApiResponse<MyPagesModel | null>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula latencia de red
    setLoading?.(false);

    const pageIndex = this.mockPages.findIndex(p => p.id === pageId);

    if (pageIndex === -1) {
      return {
        status: 404,
        message: 'Página no encontrada',
        data: null,
      };
    }

    // Actualizar el nombre
    this.mockPages[pageIndex] = {
      ...this.mockPages[pageIndex],
      name: newName,
      updatedAt: new Date().toISOString(),
    };

    return {
      status: 200,
      message: 'Nombre actualizado exitosamente',
      data: { ...this.mockPages[pageIndex] },
    };
  }
}
