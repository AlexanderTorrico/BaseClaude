import React from 'react';
import {
  Card,
  CardBody,
  Button,
  Badge,
  Spinner,
  Progress,
} from 'reactstrap';
import { TestTransactionModel, TRANSACTION_STATUS_LABELS } from '../models/PaymentTestModel';

interface PaymentStatusCardProps {
  transaction: TestTransactionModel;
  loading: boolean;
  onCapture: () => void;
  onCheckStatus: () => void;
  onNewPayment: () => void;
  onOpenPayPal: () => void;
}

const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({
  transaction,
  loading,
  onCapture,
  onCheckStatus,
  onNewPayment,
  onOpenPayPal,
}) => {
  const statusConfig = TRANSACTION_STATUS_LABELS[transaction.status];

  const getStepProgress = () => {
    switch (transaction.status) {
      case 'created':
        return 33;
      case 'approved':
        return 66;
      case 'captured':
        return 100;
      case 'failed':
      case 'cancelled':
        return 0;
      default:
        return 0;
    }
  };

  const getStepStatus = (step: 'created' | 'approved' | 'captured') => {
    const statusOrder = ['created', 'approved', 'captured'];
    const currentIndex = statusOrder.indexOf(transaction.status);
    const stepIndex = statusOrder.indexOf(step);

    if (transaction.status === 'failed' || transaction.status === 'cancelled') {
      return 'error';
    }

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

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
    <Card className="border-0 shadow-sm">
      <CardBody>
        {/* Header con estado */}
        <div className="text-center mb-4">
          <Badge color={statusConfig.color} className="px-3 py-2 mb-3" style={{ fontSize: '1rem' }}>
            {statusConfig.label}
          </Badge>
          <h3 className="mb-1">{formatCurrency(transaction.amount, transaction.currency)}</h3>
          <p className="text-muted mb-0">{transaction.description || 'Pago de prueba'}</p>
        </div>

        {/* Barra de progreso */}
        {!['failed', 'cancelled'].includes(transaction.status) && (
          <div className="mb-4">
            <Progress
              value={getStepProgress()}
              color={transaction.status === 'captured' ? 'success' : 'primary'}
              className="mb-3"
              style={{ height: '8px' }}
            />
            <div className="d-flex justify-content-between">
              <StepIndicator
                label="Creada"
                status={getStepStatus('created')}
                icon="mdi-file-document-outline"
              />
              <StepIndicator
                label="Aprobada"
                status={getStepStatus('approved')}
                icon="mdi-check-circle-outline"
              />
              <StepIndicator
                label="Capturada"
                status={getStepStatus('captured')}
                icon="mdi-cash-check"
              />
            </div>
          </div>
        )}

        {/* Detalles de la transacción */}
        <div className="bg-light rounded p-3 mb-4">
          <h6 className="mb-3">Detalles de la Transacción</h6>
          <div className="row g-2">
            <div className="col-6">
              <small className="text-muted d-block">ID Transacción</small>
              <code className="small">{transaction.uuid.substring(0, 8)}...</code>
            </div>
            <div className="col-6">
              <small className="text-muted d-block">ID PayPal</small>
              <code className="small">{transaction.paypalOrderId || '-'}</code>
            </div>
            <div className="col-6">
              <small className="text-muted d-block">Creada</small>
              <span className="small">{formatDate(transaction.createdAt)}</span>
            </div>
            <div className="col-6">
              <small className="text-muted d-block">Moneda</small>
              <span className="small">{transaction.currency}</span>
            </div>
            {transaction.payerEmail && (
              <>
                <div className="col-6">
                  <small className="text-muted d-block">Pagador</small>
                  <span className="small">{transaction.payerName || '-'}</span>
                </div>
                <div className="col-6">
                  <small className="text-muted d-block">Email</small>
                  <span className="small">{transaction.payerEmail}</span>
                </div>
              </>
            )}
            {transaction.capturedAt && (
              <div className="col-12">
                <small className="text-muted d-block">Capturada</small>
                <span className="small text-success">{formatDate(transaction.capturedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Acciones según estado */}
        <div className="d-grid gap-2">
          {transaction.status === 'created' && transaction.approveUrl && (
            <>
              <Button color="primary" size="lg" onClick={onOpenPayPal} disabled={loading}>
                <i className="mdi mdi-paypal me-2" />
                Aprobar en PayPal
              </Button>
              <Button color="outline-secondary" onClick={onCheckStatus} disabled={loading}>
                {loading ? <Spinner size="sm" /> : <i className="mdi mdi-refresh me-2" />}
                Verificar Estado
              </Button>
            </>
          )}

          {transaction.status === 'approved' && (
            <>
              <Button color="success" size="lg" onClick={onCapture} disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Capturando...
                  </>
                ) : (
                  <>
                    <i className="mdi mdi-cash-check me-2" />
                    Capturar Pago
                  </>
                )}
              </Button>
              <Button color="outline-secondary" onClick={onCheckStatus} disabled={loading}>
                <i className="mdi mdi-refresh me-2" />
                Verificar Estado
              </Button>
            </>
          )}

          {transaction.status === 'captured' && (
            <div className="text-center">
              <div className="mb-3">
                <i className="mdi mdi-check-circle text-success" style={{ fontSize: '64px' }} />
              </div>
              <h5 className="text-success">Pago Completado</h5>
              <p className="text-muted mb-3">
                El pago ha sido capturado exitosamente.
              </p>
              <Button color="primary" onClick={onNewPayment}>
                <i className="mdi mdi-plus me-2" />
                Nuevo Pago de Prueba
              </Button>
            </div>
          )}

          {(transaction.status === 'failed' || transaction.status === 'cancelled') && (
            <div className="text-center">
              <div className="mb-3">
                <i
                  className={`mdi ${transaction.status === 'failed' ? 'mdi-close-circle text-danger' : 'mdi-cancel text-warning'}`}
                  style={{ fontSize: '64px' }}
                />
              </div>
              <h5 className={transaction.status === 'failed' ? 'text-danger' : 'text-warning'}>
                {transaction.status === 'failed' ? 'Pago Fallido' : 'Pago Cancelado'}
              </h5>
              <p className="text-muted mb-3">
                {transaction.status === 'failed'
                  ? 'Hubo un error al procesar el pago.'
                  : 'El pago fue cancelado por el usuario.'}
              </p>
              <Button color="primary" onClick={onNewPayment}>
                <i className="mdi mdi-refresh me-2" />
                Intentar de Nuevo
              </Button>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

interface StepIndicatorProps {
  label: string;
  status: 'pending' | 'current' | 'completed' | 'error';
  icon: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ label, status, icon }) => {
  const getColor = () => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'current':
        return 'text-primary';
      case 'error':
        return 'text-danger';
      default:
        return 'text-muted';
    }
  };

  return (
    <div className={`text-center ${getColor()}`}>
      <i className={`mdi ${icon} d-block mb-1`} style={{ fontSize: '24px' }} />
      <small>{label}</small>
    </div>
  );
};

export default PaymentStatusCard;
