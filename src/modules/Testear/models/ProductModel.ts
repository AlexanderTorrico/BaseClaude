import { CategoryModel } from './CategoryModel';

/**
 * Modelo de Producto para la UI (mapeado desde la API o mock)
 */
export interface ProductModel {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  category: CategoryModel;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
