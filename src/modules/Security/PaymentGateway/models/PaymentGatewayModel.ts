export interface PaymentGatewayModel {
  id: number;
  name: string;
  code: string; // Código único de la pasarela (paypal, stripe, etc)
  description: string;
  enabled: boolean;
  icon: string; // Icono o logo de la pasarela
  category: 'wallet' | 'card' | 'bank' | 'cash' | 'crypto' | 'other';
  countries?: string[]; // Países donde está disponible
  currencies?: string[]; // Monedas soportadas
  config?: {
    apiKey?: string;
    secretKey?: string;
    merchantId?: string;
    environment?: 'sandbox' | 'production';
    webhookUrl?: string;
    [key: string]: any; // Configuraciones adicionales específicas de cada pasarela
  };
  fees?: {
    percentage?: number; // Porcentaje de comisión
    fixed?: number; // Comisión fija
    currency?: string;
  };
  minAmount?: number;
  maxAmount?: number;
  requiresKYC?: boolean; // Requiere verificación de identidad
  processingTime?: string; // Tiempo estimado de procesamiento
  supportedPaymentMethods?: string[]; // visa, mastercard, amex, etc
  popularity?: number; // 1-5 para ordenar por popularidad
  createdAt?: Date;
  updatedAt?: Date;
}
