import { Badge } from 'reactstrap';
import { SaleTransactionModel, TransactionStatus } from '../models/MysalesModel';

const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

const getStatusConfig = (status: TransactionStatus): { color: string; label: string; icon: string } => {
  const configs: Record<TransactionStatus, { color: string; label: string; icon: string }> = {
    completed: { color: 'success', label: 'Completado', icon: 'mdi-check-circle' },
    pending: { color: 'warning', label: 'Pendiente', icon: 'mdi-clock-outline' },
    failed: { color: 'danger', label: 'Fallido', icon: 'mdi-close-circle' },
    refunded: { color: 'info', label: 'Reembolsado', icon: 'mdi-undo' },
    cancelled: { color: 'secondary', label: 'Cancelado', icon: 'mdi-cancel' }
  };
  return configs[status];
};

export const mysalesColumns = [
  {
    key: 'transactionId',
    header: 'Transacción',
    sortable: true,
    filterable: true,
    filterType: 'text',
    cell: ({ row: { original } }: { row: { original: SaleTransactionModel } }) => (
      <div>
        <span className="fw-medium font-size-13">{original.transactionId}</span>
        <br />
        <small className="text-muted">{original.orderReference}</small>
      </div>
    )
  },
  {
    key: 'createdAt',
    header: 'Fecha',
    sortable: true,
    filterable: false,
    cell: ({ row: { original } }: { row: { original: SaleTransactionModel } }) => (
      <span className="text-muted font-size-13">{formatDate(original.createdAt)}</span>
    )
  },
  {
    key: 'customer',
    header: 'Cliente',
    sortable: true,
    filterable: true,
    filterType: 'text',
    filterAccessor: (row: SaleTransactionModel) => row.customer.name,
    cell: ({ row: { original } }: { row: { original: SaleTransactionModel } }) => (
      <div>
        <span className="fw-medium">{original.customer.name}</span>
        <br />
        <small className="text-muted">{original.customer.email}</small>
      </div>
    )
  },
  {
    key: 'page',
    header: 'Página',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterAccessor: (row: SaleTransactionModel) => row.page.name,
    cell: ({ row: { original } }: { row: { original: SaleTransactionModel } }) => (
      <div className="d-flex align-items-center">
        <i className="mdi mdi-web me-2 text-primary"></i>
        <span>{original.page.name}</span>
      </div>
    )
  },
  {
    key: 'paymentMethod',
    header: 'Método',
    sortable: false,
    filterable: true,
    filterType: 'select',
    filterAccessor: (row: SaleTransactionModel) => row.paymentMethod.name,
    cell: ({ row: { original } }: { row: { original: SaleTransactionModel } }) => (
      <div className="d-flex align-items-center">
        <i
          className={`mdi ${original.paymentMethod.icon} me-2`}
          style={{ color: original.paymentMethod.color }}
        ></i>
        <div>
          <span>{original.paymentMethod.name}</span>
          <br />
          <small className="text-muted">{original.paymentAccount.alias}</small>
        </div>
      </div>
    )
  },
  {
    key: 'amounts',
    header: 'Monto',
    sortable: true,
    filterable: false,
    sortAccessor: (row: SaleTransactionModel) => row.amounts.gross,
    cell: ({ row: { original } }: { row: { original: SaleTransactionModel } }) => (
      <div className="text-end">
        <span className="fw-bold text-dark">
          {formatCurrency(original.amounts.gross, original.amounts.currency)}
        </span>
        <br />
        <small className="text-success">
          Neto: {formatCurrency(original.amounts.net, original.amounts.currency)}
        </small>
      </div>
    )
  },
  {
    key: 'status',
    header: 'Estado',
    sortable: true,
    filterable: true,
    filterType: 'select',
    cell: ({ row: { original } }: { row: { original: SaleTransactionModel } }) => {
      const config = getStatusConfig(original.status);
      return (
        <Badge color={config.color} className="px-2 py-1">
          <i className={`mdi ${config.icon} me-1`}></i>
          {config.label}
        </Badge>
      );
    }
  }
];
