import { useState } from 'react';
import { store } from '@/store';
import { IOrderService } from '../services/IOrderService';
import { setOrders, updateOrderStatus as updateOrderStatusAction } from '../slices/orderSlice';
import { OrderStatus, ORDER_STATUS_CONFIG } from '../models/OrderModel';

export const useOrdersFetch = (service: IOrderService) => {
  const [loading, setLoading] = useState(false);

  const fetchOrders = async (): Promise<void> => {
    const result = await service.getOrders(setLoading);
    store.dispatch(setOrders(result.data));
  };

  const updateOrderStatus = async (
    orderId: number,
    newStatus: OrderStatus
  ): Promise<{ success: boolean; message: string }> => {
    const result = await service.updateOrderStatus(orderId, newStatus, setLoading);

    if (result.status !== 200) {
      return {
        success: false,
        message: result.message || 'Error al actualizar el estado'
      };
    }

    if (result.data) {
      store.dispatch(updateOrderStatusAction({ orderId, status: newStatus }));
    }

    return {
      success: true,
      message: 'Estado actualizado exitosamente'
    };
  };

  const advanceOrderStatus = async (
    orderId: number,
    currentStatus: OrderStatus
  ): Promise<{ success: boolean; message: string; whatsappUrl?: string }> => {
    const config = ORDER_STATUS_CONFIG[currentStatus];

    if (!config.nextStatus) {
      return {
        success: false,
        message: 'Esta orden no puede avanzar de estado'
      };
    }

    const result = await updateOrderStatus(orderId, config.nextStatus);

    if (result.success) {
      const order = store.getState().security_orders.list.find(o => o.id === orderId);
      if (order) {
        const whatsappUrl = generateWhatsAppUrl(order.customer.phone, config.nextStatus, {
          customerName: order.customer.fullName,
          orderNumber: order.orderNumber,
          total: order.total.toLocaleString('es-AR'),
          address: order.customer.address || 'No especificada'
        });

        return {
          ...result,
          whatsappUrl
        };
      }
    }

    return result;
  };

  const cancelOrder = async (
    orderId: number
  ): Promise<{ success: boolean; message: string; whatsappUrl?: string }> => {
    const result = await updateOrderStatus(orderId, OrderStatus.CANCELLED);

    if (result.success) {
      const order = store.getState().security_orders.list.find(o => o.id === orderId);
      if (order) {
        const whatsappUrl = generateWhatsAppUrl(order.customer.phone, OrderStatus.CANCELLED, {
          customerName: order.customer.fullName,
          orderNumber: order.orderNumber,
          total: order.total.toLocaleString('es-AR'),
          address: order.customer.address || 'No especificada'
        });

        return {
          ...result,
          whatsappUrl
        };
      }
    }

    return result;
  };

  return {
    loading,
    fetchOrders,
    updateOrderStatus,
    advanceOrderStatus,
    cancelOrder
  };
};

const generateWhatsAppUrl = (
  phone: string,
  status: OrderStatus,
  data: { customerName: string; orderNumber: string; total: string; address: string }
): string => {
  const config = ORDER_STATUS_CONFIG[status];

  let message = config.whatsappMessage
    .replace('{customerName}', data.customerName)
    .replace('{orderNumber}', data.orderNumber)
    .replace('{total}', data.total)
    .replace('{address}', data.address);

  const cleanPhone = phone.replace(/\D/g, '');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
