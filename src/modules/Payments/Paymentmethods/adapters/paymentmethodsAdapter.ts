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
    supportedCurrencies: ['EUR', 'USD', 'GBP'],
    defaultCommissionPercentage: 1.5,
    defaultFixedCommission: 0.25,
  },
  paypal: {
    type: 'digital_wallet',
    provider: 'paypal',
    color: '#003087',
    requiresCredentials: true,
    credentialFields: ['paypalClientId', 'paypalClientSecret', 'paypalMode'],
    supportedCurrencies: ['EUR', 'USD', 'GBP', 'MXN'],
    defaultCommissionPercentage: 2.9,
    defaultFixedCommission: 0.30,
  },
  klarna: {
    type: 'digital_wallet',
    provider: 'klarna',
    color: '#FFB3C7',
    requiresCredentials: true,
    credentialFields: ['klarnaUsername', 'klarnaPassword', 'klarnaApiKey'],
    supportedCurrencies: ['EUR', 'SEK', 'NOK', 'DKK', 'GBP', 'USD'],
    defaultCommissionPercentage: 2.49,
    defaultFixedCommission: 0.20,
  },
  revolut: {
    type: 'digital_wallet',
    provider: 'revolut',
    color: '#0666EB',
    requiresCredentials: true,
    credentialFields: ['revolutApiKey', 'revolutMerchantId', 'revolutWebhookSecret'],
    supportedCurrencies: ['EUR', 'USD', 'GBP'],
    defaultCommissionPercentage: 1.0,
    defaultFixedCommission: 0.20,
  },
  cash: {
    type: 'cash',
    provider: 'cash',
    color: '#28a745',
    requiresCredentials: false,
    credentialFields: [],
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
    credentials: {
      paypalClientId: '',
      paypalClientSecret: '',
      paypalMode: apiData.mode === 'production' ? 'live' : 'sandbox',
    },
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
 * Adapta el DTO de crear cuenta al formato de la API
 */
export const adaptCreateAccountDtoToApiFormat = (
  dto: CreatePaymentAccountDto,
  companyId: number
): CreatePaymentConfigDto => {
  return {
    gbl_company_id: companyId,
    pay_method_id: dto.paymentMethodId,
    client_id: dto.credentials.paypalClientId || dto.credentials.apiKey || '',
    client_secret: dto.credentials.paypalClientSecret || dto.credentials.secretKey || '',
    mode: dto.credentials.paypalMode === 'live' ? 'production' : 'sandbox',
    return_url: undefined,
    cancel_url: undefined,
    brand_name: dto.alias,
    default_currency: dto.currencies[0] || 'EUR',
  };
};

/**
 * Adapta el DTO de actualizar cuenta al formato de la API
 */
export const adaptUpdateAccountDtoToApiFormat = (
  dto: UpdatePaymentAccountDto
): UpdatePaymentConfigDto => {
  const result: UpdatePaymentConfigDto = {};

  if (dto.credentials?.paypalClientId || dto.credentials?.apiKey) {
    result.client_id = dto.credentials.paypalClientId || dto.credentials.apiKey;
  }

  if (dto.credentials?.paypalClientSecret || dto.credentials?.secretKey) {
    result.client_secret = dto.credentials.paypalClientSecret || dto.credentials.secretKey;
  }

  if (dto.credentials?.paypalMode) {
    result.mode = dto.credentials.paypalMode === 'live' ? 'production' : 'sandbox';
  }

  if (dto.alias) {
    result.brand_name = dto.alias;
  }

  if (dto.currencies && dto.currencies.length > 0) {
    result.default_currency = dto.currencies[0];
  }

  return result;
};

// ============================================
// LEGACY ADAPTERS
// ============================================

export const adaptPaymentmethodsResponseToPaymentmethodsModel = adaptPayMethodToPaymentMethodModel;
export const adaptPaymentmethodsArrayToPaymentmethodsModels = adaptPayMethodsArrayToPaymentMethodModels;
