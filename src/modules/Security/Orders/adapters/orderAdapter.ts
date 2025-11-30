import {
  OrderModel,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  OrderItemModel,
  CustomerModel
} from '../models/OrderModel';

export const adaptOrderResponseToOrderModel = (apiData: any): OrderModel => {
  return {
    id: apiData.id,
    orderNumber: apiData.order_number || apiData.orderNumber,
    createdAt: new Date(apiData.created_at || apiData.createdAt),
    status: apiData.status as OrderStatus,
    customer: adaptCustomerData(apiData.customer),
    items: (apiData.items || []).map(adaptOrderItemData),
    subtotal: apiData.subtotal || 0,
    total: apiData.total || 0,
    paymentMethod: apiData.payment_method || apiData.paymentMethod as PaymentMethod,
    paymentStatus: apiData.payment_status || apiData.paymentStatus as PaymentStatus,
    notes: apiData.notes
  };
};

const adaptCustomerData = (customerData: any): CustomerModel => {
  return {
    fullName: customerData?.full_name || customerData?.fullName || '',
    phone: customerData?.phone || '',
    email: customerData?.email || '',
    address: customerData?.address
  };
};

const adaptOrderItemData = (itemData: any): OrderItemModel => {
  return {
    id: itemData.id,
    productName: itemData.product_name || itemData.productName,
    quantity: itemData.quantity,
    unitPrice: itemData.unit_price || itemData.unitPrice,
    subtotal: itemData.subtotal
  };
};

export const adaptOrdersResponseToOrderModels = (apiData: any[]): OrderModel[] => {
  return apiData.map(adaptOrderResponseToOrderModel);
};
