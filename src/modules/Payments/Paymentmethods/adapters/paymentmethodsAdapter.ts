import {
  PayMethodApiResponse,
  PayCompanyPaymentConfigApiResponse,
  PaymentMethodModel,
  PaymentAccountModel,
  PaymentMethodType,
  PaymentMethodProvider,
  CreatePaymentAccountDto,
  CreatePaymentConfigDto,
  UpdatePaymentAccountDto,
  UpdatePaymentConfigDto,
  PaymentCredentials,
  PaymentSettings,
} from '../models/PaymentmethodsModel';

// ============================================
// CONFIGURACIÓN POR MÉTODO DE PAGO
// ============================================

interface PaymentMethodConfig {
  type: PaymentMethodType;
  provider: PaymentMethodProvider;
  color: string;
  requiresCredentials: boolean;
  credentialFields: string[];
  settingsFields: string[];
  supportedCurrencies: string[];
  defaultCommissionPercentage: number;
  defaultFixedCommission: number;
}

const PAYMENT_METHOD_CONFIGS: Record<string, PaymentMethodConfig> = {
  visa: {
    type: 'card',
    provider: 'visa',
    color: '#1A1F71',
    requiresCredentials: true,
    credentialFields: ['merchantId', 'terminalId', 'apiKey', 'secretKey'],
    settingsFields: [],
    supportedCurrencies: ['EUR', 'USD', 'GBP'],
    defaultCommissionPercentage: 1.5,
    defaultFixedCommission: 0.25,
  },
  mastercard: {
    type: 'card',
    provider: 'mastercard',
    color: '#EB001B',
    requiresCredentials: true,
    credentialFields: ['merchantId', 'terminalId', 'apiKey', 'secretKey'],
    settingsFields: [],
    supportedCurrencies: ['EUR', 'USD', 'GBP'],
    defaultCommissionPercentage: 1.5,
    defaultFixedCommission: 0.25,
  },
  paypal: {
    type: 'digital_wallet',
    provider: 'paypal',
    color: '#003087',
    requiresCredentials: true,
    credentialFields: ['client_id', 'client_secret'],
    settingsFields: ['return_url', 'cancel_url', 'landing_page', 'shipping_preference'],
    supportedCurrencies: ['EUR', 'USD', 'GBP', 'MXN'],
    defaultCommissionPercentage: 2.9,
    defaultFixedCommission: 0.30,
  },
  stripe: {
    type: 'digital_wallet',
    provider: 'stripe',
    color: '#635BFF',
    requiresCredentials: true,
    credentialFields: ['secret_key', 'publishable_key', 'webhook_secret'],
    settingsFields: ['success_url', 'cancel_url', 'payment_method_types', 'allow_promotion_codes'],
    supportedCurrencies: ['EUR', 'USD', 'GBP', 'MXN'],
    defaultCommissionPercentage: 2.9,
    defaultFixedCommission: 0.30,
  },
  mercadopago: {
    type: 'digital_wallet',
    provider: 'mercadopago',
    color: '#009EE3',
    requiresCredentials: true,
    credentialFields: ['access_token', 'public_key'],
    settingsFields: ['back_urls', 'auto_return', 'notification_url', 'statement_descriptor'],
    supportedCurrencies: ['ARS', 'BRL', 'CLP', 'COP', 'MXN', 'PEN', 'UYU'],
    defaultCommissionPercentage: 3.49,
    defaultFixedCommission: 0.00,
  },
  klarna: {
    type: 'digital_wallet',
    provider: 'klarna',
    color: '#FFB3C7',
    requiresCredentials: true,
    credentialFields: ['username', 'password', 'api_key'],
    settingsFields: ['purchase_country', 'locale', 'merchant_urls'],
    supportedCurrencies: ['EUR', 'SEK', 'NOK', 'DKK', 'GBP', 'USD'],
    defaultCommissionPercentage: 2.49,
    defaultFixedCommission: 0.20,
  },
  revolut: {
    type: 'digital_wallet',
    provider: 'revolut',
    color: '#0666EB',
    requiresCredentials: true,
    credentialFields: ['api_key', 'merchant_id', 'webhook_secret'],
    settingsFields: ['webhook_url', 'capture_mode'],
    supportedCurrencies: ['EUR', 'USD', 'GBP'],
    defaultCommissionPercentage: 1.0,
    defaultFixedCommission: 0.20,
  },
  square: {
    type: 'digital_wallet',
    provider: 'square',
    color: '#006AFF',
    requiresCredentials: true,
    credentialFields: ['access_token', 'application_id', 'location_id'],
    settingsFields: ['location_id', 'checkout_options'],
    supportedCurrencies: ['USD', 'CAD', 'GBP', 'AUD', 'JPY'],
    defaultCommissionPercentage: 2.6,
    defaultFixedCommission: 0.10,
  },
  cash: {
    type: 'cash',
    provider: 'cash',
    color: '#28a745',
    requiresCredentials: false,
    credentialFields: [],
    settingsFields: [],
    supportedCurrencies: ['EUR', 'USD', 'MXN'],
    defaultCommissionPercentage: 0,
    defaultFixedCommission: 0,
  },
};

