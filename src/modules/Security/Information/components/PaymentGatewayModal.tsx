import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Badge } from 'reactstrap';
import { PaymentGatewayModel } from '../../PaymentGateway/models/PaymentGatewayModel';
import { useNavigate } from 'react-router-dom';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  toggle: () => void;
  paymentGateway: PaymentGatewayModel | null;
}

const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  toggle,
  paymentGateway
}) => {
  const navigate = useNavigate();

  if (!paymentGateway) return null;

  const handleEditClick = () => {
    toggle();
    navigate('/paymentgateway');
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        <div className="d-flex align-items-center gap-2">
          {paymentGateway.icon && (
            <img
              src={paymentGateway.icon}
              alt={paymentGateway.name}
              style={{ width: '32px', height: '32px', objectFit: 'contain' }}
            />
          )}
          <span>{paymentGateway.name}</span>
          <Badge color={paymentGateway.enabled ? 'success' : 'secondary'}>
            {paymentGateway.enabled ? 'Habilitada' : 'Deshabilitada'}
          </Badge>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="mb-3">
          <h6 className="text-muted mb-2">Descripción</h6>
          <p>{paymentGateway.description}</p>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <h6 className="text-muted mb-2">Categoría</h6>
            <Badge color="primary" className="text-capitalize">
              {paymentGateway.category}
            </Badge>
          </div>
          <div className="col-md-6">
            <h6 className="text-muted mb-2">Código</h6>
            <code>{paymentGateway.code}</code>
          </div>
        </div>

        {paymentGateway.fees && (
          <div className="mb-3">
            <h6 className="text-muted mb-2">Comisiones</h6>
            <div className="d-flex gap-3">
              {paymentGateway.fees.percentage && (
                <div>
                  <i className="mdi mdi-percent me-1"></i>
                  <span>{paymentGateway.fees.percentage}%</span>
                </div>
              )}
              {paymentGateway.fees.fixed && (
                <div>
                  <i className="mdi mdi-cash me-1"></i>
                  <span>
                    {paymentGateway.fees.currency || '$'} {paymentGateway.fees.fixed}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {paymentGateway.processingTime && (
          <div className="mb-3">
            <h6 className="text-muted mb-2">Tiempo de Procesamiento</h6>
            <p>
              <i className="mdi mdi-clock-outline me-1"></i>
              {paymentGateway.processingTime}
            </p>
          </div>
        )}

        {paymentGateway.countries && paymentGateway.countries.length > 0 && (
          <div className="mb-3">
            <h6 className="text-muted mb-2">Países Disponibles</h6>
            <div className="d-flex flex-wrap gap-2">
              {paymentGateway.countries.map((country) => (
                <Badge key={country} color="secondary">
                  {country}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {paymentGateway.currencies && paymentGateway.currencies.length > 0 && (
          <div className="mb-3">
            <h6 className="text-muted mb-2">Monedas Soportadas</h6>
            <div className="d-flex flex-wrap gap-2">
              {paymentGateway.currencies.map((currency) => (
                <Badge key={currency} color="info">
                  {currency}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {paymentGateway.supportedPaymentMethods && paymentGateway.supportedPaymentMethods.length > 0 && (
          <div className="mb-3">
            <h6 className="text-muted mb-2">Métodos de Pago Soportados</h6>
            <div className="d-flex flex-wrap gap-2">
              {paymentGateway.supportedPaymentMethods.map((method) => (
                <Badge key={method} color="light" className="text-capitalize">
                  {method}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {paymentGateway.config?.environment && (
          <div className="mb-3">
            <h6 className="text-muted mb-2">Entorno</h6>
            <Badge color={paymentGateway.config.environment === 'production' ? 'success' : 'warning'}>
              {paymentGateway.config.environment === 'production' ? 'Producción' : 'Sandbox'}
            </Badge>
          </div>
        )}

        {(paymentGateway.minAmount || paymentGateway.maxAmount) && (
          <div className="mb-3">
            <h6 className="text-muted mb-2">Límites de Transacción</h6>
            <div className="d-flex gap-3">
              {paymentGateway.minAmount && (
                <div>
                  <small className="text-muted">Mínimo:</small>{' '}
                  <span>{paymentGateway.fees?.currency || '$'} {paymentGateway.minAmount}</span>
                </div>
              )}
              {paymentGateway.maxAmount && (
                <div>
                  <small className="text-muted">Máximo:</small>{' '}
                  <span>{paymentGateway.fees?.currency || '$'} {paymentGateway.maxAmount}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cerrar
        </Button>
        <Button color="primary" onClick={handleEditClick}>
          <i className="mdi mdi-pencil me-1"></i>
          Editar Configuración
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PaymentGatewayModal;
