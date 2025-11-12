import { PaymentGatewayModel } from '../models/PaymentGatewayModel';

export const mockPaymentGateways: PaymentGatewayModel[] = [
  // Tarjetas de Crédito/Débito
  {
    id: 1,
    name: 'Stripe',
    code: 'stripe',
    description: 'Procesamiento de pagos con tarjeta líder mundial',
    enabled: true,
    icon: 'mdi mdi-credit-card-outline',
    category: 'card',
    countries: ['US', 'MX', 'ES', 'AR', 'CL', 'CO', 'PE'],
    currencies: ['USD', 'EUR', 'MXN', 'ARS', 'CLP', 'COP', 'PEN'],
    config: {
      apiKey: '',
      secretKey: '',
      environment: 'sandbox',
      webhookUrl: ''
    },
    fees: {
      percentage: 2.9,
      fixed: 0.30,
      currency: 'USD'
    },
    supportedPaymentMethods: ['visa', 'mastercard', 'amex', 'discover'],
    popularity: 5,
    processingTime: 'Instantáneo'
  },
  {
    id: 2,
    name: 'PayPal',
    code: 'paypal',
    description: 'Pagos seguros con cuenta PayPal o tarjeta',
    enabled: true,
    icon: 'mdi mdi-paypal',
    category: 'wallet',
    countries: ['US', 'MX', 'ES', 'AR', 'CL', 'CO', 'PE', 'BR'],
    currencies: ['USD', 'EUR', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'BRL'],
    config: {
      clientId: '',
      secretKey: '',
      environment: 'sandbox'
    },
    fees: {
      percentage: 3.49,
      fixed: 0.49,
      currency: 'USD'
    },
    popularity: 5,
    processingTime: 'Instantáneo'
  },
  {
    id: 3,
    name: 'MercadoPago',
    code: 'mercadopago',
    description: 'Solución de pagos para Latinoamérica',
    enabled: true,
    icon: 'mdi mdi-cash-multiple',
    category: 'wallet',
    countries: ['AR', 'BR', 'MX', 'CL', 'CO', 'PE', 'UY'],
    currencies: ['ARS', 'BRL', 'MXN', 'CLP', 'COP', 'PEN', 'UYU'],
    config: {
      publicKey: '',
      accessToken: '',
      environment: 'sandbox'
    },
    fees: {
      percentage: 4.99,
      currency: 'USD'
    },
    supportedPaymentMethods: ['visa', 'mastercard', 'amex', 'efectivo'],
    popularity: 5,
    processingTime: 'Instantáneo'
  },
  {
    id: 4,
    name: 'Square',
    code: 'square',
    description: 'Procesamiento de pagos con tarjeta',
    enabled: false,
    icon: 'mdi mdi-square-inc',
    category: 'card',
    countries: ['US', 'CA', 'AU', 'GB', 'JP'],
    currencies: ['USD', 'CAD', 'AUD', 'GBP', 'JPY'],
    config: {
      applicationId: '',
      accessToken: '',
      locationId: '',
      environment: 'sandbox'
    },
    fees: {
      percentage: 2.6,
      fixed: 0.10,
      currency: 'USD'
    },
    supportedPaymentMethods: ['visa', 'mastercard', 'amex', 'discover'],
    popularity: 4,
    processingTime: 'Instantáneo'
  },
  // Transferencias Bancarias
  {
    id: 5,
    name: 'Transferencia SPEI',
    code: 'spei',
    description: 'Transferencias bancarias instantáneas en México',
    enabled: true,
    icon: 'mdi mdi-bank-transfer',
    category: 'bank',
    countries: ['MX'],
    currencies: ['MXN'],
    config: {
      clabe: '',
      beneficiaryName: ''
    },
    fees: {
      fixed: 5,
      currency: 'MXN'
    },
    popularity: 4,
    processingTime: '10-15 minutos'
  },
  {
    id: 6,
    name: 'SEPA',
    code: 'sepa',
    description: 'Transferencias bancarias en Europa',
    enabled: false,
    icon: 'mdi mdi-bank-transfer',
    category: 'bank',
    countries: ['ES', 'FR', 'DE', 'IT', 'PT'],
    currencies: ['EUR'],
    config: {
      iban: '',
      bic: ''
    },
    fees: {
      fixed: 0,
      currency: 'EUR'
    },
    popularity: 4,
    processingTime: '1-3 días hábiles'
  },
  {
    id: 7,
    name: 'ACH',
    code: 'ach',
    description: 'Transferencias bancarias en Estados Unidos',
    enabled: false,
    icon: 'mdi mdi-bank',
    category: 'bank',
    countries: ['US'],
    currencies: ['USD'],
    config: {
      routingNumber: '',
      accountNumber: ''
    },
    fees: {
      fixed: 1,
      currency: 'USD'
    },
    popularity: 3,
    processingTime: '3-5 días hábiles'
  },
  // Efectivo
  {
    id: 8,
    name: 'OXXO',
    code: 'oxxo',
    description: 'Pagos en efectivo en tiendas OXXO',
    enabled: true,
    icon: 'mdi mdi-store',
    category: 'cash',
    countries: ['MX'],
    currencies: ['MXN'],
    config: {},
    fees: {
      fixed: 10,
      currency: 'MXN'
    },
    minAmount: 20,
    maxAmount: 10000,
    popularity: 4,
    processingTime: '1-3 horas después del pago'
  },
  {
    id: 9,
    name: 'Rapipago',
    code: 'rapipago',
    description: 'Pagos en efectivo en Argentina',
    enabled: false,
    icon: 'mdi mdi-cash',
    category: 'cash',
    countries: ['AR'],
    currencies: ['ARS'],
    config: {},
    fees: {
      percentage: 2,
      currency: 'ARS'
    },
    popularity: 3,
    processingTime: '1-2 horas después del pago'
  },
  {
    id: 10,
    name: 'Pago Fácil',
    code: 'pagofacil',
    description: 'Pagos en efectivo en Argentina',
    enabled: false,
    icon: 'mdi mdi-cash-multiple',
    category: 'cash',
    countries: ['AR'],
    currencies: ['ARS'],
    config: {},
    fees: {
      percentage: 2,
      currency: 'ARS'
    },
    popularity: 3,
    processingTime: '1-2 horas después del pago'
  },
  // Criptomonedas
  {
    id: 11,
    name: 'Coinbase Commerce',
    code: 'coinbase',
    description: 'Pagos con criptomonedas',
    enabled: false,
    icon: 'mdi mdi-bitcoin',
    category: 'crypto',
    countries: ['Global'],
    currencies: ['BTC', 'ETH', 'USDC', 'USDT', 'DAI'],
    config: {
      apiKey: '',
      webhookSecret: ''
    },
    fees: {
      percentage: 1,
      currency: 'USD'
    },
    popularity: 3,
    processingTime: '10-30 minutos',
    requiresKYC: false
  },
  {
    id: 12,
    name: 'Binance Pay',
    code: 'binance',
    description: 'Pagos con criptomonedas vía Binance',
    enabled: false,
    icon: 'mdi mdi-currency-btc',
    category: 'crypto',
    countries: ['Global'],
    currencies: ['BTC', 'ETH', 'BNB', 'USDT', 'BUSD'],
    config: {
      apiKey: '',
      secretKey: '',
      merchantId: ''
    },
    fees: {
      percentage: 0,
      currency: 'USD'
    },
    popularity: 3,
    processingTime: 'Instantáneo',
    requiresKYC: true
  },
  // Wallets Digitales
  {
    id: 13,
    name: 'Apple Pay',
    code: 'applepay',
    description: 'Pagos con Apple Pay',
    enabled: false,
    icon: 'mdi mdi-apple',
    category: 'wallet',
    countries: ['US', 'MX', 'ES', 'AR', 'CL', 'CO'],
    currencies: ['USD', 'EUR', 'MXN', 'ARS', 'CLP', 'COP'],
    config: {
      merchantId: '',
      certificatePath: ''
    },
    fees: {
      percentage: 3,
      currency: 'USD'
    },
    popularity: 4,
    processingTime: 'Instantáneo'
  },
  {
    id: 14,
    name: 'Google Pay',
    code: 'googlepay',
    description: 'Pagos con Google Pay',
    enabled: false,
    icon: 'mdi mdi-google',
    category: 'wallet',
    countries: ['US', 'MX', 'ES', 'AR', 'CL', 'CO', 'BR'],
    currencies: ['USD', 'EUR', 'MXN', 'ARS', 'CLP', 'COP', 'BRL'],
    config: {
      merchantId: '',
      merchantName: ''
    },
    fees: {
      percentage: 3,
      currency: 'USD'
    },
    popularity: 4,
    processingTime: 'Instantáneo'
  },
  {
    id: 15,
    name: 'Klarna',
    code: 'klarna',
    description: 'Compra ahora, paga después',
    enabled: false,
    icon: 'mdi mdi-shopping',
    category: 'other',
    countries: ['US', 'DE', 'SE', 'NO', 'FI', 'DK', 'AT', 'NL', 'BE', 'ES', 'IT', 'FR', 'GB'],
    currencies: ['USD', 'EUR', 'GBP', 'SEK', 'NOK', 'DKK'],
    config: {
      apiKey: '',
      region: 'EU'
    },
    fees: {
      percentage: 3.5,
      currency: 'USD'
    },
    popularity: 4,
    processingTime: 'Instantáneo',
    requiresKYC: true
  },
  // Latinoamérica específicos
  {
    id: 16,
    name: 'PSE (Colombia)',
    code: 'pse',
    description: 'Pagos electrónicos en Colombia',
    enabled: false,
    icon: 'mdi mdi-bank-transfer',
    category: 'bank',
    countries: ['CO'],
    currencies: ['COP'],
    config: {
      merchantId: '',
      apiKey: ''
    },
    fees: {
      fixed: 3000,
      currency: 'COP'
    },
    popularity: 5,
    processingTime: 'Instantáneo'
  },
  {
    id: 17,
    name: 'Pix (Brasil)',
    code: 'pix',
    description: 'Sistema de pagos instantáneos de Brasil',
    enabled: false,
    icon: 'mdi mdi-qrcode',
    category: 'bank',
    countries: ['BR'],
    currencies: ['BRL'],
    config: {
      pixKey: '',
      merchantName: ''
    },
    fees: {
      percentage: 0.5,
      currency: 'BRL'
    },
    popularity: 5,
    processingTime: 'Instantáneo'
  },
  {
    id: 18,
    name: 'WebPay (Chile)',
    code: 'webpay',
    description: 'Plataforma de pagos de Transbank',
    enabled: false,
    icon: 'mdi mdi-credit-card',
    category: 'card',
    countries: ['CL'],
    currencies: ['CLP'],
    config: {
      commerceCode: '',
      apiKey: '',
      environment: 'sandbox'
    },
    fees: {
      percentage: 3.5,
      currency: 'CLP'
    },
    supportedPaymentMethods: ['visa', 'mastercard', 'amex', 'redcompra'],
    popularity: 5,
    processingTime: 'Instantáneo'
  }
];
