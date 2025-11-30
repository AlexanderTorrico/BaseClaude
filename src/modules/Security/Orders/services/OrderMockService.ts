import { IOrderService } from './IOrderService';
import { OrderModel, OrderStatus } from '../models/OrderModel';
import { MOCK_ORDERS } from '../data/mockOrders';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

export class OrderMockService implements IOrderService {
  private mockOrders: OrderModel[] = [...MOCK_ORDERS];

  async getOrders(setLoading?: SetStateFn): Promise<ApiResponse<OrderModel[]>> {
    setLoading?.(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    setLoading?.(false);

    return {
      status: 200,
      message: 'Success',
      data: [...this.mockOrders]
    };
  }

  async updateOrderStatus(
    orderId: number,
    status: OrderStatus,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<OrderModel>> {
    setLoading?.(true);

    await new Promise(resolve => setTimeout(resolve, 300));

    const orderIndex = this.mockOrders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
      setLoading?.(false);
      return {
        status: 404,
        message: 'Orden no encontrada',
        data: null as unknown as OrderModel
      };
    }

    this.mockOrders[orderIndex] = {
      ...this.mockOrders[orderIndex],
      status
    };

    setLoading?.(false);

    return {
      status: 200,
      message: 'Estado actualizado exitosamente',
      data: { ...this.mockOrders[orderIndex] }
    };
  }
}
