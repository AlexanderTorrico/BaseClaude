import React, { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  Badge,
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from 'reactstrap';
import { TestTransactionModel, TRANSACTION_STATUS_LABELS, TransactionStatus } from '../models/PaymentTestModel';

interface TransactionHistoryProps {
  transactions: TestTransactionModel[];
  loading: boolean;
  onRefresh: () => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  loading,
  onRefresh,
}) => {
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | ''>('');
  const [selectedTransaction, setSelectedTransaction] = useState<TestTransactionModel | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredTransactions = statusFilter
    ? transactions.filter((t) => t.status === statusFilter)
    : transactions;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewDetails = (transaction: TestTransactionModel) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="bg-transparent">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="mb-0">
              <i className="mdi mdi-history me-2" />
              Historial de Transacciones
            </h5>
            <div className="d-flex align-items-center gap-2">
              <Input
                type="select"
                bsSize="sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | '')}
                style={{ width: '150px' }}
              >
                <option value="">Todos los estados</option>
                {Object.entries(TRANSACTION_STATUS_LABELS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </Input>
              <Button color="light" size="sm" onClick={onRefresh} disabled={loading}>
                {loading ? <Spinner size="sm" /> : <i className="mdi mdi-refresh" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-5">
              <i className="mdi mdi-inbox-outline text-muted" style={{ fontSize: '48px' }} />
              <p className="text-muted mt-2">No hay transacciones</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table className="mb-0" hover>
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Monto</th>
                    <th>Estado</th>
                    <th>Pagador</th>
                    <th>Fecha</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => {
                    const statusConfig = TRANSACTION_STATUS_LABELS[transaction.status];
                    return (
                      <tr key={transaction.uuid}>
                        <td>
                          <code className="small">{transaction.uuid.substring(0, 8)}...</code>
                          {transaction.paypalOrderId && (
                            <div className="small text-muted">
                              PayPal: {transaction.paypalOrderId.substring(0, 10)}...
                            </div>
                          )}
                        </td>
                        <td>
                          <strong>{formatCurrency(transaction.amount, transaction.currency)}</strong>
                          <div className="small text-muted">{transaction.description || '-'}</div>
                        </td>
                        <td>
                          <Badge color={statusConfig.color}>{statusConfig.label}</Badge>
                        </td>
                        <td>
                          {transaction.payerName || transaction.payerEmail || (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          <small>{formatDate(transaction.createdAt)}</small>
                          {transaction.capturedAt && (
                            <div className="small text-success">
                              <i className="mdi mdi-check me-1" />
                              {formatDate(transaction.capturedAt)}
                            </div>
                          )}
                        </td>
                        <td className="text-end">
                          <Button
                            color="link"
                            size="sm"
                            onClick={() => handleViewDetails(transaction)}
                          >
                            <i className="mdi mdi-eye" /> Ver
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Modal de detalles */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
        <ModalHeader toggle={() => setModalOpen(false)}>
          Detalles de la Transacción
        </ModalHeader>
        <ModalBody>
          {selectedTransaction && (
            <TransactionDetails transaction={selectedTransaction} />
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

interface TransactionDetailsProps {
  transaction: TestTransactionModel;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction }) => {
  const statusConfig = TRANSACTION_STATUS_LABELS[transaction.status];

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('es-ES');
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-4 pb-3 border-bottom">
        <Badge color={statusConfig.color} className="px-3 py-2 mb-2">
          {statusConfig.label}
        </Badge>
        <h3>{formatCurrency(transaction.amount, transaction.currency)}</h3>
        <p className="text-muted mb-0">{transaction.description || 'Sin descripción'}</p>
      </div>

      {/* Detalles en grid */}
      <div className="row">
        <div className="col-md-6">
          <h6 className="text-muted mb-3">Información de la Transacción</h6>
          <table className="table table-sm">
            <tbody>
              <tr>
                <td className="text-muted">UUID</td>
                <td><code>{transaction.uuid}</code></td>
              </tr>
              <tr>
                <td className="text-muted">PayPal Order ID</td>
                <td><code>{transaction.paypalOrderId || '-'}</code></td>
              </tr>
              <tr>
                <td className="text-muted">PayPal Capture ID</td>
                <td><code>{transaction.paypalCaptureId || '-'}</code></td>
              </tr>
              <tr>
                <td className="text-muted">Modo</td>
                <td>
                  <Badge color={transaction.mode === 'sandbox' ? 'warning' : 'success'}>
                    {transaction.mode}
                  </Badge>
                </td>
              </tr>
              <tr>
                <td className="text-muted">Moneda</td>
                <td>{transaction.currency}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="col-md-6">
          <h6 className="text-muted mb-3">Información del Pagador</h6>
          <table className="table table-sm">
            <tbody>
              <tr>
                <td className="text-muted">Nombre</td>
                <td>{transaction.payerName || '-'}</td>
              </tr>
              <tr>
                <td className="text-muted">Email</td>
                <td>{transaction.payerEmail || '-'}</td>
              </tr>
              <tr>
                <td className="text-muted">País</td>
                <td>{transaction.payerCountryCode || '-'}</td>
              </tr>
              <tr>
                <td className="text-muted">PayPal Payer ID</td>
                <td><code>{transaction.paypalPayerId || '-'}</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Timestamps */}
      <div className="mt-4">
        <h6 className="text-muted mb-3">Línea de Tiempo</h6>
        <div className="timeline-alt pb-0">
          <div className="timeline-item">
            <i className="mdi mdi-file-document-outline bg-info text-white timeline-icon" />
            <div className="timeline-item-info">
              <span className="fw-bold">Creada</span>
              <span className="text-muted ms-2">{formatDate(transaction.createdAt)}</span>
            </div>
          </div>
          {transaction.approvedAt && (
            <div className="timeline-item">
              <i className="mdi mdi-check-circle-outline bg-primary text-white timeline-icon" />
              <div className="timeline-item-info">
                <span className="fw-bold">Aprobada</span>
                <span className="text-muted ms-2">{formatDate(transaction.approvedAt)}</span>
              </div>
            </div>
          )}
          {transaction.capturedAt && (
            <div className="timeline-item">
              <i className="mdi mdi-cash-check bg-success text-white timeline-icon" />
              <div className="timeline-item-info">
                <span className="fw-bold">Capturada</span>
                <span className="text-muted ms-2">{formatDate(transaction.capturedAt)}</span>
              </div>
            </div>
          )}
          {transaction.failedAt && (
            <div className="timeline-item">
              <i className="mdi mdi-close-circle bg-danger text-white timeline-icon" />
              <div className="timeline-item-info">
                <span className="fw-bold">Fallida</span>
                <span className="text-muted ms-2">{formatDate(transaction.failedAt)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
