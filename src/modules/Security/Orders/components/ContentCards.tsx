import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Button, Badge, Collapse } from 'reactstrap';
import {
  OrderModel,
  OrderStatus,
  ORDER_STATUS_CONFIG,
  PAYMENT_STATUS_CONFIG,
  PAYMENT_METHOD_CONFIG
} from '../models/OrderModel';
import { useOrders } from '../hooks/useOrders';
import OrderDetailModal from './modals/OrderDetailModal';
import ConfirmStatusChangeModal from './modals/ConfirmStatusChangeModal';

interface ContentCardsProps {
  filteredOrders: OrderModel[];
  loading: boolean;
  onAdvanceStatus: (orderId: number, currentStatus: OrderStatus) => Promise<{ success: boolean; message: string; whatsappUrl?: string }>;
  onCancelOrder: (orderId: number) => Promise<{ success: boolean; message: string; whatsappUrl?: string }>;
  onPrintReceipt: (order: OrderModel) => void;
}

const formatCurrency = (value: number): string => {
  return `$${value.toLocaleString('es-AR')}`;
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

interface PendingAction {
  type: 'advance' | 'cancel';
  order: OrderModel;
  newStatus: OrderStatus;
}

const OrderCard: React.FC<{
  order: OrderModel;
  isUrgent: boolean;
  onRequestStatusChange: (action: PendingAction) => void;
  onPrintReceipt: (order: OrderModel) => void;
  onViewDetails: (order: OrderModel) => void;
}> = ({ order, isUrgent, onRequestStatusChange, onPrintReceipt, onViewDetails }) => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const statusConfig = ORDER_STATUS_CONFIG[order.status];
  const paymentStatusConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus];
  const paymentMethodConfig = PAYMENT_METHOD_CONFIG[order.paymentMethod];

  const canAdvance = statusConfig.nextStatus !== undefined;
  const canCancel = order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.DELIVERED;

  const handleAdvanceStatus = () => {
    if (statusConfig.nextStatus) {
      onRequestStatusChange({
        type: 'advance',
        order,
        newStatus: statusConfig.nextStatus
      });
    }
  };

  const handleCancelOrder = () => {
    onRequestStatusChange({
      type: 'cancel',
      order,
      newStatus: OrderStatus.CANCELLED
    });
  };

  const getNextStatusLabel = (): string => {
    if (!statusConfig.nextStatus) return '';
    return ORDER_STATUS_CONFIG[statusConfig.nextStatus].label;
  };

  return (
    <Card className={`border shadow-sm h-100 ${isUrgent ? 'border-danger border-2' : ''}`}>
      {isUrgent && (
        <div className="bg-danger text-white text-center py-1 font-size-12">
          <i className="mdi mdi-alert me-1"></i>
          URGENTE - Más de 2 horas sin confirmar
        </div>
      )}

      <CardBody>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="mb-1 text-primary fw-bold">{order.orderNumber}</h5>
            <small className="text-muted">{getTimeSince(order.createdAt)}</small>
          </div>
          <Badge color={statusConfig.color} className="px-3 py-2">
            <i className={`mdi ${statusConfig.icon} me-1`}></i>
            {statusConfig.label}
          </Badge>
        </div>

        <hr className="my-2" />

        <div className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <i className="mdi mdi-account text-primary me-2 font-size-18"></i>
            <span className="fw-medium">{order.customer.fullName}</span>
          </div>
          <div className="d-flex align-items-center mb-2">
            <i className="mdi mdi-phone text-primary me-2 font-size-18"></i>
            <span className="text-muted">{order.customer.phone}</span>
          </div>
          {order.customer.address && (
            <div className="d-flex align-items-start mb-2">
              <i className="mdi mdi-map-marker text-primary me-2 font-size-18"></i>
              <small className="text-muted">{order.customer.address}</small>
            </div>
          )}
        </div>

        <div className="mb-3">
          <Button
            color="light"
            size="sm"
            onClick={() => setIsProductsOpen(!isProductsOpen)}
            className="w-100 d-flex justify-content-between align-items-center"
          >
            <span>
              <i className="mdi mdi-package-variant me-2"></i>
              {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
            </span>
            <i className={`mdi ${isProductsOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'}`}></i>
          </Button>

          <Collapse isOpen={isProductsOpen}>
            <div className="border rounded mt-2 p-2 bg-light">
              {order.items.map((item) => (
                <div key={item.id} className="d-flex justify-content-between py-1 border-bottom">
                  <div>
                    <span className="font-size-13">{item.productName}</span>
                    <small className="text-muted ms-2">x{item.quantity}</small>
                  </div>
                  <span className="font-size-13">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
              <div className="d-flex justify-content-between pt-2 fw-bold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </Collapse>
        </div>

        <div className="d-flex gap-2 mb-3 flex-wrap">
          <Badge color={paymentStatusConfig.color} pill>
            <i className={`mdi ${paymentStatusConfig.icon} me-1`}></i>
            {paymentStatusConfig.label}
          </Badge>
          <Badge color="light" className="text-dark">
            <i className={`mdi ${paymentMethodConfig.icon} me-1`}></i>
            {paymentMethodConfig.label}
          </Badge>
        </div>

        <div className="text-center mb-3 py-2 bg-light rounded">
          <span className="text-muted me-2">Total:</span>
          <span className="fw-bold font-size-18">{formatCurrency(order.total)}</span>
        </div>

        {order.notes && (
          <div className="mb-3 p-2 bg-warning bg-opacity-10 rounded">
            <small className="text-warning">
              <i className="mdi mdi-note me-1"></i>
              {order.notes}
            </small>
          </div>
        )}

        <hr className="my-2" />

        <div className="d-flex flex-column gap-2">
          {canAdvance && (
            <Button
              color={ORDER_STATUS_CONFIG[statusConfig.nextStatus!].color}
              onClick={handleAdvanceStatus}
              className="w-100"
            >
              <i className={`mdi ${ORDER_STATUS_CONFIG[statusConfig.nextStatus!].icon} me-1`}></i>
              Marcar como {getNextStatusLabel()}
            </Button>
          )}

          <div className="d-flex gap-2">
            <Button
              color="light"
              size="sm"
              onClick={() => onViewDetails(order)}
              className="flex-grow-1"
              title="Ver detalles"
            >
              <i className="mdi mdi-eye me-1"></i>
              Detalles
            </Button>

            <Button
              color="light"
              size="sm"
              onClick={() => onPrintReceipt(order)}
              className="flex-grow-1"
              title="Imprimir recibo"
            >
              <i className="mdi mdi-printer me-1"></i>
              Imprimir
            </Button>

            {canCancel && (
              <Button
                color="danger"
                size="sm"
                outline
                onClick={handleCancelOrder}
                title="Cancelar pedido"
              >
                <i className="mdi mdi-close-circle"></i>
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const ContentCards: React.FC<ContentCardsProps> = ({
  filteredOrders,
  loading,
  onAdvanceStatus,
  onCancelOrder,
  onPrintReceipt
}) => {
  const { isOrderUrgent } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<OrderModel | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleViewDetails = (order: OrderModel) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleRequestStatusChange = (action: PendingAction) => {
    setPendingAction(action);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!pendingAction) return;

    setIsProcessing(true);

    let result: { success: boolean; message: string; whatsappUrl?: string };

    if (pendingAction.type === 'cancel') {
      result = await onCancelOrder(pendingAction.order.id);
    } else {
      result = await onAdvanceStatus(pendingAction.order.id, pendingAction.order.status);
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

  return (
    <>
      <Row>
        {filteredOrders.map((order) => (
          <Col key={order.id} xs={12} sm={6} lg={4} xl={3} className="mb-4">
            <OrderCard
              order={order}
              isUrgent={isOrderUrgent(order)}
              onRequestStatusChange={handleRequestStatusChange}
              onPrintReceipt={onPrintReceipt}
              onViewDetails={handleViewDetails}
            />
          </Col>
        ))}

        {filteredOrders.length === 0 && !loading && (
          <Col xs={12}>
            <div className="text-center py-5">
              <i className="mdi mdi-package-variant-closed display-4 text-muted"></i>
              <h5 className="mt-3">No se encontraron pedidos</h5>
              <p className="text-muted">
                Intenta ajustar los filtros o busca con otros criterios
              </p>
            </div>
          </Col>
        )}
      </Row>

      {selectedOrder && (
        <OrderDetailModal
          isOpen={isDetailModalOpen}
          toggle={() => setIsDetailModalOpen(false)}
          order={selectedOrder}
          onAdvanceStatus={onAdvanceStatus}
          onCancelOrder={onCancelOrder}
          onPrintReceipt={onPrintReceipt}
        />
      )}

      {pendingAction && (
        <ConfirmStatusChangeModal
          isOpen={isConfirmModalOpen}
          toggle={handleCloseConfirmModal}
          orderNumber={pendingAction.order.orderNumber}
          currentStatus={pendingAction.order.status}
          newStatus={pendingAction.newStatus}
          onConfirm={handleConfirmStatusChange}
          isLoading={isProcessing}
        />
      )}
    </>
  );
};

export default ContentCards;
