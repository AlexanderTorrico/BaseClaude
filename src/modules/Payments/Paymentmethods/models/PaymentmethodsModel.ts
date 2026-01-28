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
  | 'stripe'
  | 'mercadopago'
  | 'square'
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
  settings: PaymentSettings;
  mode: PaymentConfigMode;
  brand_name: string | null;
  default_currency: string;
  is_active: boolean;
  is_verified: boolean;
  verified_at: string | null;
  has_credentials: boolean;
  credential_fields: string[];
  settings_fields: string[];
  created_at: string;
  updated_at: string;
}

export interface CredentialFieldsApiResponse {
  pay_method_id: number;
  code: string;
  name: string;
  credential_fields: string[];
  settings_fields: string[];
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
  settingsFields: string[];
  supportedCurrencies: string[];
  defaultCommissionPercentage: number;
  defaultFixedCommission: number;
}

// ============================================
// CONFIGURACIÓN DE PAGO (CONFIGURABLE - creada por usuario)
// ============================================

/**
 * Credenciales dinámicas - objeto con claves string (SECRETAS - encriptadas en backend)
 * Cada proveedor tiene diferentes campos:
 * - PayPal: { client_id, client_secret }
 * - Stripe: { secret_key, publishable_key, webhook_secret }
 * - MercadoPago: { access_token, public_key }
 * - etc.
 */
export type PaymentCredentials = Record<string, string>;

/**
 * Settings dinámicos - objeto con claves string (NO SECRETOS - JSON plano)
 * Configuraciones específicas por proveedor:
 * - PayPal: { return_url, cancel_url, landing_page, shipping_preference }
 * - Stripe: { success_url, cancel_url, payment_method_types }
 * - MercadoPago: { back_urls, auto_return, notification_url }
 * - etc.
 */
export type PaymentSettings = Record<string, unknown>;

export interface PaymentConfigModel {
  uuid: string;
  companyId: number;
  paymentMethodId: number;
  paymentMethod: PaymentMethodModel | null;
  settings: PaymentSettings;
  mode: PaymentConfigMode;
  brandName: string | null;
  defaultCurrency: string;
  isActive: boolean;
  isVerified: boolean;
  verifiedAt: string | null;
  hasCredentials: boolean;
  credentialFields: string[];
  settingsFields: string[];
  createdAt: string;
  updatedAt: string;
  // OAuth 2.0 fields
  oauthStatus?: OAuthStatus;
  oauthMerchantId?: string | null;
  oauthEmail?: string | null;
  oauthConnectedAt?: string | null;
  isOAuthConnected?: boolean;
}

// ============================================
// OAUTH 2.0 TYPES
// ============================================

export type OAuthStatus = 'pending' | 'connected' | 'expired' | 'revoked';

export interface OAuthConnectResponse {
  config_uuid: string;
  authorization_url: string;
  message: string;
}

export interface OAuthStatusResponse {
  uuid: string;
  oauth_status: OAuthStatus;
  is_connected: boolean;
  needs_refresh: boolean;
  oauth_merchant_id: string | null;
  oauth_email: string | null;
  oauth_connected_at: string | null;
  token_expires_at: string | null;
  token_valid?: boolean;
  token_expires_in_minutes?: number;
  mode: PaymentConfigMode;
  default_currency: string;
  is_active: boolean;
}

export interface OAuthConfigListItem {
  uuid: string;
  oauth_status: OAuthStatus;
  is_connected: boolean;
  oauth_merchant_id: string | null;
  oauth_email: string | null;
  mode: PaymentConfigMode;
  default_currency: string;
  brand_name: string | null;
  is_active: boolean;
  is_verified: boolean;
  oauth_connected_at: string | null;
  created_at: string;
}

// ============================================
// CUENTA DE PAGO (LEGACY - mantener compatibilidad)
// ============================================

export interface PaymentAccountCredentials {
  // Credenciales dinámicas
  [key: string]: string | undefined;

  // PayPal (legacy)
  paypalClientId?: string;
  paypalClientSecret?: string;
  paypalMode?: 'sandbox' | 'live';

  // Stripe
  stripeSecretKey?: string;
  stripePublishableKey?: string;
  stripeWebhookSecret?: string;

  // MercadoPago
  mercadopagoAccessToken?: string;
  mercadopagoPublicKey?: string;

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
  settings: PaymentSettings;
  limits: PaymentAccountLimits;
  schedule: PaymentAccountSchedule;
  createdAt: string;
  updatedAt: string;
  // Nuevos campos del backend
  mode?: PaymentConfigMode;
  isVerified?: boolean;
  verifiedAt?: string | null;
  credentialFields?: string[];
  settingsFields?: string[];
}

// ============================================
// DTOs PARA CREAR/ACTUALIZAR
// ============================================

export interface CreatePaymentConfigDto {
  gbl_company_id: number;
  pay_method_id: number;
  credentials: PaymentCredentials;
  settings?: PaymentSettings;
  mode: PaymentConfigMode;
  brand_name?: string;
  default_currency?: string;
}

export interface UpdatePaymentConfigDto {
  credentials?: PaymentCredentials;
  settings?: PaymentSettings;
  mode?: PaymentConfigMode;
  brand_name?: string;
  default_currency?: string;
}

