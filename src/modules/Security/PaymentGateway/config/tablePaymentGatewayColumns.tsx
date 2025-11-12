import React from 'react';
import { Badge } from 'reactstrap';
import { PaymentGatewayModel } from '../models/PaymentGatewayModel';

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    card: 'primary',
    wallet: 'success',
    bank: 'info',
    cash: 'warning',
    crypto: 'dark',
    other: 'secondary'
  };
  return colors[category] || 'secondary';
};

const getCategoryLabel = (category: string) => {
  const labels: { [key: string]: string } = {
    card: 'Tarjeta',
    wallet: 'Billetera',
    bank: 'Banco',
    cash: 'Efectivo',
    crypto: 'Cripto',
    other: 'Otro'
  };
  return labels[category] || category;
};

export const paymentgatewayColumns = [
  {
    Header: 'Pasarela',
    accessor: 'name',
    filterable: true,
    Cell: ({ row }: any) => {
      const item: PaymentGatewayModel = row.original;
      return (
        <div className="d-flex align-items-center">
          <i className={`${item.icon} font-size-20 me-2`}></i>
          <div>
            <div className="fw-bold">{item.name}</div>
            <small className="text-muted">{item.description}</small>
          </div>
        </div>
      );
    },
  },
  {
    Header: 'Categoría',
    accessor: 'category',
    filterable: true,
    Cell: ({ value }: any) => (
      <Badge color={getCategoryColor(value)} pill>
        {getCategoryLabel(value)}
      </Badge>
    ),
  },
  {
    Header: 'Estado',
    accessor: 'enabled',
    filterable: true,
    Cell: ({ value }: any) => (
      <Badge color={value ? 'success' : 'secondary'} pill>
        {value ? 'Activa' : 'Inactiva'}
      </Badge>
    ),
  },
  {
    Header: 'Comisiones',
    accessor: 'fees',
    disableFilters: true,
    Cell: ({ value }: any) => {
      if (!value) return <span className="text-muted">N/A</span>;
      const parts = [];
      if (value.percentage) parts.push(`${value.percentage}%`);
      if (value.fixed) parts.push(`+${value.fixed} ${value.currency || ''}`);
      return <span>{parts.join(' ') || 'Gratis'}</span>;
    },
  },
  {
    Header: 'Países',
    accessor: 'countries',
    disableFilters: true,
    Cell: ({ value }: any) => {
      if (!value || value.length === 0) return <span className="text-muted">N/A</span>;
      if (value.includes('Global')) return <Badge color="info">Global</Badge>;
      const display = value.slice(0, 3).join(', ');
      const more = value.length > 3 ? ` +${value.length - 3}` : '';
      return <span className="text-muted">{display}{more}</span>;
    },
  },
  {
    Header: 'Tiempo de Proceso',
    accessor: 'processingTime',
    disableFilters: true,
    Cell: ({ value }: any) => {
      if (!value) return <span className="text-muted">N/A</span>;
      const isInstant = value.toLowerCase().includes('instant');
      return (
        <span className={isInstant ? 'text-success' : ''}>
          {isInstant && <i className="mdi mdi-flash me-1"></i>}
          {value}
        </span>
      );
    },
  },
  {
    Header: 'Acciones',
    accessor: 'actions',
    disableFilters: true,
    Cell: ({ row }: any) => {
      const item: PaymentGatewayModel = row.original;

      return (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => console.log('Configurar:', item.id)}
            title="Configurar pasarela"
          >
            <i className="mdi mdi-cog"></i>
          </button>
          <button
            className={`btn btn-sm ${item.enabled ? 'btn-warning' : 'btn-success'}`}
            onClick={() => console.log('Toggle:', item.id)}
            title={item.enabled ? 'Desactivar' : 'Activar'}
          >
            <i className={`mdi ${item.enabled ? 'mdi-pause' : 'mdi-play'}`}></i>
          </button>
        </div>
      );
    },
  },
];
