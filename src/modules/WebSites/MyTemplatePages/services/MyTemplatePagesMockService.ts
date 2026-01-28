import { IMyTemplatePagesService } from './IMyTemplatePagesService';
import { MyTemplatePagesModel } from '../models/MyTemplatePagesModel';
import { ApiResponse } from '@/shared/types';

const MOCK_TEMPLATES: MyTemplatePagesModel[] = [
  {
    id: 1,
    name: 'Template Restaurante',
    description: 'Template elegante para restaurantes con menu interactivo',
    image: '/storage/templatesImages/template_01.png',
    palette: {
      ac: '#ffbc1f',
      bg: '#1D1F21',
      tx: '#FFFFFF',
      pr: '#ffbc1f',
      bg2: '#2c2e30',
      tx2: '#a2a2a2'
    },
    active: 1,
    count: 15,
    score: 4.5,
    scoreCount: 10,
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-20T14:45:00Z'
  },
  {
    id: 2,
    name: 'Template Tienda Online',
    description: 'Template moderno para e-commerce con carrito de compras',
    image: '/storage/templatesImages/template_02.png',
    palette: {
      ac: '#4CAF50',
      bg: '#FFFFFF',
      tx: '#333333',
      pr: '#2196F3',
      bg2: '#f5f5f5',
      tx2: '#666666'
    },
    active: 1,
    count: 23,
    score: 4.8,
    scoreCount: 18,
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2025-01-22T11:20:00Z'
  },
  {
    id: 3,
    name: 'Template Portfolio',
    description: 'Template minimalista para portafolios creativos',
    image: '/storage/templatesImages/template_03.png',
    palette: {
      ac: '#FF5722',
      bg: '#FAFAFA',
      tx: '#212121',
      pr: '#FF5722',
      bg2: '#EEEEEE',
      tx2: '#757575'
    },
    active: 1,
    count: 8,
    score: 4.2,
    scoreCount: 5,
    createdAt: '2025-01-18T16:00:00Z',
    updatedAt: '2025-01-25T09:30:00Z'
  }
];

type SetStateFn = (loading: boolean) => void;

export class MyTemplatePagesMockService implements IMyTemplatePagesService {
  async getAll(setLoading?: SetStateFn): Promise<ApiResponse<MyTemplatePagesModel[]>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading?.(false);

    return {
      status: 200,
      message: 'Success (mock)',
      data: MOCK_TEMPLATES,
    };
  }
}
