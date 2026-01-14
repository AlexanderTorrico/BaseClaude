import React from 'react';
import { Row, Col, Card, CardBody, Badge, Button, Input } from 'reactstrap';
import { PaymentMethodModel, PaymentMethodType } from '../models/PaymentmethodsModel';

interface ContentCardsProps {
  filteredData: PaymentMethodModel[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number) => void;
}

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

const PaymentMethodCard: React.FC<{
  method: PaymentMethodModel;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number) => void;
}> = ({ method, onEdit, onDelete, onToggleActive }) => {
  const hasCommission = method.commissionPercentage > 0 || method.fixedCommission > 0;

  return (
    <Card className={`border h-100 ${method.isActive ? 'border-success' : 'border-secondary'}`}>
      <CardBody className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded"
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: method.isActive ? '#e8f4fd' : '#f5f5f5'
              }}
            >
              <i
                className={`mdi ${method.icon} font-size-24`}
                style={{ color: method.isActive ? '#556ee6' : '#74788d' }}
              />
            </div>
            <div>
              <h5 className="mb-1">{method.name}</h5>
              <Badge color={getTypeColor(method.type)} className="font-size-11">
                {getTypeLabel(method.type)}
              </Badge>
            </div>
          </div>

          <div className="form-check form-switch form-switch-lg">
            <Input
              type="switch"
              checked={method.isActive}
              onChange={() => onToggleActive(method.id)}
              className="cursor-pointer"
              style={{ width: '3rem', height: '1.5rem' }}
            />
          </div>
        </div>

        <p className="text-muted small mb-3 flex-grow-1">{method.description}</p>

        <div className="border-top pt-3 mb-3">
          <Row className="g-2">
            <Col xs={6}>
              <div className="text-center p-2 bg-light rounded">
                <small className="text-muted d-block">Comisión</small>
                {hasCommission ? (
                  <span className="fw-medium">
                    {method.commissionPercentage > 0 && `${method.commissionPercentage}%`}
                    {method.commissionPercentage > 0 && method.fixedCommission > 0 && ' + '}
                    {method.fixedCommission > 0 && `$${method.fixedCommission.toFixed(2)}`}
                  </span>
                ) : (
                  <span className="text-success fw-medium">Gratis</span>
                )}
              </div>
            </Col>
            <Col xs={6}>
              <div className="text-center p-2 bg-light rounded">
                <small className="text-muted d-block">Límite máx.</small>
                <span className="fw-medium">${method.limits.maxAmount.toLocaleString()}</span>
              </div>
            </Col>
          </Row>
        </div>

        <div className="mb-3">
          <small className="text-muted d-block mb-1">Monedas aceptadas:</small>
          <div className="d-flex flex-wrap gap-1">
            {method.currencies.map(currency => (
              <Badge key={currency} color="light" className="text-dark">
                {currency}
              </Badge>
            ))}
          </div>
        </div>

        {method.schedule.enabled && (
          <div className="mb-3">
            <small className="text-muted d-block mb-1">
              <i className="mdi mdi-clock-outline me-1" />
              Horario: {method.schedule.startTime} - {method.schedule.endTime}
            </small>
          </div>
        )}

        <div className="d-flex gap-2 mt-auto pt-2">
          <Button
            color="primary"
            outline
            size="sm"
            className="flex-grow-1"
            onClick={() => onEdit(method.id)}
          >
            <i className="mdi mdi-cog me-1" />
            Configurar
          </Button>
          <Button
            color="danger"
            outline
            size="sm"
            onClick={() => onDelete(method.id)}
          >
            <i className="mdi mdi-trash-can" />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

const ContentCards: React.FC<ContentCardsProps> = ({
  filteredData,
  onEdit,
  onDelete,
  onToggleActive
}) => {
  if (filteredData.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="mdi mdi-credit-card-off font-size-48 text-muted" />
        <h5 className="mt-3 text-muted">No hay métodos de pago</h5>
        <p className="text-muted">Agrega un nuevo método de pago para comenzar</p>
      </div>
    );
  }

  return (
    <Row>
      {filteredData.map(method => (
        <Col key={method.id} xs={12} sm={6} lg={4} xl={3} className="mb-4">
          <PaymentMethodCard
            method={method}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleActive={onToggleActive}
          />
        </Col>
      ))}
    </Row>
  );
};

export default ContentCards;
