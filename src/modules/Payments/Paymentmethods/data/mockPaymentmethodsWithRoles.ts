import { PaymentMethodModel, PaymentAccountModel } from '../models/PaymentmethodsModel';

// ============================================
// MÉTODOS DE PAGO FIJOS (definidos por la plataforma)
// El usuario NO puede crear nuevos, solo habilitar/configurar
// ============================================

export const PLATFORM_PAYMENT_METHODS: PaymentMethodModel[] = [
  {
    id: 1,
    name: 'Visa',
    description: 'Acepta pagos con tarjetas Visa débito y crédito',
    type: 'card',
    provider: 'visa',
    icon: 'mdi-credit-card',
    color: '#1A1F71',
    requiresCredentials: true,
    credentialFields: ['merchantId', 'terminalId', 'apiKey', 'secretKey'],
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'MXN', 'ARS', 'COP'],
    defaultCommissionPercentage: 2.9,
    defaultFixedCommission: 0.30
  },
  {
    id: 2,
    name: 'Mastercard',
    description: 'Acepta pagos con tarjetas Mastercard débito y crédito',
    type: 'card',
    provider: 'mastercard',
    icon: 'mdi-credit-card-outline',
    color: '#EB001B',
    requiresCredentials: true,
    credentialFields: ['merchantId', 'terminalId', 'apiKey', 'secretKey'],
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'MXN', 'ARS', 'COP'],
    defaultCommissionPercentage: 2.9,
    defaultFixedCommission: 0.30
  },
  {
    id: 3,
    name: 'Klarna',
    description: 'Pagos flexibles: compra ahora, paga después',
    type: 'digital_wallet',
    provider: 'klarna',
    icon: 'mdi-clock-outline',
    color: '#FFB3C7',
    requiresCredentials: true,
    credentialFields: ['klarnaUsername', 'klarnaPassword', 'klarnaApiKey'],
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'SEK', 'NOK', 'DKK'],
    defaultCommissionPercentage: 3.29,
    defaultFixedCommission: 0.30
  },
  {
    id: 4,
    name: 'Revolut',
    description: 'Pagos instantáneos con Revolut Pay',
    type: 'digital_wallet',
    provider: 'revolut',
    icon: 'mdi-cellphone-nfc',
    color: '#0075EB',
    requiresCredentials: true,
    credentialFields: ['revolutApiKey', 'revolutMerchantId', 'revolutWebhookSecret'],
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CHF', 'PLN', 'RON'],
    defaultCommissionPercentage: 1.0,
    defaultFixedCommission: 0.20
  },
  {
    id: 5,
    name: 'PayPal',
    description: 'Pagos seguros con cuenta PayPal o tarjeta',
    type: 'digital_wallet',
    provider: 'paypal',
    icon: 'mdi-alpha-p-circle',
    color: '#003087',
    requiresCredentials: true,
    credentialFields: ['paypalClientId', 'paypalClientSecret', 'paypalWebhookId', 'paypalMode'],
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'MXN', 'BRL'],
    defaultCommissionPercentage: 3.49,
    defaultFixedCommission: 0.49
  },
  {
    id: 6,
    name: 'Efectivo',
    description: 'Pago en efectivo al momento de la entrega o en tienda',
    type: 'cash',
    provider: 'cash',
    icon: 'mdi-cash',
    color: '#388E3C',
    requiresCredentials: false,
    credentialFields: [],
    supportedCurrencies: ['USD', 'EUR', 'MXN', 'ARS', 'COP', 'CLP', 'PEN'],
    defaultCommissionPercentage: 0,
    defaultFixedCommission: 0
  }
];

// ============================================
// CUENTAS DE PAGO (creadas por el usuario)
// Ejemplos de cuentas configuradas
// ============================================

