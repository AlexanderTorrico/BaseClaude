import { OrderModel, OrderStatus } from '../models/OrderModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

export interface IOrderService {
  getOrders(setLoading?: SetStateFn): Promise<ApiResponse<OrderModel[]>>;

  updateOrderStatus(
    orderId: number,
    status: OrderStatus,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<OrderModel>>;
}
