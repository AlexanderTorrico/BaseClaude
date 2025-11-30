import {
  OrderModel,
  OrderStatus,
  PaymentStatus,
  PaymentMethod
} from '../models/OrderModel';

export const MOCK_ORDERS: OrderModel[] = [
  {
    id: 1,
    orderNumber: 'ORD-1001',
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // hace 30 minutos
    status: OrderStatus.PENDING,
    customer: {
      fullName: 'María García',
      phone: '+54 9 11 2345-6789',
      email: 'maria.garcia@email.com',
      address: 'Av. Corrientes 1234, CABA'
    },
    items: [
      { id: 1, productName: 'Pizza Napolitana Grande', quantity: 2, unitPrice: 4500, subtotal: 9000 },
      { id: 2, productName: 'Empanadas de Carne x6', quantity: 1, unitPrice: 3600, subtotal: 3600 },
      { id: 3, productName: 'Coca Cola 2L', quantity: 2, unitPrice: 1200, subtotal: 2400 }
    ],
    subtotal: 15000,
    total: 15000,
    paymentMethod: PaymentMethod.MERCADO_PAGO,
    paymentStatus: PaymentStatus.PAID
  },
  {
    id: 2,
    orderNumber: 'ORD-1002',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // hace 2 horas
    status: OrderStatus.PENDING,
    customer: {
      fullName: 'Juan Pérez',
      phone: '+54 9 11 9876-5432',
      email: 'juan.perez@email.com',
      address: 'Calle San Martín 567, Belgrano'
    },
    items: [
      { id: 4, productName: 'Hamburguesa Completa', quantity: 3, unitPrice: 3200, subtotal: 9600 },
      { id: 5, productName: 'Papas Fritas Grandes', quantity: 2, unitPrice: 1800, subtotal: 3600 }
    ],
    subtotal: 13200,
    total: 13200,
    paymentMethod: PaymentMethod.CASH,
    paymentStatus: PaymentStatus.PENDING
  },
  {
    id: 3,
    orderNumber: 'ORD-1003',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // hace 4 horas
    status: OrderStatus.CONFIRMED,
    customer: {
      fullName: 'Ana Rodríguez',
      phone: '+54 9 11 5555-1234',
      email: 'ana.rodriguez@email.com',
      address: 'Av. Rivadavia 8900, Flores'
    },
    items: [
      { id: 6, productName: 'Milanesa Napolitana', quantity: 2, unitPrice: 5500, subtotal: 11000 },
      { id: 7, productName: 'Ensalada Mixta', quantity: 2, unitPrice: 2000, subtotal: 4000 },
      { id: 8, productName: 'Agua Mineral 500ml', quantity: 2, unitPrice: 800, subtotal: 1600 }
    ],
    subtotal: 16600,
    total: 16600,
    paymentMethod: PaymentMethod.CARD,
    paymentStatus: PaymentStatus.PAID
  },
  {
    id: 4,
    orderNumber: 'ORD-1004',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // hace 6 horas
    status: OrderStatus.SHIPPED,
    customer: {
      fullName: 'Carlos López',
      phone: '+54 9 11 4444-5678',
      email: 'carlos.lopez@email.com',
      address: 'Calle Florida 345, Microcentro'
    },
    items: [
      { id: 9, productName: 'Sushi Mix 20 piezas', quantity: 1, unitPrice: 8500, subtotal: 8500 }
    ],
    subtotal: 8500,
    total: 8500,
    paymentMethod: PaymentMethod.TRANSFER,
    paymentStatus: PaymentStatus.PAID
  },
  {
    id: 5,
    orderNumber: 'ORD-1005',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // hace 1 día
    status: OrderStatus.DELIVERED,
    customer: {
      fullName: 'Laura Martínez',
      phone: '+54 9 11 3333-4444',
      email: 'laura.martinez@email.com',
      address: 'Av. Cabildo 2100, Nuñez'
    },
    items: [
      { id: 10, productName: 'Pastas Caseras', quantity: 4, unitPrice: 3800, subtotal: 15200 },
      { id: 11, productName: 'Salsa Bolognesa', quantity: 4, unitPrice: 1500, subtotal: 6000 },
      { id: 12, productName: 'Pan de Ajo', quantity: 2, unitPrice: 1200, subtotal: 2400 }
    ],
    subtotal: 23600,
    total: 23600,
    paymentMethod: PaymentMethod.MERCADO_PAGO,
    paymentStatus: PaymentStatus.PAID
  },
  {
    id: 6,
    orderNumber: 'ORD-1006',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // hace 2 días
    status: OrderStatus.DELIVERED,
    customer: {
      fullName: 'Roberto Sánchez',
      phone: '+54 9 11 2222-3333',
      email: 'roberto.sanchez@email.com',
      address: 'Calle Lavalle 890, Once'
    },
    items: [
      { id: 13, productName: 'Pollo al Horno', quantity: 1, unitPrice: 6500, subtotal: 6500 },
      { id: 14, productName: 'Puré de Papas', quantity: 2, unitPrice: 1800, subtotal: 3600 }
    ],
    subtotal: 10100,
    total: 10100,
    paymentMethod: PaymentMethod.CASH,
    paymentStatus: PaymentStatus.PAID
  },
  {
    id: 7,
    orderNumber: 'ORD-1007',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000), // hace 3 días
    status: OrderStatus.CANCELLED,
    customer: {
      fullName: 'Lucía Fernández',
      phone: '+54 9 11 1111-2222',
      email: 'lucia.fernandez@email.com',
      address: 'Av. Santa Fe 4500, Palermo'
    },
    items: [
      { id: 15, productName: 'Ravioles de Ricota', quantity: 2, unitPrice: 4200, subtotal: 8400 }
    ],
    subtotal: 8400,
    total: 8400,
    paymentMethod: PaymentMethod.CARD,
    paymentStatus: PaymentStatus.FAILED,
    notes: 'El cliente canceló por demora en la entrega'
  },
  {
    id: 8,
    orderNumber: 'ORD-1008',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // hace 5 horas - URGENTE
    status: OrderStatus.PENDING,
    customer: {
      fullName: 'Diego Morales',
      phone: '+54 9 11 6666-7777',
      email: 'diego.morales@email.com',
      address: 'Calle Mendoza 123, Villa Crespo'
    },
    items: [
      { id: 16, productName: 'Asado para 4', quantity: 1, unitPrice: 12000, subtotal: 12000 },
      { id: 17, productName: 'Vino Malbec', quantity: 2, unitPrice: 3500, subtotal: 7000 },
      { id: 18, productName: 'Ensalada César', quantity: 2, unitPrice: 2200, subtotal: 4400 }
    ],
    subtotal: 23400,
    total: 23400,
    paymentMethod: PaymentMethod.MERCADO_PAGO,
    paymentStatus: PaymentStatus.PAID,
    notes: 'Por favor, sin cebolla en la ensalada'
  },
  {
    id: 9,
    orderNumber: 'ORD-1009',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // hace 1 hora
    status: OrderStatus.CONFIRMED,
    customer: {
      fullName: 'Valentina Torres',
      phone: '+54 9 11 8888-9999',
      email: 'valentina.torres@email.com',
      address: 'Av. Libertador 6000, Nuñez'
    },
    items: [
      { id: 19, productName: 'Wrap de Pollo', quantity: 2, unitPrice: 2800, subtotal: 5600 },
      { id: 20, productName: 'Smoothie de Frutas', quantity: 2, unitPrice: 1500, subtotal: 3000 }
    ],
    subtotal: 8600,
    total: 8600,
    paymentMethod: PaymentMethod.CARD,
    paymentStatus: PaymentStatus.PAID
  },
  {
    id: 10,
    orderNumber: 'ORD-1010',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // hace 3 horas
    status: OrderStatus.SHIPPED,
    customer: {
      fullName: 'Martín Gómez',
      phone: '+54 9 11 7777-8888',
      email: 'martin.gomez@email.com',
      address: 'Calle Córdoba 2000, Recoleta'
    },
    items: [
      { id: 21, productName: 'Lomo a la Pimienta', quantity: 2, unitPrice: 7200, subtotal: 14400 },
      { id: 22, productName: 'Papas Rústicas', quantity: 2, unitPrice: 2000, subtotal: 4000 },
      { id: 23, productName: 'Cerveza Artesanal', quantity: 4, unitPrice: 1800, subtotal: 7200 }
    ],
    subtotal: 25600,
    total: 25600,
    paymentMethod: PaymentMethod.TRANSFER,
    paymentStatus: PaymentStatus.PAID
  }
];
