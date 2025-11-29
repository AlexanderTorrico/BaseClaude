import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Badge,
  Row,
  Col
} from 'reactstrap';
import {
  OrderModel,
  OrderStatus,
  ORDER_STATUS_CONFIG,
  PAYMENT_STATUS_CONFIG,
  PAYMENT_METHOD_CONFIG
} from '../../models/OrderModel';
import ConfirmStatusChangeModal from './ConfirmStatusChangeModal';

interface OrderDetailModalProps {
  isOpen: boolean;
  toggle: () => void;
  order: OrderModel;
  onAdvanceStatus: (orderId: number, currentStatus: OrderStatus) => Promise<{ success: boolean; message: string; whatsappUrl?: string }>;
  onCancelOrder: (orderId: number) => Promise<{ success: boolean; message: string; whatsappUrl?: string }>;
  onPrintReceipt: (order: OrderModel) => void;
}

const formatCurrency = (value: number): string => {
  return `$${value.toLocaleString('es-AR')}`;
};

const formatDate = (date: Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const StatusTimeline: React.FC<{ currentStatus: OrderStatus }> = ({ currentStatus }) => {
  const statuses = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED
  ];

  const currentIndex = statuses.indexOf(currentStatus);
  const isCancelled = currentStatus === OrderStatus.CANCELLED;

  return (
    <div className="d-flex justify-content-between align-items-center mb-4 position-relative">
      {/* Línea de conexión */}
      <div
        className="position-absolute bg-secondary"
        style={{
          height: '2px',
          left: '10%',
          right: '10%',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 0
        }}
      />

      {statuses.map((status, index) => {
        const config = ORDER_STATUS_CONFIG[status];
        const isCompleted = !isCancelled && index <= currentIndex;
        const isCurrent = !isCancelled && index === currentIndex;

        return (
          <div
            key={status}
            className="d-flex flex-column align-items-center position-relative"
            style={{ zIndex: 1 }}
          >
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center ${
                isCancelled
                  ? 'bg-light text-muted'
                  : isCompleted
                  ? `bg-${config.color} text-white`
                  : 'bg-light text-muted'
              } ${isCurrent ? 'border border-2 border-primary' : ''}`}
              style={{ width: '40px', height: '40px' }}
            >
              <i className={`mdi ${config.icon}`}></i>
            </div>
            <small className={`mt-1 text-center ${isCurrent ? 'fw-bold' : 'text-muted'}`}>
              {config.label}
            </small>
          </div>
        );
      })}

      {isCancelled && (
        <div
          className="position-absolute d-flex flex-column align-items-center"
          style={{ right: '-20px', top: '-10px', zIndex: 2 }}
        >
          <Badge color="danger" className="px-2 py-1">
            <i className="mdi mdi-close-circle me-1"></i>
            CANCELADO
          </Badge>
        </div>
      )}
    </div>
  );
};

interface PendingAction {
  type: 'advance' | 'cancel';
  newStatus: OrderStatus;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  toggle,
  order,
  onAdvanceStatus,
  onCancelOrder,
  onPrintReceipt
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const statusConfig = ORDER_STATUS_CONFIG[order.status];
  const paymentStatusConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus];
  const paymentMethodConfig = PAYMENT_METHOD_CONFIG[order.paymentMethod];

  const canAdvance = statusConfig.nextStatus !== undefined;
  const canCancel = order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.DELIVERED;

  const handleRequestAdvanceStatus = () => {
    if (statusConfig.nextStatus) {
      setPendingAction({
        type: 'advance',
        newStatus: statusConfig.nextStatus
      });
      setIsConfirmModalOpen(true);
    }
  };

  const handleRequestCancelOrder = () => {
    setPendingAction({
      type: 'cancel',
      newStatus: OrderStatus.CANCELLED
    });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!pendingAction) return;

    setIsProcessing(true);

    let result: { success: boolean; message: string; whatsappUrl?: string };

    if (pendingAction.type === 'cancel') {
      result = await onCancelOrder(order.id);
    } else {
      result = await onAdvanceStatus(order.id, order.status);
    }

    setIsProcessing(false);
    setIsConfirmModalOpen(false);
    setPendingAction(null);

    if (result.success && result.whatsappUrl) {
      window.open(result.whatsappUrl, '_blank');
    }
  };

  const handleCloseConfirmModal = () => {
    if (!isProcessing) {
      setIsConfirmModalOpen(false);
      setPendingAction(null);
    }
  };

  const getNextStatusLabel = (): string => {
    if (!statusConfig.nextStatus) return '';
    return ORDER_STATUS_CONFIG[statusConfig.nextStatus].label;
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <div className="d-flex align-items-center gap-3">
          <span className="fw-bold text-primary">{order.orderNumber}</span>
          <Badge color={statusConfig.color} className="px-3 py-2">
            <i className={`mdi ${statusConfig.icon} me-1`}></i>
            {statusConfig.label}
          </Badge>
        </div>
      </ModalHeader>

      <ModalBody>
        {/* Timeline de Estados */}
        <StatusTimeline currentStatus={order.status} />

        <Row>
          {/* Información del Cliente */}
          <Col md={6} className="mb-4">
            <h6 className="fw-bold text-primary mb-3">
              <i className="mdi mdi-account me-2"></i>
              Información del Cliente
            </h6>
            <div className="bg-light rounded p-3">
              <div className="mb-2">
                <small className="text-muted">Nombre</small>
                <div className="fw-medium">{order.customer.fullName}</div>
              </div>
              <div className="mb-2">
                <small className="text-muted">Teléfono</small>
                <div className="fw-medium">
                  <a href={`tel:${order.customer.phone}`} className="text-decoration-none">
                    {order.customer.phone}
                  </a>
                </div>
              </div>
              <div className="mb-2">
                <small className="text-muted">Email</small>
                <div className="fw-medium">
                  <a href={`mailto:${order.customer.email}`} className="text-decoration-none">
                    {order.customer.email}
                  </a>
                </div>
              </div>
              {order.customer.address && (
                <div>
                  <small className="text-muted">Dirección de Entrega</small>
                  <div className="fw-medium">{order.customer.address}</div>
                </div>
              )}
            </div>
          </Col>

          {/* Información del Pedido */}
          <Col md={6} className="mb-4">
            <h6 className="fw-bold text-primary mb-3">
              <i className="mdi mdi-information me-2"></i>
              Información del Pedido
            </h6>
            <div className="bg-light rounded p-3">
              <div className="mb-2">
                <small className="text-muted">Fecha del Pedido</small>
                <div className="fw-medium">{formatDate(order.createdAt)}</div>
              </div>
              <div className="mb-2">
                <small className="text-muted">Estado del Pago</small>
                <div>
                  <Badge color={paymentStatusConfig.color}>
                    <i className={`mdi ${paymentStatusConfig.icon} me-1`}></i>
                    {paymentStatusConfig.label}
                  </Badge>
                </div>
              </div>
              <div>
                <small className="text-muted">Método de Pago</small>
                <div>
                  <Badge color="light" className="text-dark">
                    <i className={`mdi ${paymentMethodConfig.icon} me-1`}></i>
                    {paymentMethodConfig.label}
                  </Badge>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Productos */}
        <h6 className="fw-bold text-primary mb-3">
          <i className="mdi mdi-package-variant me-2"></i>
          Productos del Pedido
        </h6>
        <div className="table-responsive mb-4">
          <table className="table table-bordered mb-0">
            <thead className="table-light">
              <tr>
                <th>Producto</th>
                <th className="text-center" style={{ width: '100px' }}>Cantidad</th>
                <th className="text-end" style={{ width: '120px' }}>P. Unitario</th>
                <th className="text-end" style={{ width: '120px' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.productName}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-end">{formatCurrency(item.unitPrice)}</td>
                  <td className="text-end">{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="table-light">
                <td colSpan={3} className="text-end fw-bold">Subtotal:</td>
                <td className="text-end">{formatCurrency(order.subtotal)}</td>
              </tr>
              <tr className="table-primary">
                <td colSpan={3} className="text-end fw-bold">TOTAL:</td>
                <td className="text-end fw-bold font-size-16">{formatCurrency(order.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Notas */}
        {order.notes && (
          <div className="p-3 bg-warning bg-opacity-10 rounded">
            <h6 className="fw-bold text-warning mb-2">
              <i className="mdi mdi-note me-2"></i>
              Notas del Pedido
            </h6>
            <p className="mb-0">{order.notes}</p>
          </div>
        )}
      </ModalBody>

      <ModalFooter className="d-flex justify-content-between">
        <div className="d-flex gap-2">
          <Button
            color="secondary"
            outline
            onClick={() => onPrintReceipt(order)}
          >
            <i className="mdi mdi-printer me-1"></i>
            Imprimir Recibo
          </Button>

          {canCancel && (
            <Button
              color="danger"
              outline
              onClick={handleRequestCancelOrder}
              disabled={isProcessing}
            >
              <i className="mdi mdi-close-circle me-1"></i>
              Cancelar Pedido
            </Button>
          )}
        </div>

        <div className="d-flex gap-2">
          <Button color="light" onClick={toggle}>
            Cerrar
          </Button>

          {canAdvance && (
            <Button
              color={ORDER_STATUS_CONFIG[statusConfig.nextStatus!].color}
              onClick={handleRequestAdvanceStatus}
              disabled={isProcessing}
            >
              <i className={`mdi ${ORDER_STATUS_CONFIG[statusConfig.nextStatus!].icon} me-1`}></i>
              Marcar como {getNextStatusLabel()}
            </Button>
          )}
        </div>
      </ModalFooter>

      {pendingAction && (
        <ConfirmStatusChangeModal
          isOpen={isConfirmModalOpen}
          toggle={handleCloseConfirmModal}
          orderNumber={order.orderNumber}
          currentStatus={order.status}
          newStatus={pendingAction.newStatus}
          onConfirm={handleConfirmStatusChange}
          isLoading={isProcessing}
        />
      )}
    </Modal>
  );
};

export default OrderDetailModal;
