import React, { useState } from 'react';
import { Card, CardBody, Row, Col, Badge, Button, Modal, ModalHeader, ModalBody, Spinner } from 'reactstrap';
import { MyTemplatePagesModel, TemplateStatus } from '../models/MyTemplatePagesModel';
import { TemplateVerificationsResponse } from '../models/TemplateVerificationModel';

interface TemplateCardProps {
  template: MyTemplatePagesModel;
  onPublish?: (templateId: number) => void;
  onEdit?: (templateId: number) => void;
  onLoadVerifications?: (templateId: number) => Promise<TemplateVerificationsResponse | null>;
}

const getStatusConfig = (status: TemplateStatus) => {
  const config: Record<TemplateStatus, { color: string; label: string; icon: string }> = {
    DRAFT: { color: 'secondary', label: 'Privado/Borrador', icon: 'mdi-file-edit-outline' },
    PENDING: { color: 'warning', label: 'Pendiente', icon: 'mdi-clock-outline' },
    APPROVED: { color: 'success', label: 'Aprobado', icon: 'mdi-check-circle' },
    REJECTED: { color: 'danger', label: 'Rechazado', icon: 'mdi-close-circle' },
  };
  return config[status] || config.DRAFT;
};

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onPublish, onEdit, onLoadVerifications }) => {
  const imageUrl = `https://backend.aziende.us${template.image}`;
  const statusConfig = getStatusConfig(template.status);
  const canPublish = template.status === 'DRAFT';

  const [showVerificationsModal, setShowVerificationsModal] = useState(false);
  const [verifications, setVerifications] = useState<TemplateVerificationsResponse | null>(null);
  const [loadingVerifications, setLoadingVerifications] = useState(false);

  const handleOpenVerifications = async () => {
    setShowVerificationsModal(true);
    if (!verifications && onLoadVerifications) {
      setLoadingVerifications(true);
      const data = await onLoadVerifications(template.id);
      setVerifications(data);
      setLoadingVerifications(false);
    }
  };

  return (
    <>
      <Card className="border shadow-sm mb-3">
        <CardBody className="p-3">
          <Row>
            {/* Columna izquierda: Preview de imagen */}
            <Col xs={12} md={4} lg={3} className="mb-3 mb-md-0">
              <div
                className="border rounded position-relative"
                style={{
                  width: '100%',
                  paddingTop: '75%',
                  overflow: 'hidden',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <img
                  src={imageUrl}
                  alt={`Preview de ${template.name}`}
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"%3E%3Crect fill="%23f8f9fa" width="200" height="150"/%3E%3Ctext fill="%236c757d" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ESin preview%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </Col>

            {/* Columna derecha: Informacion */}
            <Col xs={12} md={8} lg={9}>
              <div className="d-flex flex-column h-100">
                {/* Titulo y descripcion */}
                <div className="mb-3">
                  <h5 className="mb-1 fw-bold">{template.name}</h5>
                  <p className="text-muted mb-0 font-size-13">{template.description}</p>
                </div>

                {/* Metricas */}
                <Row className="mb-3">
                  <Col xs={6} sm={3}>
                    <div className="d-flex align-items-center">
                      <i className="mdi mdi-file-document-multiple text-info me-2 font-size-20"></i>
                      <div>
                        <div className="text-muted font-size-12">Usos</div>
                        <div className="fw-medium">{template.count}</div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={6} sm={3}>
                    <div className="d-flex align-items-center">
                      <i className="mdi mdi-star text-warning me-2 font-size-20"></i>
                      <div>
                        <div className="text-muted font-size-12">Puntuacion</div>
                        <div className="fw-medium">{template.score.toFixed(1)} ({template.scoreCount})</div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={6} sm={3} className="mt-2 mt-sm-0">
                    <div
                      className="d-flex align-items-center"
                      style={{ cursor: onLoadVerifications ? 'pointer' : 'default' }}
                      onClick={onLoadVerifications ? handleOpenVerifications : undefined}
                      title="Ver verificaciones"
                    >
                      <i className="mdi mdi-shield-check text-success me-2 font-size-20"></i>
                      <div>
                        <div className="text-muted font-size-12">Verificaciones</div>
                        <div className="fw-medium text-primary" style={{ textDecoration: onLoadVerifications ? 'underline' : 'none' }}>
                          {verifications?.stats.totalVerifications ?? 'Ver'}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={6} sm={3} className="mt-2 mt-sm-0">
                    <div className="d-flex align-items-center">
                      <i className={`mdi ${statusConfig.icon} text-${statusConfig.color} me-2 font-size-20`}></i>
                      <div>
                        <div className="text-muted font-size-12">Estado</div>
                        <Badge color={statusConfig.color} pill>
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Paleta de colores y boton */}
                <div className="mt-auto d-flex justify-content-between align-items-end">
                  <div>
                    <div className="text-muted font-size-12 mb-2">Paleta de colores</div>
                    <div className="d-flex gap-2 align-items-center">
                      {template.palette.ac && (
                        <div
                          className="border rounded"
                          style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: template.palette.ac
                          }}
                          title={`Acento: ${template.palette.ac}`}
                        />
                      )}
                      {template.palette.bg && (
                        <div
                          className="border rounded"
                          style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: template.palette.bg
                          }}
                          title={`Fondo: ${template.palette.bg}`}
                        />
                      )}
                      {template.palette.tx && (
                        <div
                          className="border rounded"
                          style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: template.palette.tx
                          }}
                          title={`Texto: ${template.palette.tx}`}
                        />
                      )}
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <Button
                      color="warning"
                      size="sm"
                      onClick={() => onEdit?.(template.id)}
                    >
                      <i className="mdi mdi-pencil me-1"></i>
                      Editar
                    </Button>
                    {canPublish && onPublish && (
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => onPublish(template.id)}
                      >
                        <i className="mdi mdi-send me-1"></i>
                        Publicar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Modal de Verificaciones */}
      <Modal isOpen={showVerificationsModal} toggle={() => setShowVerificationsModal(false)} size="lg">
        <ModalHeader toggle={() => setShowVerificationsModal(false)}>
          <i className="mdi mdi-shield-check me-2"></i>
          Verificaciones - {template.name}
        </ModalHeader>
        <ModalBody>
          {loadingVerifications ? (
            <div className="text-center py-4">
              <Spinner color="primary" />
              <p className="text-muted mt-2 mb-0">Cargando verificaciones...</p>
            </div>
          ) : verifications ? (
            <Row>
              <Col xs={6}>
                <Card className="border bg-light">
                  <CardBody className="text-center py-3">
                    <h3 className="mb-1 text-primary">{verifications.stats.totalVerifications}</h3>
                    <small className="text-muted">Total verificaciones</small>
                  </CardBody>
                </Card>
              </Col>
              <Col xs={6}>
                <Card className="border bg-light">
                  <CardBody className="text-center py-3">
                    <h3 className="mb-1 text-info">{verifications.stats.uniqueUsers}</h3>
                    <small className="text-muted">Usuarios unicos</small>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          ) : (
            <p className="text-muted text-center py-3">Error al cargar verificaciones</p>
          )}
        </ModalBody>
      </Modal>
    </>
  );
};

export default TemplateCard;
