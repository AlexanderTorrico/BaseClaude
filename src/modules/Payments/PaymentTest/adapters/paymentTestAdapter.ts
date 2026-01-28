import {
  TestTransactionModel,
  TransactionApiResponse,
  CreateOrderApiResponse,
  CaptureOrderApiResponse,
  OrderStatusApiResponse,
} from '../models/PaymentTestModel';

/**
 * Adaptar respuesta de API de transacción a modelo frontend
 */
export const adaptTransactionToModel = (api: TransactionApiResponse): TestTransactionModel => ({
  uuid: api.uuid,
  companyId: api.gbl_company_id,
  branchId: api.gbl_company_branch_id,
  paypalOrderId: api.paypal_order_id,
  paypalCaptureId: api.paypal_capture_id,
  paypalPayerId: api.paypal_payer_id,
  amount: parseFloat(api.amount),
  currency: api.currency,
  status: api.status,
  payerEmail: api.payer_email,
  payerName: api.payer_name,
  payerCountryCode: api.payer_country_code,
  description: api.description,
  internalReference: api.internal_reference,
  approveUrl: null,
  mode: 'sandbox', // Por defecto sandbox en pruebas
  isTest: true,
  createdAt: api.created_at,
  approvedAt: api.approved_at,
  capturedAt: api.captured_at,
  failedAt: api.failed_at,
});

/**
 * Adaptar array de transacciones
 */
export const adaptTransactionsToModels = (apis: TransactionApiResponse[]): TestTransactionModel[] =>
  apis.map(adaptTransactionToModel);

/**
 * Adaptar respuesta de crear orden a transacción parcial
 */
export const adaptCreateOrderToTransaction = (
  api: CreateOrderApiResponse,
  companyId: number,
  amount: number,
  currency: string,
  description?: string
): TestTransactionModel => ({
  uuid: api.transaction_uuid,
  companyId,
  branchId: null,
  paypalOrderId: api.paypal_order_id,
  paypalCaptureId: null,
  paypalPayerId: null,
  amount,
  currency,
  status: 'created',
  payerEmail: null,
  payerName: null,
  payerCountryCode: null,
  description: description || null,
  internalReference: null,
  approveUrl: api.approve_url,
  mode: 'sandbox',
  isTest: true,
  createdAt: new Date().toISOString(),
  approvedAt: null,
  capturedAt: null,
  failedAt: null,
});

/**
 * Adaptar respuesta de captura a actualización de transacción
 */
export const adaptCaptureToTransaction = (
  api: CaptureOrderApiResponse,
  existing: TestTransactionModel
): TestTransactionModel => ({
  ...existing,
  status: 'captured',
  payerEmail: api.payer?.email || existing.payerEmail,
  payerName: api.payer?.name || existing.payerName,
  paypalCaptureId: api.capture?.id || null,
  capturedAt: new Date().toISOString(),
});

/**
 * Adaptar respuesta de estado
 */
export const adaptOrderStatus = (
  api: OrderStatusApiResponse,
  existing: TestTransactionModel
): TestTransactionModel => ({
  ...existing,
  status: api.local_status,
  approvedAt: api.local_status === 'approved' ? new Date().toISOString() : existing.approvedAt,
});
