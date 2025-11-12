import React from 'react';
import { Card, CardBody, CardHeader, Row, Col, Badge, Button } from 'reactstrap';
import { CompanyModel } from '../models/CompanyModel';

interface CompanyInfoCardProps {
  company: CompanyModel;
  onEdit: () => void;
}

const CompanyInfoCard: React.FC<CompanyInfoCardProps> = ({ company, onEdit }) => {
  const InfoItem: React.FC<{ icon: string; label: string; value: string | React.ReactNode }> = ({
    icon,
    label,
    value,
  }) => (
    <div className="mb-3">
      <div className="d-flex align-items-start">
        <div className="flex-shrink-0">
          <i className={`${icon} font-size-18 text-primary me-2`}></i>
        </div>
        <div className="flex-grow-1">
          <p className="text-muted mb-1 small">{label}</p>
          <div className="fw-medium">{value || '—'}</div>
        </div>
      </div>
    </div>
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPhone = (phone: string[]) => {
    return phone.join(' - ');
  };

  return (
    <Card>
      <CardHeader className="bg-transparent d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0">
            <i className="mdi mdi-office-building me-2 text-warning"></i>
            Información de la Compañía
          </h5>
        </div>
        <Button color="warning" size="sm" onClick={onEdit}>
          <i className="mdi mdi-pencil me-1"></i>
          Editar
        </Button>
      </CardHeader>
      <CardBody>
        <Row>
          <Col xs={12} className="text-center mb-4">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="rounded"
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'contain',
                  border: '2px solid #e9ecef',
                  padding: '8px',
                }}
              />
            ) : (
              <div
                className="rounded bg-soft-warning d-inline-flex align-items-center justify-content-center"
                style={{ width: '120px', height: '120px' }}
              >
                <i className="mdi mdi-office-building font-size-48 text-warning"></i>
              </div>
            )}
            <div className="mt-3">
              <h4 className="mb-1">{company.name}</h4>
              <Badge color={company.active ? 'success' : 'danger'} pill>
                {company.active ? 'Activa' : 'Inactiva'}
              </Badge>
            </div>
          </Col>
        </Row>

        <hr />

        <Row>
          <Col md={6}>
            <InfoItem
              icon="mdi mdi-calendar"
              label="Fecha de Apertura"
              value={formatDate(company.openingDateCompany)}
            />
          </Col>
          <Col md={6}>
            <InfoItem icon="mdi mdi-email" label="Email" value={company.email} />
          </Col>
          <Col md={6}>
            <InfoItem icon="mdi mdi-phone" label="Teléfono" value={formatPhone(company.phone)} />
          </Col>
          <Col md={6}>
            <InfoItem icon="mdi mdi-account-group" label="Tamaño de Empresa" value={company.companySize} />
          </Col>
          <Col md={6}>
            <InfoItem icon="mdi mdi-web" label="Zona Horaria" value={company.timeZone} />
          </Col>
          <Col md={6}>
            <InfoItem
              icon="mdi mdi-translate"
              label="Lenguaje"
              value={company.language === 'es' ? 'Español' : company.language === 'en' ? 'English' : company.language}
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default CompanyInfoCard;
