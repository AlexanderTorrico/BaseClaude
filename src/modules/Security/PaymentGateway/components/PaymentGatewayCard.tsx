import React from 'react';
import { Card, CardBody, Badge, Button } from 'reactstrap';
import { PaymentGatewayModel } from '../models/PaymentGatewayModel';

interface PaymentGatewayCardProps {
  gateway: PaymentGatewayModel;
  onToggle: (gateway: PaymentGatewayModel) => void;
  onConfigure: (gateway: PaymentGatewayModel) => void;
}

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

export const PaymentGatewayCard: React.FC<PaymentGatewayCardProps> = ({
  gateway,
  onToggle,
  onConfigure,
}) => {
  return (
    <Card className={`payment-gateway-card ${gateway.enabled ? 'border-success' : ''}`}>
      <CardBody>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center">
            <i className={`${gateway.icon} font-size-24 me-3`}></i>
            <div>
              <h5 className="mb-1">{gateway.name}</h5>
              <Badge color={getCategoryColor(gateway.category)} pill>
                {getCategoryLabel(gateway.category)}
              </Badge>
            </div>
          </div>
          <div className="form-check form-switch form-switch-lg">
            <input
              className="form-check-input"
              type="checkbox"
              id={`switch-${gateway.id}`}
              checked={gateway.enabled}
              onChange={() => onToggle(gateway)}
            />
            <label className="form-check-label" htmlFor={`switch-${gateway.id}`}>
              {gateway.enabled ? 'Activa' : 'Inactiva'}
            </label>
          </div>
        </div>

        <p className="text-muted mb-3">{gateway.description}</p>

        <div className="payment-gateway-info mb-3">
          {gateway.fees && (
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">
                <i className="mdi mdi-cash me-1"></i>
                Comisión:
              </span>
              <span className="fw-bold">
                {gateway.fees.percentage ? `${gateway.fees.percentage}%` : ''}
                {gateway.fees.percentage && gateway.fees.fixed ? ' + ' : ''}
                {gateway.fees.fixed ? `${gateway.fees.fixed} ${gateway.fees.currency || ''}` : ''}
                {!gateway.fees.percentage && !gateway.fees.fixed ? 'Gratis' : ''}
              </span>
            </div>
          )}

          {gateway.processingTime && (
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">
                <i className="mdi mdi-clock-outline me-1"></i>
                Tiempo:
              </span>
              <span className={gateway.processingTime.toLowerCase().includes('instant') ? 'text-success' : ''}>
                {gateway.processingTime}
              </span>
            </div>
          )}

          {gateway.countries && gateway.countries.length > 0 && (
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">
                <i className="mdi mdi-earth me-1"></i>
                Países:
              </span>
              <span>
                {gateway.countries.includes('Global') ? (
                  <Badge color="info">Global</Badge>
                ) : (
                  gateway.countries.slice(0, 3).join(', ') +
                  (gateway.countries.length > 3 ? ` +${gateway.countries.length - 3}` : '')
                )}
              </span>
            </div>
          )}

          {gateway.currencies && gateway.currencies.length > 0 && (
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">
                <i className="mdi mdi-currency-usd me-1"></i>
                Monedas:
              </span>
              <span>
                {gateway.currencies.slice(0, 4).join(', ')}
                {gateway.currencies.length > 4 ? ` +${gateway.currencies.length - 4}` : ''}
              </span>
            </div>
          )}

          {gateway.supportedPaymentMethods && gateway.supportedPaymentMethods.length > 0 && (
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">
                <i className="mdi mdi-credit-card-multiple me-1"></i>
                Métodos:
              </span>
              <span className="text-capitalize">
                {gateway.supportedPaymentMethods.slice(0, 3).join(', ')}
                {gateway.supportedPaymentMethods.length > 3 ? '...' : ''}
              </span>
            </div>
          )}
        </div>

        <div className="d-flex gap-2">
          <Button
            color="primary"
            size="sm"
            className="flex-fill"
            onClick={() => onConfigure(gateway)}
            disabled={!gateway.enabled}
          >
            <i className="mdi mdi-cog me-1"></i>
            Configurar
          </Button>
          {gateway.config?.environment && (
            <Badge
              color={gateway.config.environment === 'production' ? 'success' : 'warning'}
              className="align-self-center"
            >
              {gateway.config.environment === 'production' ? 'Producción' : 'Pruebas'}
            </Badge>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
