import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Badge
} from 'reactstrap';
import { OrderStatus, ORDER_STATUS_CONFIG } from '../../models/OrderModel';

interface ConfirmStatusChangeModalProps {
  isOpen: boolean;
  toggle: () => void;
  orderNumber: string;
  currentStatus: OrderStatus;
  newStatus: OrderStatus;
  onConfirm: () => void;
  isLoading: boolean;
}

const ConfirmStatusChangeModal: React.FC<ConfirmStatusChangeModalProps> = ({
  isOpen,
  toggle,
  orderNumber,
  currentStatus,
  newStatus,
  onConfirm,
  isLoading
}) => {
  const currentConfig = ORDER_STATUS_CONFIG[currentStatus];
  const newConfig = ORDER_STATUS_CONFIG[newStatus];
  const isCancelling = newStatus === OrderStatus.CANCELLED;

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle} className={isCancelling ? 'bg-danger text-white' : ''}>
        <i className={`mdi ${isCancelling ? 'mdi-alert' : 'mdi-alert-circle-outline'} me-2`}></i>
        {isCancelling ? 'Cancelar Pedido' : 'Confirmar Cambio de Estado'}
      </ModalHeader>

      <ModalBody className="text-center py-4">
        <div className="mb-4">
          <i className={`mdi mdi-alert-circle-outline display-4 ${isCancelling ? 'text-danger' : 'text-warning'}`}></i>
        </div>

        <h5 className="mb-3">
          {isCancelling
            ? `¿Estás seguro de CANCELAR el pedido ${orderNumber}?`
            : `¿Cambiar estado del pedido ${orderNumber}?`
          }
        </h5>

        {/* Visualización del cambio de estado */}
        <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
          <Badge color={currentConfig.color} className="px-3 py-2">
            <i className={`mdi ${currentConfig.icon} me-1`}></i>
            {currentConfig.label}
          </Badge>
          <i className="mdi mdi-arrow-right font-size-20 text-muted"></i>
          <Badge color={newConfig.color} className="px-3 py-2">
            <i className={`mdi ${newConfig.icon} me-1`}></i>
            {newConfig.label}
          </Badge>
        </div>

        <div className={`alert ${isCancelling ? 'alert-danger' : 'alert-warning'} mb-0`}>
          <i className="mdi mdi-information-outline me-2"></i>
          <strong>Esta acción NO se puede deshacer.</strong>
          <br />
          <small>
            {isCancelling
              ? 'El pedido quedará marcado como cancelado permanentemente y se notificará al cliente.'
              : 'Una vez cambiado el estado, no podrás volver al estado anterior. Se enviará una notificación al cliente por WhatsApp.'
            }
          </small>
        </div>
      </ModalBody>

      <ModalFooter className="d-flex justify-content-between">
        <Button color="light" onClick={toggle} disabled={isLoading}>
          <i className="mdi mdi-close me-1"></i>
          Cancelar
        </Button>
        <Button
          color={isCancelling ? 'danger' : newConfig.color}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <i className="mdi mdi-loading mdi-spin me-1"></i>
              Procesando...
            </>
          ) : (
            <>
              <i className={`mdi ${isCancelling ? 'mdi-close-circle' : 'mdi-check'} me-1`}></i>
              {isCancelling ? 'Sí, Cancelar Pedido' : `Sí, Marcar como ${newConfig.label}`}
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmStatusChangeModal;
