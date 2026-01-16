import { SaleTransactionModel, SalesKPIs } from '../models/MysalesModel';

export const MOCK_SALES_TRANSACTIONS: SaleTransactionModel[] = [
  {
    id: 1,
    transactionId: 'TXN-2026-000001',
    orderReference: 'ORD-001234',
    status: 'completed',
    amounts: {
      gross: 150.00,
      commission: 4.50,
      net: 145.50,
      currency: 'EUR'
    },
    customer: {
      name: 'María García',
      email: 'maria.garcia@email.com',
      phone: '+34 612 345 678'
    },
    paymentMethod: {
      id: 1,
      name: 'Visa',
      type: 'card',
      provider: 'visa',
      icon: 'mdi-credit-card',
      color: '#1A1F71'
    },
    paymentAccount: {
      id: 1,
      alias: 'Stripe Principal',
      description: 'Cuenta principal de Stripe'
    },
    page: {
      id: 1,
      name: 'Osteria da Canneto',
      domain: 'https://osteriadacanneto.com',
      image: '/restaurants/canneto.jpg'
    },
    description: 'Reserva mesa para 4 - Cena especial',
    createdAt: '2026-01-14T10:30:00Z',
    completedAt: '2026-01-14T10:30:05Z'
  },
  {
    id: 2,
    transactionId: 'TXN-2026-000002',
    orderReference: 'ORD-001235',
    status: 'completed',
    amounts: {
      gross: 85.50,
      commission: 2.57,
      net: 82.93,
      currency: 'EUR'
    },
    customer: {
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com'
    },
    paymentMethod: {
      id: 2,
      name: 'PayPal',
      type: 'digital_wallet',
      provider: 'paypal',
      icon: 'mdi-wallet',
      color: '#003087'
    },
    paymentAccount: {
      id: 2,
      alias: 'PayPal Business',
      description: 'Cuenta PayPal empresarial'
    },
    page: {
      id: 2,
      name: 'La Trattoria Bella',
      domain: 'https://latrattoriabella.com',
      image: '/restaurants/bella.jpg'
    },
    description: 'Pedido delivery - Pizza y pasta',
    createdAt: '2026-01-14T11:45:00Z',
    completedAt: '2026-01-14T11:45:12Z'
  },
  {
    id: 3,
    transactionId: 'TXN-2026-000003',
    orderReference: 'ORD-001236',
    status: 'pending',
    amounts: {
      gross: 220.00,
      commission: 6.60,
      net: 213.40,
      currency: 'EUR'
    },
    customer: {
      name: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      phone: '+34 698 765 432'
    },
    paymentMethod: {
      id: 3,
      name: 'Transferencia Bancaria',
      type: 'bank_transfer',
      provider: 'bank',
      icon: 'mdi-bank',
      color: '#2E7D32'
    },
    paymentAccount: {
      id: 3,
      alias: 'Banco Santander',
      description: 'Cuenta corriente principal'
    },
    page: {
      id: 1,
      name: 'Osteria da Canneto',
      domain: 'https://osteriadacanneto.com',
      image: '/restaurants/canneto.jpg'
    },
    description: 'Evento privado - Cumpleaños',
    createdAt: '2026-01-14T14:20:00Z'
  },
  {
    id: 4,
    transactionId: 'TXN-2026-000004',
    orderReference: 'ORD-001237',
    status: 'failed',
    amounts: {
      gross: 45.00,
      commission: 1.35,
      net: 43.65,
      currency: 'EUR'
    },
    customer: {
      name: 'Pedro López',
      email: 'pedro.lopez@email.com'
    },
    paymentMethod: {
      id: 4,
      name: 'Mastercard',
      type: 'card',
      provider: 'mastercard',
      icon: 'mdi-credit-card',
      color: '#EB001B'
    },
    paymentAccount: {
      id: 1,
      alias: 'Stripe Principal',
      description: 'Cuenta principal de Stripe'
    },
    page: {
      id: 3,
      name: 'Café del Centro',
      domain: 'https://cafedelcentro.com',
      image: '/restaurants/cafe.jpg'
    },
    description: 'Pedido online - Desayuno',
    createdAt: '2026-01-13T09:15:00Z'
  },
  {
    id: 5,
    transactionId: 'TXN-2026-000005',
    orderReference: 'ORD-001238',
    status: 'refunded',
    amounts: {
      gross: 95.00,
      commission: 2.85,
      net: 92.15,
      currency: 'EUR'
    },
    customer: {
      name: 'Laura Sánchez',
      email: 'laura.sanchez@email.com',
      phone: '+34 655 123 456'
    },
    paymentMethod: {
      id: 1,
      name: 'Visa',
      type: 'card',
      provider: 'visa',
      icon: 'mdi-credit-card',
      color: '#1A1F71'
    },
    paymentAccount: {
      id: 1,
      alias: 'Stripe Principal',
      description: 'Cuenta principal de Stripe'
    },
    page: {
      id: 2,
      name: 'La Trattoria Bella',
      domain: 'https://latrattoriabella.com',
      image: '/restaurants/bella.jpg'
    },
    description: 'Reserva cancelada - Reembolso procesado',
    createdAt: '2026-01-12T16:00:00Z',
    completedAt: '2026-01-12T16:00:08Z'
  },
  {
    id: 6,
    transactionId: 'TXN-2026-000006',
    orderReference: 'ORD-001239',
    status: 'completed',
    amounts: {
      gross: 320.00,
      commission: 9.60,
      net: 310.40,
      currency: 'EUR'
    },
    customer: {
      name: 'Roberto Fernández',
      email: 'roberto.fernandez@email.com',
      phone: '+34 677 890 123'
    },
    paymentMethod: {
      id: 5,
      name: 'MercadoPago',
      type: 'digital_wallet',
      provider: 'mercadopago',
      icon: 'mdi-wallet',
      color: '#009EE3'
    },
    paymentAccount: {
      id: 4,
      alias: 'MercadoPago Store',
      description: 'Cuenta MercadoPago tienda'
    },
    page: {
      id: 1,
      name: 'Osteria da Canneto',
      domain: 'https://osteriadacanneto.com',
      image: '/restaurants/canneto.jpg'
    },
    description: 'Catering corporativo - 15 personas',
    createdAt: '2026-01-12T12:30:00Z',
    completedAt: '2026-01-12T12:30:15Z'
  },
  {
    id: 7,
    transactionId: 'TXN-2026-000007',
    orderReference: 'ORD-001240',
    status: 'completed',
    amounts: {
      gross: 58.90,
      commission: 1.77,
      net: 57.13,
      currency: 'EUR'
    },
    customer: {
      name: 'Elena Torres',
      email: 'elena.torres@email.com'
    },
    paymentMethod: {
      id: 2,
      name: 'PayPal',
      type: 'digital_wallet',
      provider: 'paypal',
      icon: 'mdi-wallet',
      color: '#003087'
    },
    paymentAccount: {
      id: 2,
      alias: 'PayPal Business',
      description: 'Cuenta PayPal empresarial'
    },
    page: {
      id: 3,
      name: 'Café del Centro',
      domain: 'https://cafedelcentro.com',
      image: '/restaurants/cafe.jpg'
    },
    description: 'Suscripción mensual café premium',
    createdAt: '2026-01-11T08:00:00Z',
    completedAt: '2026-01-11T08:00:03Z'
  },
  {
    id: 8,
    transactionId: 'TXN-2026-000008',
    orderReference: 'ORD-001241',
    status: 'completed',
    amounts: {
      gross: 175.00,
      commission: 5.25,
      net: 169.75,
      currency: 'EUR'
    },
    customer: {
      name: 'Miguel Ángel Ruiz',
      email: 'miguelangel.ruiz@email.com',
      phone: '+34 699 111 222'
    },
    paymentMethod: {
      id: 1,
      name: 'Visa',
      type: 'card',
      provider: 'visa',
      icon: 'mdi-credit-card',
      color: '#1A1F71'
    },
    paymentAccount: {
      id: 1,
      alias: 'Stripe Principal',
      description: 'Cuenta principal de Stripe'
    },
    page: {
      id: 2,
      name: 'La Trattoria Bella',
      domain: 'https://latrattoriabella.com',
      image: '/restaurants/bella.jpg'
    },
    description: 'Cena romántica - Menú degustación',
    createdAt: '2026-01-10T20:45:00Z',
    completedAt: '2026-01-10T20:45:10Z'
  },
  {
    id: 9,
    transactionId: 'TXN-2026-000009',
    orderReference: 'ORD-001242',
    status: 'cancelled',
    amounts: {
      gross: 65.00,
      commission: 1.95,
      net: 63.05,
      currency: 'EUR'
    },
    customer: {
      name: 'Isabel Moreno',
      email: 'isabel.moreno@email.com'
    },
    paymentMethod: {
      id: 4,
      name: 'Mastercard',
      type: 'card',
      provider: 'mastercard',
      icon: 'mdi-credit-card',
      color: '#EB001B'
    },
    paymentAccount: {
      id: 1,
      alias: 'Stripe Principal',
      description: 'Cuenta principal de Stripe'
    },
    page: {
      id: 1,
      name: 'Osteria da Canneto',
      domain: 'https://osteriadacanneto.com',
      image: '/restaurants/canneto.jpg'
    },
    description: 'Reserva cancelada por cliente',
    createdAt: '2026-01-10T15:20:00Z'
  },
  {
    id: 10,
    transactionId: 'TXN-2026-000010',
    orderReference: 'ORD-001243',
    status: 'completed',
    amounts: {
      gross: 420.00,
      commission: 12.60,
      net: 407.40,
      currency: 'EUR'
    },
    customer: {
      name: 'Empresa Tech Solutions S.L.',
      email: 'contabilidad@techsolutions.es',
      phone: '+34 911 222 333'
    },
    paymentMethod: {
      id: 3,
      name: 'Transferencia Bancaria',
      type: 'bank_transfer',
      provider: 'bank',
      icon: 'mdi-bank',
      color: '#2E7D32'
    },
    paymentAccount: {
      id: 3,
      alias: 'Banco Santander',
      description: 'Cuenta corriente principal'
    },
    page: {
      id: 1,
      name: 'Osteria da Canneto',
      domain: 'https://osteriadacanneto.com',
      image: '/restaurants/canneto.jpg'
    },
    description: 'Almuerzo de negocios - 20 personas',
    createdAt: '2026-01-09T13:00:00Z',
    completedAt: '2026-01-09T14:30:00Z'
  }
];

export const calculateSalesKPIs = (transactions: SaleTransactionModel[]): SalesKPIs => {
  const completed = transactions.filter(t => t.status === 'completed');
  const pending = transactions.filter(t => t.status === 'pending');
  const failed = transactions.filter(t => t.status === 'failed');
  const refunded = transactions.filter(t => t.status === 'refunded');

  return {
    totalGross: completed.reduce((sum, t) => sum + t.amounts.gross, 0),
    totalNet: completed.reduce((sum, t) => sum + t.amounts.net, 0),
    totalCommissions: completed.reduce((sum, t) => sum + t.amounts.commission, 0),
    transactionCount: transactions.length,
    completedCount: completed.length,
    pendingCount: pending.length,
    failedCount: failed.length,
    refundedCount: refunded.length,
    currency: 'EUR'
  };
};
