import React, { useState } from 'react';
import { Card, CardBody, CardFooter, FormGroup, Label, Input, Button } from 'reactstrap';
import { PageModel, PagePalette } from '../models/PageModel';
import { PaymentGatewayModel } from '../../PaymentGateway/models/PaymentGatewayModel';
import PaymentGatewayModal from './PaymentGatewayModal';

interface PageCardProps {
  page: PageModel;
  onPageClick?: (page: PageModel) => void;
  paymentGateways?: PaymentGatewayModel[];
  onEcommerceChange?: (pageId: number, enabled: boolean, gatewayId?: number | null) => void;
}

const PageCard: React.FC<PageCardProps> = ({ page, onPageClick, paymentGateways = [], onEcommerceChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayModel | null>(null);

  const getPalette = (): PagePalette | null => {
    try {
      if (typeof page.palette === 'string') {
        return JSON.parse(page.palette);
      }
      return page.palette as PagePalette;
    } catch (error) {
      console.error('Error parsing palette:', error);
      return null;
    }
  };

  const palette = getPalette();
  const imageUrl = page.image.startsWith('http') ? page.image : `${window.location.origin}${page.image}`;

  const handleClick = () => {
    if (onPageClick) {
      onPageClick(page);
    }
  };

  const handleEcommerceToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const enabled = e.target.checked;
    if (onEcommerceChange) {
      onEcommerceChange(page.id, enabled, enabled ? page.payment_gateway_id : null);
    }
  };

  const handleGatewayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const gatewayId = e.target.value ? parseInt(e.target.value) : null;
    if (onEcommerceChange) {
      onEcommerceChange(page.id, true, gatewayId);
    }
  };

  const handleViewGatewayDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    const gateway = paymentGateways.find(g => g.id === page.payment_gateway_id);
    if (gateway) {
      setSelectedGateway(gateway);
      setIsModalOpen(true);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const currentGateway = paymentGateways.find(g => g.id === page.payment_gateway_id);

  return (
    <Card
      className="page-card shadow-sm mb-3"
      style={{
        cursor: onPageClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        if (onPageClick) {
          e.currentTarget.style.transform = 'translateX(4px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (onPageClick) {
          e.currentTarget.style.transform = 'translateX(0)';
          e.currentTarget.style.boxShadow = '';
        }
      }}
    >
      <div className="d-flex flex-column flex-md-row">
        {/* Preview Section */}
        <div
          className="page-preview"
          style={{
            width: '100%',
            maxWidth: '300px',
            minWidth: '300px',
            height: '180px',
            backgroundColor: palette?.bg || '#f8f9fa',
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            flexShrink: 0
          }}
        >
          {/* Score Badge */}
          {page.score > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: palette?.ac || '#ffbc1f',
                color: palette?.tx || '#FFFFFF',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              Score: {page.score}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="d-flex flex-column flex-grow-1">
          <CardBody className="d-flex flex-column justify-content-between flex-grow-1">
            <div>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="mb-0" style={{ fontWeight: 600 }}>
                  {page.name}
                </h5>
                <span className="badge bg-secondary">{page.view_key}</span>
              </div>

              <div className="d-flex flex-wrap gap-3 mb-3">
                {/* Color Palette Preview */}
                {palette && (
                  <div className="d-flex gap-1 align-items-center">
                    <span style={{ fontSize: '13px', color: '#6c757d', marginRight: '4px' }}>
                      Paleta:
                    </span>
                    {Object.entries(palette).map(([key, color]) => (
                      <div
                        key={key}
                        style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: color,
                          borderRadius: '4px',
                          border: '1px solid #dee2e6'
                        }}
                        title={`${key}: ${color}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="d-flex flex-wrap gap-3" style={{ fontSize: '13px', color: '#6c757d' }}>
                <div>
                  <i className="mdi mdi-format-font me-1"></i>
                  <span>Fuente: {page.font.replace('font', '')}</span>
                </div>
                <div>
                  <i className="mdi mdi-calendar me-1"></i>
                  <span>Creada: {new Date(page.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <i className="mdi mdi-update me-1"></i>
                  <span>Actualizada: {new Date(page.updated_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Sección de Ecommerce */}
              <div className="mt-3 pt-3 border-top">
                <FormGroup check className="mb-3">
                  <Input
                    type="checkbox"
                    id={`ecommerce-${page.id}`}
                    checked={page.ecommerce_enabled || false}
                    onChange={handleEcommerceToggle}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Label check for={`ecommerce-${page.id}`} className="fw-semibold">
                    <i className="mdi mdi-cart me-1"></i>
                    Habilitar Ecommerce
                  </Label>
                </FormGroup>

                {page.ecommerce_enabled && (
                  <div className="ms-4">
                    <FormGroup>
                      <Label for={`gateway-${page.id}`} style={{ fontSize: '13px', fontWeight: 500 }}>
                        Pasarela de Pago
                      </Label>
                      <div className="d-flex gap-2">
                        <Input
                          type="select"
                          id={`gateway-${page.id}`}
                          value={page.payment_gateway_id || ''}
                          onChange={handleGatewayChange}
                          onClick={(e) => e.stopPropagation()}
                          style={{ fontSize: '13px' }}
                        >
                          <option value="">Seleccionar pasarela...</option>
                          {paymentGateways.map((gateway) => (
                            <option key={gateway.id} value={gateway.id}>
                              {gateway.name} ({gateway.code})
                            </option>
                          ))}
                        </Input>
                        {page.payment_gateway_id && currentGateway && (
                          <Button
                            color="info"
                            size="sm"
                            onClick={handleViewGatewayDetails}
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            <i className="mdi mdi-eye"></i> Ver
                          </Button>
                        )}
                      </div>
                    </FormGroup>

                    {currentGateway && (
                      <div className="mt-2 p-2 bg-light rounded" style={{ fontSize: '12px' }}>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          {currentGateway.icon && (
                            <img
                              src={currentGateway.icon}
                              alt={currentGateway.name}
                              style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                            />
                          )}
                          <span className="fw-semibold">{currentGateway.name}</span>
                          <span className={`badge ${currentGateway.enabled ? 'bg-success' : 'bg-secondary'}`}>
                            {currentGateway.enabled ? 'Activa' : 'Inactiva'}
                          </span>
                        </div>
                        {currentGateway.fees && (
                          <div className="text-muted">
                            Comisión: {currentGateway.fees.percentage}%
                            {currentGateway.fees.fixed && ` + ${currentGateway.fees.currency || '$'}${currentGateway.fees.fixed}`}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </div>
      </div>

      <PaymentGatewayModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        paymentGateway={selectedGateway}
      />
    </Card>
  );
};

export default PageCard;
