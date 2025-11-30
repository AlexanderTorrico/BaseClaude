export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed'
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  TRANSFER = 'transfer',
  MERCADO_PAGO = 'mercado_pago'
}

export interface OrderItemModel {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CustomerModel {
  fullName: string;
  phone: string;
  email: string;
  address?: string;
}

export interface OrderModel {
  id: number;
  orderNumber: string;
  createdAt: Date;
  status: OrderStatus;
  customer: CustomerModel;
  items: OrderItemModel[];
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
}

export interface OrderStatusInfo {
  key: OrderStatus;
  label: string;
  color: string;
  icon: string;
  nextStatus?: OrderStatus;
  whatsappMessage: string;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, OrderStatusInfo> = {
  [OrderStatus.PENDING]: {
    key: OrderStatus.PENDING,
    label: 'Pendiente',
    color: 'warning',
    icon: 'mdi-clock-outline',
    nextStatus: OrderStatus.CONFIRMED,
    whatsappMessage: 'Hola {customerName}, hemos recibido tu pedido #{orderNumber}. Pronto te confirmaremos los detalles.'
  },
  [OrderStatus.CONFIRMED]: {
    key: OrderStatus.CONFIRMED,
    label: 'Confirmado',
    color: 'info',
    icon: 'mdi-check-circle-outline',
    nextStatus: OrderStatus.SHIPPED,
    whatsappMessage: 'Hola {customerName}, tu pedido #{orderNumber} ha sido CONFIRMADO. Total: ${total}. Estamos preparándolo para el envío.'
  },
  [OrderStatus.SHIPPED]: {
    key: OrderStatus.SHIPPED,
    label: 'Enviado',
    color: 'primary',
    icon: 'mdi-truck-delivery-outline',
    nextStatus: OrderStatus.DELIVERED,
    whatsappMessage: 'Hola {customerName}, tu pedido #{orderNumber} ha sido ENVIADO. Pronto llegará a tu dirección: {address}.'
  },
  [OrderStatus.DELIVERED]: {
    key: OrderStatus.DELIVERED,
    label: 'Entregado',
    color: 'success',
    icon: 'mdi-package-variant-closed-check',
    nextStatus: undefined,
    whatsappMessage: 'Hola {customerName}, tu pedido #{orderNumber} ha sido ENTREGADO. ¡Gracias por tu compra! Esperamos verte pronto.'
  },
  [OrderStatus.CANCELLED]: {
    key: OrderStatus.CANCELLED,
    label: 'Cancelado',
    color: 'danger',
    icon: 'mdi-close-circle-outline',
    nextStatus: undefined,
    whatsappMessage: 'Hola {customerName}, lamentamos informarte que tu pedido #{orderNumber} ha sido CANCELADO. Si tienes alguna consulta, no dudes en contactarnos.'
  }
};

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string; icon: string }> = {
  [PaymentStatus.PENDING]: {
    label: 'Pendiente',
    color: 'warning',
    icon: 'mdi-clock-outline'
  },
  [PaymentStatus.PAID]: {
    label: 'Pagado',
    color: 'success',
    icon: 'mdi-check-circle'
  },
  [PaymentStatus.FAILED]: {
    label: 'Fallido',
    color: 'danger',
    icon: 'mdi-alert-circle'
  }
};

export const PAYMENT_METHOD_CONFIG: Record<PaymentMethod, { label: string; icon: string }> = {
  [PaymentMethod.CASH]: {
    label: 'Efectivo',
    icon: 'mdi-cash'
  },
  [PaymentMethod.CARD]: {
    label: 'Tarjeta',
    icon: 'mdi-credit-card'
  },
  [PaymentMethod.TRANSFER]: {
    label: 'Transferencia',
    icon: 'mdi-bank-transfer'
  },
  [PaymentMethod.MERCADO_PAGO]: {
    label: 'Mercado Pago',
    icon: 'mdi-cellphone'
  }
};
