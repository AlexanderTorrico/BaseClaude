import React from 'react';
import { Badge } from 'reactstrap';
import {
  OrderModel,
  ORDER_STATUS_CONFIG,
  PAYMENT_STATUS_CONFIG,
  PAYMENT_METHOD_CONFIG
} from '../models/OrderModel';

const formatCurrency = (value: number): string => {
  return `$${value.toLocaleString('es-AR')}`;
};

const formatDate = (date: Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getTimeSince = (date: Date): string => {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffHours >= 24) {
    const diffDays = Math.floor(diffHours / 24);
    return `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
  }
  if (diffHours > 0) {
    return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  }
  return `hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
};

export const orderTableColumns = [
  {
    key: 'orderNumber',
    header: 'Pedido',
    sortable: true,
    filterable: true,
    filterType: 'text',
    cell: ({ row: { original } }: { row: { original: OrderModel } }) => (
      <div className="d-flex flex-column">
        <span className="fw-bold text-primary">{original.orderNumber}</span>
        <small className="text-muted">{getTimeSince(original.createdAt)}</small>
      </div>
    )
  },
  {
    key: 'customer.fullName',
    header: 'Cliente',
    sortable: true,
    filterable: true,
    filterType: 'text',
    cell: ({ row: { original } }: { row: { original: OrderModel } }) => (
      <div className="d-flex flex-column">
        <span className="fw-medium">{original.customer.fullName}</span>
        <small className="text-muted">
          <i className="mdi mdi-phone me-1"></i>
          {original.customer.phone}
        </small>
      </div>
    )
  },
  {
    key: 'items',
    header: 'Productos',
    sortable: false,
    filterable: false,
    cell: ({ row: { original } }: { row: { original: OrderModel } }) => {
      const itemCount = original.items.length;
      const totalQuantity = original.items.reduce((acc, item) => acc + item.quantity, 0);

      return (
        <Badge color="light" className="text-dark">
          <i className="mdi mdi-package-variant me-1"></i>
          {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})
        </Badge>
      );
    }
  },
  {
    key: 'total',
    header: 'Total',
    sortable: true,
    filterable: false,
    cell: ({ row: { original } }: { row: { original: OrderModel } }) => (
      <span className="fw-bold">{formatCurrency(original.total)}</span>
    )
  },
  {
    key: 'paymentStatus',
    header: 'Pago',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: Object.entries(PAYMENT_STATUS_CONFIG).map(([key, value]) => ({
      value: key,
      label: value.label
    })),
    cell: ({ row: { original } }: { row: { original: OrderModel } }) => {
      const paymentConfig = PAYMENT_STATUS_CONFIG[original.paymentStatus];
      const methodConfig = PAYMENT_METHOD_CONFIG[original.paymentMethod];

      return (
        <div className="d-flex flex-column gap-1">
          <Badge color={paymentConfig.color} pill>
            <i className={`mdi ${paymentConfig.icon} me-1`}></i>
            {paymentConfig.label}
          </Badge>
          <small className="text-muted">
            <i className={`mdi ${methodConfig.icon} me-1`}></i>
            {methodConfig.label}
          </small>
        </div>
      );
    }
  },
  {
    key: 'status',
    header: 'Estado',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: Object.entries(ORDER_STATUS_CONFIG).map(([key, value]) => ({
      value: key,
      label: value.label
    })),
    cell: ({ row: { original } }: { row: { original: OrderModel } }) => {
      const statusConfig = ORDER_STATUS_CONFIG[original.status];

      return (
        <Badge color={statusConfig.color} className="px-3 py-2">
          <i className={`mdi ${statusConfig.icon} me-1`}></i>
          {statusConfig.label}
        </Badge>
      );
    }
  },
  {
    key: 'createdAt',
    header: 'Fecha',
    sortable: true,
    filterable: true,
    filterType: 'date',
    cell: ({ row: { original } }: { row: { original: OrderModel } }) => (
      <small className="text-muted">{formatDate(original.createdAt)}</small>
    )
  }
];