// Legacy DTOs (mantener compatibilidad con UI actual)
export interface CreatePaymentAccountDto {
  paymentMethodId: number;
  methodCode?: string; // Código del método (paypal, stripe, etc.) para el adapter
  mode?: PaymentConfigMode; // Modo: sandbox o production
  alias: string;
  description?: string;
  isActive: boolean;
  isDefault: boolean;
  commissionPercentage: number;
  fixedCommission: number;
  currencies: string[];
  credentials: PaymentAccountCredentials;
  settings?: PaymentSettings;
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

// ============================================
// LABELS DE CAMPOS DE CREDENCIALES
// ============================================

export const CREDENTIAL_FIELD_LABELS: Record<string, { label: string; placeholder: string; type: 'text' | 'password' }> = {
  // PayPal
  client_id: { label: 'Client ID', placeholder: 'Ingresa tu Client ID de PayPal', type: 'text' },
  client_secret: { label: 'Client Secret', placeholder: 'Ingresa tu Client Secret de PayPal', type: 'password' },

  // Stripe
  secret_key: { label: 'Secret Key', placeholder: 'sk_live_xxx o sk_test_xxx', type: 'password' },
  publishable_key: { label: 'Publishable Key', placeholder: 'pk_live_xxx o pk_test_xxx', type: 'text' },
  webhook_secret: { label: 'Webhook Secret', placeholder: 'whsec_xxx', type: 'password' },

  // MercadoPago
  access_token: { label: 'Access Token', placeholder: 'APP_USR-xxx', type: 'password' },
  public_key: { label: 'Public Key', placeholder: 'APP_USR-xxx', type: 'text' },

  // Klarna
  username: { label: 'Username', placeholder: 'Tu username de Klarna', type: 'text' },
  password: { label: 'Password', placeholder: 'Tu password de Klarna', type: 'password' },
  api_key: { label: 'API Key', placeholder: 'Tu API Key', type: 'password' },

  // Revolut
  merchant_id: { label: 'Merchant ID', placeholder: 'Tu Merchant ID de Revolut', type: 'text' },

  // Square
  application_id: { label: 'Application ID', placeholder: 'Tu Application ID de Square', type: 'text' },
  location_id: { label: 'Location ID', placeholder: 'Tu Location ID de Square', type: 'text' },
};

// ============================================
// LABELS DE CAMPOS DE SETTINGS
// ============================================

export const SETTINGS_FIELD_LABELS: Record<string, { label: string; placeholder: string; type: 'text' | 'url' | 'select' }> = {
  // URLs comunes
  return_url: { label: 'URL de Retorno', placeholder: 'https://tudominio.com/payment/success', type: 'url' },
  cancel_url: { label: 'URL de Cancelación', placeholder: 'https://tudominio.com/payment/cancel', type: 'url' },
  success_url: { label: 'URL de Éxito', placeholder: 'https://tudominio.com/payment/success', type: 'url' },
  notification_url: { label: 'URL de Notificación', placeholder: 'https://tudominio.com/webhooks/payment', type: 'url' },
  webhook_url: { label: 'URL de Webhook', placeholder: 'https://tudominio.com/webhooks', type: 'url' },

  // PayPal específicos
  landing_page: { label: 'Página de Aterrizaje', placeholder: 'LOGIN o BILLING', type: 'select' },
  shipping_preference: { label: 'Preferencia de Envío', placeholder: 'GET_FROM_FILE o NO_SHIPPING', type: 'select' },

  // Stripe específicos
  payment_method_types: { label: 'Tipos de Pago', placeholder: 'card, ideal, sepa_debit', type: 'text' },
  allow_promotion_codes: { label: 'Permitir Códigos Promocionales', placeholder: 'true o false', type: 'select' },

  // MercadoPago específicos
  auto_return: { label: 'Auto Retorno', placeholder: 'approved, all', type: 'select' },
  statement_descriptor: { label: 'Descriptor de Estado', placeholder: 'Tu Empresa', type: 'text' },

  // Klarna específicos
  purchase_country: { label: 'País de Compra', placeholder: 'ES, DE, FR...', type: 'text' },
  locale: { label: 'Idioma', placeholder: 'es-ES, en-US...', type: 'text' },

  // Revolut específicos
  capture_mode: { label: 'Modo de Captura', placeholder: 'automatic o manual', type: 'select' },
};

/**
 * Helper para obtener el label de un campo de credencial
 */
export const getCredentialFieldLabel = (field: string): string => {
  return CREDENTIAL_FIELD_LABELS[field]?.label || field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Helper para obtener el placeholder de un campo de credencial
 */
export const getCredentialFieldPlaceholder = (field: string): string => {
  return CREDENTIAL_FIELD_LABELS[field]?.placeholder || `Ingresa tu ${field}`;
};

/**
 * Helper para obtener el tipo de input de un campo de credencial
 */
export const getCredentialFieldType = (field: string): 'text' | 'password' => {
  return CREDENTIAL_FIELD_LABELS[field]?.type || 'text';
};

/**
 * Helper para obtener el label de un campo de settings
 */
export const getSettingsFieldLabel = (field: string): string => {
  return SETTINGS_FIELD_LABELS[field]?.label || field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Helper para obtener el placeholder de un campo de settings
 */
export const getSettingsFieldPlaceholder = (field: string): string => {
  return SETTINGS_FIELD_LABELS[field]?.placeholder || `Ingresa ${field}`;
};

/**
 * Helper para obtener el tipo de input de un campo de settings
 */
export const getSettingsFieldType = (field: string): 'text' | 'url' | 'select' => {
  return SETTINGS_FIELD_LABELS[field]?.type || 'text';
};
