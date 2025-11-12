import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Badge,
  Alert,
  ButtonGroup
} from 'reactstrap';
import { MapPin, Users, CheckCircle, AlertCircle, Lightbulb, Grid, Map } from 'lucide-react';
import { ReservationModel } from '../models/ReservationModel';
import { Table, Zone } from '../models/TableModel';
import { useTableAssignment } from '../hooks/useTableAssignment';

interface TableAssignmentProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: ReservationModel;
  tables: Table[];
  zones: Zone[];
  onConfirm: (zoneId: number, tableIds: number[]) => Promise<void>;
}

type ViewMode = 'grid' | 'map';

const TableAssignment: React.FC<TableAssignmentProps> = ({
  isOpen,
  onClose,
  reservation,
  tables,
  zones,
  onConfirm
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('map');

  const {
    selectedZoneId,
    selectedTableIds,
    isAssigning,
    error,
    selectZone,
    toggleTableSelection,
    confirmAssignment,
    validateSelection,
    getTotalSelectedCapacity,
    isTableSelected,
    applySuggestion
  } = useTableAssignment(reservation, onConfirm);

  // Filtrar mesas disponibles
  const getAvailableTables = (zoneId: number): Table[] => {
    return tables.filter(
      t => t.zone_id === zoneId &&
      (t.status === 'Available' || selectedTableIds.includes(t.id))
    );
  };

  // Manejar confirmación
  const handleConfirm = async () => {
    const availableTables = selectedZoneId
      ? getAvailableTables(selectedZoneId)
      : tables.filter(t => t.status === 'Available');

    const success = await confirmAssignment(availableTables, reservation.diners);
    if (success) {
      onClose();
    }
  };

  // Aplicar sugerencia automática
  const handleApplySuggestion = () => {
    const availableTables = tables.filter(t => t.status === 'Available');
    applySuggestion(availableTables, reservation.diners, selectedZoneId || undefined);
  };

  // Validar selección actual
  const validation = selectedZoneId
    ? validateSelection(getAvailableTables(selectedZoneId), reservation.diners)
    : { valid: false, message: 'Seleccione una zona' };

  const totalCapacity = getTotalSelectedCapacity(tables);

  // Renderizar vista de mapa
  const renderMapView = (zoneId: number) => {
    const zoneTables = getAvailableTables(zoneId);
    const scale = 0.6; // Escala reducida para el modal
    const baseWidth = 800;
    const baseHeight = 600;

    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: `${baseHeight * scale}px`,
          backgroundColor: '#f8f9fa',
          border: '2px solid #dee2e6',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        {zoneTables.map(table => {
          const x = (table.x || 0) * scale;
          const y = (table.y || 0) * scale;
          const size = 60 * scale;
          const selected = isTableSelected(table.id);
          const available = table.status === 'Available';

          // Colores
          const getColor = () => {
            if (selected) return '#007bff'; // Azul si está seleccionada
            if (!available) return '#6c757d'; // Gris si no disponible
            return '#28a745'; // Verde si disponible
          };

          const commonStyle: React.CSSProperties = {
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            backgroundColor: getColor(),
            border: `${selected ? 3 : 2}px solid ${selected ? '#0056b3' : '#333'}`,
            cursor: available ? 'pointer' : 'not-allowed',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: `${12 * scale}px`,
            transition: 'all 0.2s ease',
            boxShadow: selected ? '0 0 0 3px rgba(0,123,255,0.3)' : '0 2px 4px rgba(0,0,0,0.2)',
            opacity: available ? 1 : 0.5,
          };

          let shapeStyle = {};
          switch (table.shape) {
            case 'round':
              shapeStyle = {
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
              };
              break;
            case 'square':
              shapeStyle = {
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '6px',
              };
              break;
            case 'rectangle':
              shapeStyle = {
                width: `${size * 1.5}px`,
                height: `${size * 0.7}px`,
                borderRadius: '6px',
              };
              break;
          }

          return (
            <div
              key={table.id}
              style={{ ...commonStyle, ...shapeStyle }}
              onClick={() => available && toggleTableSelection(table.id)}
              title={`${table.table_number} - ${table.capacity} personas - ${table.status}`}
            >
              <div>{table.table_number}</div>
              <div style={{ fontSize: `${10 * scale}px`, marginTop: '2px' }}>
                {table.capacity}p
              </div>
              {selected && (
                <CheckCircle
                  size={14 * scale}
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    color: '#007bff'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Renderizar vista de grilla (original)
  const renderGridView = (zoneId: number) => {
    const zoneTables = getAvailableTables(zoneId);

    return (
      <div className="row">
        {zoneTables.map(table => {
          const selected = isTableSelected(table.id);
          const canSelect = table.status === 'Available';

          return (
            <div key={table.id} className="col-6 col-md-4 col-lg-3 mb-3">
              <div
                className={`card shadow-sm h-100 ${selected ? 'border-primary border-2' : ''} ${!canSelect ? 'opacity-50' : ''}`}
                style={{ cursor: canSelect ? 'pointer' : 'not-allowed' }}
                onClick={() => canSelect && toggleTableSelection(table.id)}
              >
                <div className="card-body text-center">
                  {selected && (
                    <div className="position-absolute top-0 end-0 m-2">
                      <CheckCircle size={20} className="text-primary" />
                    </div>
                  )}
                  <h5 className="mb-2">{table.table_number}</h5>
                  <div className="d-flex align-items-center justify-content-center gap-1 mb-2">
                    <Users size={14} className="text-muted" />
                    <span className="small">{table.capacity}</span>
                  </div>
                  <Badge
                    color={table.status === 'Available' ? 'success' : 'secondary'}
                    className="small"
                  >
                    {table.status}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} size="xl" style={{ maxWidth: '90vw' }}>
      <ModalHeader toggle={onClose}>
        Asignar Mesa - {reservation.name} {reservation.last_name}
      </ModalHeader>

      <ModalBody>
        {/* Información de la reserva */}
        <Alert color="info" className="mb-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <div>
                <Users size={16} className="me-1" />
                <strong>{reservation.diners} comensales</strong>
              </div>
              {selectedTableIds.length > 0 && (
                <div>
                  <CheckCircle size={16} className="me-1" />
                  Capacidad seleccionada: <strong>{totalCapacity}</strong>
                </div>
              )}
            </div>
            <div className="d-flex gap-2">
              <ButtonGroup size="sm">
                <Button
                  color={viewMode === 'map' ? 'primary' : 'outline-primary'}
                  onClick={() => setViewMode('map')}
                >
                  <Map size={14} className="me-1" />
                  Mapa
                </Button>
                <Button
                  color={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={14} className="me-1" />
                  Grilla
                </Button>
              </ButtonGroup>
              <Button
                color="warning"
                size="sm"
                outline
                onClick={handleApplySuggestion}
              >
                <Lightbulb size={14} className="me-1" />
                Sugerir
              </Button>
            </div>
          </div>
        </Alert>

        {/* Error */}
        {error && (
          <Alert color="danger" className="mb-3">
            <AlertCircle size={16} className="me-2" />
            {error}
          </Alert>
        )}

        {/* Navegación por zonas */}
        <Nav tabs className="mb-3">
          {zones.map(zone => {
            const zoneTables = getAvailableTables(zone.id);
            return (
              <NavItem key={zone.id}>
                <NavLink
                  active={selectedZoneId === zone.id}
                  onClick={() => selectZone(zone.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <MapPin size={14} />
                    {zone.name}
                    <Badge color="secondary" pill>
                      {zoneTables.length}
                    </Badge>
                  </div>
                </NavLink>
              </NavItem>
            );
          })}
        </Nav>

        {/* Contenido de las zonas */}
        <TabContent activeTab={selectedZoneId?.toString() || ''}>
          {zones.map(zone => (
            <TabPane key={zone.id} tabId={zone.id.toString()}>
              {selectedZoneId === zone.id && (
                <>
                  {/* Descripción de la zona */}
                  <div className="mb-3">
                    <small className="text-muted">{zone.description}</small>
                  </div>

                  {/* Vista seleccionada */}
                  {viewMode === 'map' ? renderMapView(zone.id) : renderGridView(zone.id)}

                  {getAvailableTables(zone.id).length === 0 && (
                    <Alert color="warning" className="mt-3">
                      <AlertCircle size={16} className="me-2" />
                      No hay mesas disponibles en esta zona
                    </Alert>
                  )}
                </>
              )}
            </TabPane>
          ))}
        </TabContent>
      </ModalBody>

      <ModalFooter>
        <div className="w-100 d-flex justify-content-between align-items-center">
          <div>
            {selectedTableIds.length > 0 && (
              <span className="text-muted small">
                {selectedTableIds.length} mesa(s) seleccionada(s)
              </span>
            )}
          </div>
          <div className="d-flex gap-2">
            <Button color="secondary" outline onClick={onClose} disabled={isAssigning}>
              Cancelar
            </Button>
            <Button
              color="success"
              onClick={handleConfirm}
              disabled={!validation.valid || isAssigning}
            >
              {isAssigning ? 'Asignando...' : 'Confirmar Asignación'}
            </Button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default TableAssignment;
