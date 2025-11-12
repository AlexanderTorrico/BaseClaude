import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Badge,
  Button,
  Input,
  InputGroup,
  Spinner,
  Alert
} from 'reactstrap';
import { Calendar, Search, Users, CheckCircle, Clock } from 'lucide-react';
import { ReservationModel, ReservationStatus } from './models/ReservationModel';
import { useReservations } from './hooks/useReservations';
import { useTables } from './hooks/useTables';
import DateSelector from './components/DateSelector';
import ReservationList from './components/ReservationList';
import ReservationDetail from './components/ReservationDetail';
import TableManagement from './components/TableManagement';

type TabView = 'reservations' | 'tables';

const Reservation: React.FC = () => {
  const today = new Date().toISOString().split('T')[0] || '';

  // Hooks personalizados
  const {
    reservations,
    filteredReservations,
    loading: loadingReservations,
    error: reservationsError,
    selectedDate,
    filterStatus,
    searchTerm,
    confirmReservation,
    cancelReservation,
    markAsSeated,
    completeReservation,
    markAsNoShow,
    setFilterStatus,
    setSearchTerm,
    changeDate,
    goToPreviousDay,
    goToNextDay,
    goToToday,
    getStats,
    refresh: refreshReservations
  } = useReservations(today);

  const {
    tables,
    zones,
    loading: loadingTables,
    error: tablesError,
    refresh: refreshTables
  } = useTables(reservations);

  // Estado local
  const [activeTab, setActiveTab] = useState<TabView>('reservations');
  const [selectedReservation, setSelectedReservation] = useState<ReservationModel | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Estadísticas
  const stats = getStats();

  // Manejar selección de reserva
  const handleSelectReservation = (reservation: ReservationModel) => {
    setSelectedReservation(reservation);
    setDetailOpen(true);
  };

  // Manejar confirmación de reserva con asignación de mesa
  const handleConfirmReservation = async (zoneId: number, tableIds: number[]) => {
    if (!selectedReservation) return;

    try {
      await confirmReservation(selectedReservation.id, zoneId, tableIds);
      // Actualizar la reserva seleccionada
      const updated = filteredReservations.find(r => r.id === selectedReservation.id);
      if (updated) {
        setSelectedReservation(updated);
      }
    } catch (error) {
      console.error('Error confirming reservation:', error);
    }
  };

  // Manejar cambio de estado
  const handleStatusChange = async (newStatus: ReservationStatus) => {
    if (!selectedReservation) return;

    try {
      let updated: ReservationModel;

      switch (newStatus) {
        case 'Cancelled':
          updated = await cancelReservation(selectedReservation.id);
          break;
        case 'Seated':
          updated = await markAsSeated(selectedReservation.id);
          break;
        case 'Completed':
          updated = await completeReservation(selectedReservation.id);
          break;
        case 'NoShow':
          updated = await markAsNoShow(selectedReservation.id);
          break;
        default:
          return;
      }

      setSelectedReservation(updated);
    } catch (error) {
      console.error('Error changing status:', error);
    }
  };

  // Alternar filtro de estado
  const toggleStatusFilter = (status: ReservationStatus) => {
    if (filterStatus.includes(status)) {
      setFilterStatus(filterStatus.filter(s => s !== status));
    } else {
      setFilterStatus([...filterStatus, status]);
    }
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilterStatus([]);
    setSearchTerm('');
  };

  // Refrescar todos los datos
  const refreshAll = () => {
    refreshReservations();
    refreshTables();
  };

  const loading = loadingReservations || loadingTables;
  const error = reservationsError || tablesError;

  return (
    <div className="page-content">
      <Container fluid style={{ overflowX: 'hidden' }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">Gestión de Reservas</h4>
            <p className="text-muted mb-0">
              Administra las reservas y mesas del restaurante
            </p>
          </div>
          <Button color="primary" outline onClick={refreshAll}>
            Actualizar
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert color="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Selector de fecha */}
        <Card className="shadow-sm mb-4">
          <CardBody>
            <DateSelector
              selectedDate={selectedDate}
              onDateChange={changeDate}
              onPreviousDay={goToPreviousDay}
              onNextDay={goToNextDay}
              onToday={goToToday}
            />
          </CardBody>
        </Card>

        {/* Estadísticas rápidas */}
        <Row className="mb-4">
          <Col xs={6} md={3} className="mb-3">
            <Card className="shadow-sm border-0 border-start border-4 border-warning">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="mb-0">{stats.pending}</h3>
                    <p className="text-muted small mb-0">Pendientes</p>
                  </div>
                  <Clock size={32} className="text-warning opacity-50" />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <Card className="shadow-sm border-0 border-start border-4 border-info">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="mb-0">{stats.confirmed}</h3>
                    <p className="text-muted small mb-0">Confirmadas</p>
                  </div>
                  <CheckCircle size={32} className="text-info opacity-50" />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <Card className="shadow-sm border-0 border-start border-4 border-primary">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="mb-0">{stats.seated}</h3>
                    <p className="text-muted small mb-0">En Mesa</p>
                  </div>
                  <Users size={32} className="text-primary opacity-50" />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <Card className="shadow-sm border-0 border-start border-4 border-success">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="mb-0">{stats.total}</h3>
                    <p className="text-muted small mb-0">Total</p>
                  </div>
                  <Calendar size={32} className="text-success opacity-50" />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Navegación de pestañas */}
        <Card className="shadow-sm mb-4">
          <CardBody className="p-0">
            <Nav tabs className="border-0">
              <NavItem>
                <NavLink
                  active={activeTab === 'reservations'}
                  onClick={() => setActiveTab('reservations')}
                  style={{ cursor: 'pointer' }}
                  className="d-flex align-items-center gap-2"
                >
                  <Calendar size={16} />
                  Reservas
                  <Badge color="primary" pill>
                    {reservations.length}
                  </Badge>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === 'tables'}
                  onClick={() => setActiveTab('tables')}
                  style={{ cursor: 'pointer' }}
                  className="d-flex align-items-center gap-2"
                >
                  <Users size={16} />
                  Mesas
                  <Badge color="primary" pill>
                    {tables.length}
                  </Badge>
                </NavLink>
              </NavItem>
            </Nav>
          </CardBody>
        </Card>

        {/* Contenido de las pestañas */}
        <TabContent activeTab={activeTab}>
          {/* Pestaña de Reservas */}
          <TabPane tabId="reservations">
            {/* Barra de búsqueda y filtros */}
            <Card className="shadow-sm mb-4">
              <CardBody>
                <Row className="align-items-center">
                  <Col xs={12} md={6} className="mb-3 mb-md-0">
                    <InputGroup>
                      <span className="input-group-text">
                        <Search size={16} />
                      </span>
                      <Input
                        type="text"
                        placeholder="Buscar por nombre, teléfono o ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="d-flex gap-2 flex-wrap justify-content-md-end">
                      <Button
                        size="sm"
                        color={filterStatus.includes('Pending') ? 'warning' : 'outline-warning'}
                        onClick={() => toggleStatusFilter('Pending')}
                      >
                        Pendientes
                      </Button>
                      <Button
                        size="sm"
                        color={filterStatus.includes('Confirmed') ? 'info' : 'outline-info'}
                        onClick={() => toggleStatusFilter('Confirmed')}
                      >
                        Confirmadas
                      </Button>
                      <Button
                        size="sm"
                        color={filterStatus.includes('Seated') ? 'primary' : 'outline-primary'}
                        onClick={() => toggleStatusFilter('Seated')}
                      >
                        En Mesa
                      </Button>
                      {(filterStatus.length > 0 || searchTerm) && (
                        <Button size="sm" color="secondary" outline onClick={clearFilters}>
                          Limpiar
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            {/* Lista de reservas */}
            {loading ? (
              <Card className="shadow-sm">
                <CardBody className="text-center py-5">
                  <Spinner color="primary" />
                  <p className="mt-2 text-muted">Cargando reservas...</p>
                </CardBody>
              </Card>
            ) : (
              <ReservationList
                reservations={filteredReservations}
                onSelectReservation={handleSelectReservation}
                selectedReservationId={selectedReservation?.id}
              />
            )}
          </TabPane>

          {/* Pestaña de Mesas */}
          <TabPane tabId="tables">
            {loading ? (
              <Card className="shadow-sm">
                <CardBody className="text-center py-5">
                  <Spinner color="primary" />
                  <p className="mt-2 text-muted">Cargando mesas...</p>
                </CardBody>
              </Card>
            ) : (
              <TableManagement
                tables={tables}
                zones={zones}
                reservations={reservations}
                onRefresh={refreshTables}
              />
            )}
          </TabPane>
        </TabContent>

        {/* Panel de detalle de reserva */}
        <ReservationDetail
          reservation={selectedReservation}
          isOpen={detailOpen}
          onClose={() => setDetailOpen(false)}
          tables={tables}
          zones={zones}
          onConfirmReservation={handleConfirmReservation}
          onStatusChange={handleStatusChange}
        />
      </Container>
    </div>
  );
};

export default Reservation;
