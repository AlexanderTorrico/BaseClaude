import React, { useState, useMemo } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Input,
  InputGroup,
  Button,
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { mockPaymentGateways } from './data/mockPaymentGatewayWithRoles';
import { PaymentGatewayModel } from './models/PaymentGatewayModel';
import { PaymentGatewayCard } from './components/PaymentGatewayCard';
import { PaymentGatewayConfigModal } from './components/PaymentGatewayConfigModal';

const PaymentGateway: React.FC = () => {
  const [gateways, setGateways] = useState<PaymentGatewayModel[]>(mockPaymentGateways);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayModel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrar y buscar pasarelas
  const filteredGateways = useMemo(() => {
    return gateways.filter((gateway) => {
      const matchesSearch = gateway.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gateway.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || gateway.category === filterCategory;
      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'enabled' && gateway.enabled) ||
        (filterStatus === 'disabled' && !gateway.enabled);
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [gateways, searchTerm, filterCategory, filterStatus]);

  // Estadísticas
  const stats = useMemo(() => {
    const enabled = gateways.filter(g => g.enabled).length;
    const total = gateways.length;
    return { enabled, disabled: total - enabled, total };
  }, [gateways]);

  const handleToggleGateway = (gateway: PaymentGatewayModel) => {
    setGateways(prev =>
      prev.map(g =>
        g.id === gateway.id ? { ...g, enabled: !g.enabled } : g
      )
    );
  };

  const handleConfigureGateway = (gateway: PaymentGatewayModel) => {
    setSelectedGateway(gateway);
    setIsModalOpen(true);
  };

  const handleSaveConfiguration = (updatedGateway: PaymentGatewayModel) => {
    setGateways(prev =>
      prev.map(g =>
        g.id === updatedGateway.id ? updatedGateway : g
      )
    );
  };

  const handleEnableAll = () => {
    setGateways(prev => prev.map(g => ({ ...g, enabled: true })));
  };

  const handleDisableAll = () => {
    setGateways(prev => prev.map(g => ({ ...g, enabled: false })));
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      card: 'Tarjetas',
      wallet: 'Billeteras',
      bank: 'Transferencias',
      cash: 'Efectivo',
      crypto: 'Criptomonedas',
      other: 'Otros'
    };
    return labels[category] || category;
  };

  return (
    <div className="page-content">
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-1">Pasarelas de Pago</h4>
                <p className="text-muted">Configure las pasarelas de pago disponibles para su tienda</p>
              </div>
              <div className="d-flex gap-2">
                <Button color="success" outline onClick={handleEnableAll}>
                  <i className="mdi mdi-check-all me-1"></i>
                  Activar Todas
                </Button>
                <Button color="secondary" outline onClick={handleDisableAll}>
                  <i className="mdi mdi-close-circle me-1"></i>
                  Desactivar Todas
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <CardBody>
                <div className="d-flex align-items-center">
                  <div className="avatar-sm flex-shrink-0 me-3">
                    <span className="avatar-title bg-success-subtle text-success rounded-circle font-size-18">
                      <i className="mdi mdi-check-circle"></i>
                    </span>
                  </div>
                  <div className="flex-grow-1">
                    <p className="text-muted mb-1">Pasarelas Activas</p>
                    <h4 className="mb-0">{stats.enabled}</h4>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <CardBody>
                <div className="d-flex align-items-center">
                  <div className="avatar-sm flex-shrink-0 me-3">
                    <span className="avatar-title bg-secondary-subtle text-secondary rounded-circle font-size-18">
                      <i className="mdi mdi-pause-circle"></i>
                    </span>
                  </div>
                  <div className="flex-grow-1">
                    <p className="text-muted mb-1">Pasarelas Inactivas</p>
                    <h4 className="mb-0">{stats.disabled}</h4>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <CardBody>
                <div className="d-flex align-items-center">
                  <div className="avatar-sm flex-shrink-0 me-3">
                    <span className="avatar-title bg-primary-subtle text-primary rounded-circle font-size-18">
                      <i className="mdi mdi-wallet"></i>
                    </span>
                  </div>
                  <div className="flex-grow-1">
                    <p className="text-muted mb-1">Total Disponibles</p>
                    <h4 className="mb-0">{stats.total}</h4>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Filters and Search */}
        <Card className="mb-4">
          <CardBody>
            <Row className="align-items-center">
              <Col md={5}>
                <InputGroup>
                  <span className="input-group-text">
                    <i className="mdi mdi-magnify"></i>
                  </span>
                  <Input
                    type="text"
                    placeholder="Buscar pasarelas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={7}>
                <div className="d-flex gap-2 justify-content-md-end mt-3 mt-md-0">
                  <UncontrolledDropdown>
                    <DropdownToggle caret color="light">
                      <i className="mdi mdi-filter me-1"></i>
                      Categoría: {filterCategory === 'all' ? 'Todas' : getCategoryLabel(filterCategory)}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => setFilterCategory('all')}>
                        Todas las categorías
                      </DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem onClick={() => setFilterCategory('card')}>
                        Tarjetas
                      </DropdownItem>
                      <DropdownItem onClick={() => setFilterCategory('wallet')}>
                        Billeteras Digitales
                      </DropdownItem>
                      <DropdownItem onClick={() => setFilterCategory('bank')}>
                        Transferencias Bancarias
                      </DropdownItem>
                      <DropdownItem onClick={() => setFilterCategory('cash')}>
                        Efectivo
                      </DropdownItem>
                      <DropdownItem onClick={() => setFilterCategory('crypto')}>
                        Criptomonedas
                      </DropdownItem>
                      <DropdownItem onClick={() => setFilterCategory('other')}>
                        Otros
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>

                  <UncontrolledDropdown>
                    <DropdownToggle caret color="light">
                      <i className="mdi mdi-filter-variant me-1"></i>
                      Estado: {filterStatus === 'all' ? 'Todos' : filterStatus === 'enabled' ? 'Activas' : 'Inactivas'}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => setFilterStatus('all')}>
                        Todos los estados
                      </DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem onClick={() => setFilterStatus('enabled')}>
                        Activas
                      </DropdownItem>
                      <DropdownItem onClick={() => setFilterStatus('disabled')}>
                        Inactivas
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>

                  <div className="btn-group">
                    <Button
                      color={viewMode === 'grid' ? 'primary' : 'light'}
                      onClick={() => setViewMode('grid')}
                    >
                      <i className="mdi mdi-view-grid"></i>
                    </Button>
                    <Button
                      color={viewMode === 'list' ? 'primary' : 'light'}
                      onClick={() => setViewMode('list')}
                    >
                      <i className="mdi mdi-view-list"></i>
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>

            {(searchTerm || filterCategory !== 'all' || filterStatus !== 'all') && (
              <div className="mt-3">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className="text-muted">Filtros activos:</span>
                  {searchTerm && (
                    <Badge color="info" className="d-flex align-items-center gap-1">
                      Búsqueda: "{searchTerm}"
                      <i
                        className="mdi mdi-close"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSearchTerm('')}
                      ></i>
                    </Badge>
                  )}
                  {filterCategory !== 'all' && (
                    <Badge color="info" className="d-flex align-items-center gap-1">
                      Categoría: {getCategoryLabel(filterCategory)}
                      <i
                        className="mdi mdi-close"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setFilterCategory('all')}
                      ></i>
                    </Badge>
                  )}
                  {filterStatus !== 'all' && (
                    <Badge color="info" className="d-flex align-items-center gap-1">
                      Estado: {filterStatus === 'enabled' ? 'Activas' : 'Inactivas'}
                      <i
                        className="mdi mdi-close"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setFilterStatus('all')}
                      ></i>
                    </Badge>
                  )}
                  <Button
                    color="link"
                    size="sm"
                    className="text-decoration-none"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterCategory('all');
                      setFilterStatus('all');
                    }}
                  >
                    Limpiar filtros
                  </Button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Gateways Grid/List */}
        {filteredGateways.length === 0 ? (
          <Card>
            <CardBody className="text-center py-5">
              <i className="mdi mdi-magnify font-size-48 text-muted mb-3 d-block"></i>
              <h5 className="text-muted">No se encontraron pasarelas</h5>
              <p className="text-muted">Intenta ajustar tus filtros de búsqueda</p>
            </CardBody>
          </Card>
        ) : (
          <Row>
            {filteredGateways.map((gateway) => (
              <Col
                key={gateway.id}
                xs={12}
                sm={viewMode === 'grid' ? 6 : 12}
                lg={viewMode === 'grid' ? 4 : 12}
                className="mb-4"
              >
                <PaymentGatewayCard
                  gateway={gateway}
                  onToggle={handleToggleGateway}
                  onConfigure={handleConfigureGateway}
                />
              </Col>
            ))}
          </Row>
        )}

        {/* Configuration Modal */}
        <PaymentGatewayConfigModal
          isOpen={isModalOpen}
          toggle={() => setIsModalOpen(!isModalOpen)}
          gateway={selectedGateway}
          onSave={handleSaveConfiguration}
        />
      </Container>

      <style>{`
        .payment-gateway-card {
          transition: all 0.3s ease;
          height: 100%;
        }
        .payment-gateway-card:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
          transform: translateY(-2px);
        }
        .payment-gateway-card.border-success {
          border-width: 2px !important;
        }
        .form-switch-lg .form-check-input {
          width: 3rem;
          height: 1.5rem;
        }
        .avatar-sm {
          width: 3rem;
          height: 3rem;
        }
        .avatar-title {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        .bg-success-subtle {
          background-color: rgba(25, 135, 84, 0.1);
        }
        .bg-secondary-subtle {
          background-color: rgba(108, 117, 125, 0.1);
        }
        .bg-primary-subtle {
          background-color: rgba(13, 110, 253, 0.1);
        }
      `}</style>
    </div>
  );
};

export default PaymentGateway;
