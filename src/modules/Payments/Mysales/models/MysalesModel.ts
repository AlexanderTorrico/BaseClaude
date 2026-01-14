import { PaymentMethodType, PaymentMethodProvider } from '../../Paymentmethods/models/PaymentmethodsModel';

// ============================================
// TIPOS BASE
// ============================================

export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'refunded' | 'cancelled';

// ============================================
// INFORMACIÓN DEL CLIENTE
// ============================================

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
}

// ============================================
// INFORMACIÓN DEL MÉTODO DE PAGO
// ============================================

export interface PaymentMethodInfo {
  id: number;
  name: string;
  type: PaymentMethodType;
  provider: PaymentMethodProvider;
  icon: string;
  color: string;
}

// ============================================
// INFORMACIÓN DE LA CUENTA DE PAGO
// ============================================

export interface PaymentAccountInfo {
  id: number;
  alias: string;
  description?: string;
}

// ============================================
// INFORMACIÓN DE LA PÁGINA/TIENDA
// ============================================

export interface PageInfo {
  id: number;
  name: string;
  domain: string;
  image?: string;
}

// ============================================
// DETALLE DE MONTOS
// ============================================

export interface TransactionAmounts {
  gross: number;           // Monto bruto (lo que pagó el cliente)
  commission: number;      // Comisión cobrada
  net: number;             // Monto neto (gross - commission)
  currency: string;        // Moneda (USD, EUR, etc.)
}

// ============================================
// MODELO PRINCIPAL DE TRANSACCIÓN/VENTA
// ============================================

export interface SaleTransactionModel {
  id: number;
  transactionId: string;           // ID único de transacción (ej: TXN-2024-001234)
  orderReference: string;          // Referencia del pedido (ej: ORD-001234)
  status: TransactionStatus;
  amounts: TransactionAmounts;
  customer: CustomerInfo;
  paymentMethod: PaymentMethodInfo;
  paymentAccount: PaymentAccountInfo;
  page: PageInfo;
  description?: string;            // Descripción del producto/servicio
  createdAt: string;               // Fecha de creación
  completedAt?: string;            // Fecha de completado (si aplica)
  metadata?: Record<string, any>;  // Datos adicionales
}

// ============================================
// MODELO PARA KPIs DEL DASHBOARD
// ============================================

export interface SalesKPIs {
  totalGross: number;
  totalNet: number;
  totalCommissions: number;
  transactionCount: number;
  completedCount: number;
  pendingCount: number;
  failedCount: number;
  refundedCount: number;
  currency: string;
}

// ============================================
// FILTROS
// ============================================

export interface SalesFilters {
  dateFrom?: string;
  dateTo?: string;
  status?: TransactionStatus;
  paymentMethodId?: number;
  paymentAccountId?: number;
  pageId?: number;
}
