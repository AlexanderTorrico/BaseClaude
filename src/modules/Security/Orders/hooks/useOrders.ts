import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { OrderModel, OrderStatus, ORDER_STATUS_CONFIG } from '../models/OrderModel';

const URGENT_HOURS_THRESHOLD = 2;

export const useOrders = () => {
  const orders = useSelector((state: RootState) => state.security_orders.list);
  const currentView = useSelector((state: RootState) => state.security_orders.currentView);
  const activeTab = useSelector((state: RootState) => state.security_orders.activeTab);

  const getOrdersForActiveTab = (): OrderModel[] => {
    return orders.filter(order => order.status === activeTab);
  };

  const getTotalOrders = (): number => {
    return orders.length;
  };

  const getOrdersByStatus = (status: OrderStatus): OrderModel[] => {
    return orders.filter(order => order.status === status);
  };

  const getOrderCountByStatus = (status: OrderStatus): number => {
    return orders.filter(order => order.status === status).length;
  };

  const findOrderById = (orderId: number): OrderModel | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const findOrderByNumber = (orderNumber: string): OrderModel | undefined => {
    return orders.find(order => order.orderNumber === orderNumber);
  };

  const getStatusSummary = () => {
    return {
      pending: getOrderCountByStatus(OrderStatus.PENDING),
      confirmed: getOrderCountByStatus(OrderStatus.CONFIRMED),
      shipped: getOrderCountByStatus(OrderStatus.SHIPPED),
      delivered: getOrderCountByStatus(OrderStatus.DELIVERED),
      cancelled: getOrderCountByStatus(OrderStatus.CANCELLED)
    };
  };

  const isOrderUrgent = (order: OrderModel): boolean => {
    if (order.status !== OrderStatus.PENDING) return false;

    const hoursSinceCreation = (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60);
    return hoursSinceCreation >= URGENT_HOURS_THRESHOLD;
  };

  const getUrgentOrdersCount = (): number => {
    return orders.filter(isOrderUrgent).length;
  };

  const canChangeStatus = (currentStatus: OrderStatus): boolean => {
    const config = ORDER_STATUS_CONFIG[currentStatus];
    return config.nextStatus !== undefined;
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | undefined => {
    return ORDER_STATUS_CONFIG[currentStatus].nextStatus;
  };

  return {
    orders,
    currentView,
    activeTab,
    getOrdersForActiveTab,
    getTotalOrders,
    getOrdersByStatus,
    getOrderCountByStatus,
    findOrderById,
    findOrderByNumber,
    getStatusSummary,
    isOrderUrgent,
    getUrgentOrdersCount,
    canChangeStatus,
    getNextStatus
  };
};