export const MOCK_PAYMENT_ACCOUNTS: PaymentAccountModel[] = [
  // PayPal - 2 cuentas configuradas
  {
    id: 1,
    paymentMethodId: 5,
    alias: 'PayPal Ventas Principal',
    description: 'Cuenta principal para ventas online',
    isActive: true,
    isDefault: true,
    commissionPercentage: 3.49,
    fixedCommission: 0.49,
    currencies: ['USD', 'EUR', 'MXN'],
    credentials: {
      paypalClientId: 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPp',
      paypalClientSecret: '••••••••••••••••••••',
      paypalWebhookId: 'WH-1234567890ABCDEF',
      paypalMode: 'live'
    },
    limits: {
      minAmount: 1,
      maxAmount: 10000,
      dailyLimit: 50000,
      monthlyLimit: 500000
    },
    schedule: { enabled: false },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    paymentMethodId: 5,
    alias: 'PayPal Eventos',
    description: 'Cuenta para cobros de eventos especiales',
    isActive: true,
    isDefault: false,
    commissionPercentage: 3.49,
    fixedCommission: 0.49,
    currencies: ['USD', 'EUR'],
    credentials: {
      paypalClientId: 'XxYyZz123456789ABCDEF',
      paypalClientSecret: '••••••••••••••••••••',
      paypalWebhookId: 'WH-EVENTOS12345',
      paypalMode: 'live'
    },
    limits: {
      minAmount: 10,
      maxAmount: 5000,
      dailyLimit: 20000
    },
    schedule: { enabled: false },
    createdAt: '2024-02-01T14:00:00Z',
    updatedAt: '2024-02-01T14:00:00Z'
  },

  // Visa - 1 cuenta
  {
    id: 3,
    paymentMethodId: 1,
    alias: 'Terminal Visa Principal',
    description: 'Terminal principal para tarjetas Visa',
    isActive: true,
    isDefault: true,
    commissionPercentage: 2.9,
    fixedCommission: 0.30,
    currencies: ['USD', 'EUR', 'MXN'],
    credentials: {
      merchantId: 'MERCH-VISA-001234',
      terminalId: 'TERM-001',
      apiKey: 'visa_api_key_xxx',
      secretKey: '••••••••••••••••••••'
    },
    limits: {
      minAmount: 1,
      maxAmount: 50000,
      dailyLimit: 100000,
      monthlyLimit: 1000000
    },
    schedule: { enabled: false },
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-20T11:00:00Z'
  },

  // Mastercard - 1 cuenta
  {
    id: 4,
    paymentMethodId: 2,
    alias: 'Terminal Mastercard',
    description: 'Terminal para tarjetas Mastercard',
    isActive: true,
    isDefault: true,
    commissionPercentage: 2.9,
    fixedCommission: 0.30,
    currencies: ['USD', 'EUR', 'MXN'],
    credentials: {
      merchantId: 'MERCH-MC-005678',
      terminalId: 'TERM-002',
      apiKey: 'mc_api_key_xxx',
      secretKey: '••••••••••••••••••••'
    },
    limits: {
      minAmount: 1,
      maxAmount: 50000,
      dailyLimit: 100000,
      monthlyLimit: 1000000
    },
    schedule: { enabled: false },
    createdAt: '2024-01-12T09:00:00Z',
    updatedAt: '2024-01-12T09:00:00Z'
  },

  // Klarna - 1 cuenta
  {
    id: 5,
    paymentMethodId: 3,
    alias: 'Klarna Europa',
    description: 'Pagos a plazos para clientes europeos',
    isActive: true,
    isDefault: true,
    commissionPercentage: 3.29,
    fixedCommission: 0.30,
    currencies: ['EUR', 'GBP', 'SEK'],
    credentials: {
      klarnaUsername: 'K123456_abcdef',
      klarnaPassword: '••••••••••••••••••••',
      klarnaApiKey: 'klarna_api_xxx'
    },
    limits: {
      minAmount: 35,
      maxAmount: 1500,
      dailyLimit: 10000
    },
    schedule: { enabled: false },
    createdAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-08T10:00:00Z'
  },

  // Revolut - 1 cuenta
  {
    id: 6,
    paymentMethodId: 4,
    alias: 'Revolut Business',
    description: 'Pagos instantáneos con Revolut',
    isActive: true,
    isDefault: true,
    commissionPercentage: 1.0,
    fixedCommission: 0.20,
    currencies: ['EUR', 'GBP', 'USD'],
    credentials: {
      revolutApiKey: 'rev_api_xxxxxxxxxxxxxxxxxx',
      revolutMerchantId: 'rev_merchant_xxxxxxxxx',
      revolutWebhookSecret: 'rev_whsec_xxxxxxxxxxxxxxxxxx'
    },
    limits: {
      minAmount: 1,
      maxAmount: 25000,
      dailyLimit: 50000,
      monthlyLimit: 500000
    },
    schedule: { enabled: false },
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },

  // Efectivo - 1 cuenta
  {
    id: 7,
    paymentMethodId: 6,
    alias: 'Efectivo Entregas',
    description: 'Pago en efectivo contra entrega',
    isActive: true,
    isDefault: true,
    commissionPercentage: 0,
    fixedCommission: 0,
    currencies: ['MXN', 'ARS', 'COP'],
    credentials: {},
    limits: {
      minAmount: 1,
      maxAmount: 5000
    },
    schedule: {
      enabled: true,
      startTime: '08:00',
      endTime: '20:00',
      daysOfWeek: [1, 2, 3, 4, 5, 6]
    },
    createdAt: '2024-01-03T07:00:00Z',
    updatedAt: '2024-01-03T07:00:00Z'
  }
];
