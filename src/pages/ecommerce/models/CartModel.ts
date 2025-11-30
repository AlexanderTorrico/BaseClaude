import { ProductModel } from './ProductModel';

export interface CartItemModel {
  product: ProductModel;
  quantity: number;
  addedAt: string;
}

export interface CartModel {
  items: CartItemModel[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface WishlistItemModel {
  product: ProductModel;
  addedAt: string;
  note?: string;
}

export interface CompareItemModel {
  product: ProductModel;
  addedAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderTrackingModel {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  estimatedDelivery: string;
  actualDelivery?: string;
  items: CartItemModel[];
  total: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    region: string;
    country: string;
    postalCode: string;
    phone: string;
  };
  timeline: {
    status: OrderStatus;
    date: string;
    location?: string;
    description: string;
    completed: boolean;
  }[];
  carrier?: string;
  trackingNumber?: string;
  currentLocation?: string;
}

export interface ReviewModel {
  id: string;
  productId: number;
  orderId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  images?: string[];
  verifiedPurchase: boolean;
  helpful: number;
  createdAt: string;
  response?: {
    from: string;
    message: string;
    date: string;
  };
}

export interface ReviewFormData {
  productId: number;
  orderId: string;
  rating: number;
  title: string;
  comment: string;
  pros: string;
  cons: string;
  recommendProduct: boolean;
}
