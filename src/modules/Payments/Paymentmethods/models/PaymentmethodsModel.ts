// ============================================
// TIPOS BASE
// ============================================

export type PaymentMethodType = 'card' | 'bank_transfer' | 'cash' | 'digital_wallet';

export type PaymentMethodProvider =
  | 'visa'
  | 'mastercard'
  | 'klarna'
  | 'revolut'
  | 'paypal'
  | 'cash';

export type PaymentConfigMode = 'sandbox' | 'production';

// ============================================
// RESPUESTAS DEL BACKEND (API Response Types)
// ============================================

export interface PayMethodApiResponse {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string | null;
  image: string | null;
  is_active: boolean;
}

export interface PayCompanyPaymentConfigApiResponse {
  uuid: string;
  gbl_company_id: number;
  pay_method_id: number;
  pay_method: PayMethodApiResponse | null;
  mode: PaymentConfigMode;
  return_url: string | null;
  cancel_url: string | null;
  brand_name: string | null;
  default_currency: string;
  is_active: boolean;
  is_verified: boolean;
  verified_at: string | null;
  has_credentials: boolean;
  created_at: string;
  updated_at: string;
}

export interface PayBranchAssignmentApiResponse {
  id: number;
  gbl_company_branch_id: number;
  pay_company_payment_config_id: number;
  pay_method: PayMethodApiResponse | null;
  config: {
    mode: PaymentConfigMode;
    is_verified: boolean;
    default_currency: string;
  };
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface PayTransactionApiResponse {
  id: number;
  uuid: string;
  gbl_company_id: number;
  gbl_company_branch_id: number | null;
  ped_shopping_cart_id: number | null;
  paypal_order_id: string | null;
  paypal_capture_id: string | null;
  amount: number;
  currency: string;
  status: TransactionStatus;
  payer_email: string | null;
  payer_name: string | null;
  description: string | null;
  created_at: string;
  captured_at: string | null;
}

export type TransactionStatus =
  | 'created'
  | 'approved'
  | 'captured'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded';

// ============================================
// MÉTODO DE PAGO (FIJO - definido por plataforma)
// ============================================

export interface PaymentMethodModel {
  id: number;
  code: string;
  name: string;
  description: string;
  type: PaymentMethodType;
  provider: PaymentMethodProvider;
  icon: string;
  image: string | null;
  color: string;
  requiresCredentials: boolean;
  credentialFields: string[];
  supportedCurrencies: string[];
  defaultCommissionPercentage: number;
  defaultFixedCommission: number;
}

// ============================================
// CONFIGURACIÓN DE PAGO (CONFIGURABLE - creada por usuario)
// ============================================

export interface PaymentConfigCredentials {
  clientId: string;
  clientSecret: string;
}

export interface PaymentConfigModel {
  uuid: string;
  companyId: number;
  paymentMethodId: number;
  paymentMethod: PaymentMethodModel | null;
  mode: PaymentConfigMode;
  returnUrl: string | null;
  cancelUrl: string | null;
  brandName: string | null;
  defaultCurrency: string;
  isActive: boolean;
  isVerified: boolean;
  verifiedAt: string | null;
  hasCredentials: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// CUENTA DE PAGO (LEGACY - mantener compatibilidad)
// ============================================

export interface PaymentAccountCredentials {
  // PayPal
  paypalClientId?: string;
  paypalClientSecret?: string;
  paypalMode?: 'sandbox' | 'live';

  // Otros métodos (para escalabilidad futura)
  merchantId?: string;
  terminalId?: string;
  apiKey?: string;
  secretKey?: string;
  klarnaUsername?: string;
  klarnaPassword?: string;
  klarnaApiKey?: string;
  revolutApiKey?: string;
  revolutMerchantId?: string;
  revolutWebhookSecret?: string;
}

export interface PaymentAccountLimits {
  minAmount: number;
  maxAmount: number;
  dailyLimit?: number;
  monthlyLimit?: number;
}

export interface PaymentAccountSchedule {
  enabled: boolean;
  startTime?: string;
  endTime?: string;
  daysOfWeek?: number[];
}

export interface PaymentAccountModel {
  uuid: string;
  paymentMethodId: number;
  alias: string;
  description?: string;
  isActive: boolean;
  isDefault: boolean;
  commissionPercentage: number;
  fixedCommission: number;
  currencies: string[];
  credentials: PaymentAccountCredentials;
  limits: PaymentAccountLimits;
  schedule: PaymentAccountSchedule;
  createdAt: string;
  updatedAt: string;
  // Nuevos campos del backend
  mode?: PaymentConfigMode;
  isVerified?: boolean;
  verifiedAt?: string | null;
}

// ============================================
// DTOs PARA CREAR/ACTUALIZAR
// ============================================

export interface CreatePaymentConfigDto {
  gbl_company_id: number;
  pay_method_id: number;
  client_id: string;
  client_secret: string;
  mode: PaymentConfigMode;
  return_url?: string;
  cancel_url?: string;
  brand_name?: string;
  default_currency?: string;
}

export interface UpdatePaymentConfigDto {
  client_id?: string;
  client_secret?: string;
  mode?: PaymentConfigMode;
  return_url?: string;
  cancel_url?: string;
  brand_name?: string;
  default_currency?: string;
}

// Legacy DTOs (mantener compatibilidad con UI actual)
export interface CreatePaymentAccountDto {
  paymentMethodId: number;
  alias: string;
  description?: string;
  isActive: boolean;
  isDefault: boolean;
  commissionPercentage: number;
  fixedCommission: number;
  currencies: string[];
  credentials: PaymentAccountCredentials;
  limits: PaymentAccountLimits;
  schedule: PaymentAccountSchedule;
}

export interface UpdatePaymentAccountDto extends Partial<CreatePaymentAccountDto> {
  uuid: string;
}

// ============================================
// ESTADO COMBINADO (para UI)
// ============================================

export interface PaymentMethodWithAccounts extends PaymentMethodModel {
  accounts: PaymentAccountModel[];
  isEnabled: boolean;
  activeAccountsCount: number;
}

// ============================================
// ESTADÍSTICAS DE TRANSACCIONES
// ============================================

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
  by_pay_method: Array<{
    pay_method_id: number;
    count: number;
    total_amount: number;
  }>;
}

// ============================================
// TEST DE CONEXIÓN
// ============================================

export interface TestConnectionResponse {
  connection: 'OK' | 'ERROR';
  mode: PaymentConfigMode;
  test_order_id?: string;
  message: string;
  verified_at?: string;
}
