import React, { useState, useEffect } from 'react';
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Button,
  Badge,
  Alert,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  ButtonGroup
} from 'reactstrap';
import {
  X,
  Clock,
  Users,
  Phone,
  MapPin,
  FileText,
  Globe,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCheck,
  ShoppingBag
} from 'lucide-react';
import { ReservationModel, ReservationStatus } from '../models/ReservationModel';
import { Table, Zone } from '../models/TableModel';
import TableAssignment from './TableAssignment';

interface ReservationDetailProps {
  reservation: ReservationModel | null;
  isOpen: boolean;
  onClose: () => void;
  tables: Table[];
  zones: Zone[];
  onConfirmReservation: (zoneId: number, tableIds: number[]) => Promise<void>;
  onStatusChange: (status: ReservationStatus) => Promise<void>;
  loading?: boolean;
}

const ReservationDetail: React.FC<ReservationDetailProps> = ({
  reservation,
  isOpen,
  onClose,
  tables,
  zones,
  onConfirmReservation,
  onStatusChange,
  loading = false
}) => {
  const [showTableAssignment, setShowTableAssignment] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Reset state when reservation changes
    setShowTableAssignment(false);
  }, [reservation?.id]);

  if (!reservation) {
    return null;
  }

  const handleStatusChange = async (newStatus: ReservationStatus) => {
    setIsUpdating(true);
    try {
      await onStatusChange(newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmAssignment = async (zoneId: number, tableIds: number[]) => {
    setIsUpdating(true);
    try {
      await onConfirmReservation(zoneId, tableIds);
      setShowTableAssignment(false);
    } finally {
      setIsUpdating(false);
    }
  };

  // Obtener badge de estado
  const getStatusBadge = (status: ReservationStatus) => {
    const config = {
      Pending: { color: 'warning', icon: AlertCircle, text: 'Pendiente' },
      Confirmed: { color: 'info', icon: CheckCircle, text: 'Confirmada' },
      Seated: { color: 'primary', icon: Users, text: 'En mesa' },
      Completed: { color: 'success', icon: CheckCircle, text: 'Completada' },
      Cancelled: { color: 'danger', icon: XCircle, text: 'Cancelada' },
      NoShow: { color: 'secondary', icon: XCircle, text: 'No se presentó' }
    };

    const { color, icon: Icon, text } = config[status];

    return (
      <Badge color={color} className="d-flex align-items-center gap-1">
        <Icon size={14} />
        {text}
      </Badge>
    );
  };

  // Parsear parámetros especiales
  const parseSpecialParameters = () => {
    try {
      const allParameters: Array<{ name: string; type: string; active: boolean }> = [];

      reservation.act_parameters.forEach(param => {
        const parsed = JSON.parse(param.data);
        const pivotData = param.pivot?.data ? JSON.parse(param.pivot.data) : [];

        parsed.forEach((p: any) => {
          const pivotParam = pivotData.find((pd: any) => pd.name === p.name);
          if (pivotParam?.active || p.active) {
            allParameters.push(p);
          }
        });
      });

      return allParameters;
    } catch (error) {
      console.error('Error parsing special parameters:', error);
      return [];
    }
  };

  const specialParameters = parseSpecialParameters();

  // Acciones disponibles según el estado
  const getAvailableActions = () => {
    switch (reservation.status) {
      case 'Pending':
        return (
          <>
            <Button
              color="success"
              size="sm"
              onClick={() => setShowTableAssignment(true)}
              disabled={isUpdating}
            >
              <CheckCircle size={16} className="me-1" />
              Asignar Mesa
            </Button>
            <Button
              color="danger"
              size="sm"
              outline
              onClick={() => handleStatusChange('Cancelled')}
              disabled={isUpdating}
            >
              <XCircle size={16} className="me-1" />
              Cancelar
            </Button>
          </>
        );
      case 'Confirmed':
        return (
          <>
            <Button
              color="primary"
              size="sm"
              onClick={() => handleStatusChange('Seated')}
              disabled={isUpdating}
            >
              <UserCheck size={16} className="me-1" />
              Marcar Sentado
            </Button>
            <Button
              color="warning"
              size="sm"
              outline
              onClick={() => setShowTableAssignment(true)}
              disabled={isUpdating}
            >
              <MapPin size={16} className="me-1" />
              Cambiar Mesa
            </Button>
            <Button
              color="danger"
              size="sm"
              outline
              onClick={() => handleStatusChange('Cancelled')}
              disabled={isUpdating}
            >
              <XCircle size={16} className="me-1" />
              Cancelar
            </Button>
          </>
        );
      case 'Seated':
        return (
          <>
            <Button
              color="success"
              size="sm"
              onClick={() => handleStatusChange('Completed')}
              disabled={isUpdating}
            >
              <ShoppingBag size={16} className="me-1" />
              Completar Servicio
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Offcanvas
        isOpen={isOpen}
        toggle={onClose}
        direction="end"
        style={{ width: '500px' }}
      >
        <OffcanvasHeader toggle={onClose} className="border-bottom">
          <div className="d-flex flex-column">
            <h5 className="mb-1">Reserva #{reservation.id}</h5>
            {getStatusBadge(reservation.status)}
          </div>
        </OffcanvasHeader>

        <OffcanvasBody>
          {loading || isUpdating ? (
            <div className="text-center py-5">
              <Spinner color="primary" />
              <p className="mt-2 text-muted">Actualizando...</p>
            </div>
          ) : (
            <>
              {/* Información del cliente */}
              <Card className="mb-3 shadow-sm">
                <CardHeader className="bg-light">
                  <h6 className="mb-0">Información del Cliente</h6>
                </CardHeader>
                <CardBody>
                  <div className="mb-2">
                    <strong>Nombre:</strong>
                    <p className="mb-0">{reservation.name} {reservation.last_name}</p>
                  </div>
                  <div className="mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <Phone size={16} className="text-muted" />
                      <span>{reservation.phone}</span>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <Globe size={16} className="text-muted" />
                      <Badge color="primary" pill>
                        {reservation.come_of}
                      </Badge>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Detalles de la reserva */}
              <Card className="mb-3 shadow-sm">
                <CardHeader className="bg-light">
                  <h6 className="mb-0">Detalles de la Reserva</h6>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col xs={6}>
                      <div className="mb-3">
                        <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                          <Clock size={14} />
                          <span>Hora</span>
                        </div>
                        <strong>{reservation.boo_hour?.time || 'N/A'}</strong>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="mb-3">
                        <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                          <Users size={14} />
                          <span>Comensales</span>
                        </div>
                        <strong>{reservation.diners}</strong>
                      </div>
                    </Col>
                  </Row>

                  {reservation.detail && (
                    <div className="mb-2">
                      <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                        <FileText size={14} />
                        <span>Notas</span>
                      </div>
                      <p className="mb-0 small">{reservation.detail}</p>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Mesa asignada */}
              {reservation.boo_tables.length > 0 && (
                <Card className="mb-3 shadow-sm border-success">
                  <CardHeader className="bg-success text-white">
                    <h6 className="mb-0 d-flex align-items-center gap-2">
                      <MapPin size={16} />
                      Mesa Asignada
                    </h6>
                  </CardHeader>
                  <CardBody>
                    {reservation.boo_tables.map((table, index) => (
                      <div key={index} className="mb-2">
                        <strong>{table.table_number}</strong>
                        <p className="mb-0 small text-muted">{table.zone_name}</p>
                      </div>
                    ))}
                  </CardBody>
                </Card>
              )}

              {/* Solicitudes especiales */}
              {specialParameters.length > 0 && (
                <Card className="mb-3 shadow-sm">
                  <CardHeader className="bg-light">
                    <h6 className="mb-0">Solicitudes Especiales</h6>
                  </CardHeader>
                  <CardBody>
                    <div className="d-flex flex-wrap gap-2">
                      {specialParameters.map((param, index) => (
                        <Badge key={index} color="info" pill>
                          {param.name}
                        </Badge>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Acciones */}
              {getAvailableActions() && (
                <Card className="shadow-sm">
                  <CardHeader className="bg-light">
                    <h6 className="mb-0">Acciones</h6>
                  </CardHeader>
                  <CardBody>
                    <div className="d-flex flex-column gap-2">
                      {getAvailableActions()}
                    </div>
                  </CardBody>
                </Card>
              )}
            </>
          )}
        </OffcanvasBody>
      </Offcanvas>

      {/* Modal de asignación de mesa */}
      {showTableAssignment && (
        <TableAssignment
          isOpen={showTableAssignment}
          onClose={() => setShowTableAssignment(false)}
          reservation={reservation}
          tables={tables}
          zones={zones}
          onConfirm={handleConfirmAssignment}
        />
      )}
    </>
  );
};

export default ReservationDetail;