// ============================================
// ADAPTERS: API -> FRONTEND
// ============================================

/**
 * Adapta un método de pago de la API al modelo del frontend
 */
export const adaptPayMethodToPaymentMethodModel = (
  apiData: PayMethodApiResponse
): PaymentMethodModel => {
  const config = PAYMENT_METHOD_CONFIGS[apiData.code] || PAYMENT_METHOD_CONFIGS.cash;

  return {
    id: apiData.id,
    code: apiData.code,
    name: apiData.name,
    description: apiData.description,
    type: config.type,
    provider: config.provider,
    icon: apiData.icon || `mdi-${apiData.code}`,
    image: apiData.image,
    color: config.color,
    requiresCredentials: config.requiresCredentials,
    credentialFields: config.credentialFields,
    settingsFields: config.settingsFields,
    supportedCurrencies: config.supportedCurrencies,
    defaultCommissionPercentage: config.defaultCommissionPercentage,
    defaultFixedCommission: config.defaultFixedCommission,
  };
};

/**
 * Adapta un array de métodos de pago de la API
 */
export const adaptPayMethodsArrayToPaymentMethodModels = (
  apiDataArray: PayMethodApiResponse[]
): PaymentMethodModel[] => {
  return apiDataArray.map(adaptPayMethodToPaymentMethodModel);
};

/**
 * Adapta una configuración de pago de la API al modelo PaymentAccountModel
 */
export const adaptPayConfigToPaymentAccountModel = (
  apiData: PayCompanyPaymentConfigApiResponse
): PaymentAccountModel => {
  const payMethod = apiData.pay_method;
  const config = payMethod ? PAYMENT_METHOD_CONFIGS[payMethod.code] : null;

  // Obtener campos del backend o del config local
  const credentialFields = apiData.credential_fields || config?.credentialFields || [];
  const settingsFields = apiData.settings_fields || config?.settingsFields || [];

  return {
    uuid: apiData.uuid,
    paymentMethodId: apiData.pay_method_id,
    alias: apiData.brand_name || payMethod?.name || 'Cuenta',
    description: payMethod?.description,
    isActive: apiData.is_active,
    isDefault: false,
    commissionPercentage: config?.defaultCommissionPercentage || 0,
    fixedCommission: config?.defaultFixedCommission || 0,
    currencies: [apiData.default_currency],
    credentials: {},
    settings: apiData.settings || {},
    limits: {
      minAmount: 1,
      maxAmount: 10000,
    },
    schedule: {
      enabled: false,
    },
    createdAt: apiData.created_at,
    updatedAt: apiData.updated_at,
    mode: apiData.mode,
    isVerified: apiData.is_verified,
    verifiedAt: apiData.verified_at,
    credentialFields: credentialFields,
    settingsFields: settingsFields,
  };
};

/**
 * Adapta un array de configuraciones de pago
 */
export const adaptPayConfigsToPaymentAccountModels = (
  apiDataArray: PayCompanyPaymentConfigApiResponse[]
): PaymentAccountModel[] => {
  return apiDataArray.map(adaptPayConfigToPaymentAccountModel);
};

// ============================================
// ADAPTERS: FRONTEND -> API
// ============================================

/**
 * Convierte credenciales del formato legacy al nuevo formato
 */
const convertLegacyCredentialsToNew = (
  credentials: Record<string, string | undefined>,
  methodCode: string
): PaymentCredentials => {
  const result: PaymentCredentials = {};

  // Mapeo de campos legacy a nuevos
  const legacyMappings: Record<string, Record<string, string>> = {
    paypal: {
      paypalClientId: 'client_id',
      paypalClientSecret: 'client_secret',
    },
    stripe: {
      stripeSecretKey: 'secret_key',
      stripePublishableKey: 'publishable_key',
      stripeWebhookSecret: 'webhook_secret',
    },
    mercadopago: {
      mercadopagoAccessToken: 'access_token',
      mercadopagoPublicKey: 'public_key',
    },
  };

  const mapping = legacyMappings[methodCode] || {};

  for (const [legacyKey, newKey] of Object.entries(mapping)) {
    if (credentials[legacyKey]) {
      result[newKey] = credentials[legacyKey] as string;
    }
  }

  // También copiar campos que ya están en el formato nuevo
  const config = PAYMENT_METHOD_CONFIGS[methodCode];
  if (config) {
    for (const field of config.credentialFields) {
      if (credentials[field]) {
        result[field] = credentials[field] as string;
      }
    }
  }

  return result;
};

