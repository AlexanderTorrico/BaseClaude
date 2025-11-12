import React from 'react';
import { Card, CardBody, Badge, Button, Row, Col } from 'reactstrap';
import { Clock, Users, Phone, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ReservationModel, ReservationStatus } from '../models/ReservationModel';

interface ReservationListProps {
  reservations: ReservationModel[];
  onSelectReservation: (reservation: ReservationModel) => void;
  selectedReservationId?: number;
}

const ReservationList: React.FC<ReservationListProps> = ({
  reservations,
  onSelectReservation,
  selectedReservationId
}) => {
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
        <Icon size={12} />
        {text}
      </Badge>
    );
  };

  // Obtener badge de origen
  const getSourceBadge = (source: string) => {
    const config: Record<string, { color: string; text: string }> = {
      web: { color: 'primary', text: 'Web' },
      phone: { color: 'info', text: 'Teléfono' },
      'walk-in': { color: 'secondary', text: 'Walk-in' },
      app: { color: 'success', text: 'App' }
    };

    const { color, text } = config[source] || { color: 'secondary', text: source };

    return (
      <Badge color={color} pill className="small">
        {text}
      </Badge>
    );
  };

  if (reservations.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardBody className="text-center py-5">
          <AlertCircle size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No hay reservas para esta fecha</h5>
          <p className="text-muted small">
            Las reservas realizadas por los clientes aparecerán aquí
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="reservation-list">
      <Row>
        {reservations.map((reservation) => (
          <Col key={reservation.id} xs={12} md={6} lg={4} className="mb-3">
            <Card
              className={`shadow-sm h-100 cursor-pointer transition-all ${
                selectedReservationId === reservation.id
                  ? 'border-primary border-2'
                  : 'border-0'
              }`}
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectReservation(reservation)}
            >
              <CardBody>
                {/* Header con hora y estado */}
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <Clock size={18} className="text-primary" />
                    <h5 className="mb-0">{reservation.boo_hour?.time || 'N/A'}</h5>
                  </div>
                  {getStatusBadge(reservation.status)}
                </div>

                {/* Información del cliente */}
                <div className="mb-2">
                  <h6 className="mb-1 text-truncate">
                    {reservation.name} {reservation.last_name}
                  </h6>
                  <div className="d-flex align-items-center gap-2 text-muted small">
                    <Phone size={14} />
                    <span>{reservation.phone}</span>
                  </div>
                </div>

                {/* Comensales */}
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Users size={16} className="text-muted" />
                  <span className="small">
                    {reservation.diners} {reservation.diners === 1 ? 'comensal' : 'comensales'}
                  </span>
                </div>

                {/* Mesa asignada */}
                {reservation.boo_tables.length > 0 && (
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <MapPin size={16} className="text-success" />
                    <span className="small text-success">
                      {reservation.boo_tables.map(t => t.table_number).join(', ')} - {reservation.boo_tables[0].zone_name}
                    </span>
                  </div>
                )}

                {/* Detalles */}
                {reservation.detail && (
                  <p className="small text-muted mb-2 text-truncate" title={reservation.detail}>
                    {reservation.detail}
                  </p>
                )}

                {/* Footer con origen y ID */}
                <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                  {getSourceBadge(reservation.come_of)}
                  <span className="small text-muted">#{reservation.id}</span>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <style>{`
        .cursor-pointer:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }
        .transition-all {
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ReservationList;
