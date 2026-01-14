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

// ============================================
// MÉTODO DE PAGO (FIJO - definido por plataforma)
// ============================================

export interface PaymentMethodModel {
  id: number;
  name: string;
  description: string;
  type: PaymentMethodType;
  provider: PaymentMethodProvider;
  icon: string;
  color: string;
  requiresCredentials: boolean;
  credentialFields: string[];
  supportedCurrencies: string[];
  defaultCommissionPercentage: number;
  defaultFixedCommission: number;
}

// ============================================
// CUENTA DE PAGO (CONFIGURABLE - creada por usuario)
// ============================================

export interface PaymentAccountCredentials {
  // Visa/Mastercard (procesador de pagos)
  merchantId?: string;
  terminalId?: string;
  apiKey?: string;
  secretKey?: string;

  // Klarna
  klarnaUsername?: string;
  klarnaPassword?: string;
  klarnaApiKey?: string;

  // Revolut
  revolutApiKey?: string;
  revolutMerchantId?: string;
  revolutWebhookSecret?: string;

  // PayPal
  paypalClientId?: string;
  paypalClientSecret?: string;
  paypalWebhookId?: string;
  paypalMode?: 'sandbox' | 'live';

  // Efectivo - no requiere credenciales
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
  id: number;
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
}

// ============================================
// DTOs
// ============================================

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
  id: number;
}

// ============================================
// ESTADO COMBINADO (para UI)
// ============================================

export interface PaymentMethodWithAccounts extends PaymentMethodModel {
  accounts: PaymentAccountModel[];
  isEnabled: boolean;
  activeAccountsCount: number;
}
