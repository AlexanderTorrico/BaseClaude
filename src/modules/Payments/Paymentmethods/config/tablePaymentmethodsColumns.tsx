import React from 'react';
import { Badge } from 'reactstrap';
import { PaymentMethodModel, PaymentMethodType } from '../models/PaymentmethodsModel';

const getTypeLabel = (type: PaymentMethodType): string => {
  const labels: Record<PaymentMethodType, string> = {
    card: 'Tarjeta',
    bank_transfer: 'Transferencia',
    cash: 'Efectivo',
    digital_wallet: 'Billetera Digital'
  };
  return labels[type] || type;
};

const getTypeColor = (type: PaymentMethodType): string => {
  const colors: Record<PaymentMethodType, string> = {
    card: 'primary',
    bank_transfer: 'info',
    cash: 'success',
    digital_wallet: 'warning'
  };
  return colors[type] || 'secondary';
};

export const paymentMethodsTableColumns = [
  {
    key: 'name',
    header: 'Método de Pago',
    sortable: true,
    filterable: true,
    filterType: 'text',
    cell: ({ row: { original } }: { row: { original: PaymentMethodModel } }) => (
      <div className="d-flex align-items-center gap-2">
        <div
          className="d-flex align-items-center justify-content-center rounded"
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: original.isActive ? '#e8f4fd' : '#f5f5f5'
          }}
        >
          <i
            className={`mdi ${original.icon} font-size-18`}
            style={{ color: original.isActive ? '#556ee6' : '#74788d' }}
          />
        </div>
        <div>
          <div className="fw-medium">{original.name}</div>
          <small className="text-muted">{original.description}</small>
        </div>
      </div>
    )
  },
  {
    key: 'type',
    header: 'Tipo',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: ['Tarjeta', 'Transferencia', 'Efectivo', 'Billetera Digital'],
    cell: ({ row: { original } }: { row: { original: PaymentMethodModel } }) => (
      <Badge color={getTypeColor(original.type)} className="font-size-12">
        {getTypeLabel(original.type)}
      </Badge>
    )
  },
  {
    key: 'commissionPercentage',
    header: 'Comisión',
    sortable: true,
    filterable: false,
    cell: ({ row: { original } }: { row: { original: PaymentMethodModel } }) => {
      const hasCommission = original.commissionPercentage > 0 || original.fixedCommission > 0;

      if (!hasCommission) {
        return <span className="text-success fw-medium">Sin comisión</span>;
      }

      return (
        <div>
          {original.commissionPercentage > 0 && (
            <div>{original.commissionPercentage}%</div>
          )}
          {original.fixedCommission > 0 && (
            <small className="text-muted">+ ${original.fixedCommission.toFixed(2)}</small>
          )}
        </div>
      );
    }
  },
  {
    key: 'currencies',
    header: 'Monedas',
    sortable: false,
    filterable: false,
    cell: ({ row: { original } }: { row: { original: PaymentMethodModel } }) => (
      <div className="d-flex flex-wrap gap-1">
        {original.currencies.slice(0, 3).map(currency => (
          <Badge key={currency} color="light" className="text-dark">
            {currency}
          </Badge>
        ))}
        {original.currencies.length > 3 && (
          <Badge color="secondary">+{original.currencies.length - 3}</Badge>
        )}
      </div>
    )
  },
  {
    key: 'limits',
    header: 'Límites',
    sortable: false,
    filterable: false,
    cell: ({ row: { original } }: { row: { original: PaymentMethodModel } }) => (
      <div>
        <small className="text-muted d-block">
          Min: ${original.limits.minAmount.toLocaleString()}
        </small>
        <small className="text-muted d-block">
          Max: ${original.limits.maxAmount.toLocaleString()}
        </small>
      </div>
    )
  },
  {
    key: 'isActive',
    header: 'Estado',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: ['Sí', 'No'],
    cell: ({ row: { original } }: { row: { original: PaymentMethodModel } }) => (
      <Badge color={original.isActive ? 'success' : 'danger'} pill>
        {original.isActive ? 'Activo' : 'Inactivo'}
      </Badge>
    )
  }
];
