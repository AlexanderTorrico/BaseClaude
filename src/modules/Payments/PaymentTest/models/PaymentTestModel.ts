// ============================================
// TIPOS PARA PRUEBAS DE PAGO
// ============================================

import { TransactionStatus, PaymentConfigMode } from '../../Paymentmethods/models/PaymentmethodsModel';

/**
 * Modelo de transacción de prueba
 */
export interface TestTransactionModel {
  uuid: string;
  companyId: number;
  branchId: number | null;
  paypalOrderId: string | null;
  paypalCaptureId: string | null;
  paypalPayerId: string | null;
  amount: number;
  currency: string;
  status: TransactionStatus;
  payerEmail: string | null;
  payerName: string | null;
  payerCountryCode: string | null;
  description: string | null;
  internalReference: string | null;
  approveUrl: string | null;
  mode: PaymentConfigMode;
  isTest: boolean;
  createdAt: string;
  approvedAt: string | null;
  capturedAt: string | null;
  failedAt: string | null;
}

/**
 * Respuesta de la API al crear orden
 */
export interface CreateOrderApiResponse {
  transaction_uuid: string;
  paypal_order_id: string;
  status: string;
  approve_url: string | null;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

/**
 * Respuesta de la API al capturar orden
 */
export interface CaptureOrderApiResponse {
  transaction_uuid: string;
  paypal_order_id: string;
  status: string;
  payer: {
    email: string | null;
    name: string | null;
  };
  capture: {
    id: string;
    status: string;
    amount: {
      currency_code: string;
      value: string;
    };
  } | null;
}

/**
 * Respuesta de la API al consultar estado
 */
export interface OrderStatusApiResponse {
  transaction_uuid: string;
  local_status: TransactionStatus;
  paypal_status: string;
  paypal_order_id: string;
  amount: {
    currency_code: string;
    value: string;
  } | null;
}

/**
 * Respuesta de la API de transacciones
 */
export interface TransactionApiResponse {
  id: number;
  uuid: string;
  gbl_company_id: number;
  gbl_company_branch_id: number | null;
  ped_shopping_cart_id: number | null;
  pay_method_id: number;
  paypal_order_id: string | null;
  paypal_capture_id: string | null;
  paypal_payer_id: string | null;
  amount: string;
  currency: string;
  status: TransactionStatus;
  payer_email: string | null;
  payer_name: string | null;
  payer_country_code: string | null;
  description: string | null;
  internal_reference: string | null;
  metadata: Record<string, unknown> | null;
  approved_at: string | null;
  captured_at: string | null;
  failed_at: string | null;
  created_at: string;
  updated_at: string;
  pay_method?: {
    id: number;
    code: string;
    name: string;
    icon: string | null;
  };
}

/**
 * DTO para crear orden de prueba
 */
export interface CreateTestOrderDto {
  gbl_company_id: number;
  amount: number;
  currency?: string;
  description?: string;
  return_url?: string;
  cancel_url?: string;
}

/**
 * DTO para capturar orden
 */
export interface CaptureOrderDto {
  paypal_order_id: string;
  gbl_company_id: number;
}

/**
 * DTO para consultar estado
 */
export interface OrderStatusDto {
  paypal_order_id: string;
  gbl_company_id: number;
}

/**
 * Filtros para historial de transacciones
 */
export interface TransactionFilters {
  status?: TransactionStatus;
  from_date?: string;
  to_date?: string;
  per_page?: number;
}

/**
 * Estadisticas de transacciones
 */
export interface TransactionStats {
  period: {
    from: string;
    to: string;
  };
  summary: {
    total_transactions: number;
    successful_transactions: number;
    success_rate: number;
    total_captured: number;
  };
  by_status: Record<string, { count: number; total_amount: number }>;
}

/**
 * Configuración de PayPal disponible para pruebas
 */
export interface PayPalConfigForTest {
  uuid: string;
  mode: PaymentConfigMode;
  defaultCurrency: string;
  brandName: string | null;
  isVerified: boolean;
}

/**
 * Constantes de estado
 */
export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, { label: string; color: string }> = {
  created: { label: 'Creada', color: 'info' },
  approved: { label: 'Aprobada', color: 'primary' },
  captured: { label: 'Capturada', color: 'success' },
  failed: { label: 'Fallida', color: 'danger' },
  cancelled: { label: 'Cancelada', color: 'warning' },
  refunded: { label: 'Reembolsada', color: 'secondary' },
  partially_refunded: { label: 'Reembolso parcial', color: 'secondary' },
};

/**
 * Monedas soportadas para pruebas
 */
export const SUPPORTED_CURRENCIES = [
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
];