/**
 * Obtener el código del método de pago por ID
 */
const getMethodCodeById = (methodId: number, methodCode?: string): string => {
  // Si ya tenemos el código, usarlo
  if (methodCode) return methodCode;

  // Mapeo conocido de IDs a códigos (ajustar según tu base de datos)
  const knownMappings: Record<number, string> = {
    1: 'paypal',
    2: 'stripe',
    3: 'mercadopago',
    4: 'cash',
  };

  return knownMappings[methodId] || 'unknown';
};

/**
 * Adapta el DTO de crear cuenta al formato de la API
 */
export const adaptCreateAccountDtoToApiFormat = (
  dto: CreatePaymentAccountDto,
  companyId: number,
  methodCode?: string
): CreatePaymentConfigDto => {
  // Priorizar: 1) methodCode del DTO, 2) parámetro methodCode, 3) mapeo por ID
  const code = dto.methodCode || methodCode || getMethodCodeById(dto.paymentMethodId);
  const credentials = convertLegacyCredentialsToNew(dto.credentials, code);

  // Determinar modo: priorizar dto.mode, luego legacy paypalMode, fallback a sandbox
  let mode: 'sandbox' | 'production' = 'sandbox';
  if (dto.mode) {
    mode = dto.mode;
  } else if (dto.credentials.paypalMode === 'live') {
    mode = 'production';
  }

  return {
    gbl_company_id: companyId,
    pay_method_id: dto.paymentMethodId,
    credentials: credentials,
    settings: dto.settings,
    mode: mode,
    brand_name: dto.alias,
    default_currency: dto.currencies[0] || 'EUR',
  };
};

/**
 * Adapta el DTO de actualizar cuenta al formato de la API
 */
export const adaptUpdateAccountDtoToApiFormat = (
  dto: UpdatePaymentAccountDto,
  methodCode?: string
): UpdatePaymentConfigDto => {
  const result: UpdatePaymentConfigDto = {};

  if (dto.credentials && Object.keys(dto.credentials).length > 0) {
    // Priorizar: 1) methodCode del DTO, 2) parámetro methodCode, 3) fallback
    const code = dto.methodCode || methodCode || 'paypal';
    result.credentials = convertLegacyCredentialsToNew(dto.credentials, code);
  }

  // Usar dto.mode directamente si existe, fallback a legacy paypalMode
  if (dto.mode) {
    result.mode = dto.mode;
  } else if (dto.credentials?.paypalMode) {
    result.mode = dto.credentials.paypalMode === 'live' ? 'production' : 'sandbox';
  }

  if (dto.settings) {
    result.settings = dto.settings;
  }

  if (dto.alias) {
    result.brand_name = dto.alias;
  }

  if (dto.currencies && dto.currencies.length > 0) {
    result.default_currency = dto.currencies[0];
  }

  return result;
};

/**
 * Crear DTO directamente con credenciales en nuevo formato
 */
export const createPaymentConfigDto = (
  companyId: number,
  payMethodId: number,
  credentials: PaymentCredentials,
  mode: 'sandbox' | 'production',
  settings?: PaymentSettings,
  brandName?: string,
  defaultCurrency: string = 'EUR'
): CreatePaymentConfigDto => {
  return {
    gbl_company_id: companyId,
    pay_method_id: payMethodId,
    credentials,
    settings,
    mode,
    brand_name: brandName,
    default_currency: defaultCurrency,
  };
};

/**
 * Crear DTO de actualización directamente con credenciales en nuevo formato
 */
export const updatePaymentConfigDto = (
  credentials?: PaymentCredentials,
  settings?: PaymentSettings,
  mode?: 'sandbox' | 'production',
  brandName?: string,
  defaultCurrency?: string
): UpdatePaymentConfigDto => {
  const result: UpdatePaymentConfigDto = {};

  if (credentials && Object.keys(credentials).length > 0) {
    result.credentials = credentials;
  }
  if (settings && Object.keys(settings).length > 0) {
    result.settings = settings;
  }
  if (mode) {
    result.mode = mode;
  }
  if (brandName) {
    result.brand_name = brandName;
  }
  if (defaultCurrency) {
    result.default_currency = defaultCurrency;
  }

  return result;
};

// ============================================
// LEGACY ADAPTERS
// ============================================

export const adaptPaymentmethodsResponseToPaymentmethodsModel = adaptPayMethodToPaymentMethodModel;
export const adaptPaymentmethodsArrayToPaymentmethodsModels = adaptPayMethodsArrayToPaymentMethodModels;
