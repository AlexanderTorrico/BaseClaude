import React, { useState } from 'react';
import { Row, Col, Button, Collapse, Badge } from 'reactstrap';
import AzTable from '../../../../components/aziende/AzTable';
import { orderTableColumns } from '../config/tableColumns';
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

interface ContentTableProps {
  filteredOrders: OrderModel[];
  filters?: Record<string, string>;
  sorting?: { field: string; direction: string };
  onFilterChange?: (column: string, value: string) => void;
  onSortChange?: (config: { field: string; direction: string }) => void;
  loading: boolean;
  onAdvanceStatus: (orderId: number, currentStatus: OrderStatus) => Promise<{ success: boolean; message: string; whatsappUrl?: string }>;
  onCancelOrder: (orderId: number) => Promise<{ success: boolean; message: string; whatsappUrl?: string }>;
  onPrintReceipt: (order: OrderModel) => void;
}

const formatCurrency = (value: number): string => {
  return `$${value.toLocaleString('es-AR')}`;
};

interface PendingAction {
  type: 'advance' | 'cancel';
  order: OrderModel;
  newStatus: OrderStatus;
}

const ExpandedRowContent: React.FC<{ order: OrderModel }> = ({ order }) => {
  const paymentStatusConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus];
  const paymentMethodConfig = PAYMENT_METHOD_CONFIG[order.paymentMethod];

  return (
    <div className="p-3 bg-light border-top">
      <Row>
        <Col md={6}>
          <h6 className="fw-bold mb-3">
            <i className="mdi mdi-package-variant me-2"></i>
            Productos del Pedido
          </h6>
          <div className="table-responsive">
            <table className="table table-sm table-bordered mb-0">
              <thead className="table-light">
                <tr>
                  <th>Producto</th>
                  <th className="text-center" style={{ width: '80px' }}>Cant.</th>
                  <th className="text-end" style={{ width: '100px' }}>P. Unit.</th>
                  <th className="text-end" style={{ width: '100px' }}>Subtotal</th>
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
              <tfoot className="table-light">
                <tr>
                  <td colSpan={3} className="text-end fw-bold">Subtotal:</td>
                  <td className="text-end">{formatCurrency(order.subtotal)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="text-end fw-bold">Total:</td>
                  <td className="text-end fw-bold">{formatCurrency(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Col>

        <Col md={6}>
          <h6 className="fw-bold mb-3">
            <i className="mdi mdi-account me-2"></i>
            Información del Cliente
          </h6>
          <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <i className="mdi mdi-account-circle text-muted me-2"></i>
              <span>{order.customer.fullName}</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <i className="mdi mdi-phone text-muted me-2"></i>
              <span>{order.customer.phone}</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <i className="mdi mdi-email text-muted me-2"></i>
              <span>{order.customer.email}</span>
            </div>
            {order.customer.address && (
              <div className="d-flex align-items-start mb-2">
                <i className="mdi mdi-map-marker text-muted me-2"></i>
                <span>{order.customer.address}</span>
              </div>
            )}
          </div>

          <h6 className="fw-bold mb-3 mt-4">
            <i className="mdi mdi-credit-card me-2"></i>
            Información de Pago
          </h6>
          <div className="d-flex gap-2 flex-wrap">
            <Badge color={paymentStatusConfig.color} className="px-3 py-2">
              <i className={`mdi ${paymentStatusConfig.icon} me-1`}></i>
              {paymentStatusConfig.label}
            </Badge>
            <Badge color="light" className="text-dark px-3 py-2">
              <i className={`mdi ${paymentMethodConfig.icon} me-1`}></i>
              {paymentMethodConfig.label}
            </Badge>
          </div>

          {order.notes && (
            <div className="mt-3 p-2 bg-warning bg-opacity-10 rounded">
              <small className="text-warning">
                <i className="mdi mdi-note me-1"></i>
                <strong>Nota:</strong> {order.notes}
              </small>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

const ContentTable: React.FC<ContentTableProps> = ({
  filteredOrders,
  filters,
  sorting,
  onFilterChange,
  onSortChange,
  loading,
  onAdvanceStatus,
  onCancelOrder,
  onPrintReceipt
}) => {
  const { isOrderUrgent, findOrderById } = useOrders();
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [selectedOrder, setSelectedOrder] = useState<OrderModel | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleRowExpansion = (orderId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedRows(newExpanded);
  };

  const handleRequestAdvanceStatus = (order: OrderModel) => {
    const statusConfig = ORDER_STATUS_CONFIG[order.status];
    if (statusConfig.nextStatus) {
      setPendingAction({
        type: 'advance',
        order,
        newStatus: statusConfig.nextStatus
      });
      setIsConfirmModalOpen(true);
    }
  };

  const handleRequestCancelOrder = (order: OrderModel) => {
    setPendingAction({
      type: 'cancel',
      order,
      newStatus: OrderStatus.CANCELLED
    });
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

  const handleViewDetails = (order: OrderModel) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const getRowClassName = (order: OrderModel) => {
    if (isOrderUrgent(order)) {
      return 'table-danger';
    }
    return '';
  };

  return (
    <>
      <Row>
        <Col xl={12}>
          <AzTable
            data={filteredOrders}
            columns={orderTableColumns}
            pagination={true}
            filters={filters}
            onFilterChange={onFilterChange}
            sorting={sorting}
            onSortChange={onSortChange}
            className="table-centered"
            loading={loading}
            rowClassName={(row: OrderModel) => getRowClassName(row)}
            expandedContent={(row: OrderModel) => (
              <Collapse isOpen={expandedRows.has(row.id)}>
                <ExpandedRowContent order={row} />
              </Collapse>
            )}
          >
            <AzTable.Actions>
              <Button
                size="sm"
                color="light"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as OrderModel;
                  toggleRowExpansion(rowData.id);
                }}
                title="Ver productos"
              >
                <i className={`mdi ${expandedRows.has(0) ? 'mdi-chevron-up' : 'mdi-chevron-down'}`}></i>
              </Button>

              <Button
                size="sm"
                color="success"
                outline
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as OrderModel;
                  const order = findOrderById(rowData.id);
                  if (order) {
                    handleRequestAdvanceStatus(order);
                  }
                }}
                title="Avanzar estado"
                disabled={isProcessing}
              >
                <i className="mdi mdi-arrow-right-bold"></i>
              </Button>

              <Button
                size="sm"
                color="info"
                outline
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as OrderModel;
                  const order = findOrderById(rowData.id);
                  if (order) {
                    handleViewDetails(order);
                  }
                }}
                title="Ver detalles"
              >
                <i className="mdi mdi-eye"></i>
              </Button>

              <Button
                size="sm"
                color="secondary"
                outline
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as OrderModel;
                  const order = findOrderById(rowData.id);
                  if (order) {
                    onPrintReceipt(order);
                  }
                }}
                title="Imprimir recibo"
              >
                <i className="mdi mdi-printer"></i>
              </Button>

              <Button
                size="sm"
                color="danger"
                outline
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as OrderModel;
                  const order = findOrderById(rowData.id);
                  if (order && order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.DELIVERED) {
                    handleRequestCancelOrder(order);
                  }
                }}
                title="Cancelar pedido"
                disabled={isProcessing}
              >
                <i className="mdi mdi-close-circle"></i>
              </Button>
            </AzTable.Actions>
          </AzTable>
        </Col>
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

export default ContentTable;
