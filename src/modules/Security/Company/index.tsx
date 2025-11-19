import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody, Button, Badge, Input } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { useCompany } from './hooks/useCompany';
import { useCompanyFetch } from './hooks/useCompanyFetch';
import { setSelectedCompanyId } from './slices/companySlice';
// import { CompanyMockService } from './services/CompanyMockService';
import { CompanyApiService } from './services/CompanyApiService'; // Descomentar cuando conectes con API real
import EmptyState from './components/EmptyState';
import CompanyForm from './components/CompanyForm';
import BranchMap from './components/BranchMap';
import BranchFormModal from './components/modals/BranchFormModal';
import { BranchDto } from './models/CompanyModel';

// Servicio - cambiar a CompanyApiService cuando conectes con API real
const companyService = new CompanyApiService();

const Company: React.FC = () => {
  const dispatch = useDispatch();
  const { companies, hasCompanies, selectedCompanyId } = useCompany();
  const {
    loading,
    fetchAll,
    createCompany,
    updateCompanyData,
    createBranch,
    updateBranchData,
    deleteBranch,
  } = useCompanyFetch(companyService);

  // Estado local
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [selectedBranchForMap, setSelectedBranchForMap] = useState<number | null>(null);

  // Usar la compañía seleccionada del Redux store
  const currentCompany = companies.find(c => c.id === selectedCompanyId) || null;

  useEffect(() => {
    fetchAll();
  }, []);

  // Inicializar la compañía seleccionada si no hay ninguna seleccionada
  useEffect(() => {
    if (companies.length > 0 && !selectedCompanyId && companies[0]) {
      dispatch(setSelectedCompanyId(companies[0].id));
    }
  }, [companies, selectedCompanyId, dispatch]);

  // Mostrar formulario de creación si no hay compañías
  useEffect(() => {
    if (hasCompanies()) {
      setShowCreateForm(false);
    }
  }, [hasCompanies]);

  const handleCreateCompany = () => {
    setShowCreateForm(true);
  };

  const handleSubmitCompany = async (dto: any) => {
    if (currentCompany) {
      // Actualizar compañía existente (incluye sucursales actuales)
      console.log('🏢 Compañía actual:', currentCompany);
      console.log('📍 Sucursales en Redux:', currentCompany.sucursales);
      return await updateCompanyData(currentCompany.id, dto, currentCompany.sucursales);
    } else {
      // Crear nueva compañía
      const result = await createCompany(dto);
      if (result.success) {
        setShowCreateForm(false);
        // Seleccionar la nueva compañía creada
        // La nueva compañía será la última en el array después de crearla
        setTimeout(() => {
          const newCompany = companies[companies.length - 1];
          if (newCompany) {
            dispatch(setSelectedCompanyId(newCompany.id));
          }
        }, 100);
      }
      return result;
    }
  };

  const handleAddBranch = () => {
    setSelectedBranchId(null);
    setBranchModalOpen(true);
  };

  const handleEditBranch = (branchId: number) => {
    setSelectedBranchId(branchId);
    setBranchModalOpen(true);
  };

  const handleDeleteBranch = async (branchId: number) => {
    if (!currentCompany) return;

    const confirmed = window.confirm('¿Estás seguro de eliminar esta sucursal?');
    if (!confirmed) return;

    await deleteBranch(currentCompany.id, branchId);
  };

  const handleSubmitBranch = async (companyId: number, dto: BranchDto) => {
    if (dto.id) {
      // Actualizar sucursal existente
      return await updateBranchData(companyId, dto);
    } else {
      // Crear nueva sucursal
      const result = await createBranch(companyId, dto);

      // Si se creó exitosamente y tiene coordenadas, seleccionarla en el mapa
      if (result.success && result.data && result.data.lat !== null && result.data.lng !== null) {
        setTimeout(() => {
          setSelectedBranchForMap(result.data!.id);
        }, 300);
      }

      return result;
    }
  };

  const handleBranchMove = async (branchId: number, lat: number, lng: number) => {
    if (!currentCompany) return;

    const branch = currentCompany.sucursales.find(b => b.id === branchId);
    if (!branch) return;

    // Seleccionar este branch para que el mapa se centre en la nueva posición
    setSelectedBranchForMap(branchId);

    const dto: BranchDto = {
      id: branch.id,
      name: branch.name,
      email: branch.email ?? undefined,
      phone: branch.phone,
      address: branch.address,
      lat,
      lng,
      gblCompanyId: currentCompany.id,
    };

    await updateBranchData(currentCompany.id, dto);
  };

  // Si no hay compañías y no está mostrando formulario, mostrar EmptyState
  if (!hasCompanies() && !showCreateForm) {
    return (
      <div className="page-content">
        <Container fluid>
          <EmptyState onCreateCompany={handleCreateCompany} />
        </Container>
      </div>
    );
  }

  // Si está creando primera compañía
  if (!hasCompanies() && showCreateForm) {
    return (
      <div className="page-content">
        <Container fluid>
          <Row className="justify-content-center">
            <Col xl={8}>
              <CompanyForm onSubmit={handleSubmitCompany} loading={loading} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  // Pantalla principal con compañía existente
  const selectedBranch = currentCompany?.sucursales.find(b => b.id === selectedBranchId) || null;

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const companyId = parseInt(e.target.value, 10);
    dispatch(setSelectedCompanyId(companyId));
  };

  const handleNewCompany = () => {
    setShowCreateForm(true);
  };

  return (
    <div className="page-content">
      <Container fluid>
        {/* Selector de Compañías */}
        {companies.length > 0 && (
          <Row className="mb-3">
            <Col xl={12}>
              <Card className="shadow-sm">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    {companies.length > 1 ? (
                      <div className="d-flex align-items-center gap-3 flex-grow-1">
                        <div className="d-flex align-items-center">
                          <i className="mdi mdi-office-building text-primary me-2" style={{ fontSize: '1.5rem' }}></i>
                          <h6 className="mb-0">Compañía Activa:</h6>
                        </div>
                        <Input
                          type="select"
                          value={selectedCompanyId || ''}
                          onChange={handleCompanyChange}
                          style={{ maxWidth: '300px' }}
                        >
                          {companies.map(company => (
                            <option key={company.id} value={company.id}>
                              {company.name}
                            </option>
                          ))}
                        </Input>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center">
                        <i className="mdi mdi-office-building text-primary me-2" style={{ fontSize: '1.5rem' }}></i>
                        <div>
                          <h6 className="mb-0">{currentCompany?.name}</h6>
                          <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
                            Compañía Actual
                          </p>
                        </div>
                      </div>
                    )}
                    <Button color="success" onClick={handleNewCompany}>
                      <i className="mdi mdi-plus me-1"></i>
                      Nueva Compañía
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

        {/* Formulario de Compañía */}
        <Row>
          <Col xl={12}>
            <CompanyForm company={currentCompany || null} onSubmit={handleSubmitCompany} loading={loading} />
          </Col>
        </Row>

        {/* Sección de Sucursales */}
        <Row className="mt-4">
          <Col xl={12}>
            <Card className="shadow-sm">
              <CardBody>
                {/* Header de Sucursales */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center">
                    <i className="mdi mdi-map-marker-multiple text-danger me-2" style={{ fontSize: '1.5rem' }}></i>
                    <div>
                      <h5 className="mb-0">Sucursales</h5>
                      <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
                        {currentCompany?.sucursales.length || 0} sucursal
                        {currentCompany?.sucursales.length !== 1 ? 'es' : ''} registrada
                        {currentCompany?.sucursales.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <Button color="warning" onClick={handleAddBranch}>
                    <i className="mdi mdi-plus me-1"></i>
                    Agregar Sucursal
                  </Button>
                </div>

                {/* Mapa + Lista de Sucursales en Cards */}
                <Row>
                  {/* Mapa */}
                  <Col xl={6} className="mb-4 mb-xl-0">
                    <div className="position-sticky" style={{ top: '20px' }}>
                      <h6 className="mb-3">
                        <i className="mdi mdi-map me-2 text-primary"></i>
                        Mapa de Ubicaciones
                      </h6>
                      <BranchMap
                        branches={currentCompany?.sucursales || []}
                        selectedBranchId={selectedBranchForMap}
                        onBranchSelect={setSelectedBranchForMap}
                        onBranchMove={handleBranchMove}
                        draggableMarkers={true}
                        height="500px"
                      />
                      <div className="mt-3 p-3 bg-light border rounded">
                        <p className="mb-2 text-muted" style={{ fontSize: '0.875rem' }}>
                          <i className="mdi mdi-information-outline me-1 text-info"></i>
                          <strong>Funcionalidades del Mapa:</strong>
                        </p>
                        <ul className="mb-0 text-muted" style={{ fontSize: '0.875rem' }}>
                          <li>Click en un marker para ver detalles</li>
                          <li>Arrastra los markers para cambiar ubicación</li>
                          <li>Zoom automático para mostrar todas las sucursales</li>
                        </ul>
                      </div>
                    </div>
                  </Col>

                  {/* Lista de Sucursales en Cards */}
                  <Col xl={6}>
                    {(currentCompany?.sucursales.length || 0) === 0 ? (
                      <div className="text-center text-muted p-5 border rounded bg-light">
                        <i className="mdi mdi-map-marker-off" style={{ fontSize: '3rem' }}></i>
                        <p className="mt-3 mb-0">
                          No hay sucursales registradas
                        </p>
                        <p style={{ fontSize: '0.875rem' }}>
                          Agrega tu primera sucursal usando el botón "Agregar Sucursal"
                        </p>
                      </div>
                    ) : (
                      <Row>
                        {currentCompany?.sucursales.map(branch => (
                          <Col key={branch.id} xs={12} md={6} className="mb-3">
                            <Card
                              className={`border shadow-sm h-100 ${selectedBranchForMap === branch.id ? 'border-primary' : ''}`}
                              style={{ cursor: branch.lat !== null && branch.lng !== null ? 'pointer' : 'default' }}
                              onClick={() => {
                                if (branch.lat !== null && branch.lng !== null) {
                                  setSelectedBranchForMap(branch.id);
                                }
                              }}
                            >
                              <CardBody>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                  <div className="flex-grow-1">
                                    <h6 className="mb-1">
                                      <i className="mdi mdi-map-marker text-danger me-2"></i>
                                      {branch.name}
                                    </h6>
                                    {branch.lat !== null && branch.lng !== null ? (
                                      <Badge color="info" pill className="font-size-11">
                                        <i className="mdi mdi-map-marker-check me-1"></i>
                                        Ubicación definida
                                      </Badge>
                                    ) : (
                                      <Badge color="light" className="text-muted font-size-11">
                                        Sin ubicación
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                                  <p className="mb-2">
                                    <i className="mdi mdi-phone me-2"></i>
                                    {branch.phone}
                                  </p>

                                  {branch.email && (
                                    <p className="mb-2">
                                      <i className="mdi mdi-email me-2"></i>
                                      {branch.email}
                                    </p>
                                  )}

                                  <p className="mb-2">
                                    <i className="mdi mdi-map-marker-outline me-2"></i>
                                    {branch.address}
                                  </p>

                                  {branch.lat !== null && branch.lng !== null && (
                                    <p className="mb-0 text-info" style={{ fontSize: '0.75rem' }}>
                                      <i className="mdi mdi-crosshairs-gps me-1"></i>
                                      {branch.lat.toFixed(4)}, {branch.lng.toFixed(4)}
                                    </p>
                                  )}
                                </div>

                                <div className="d-flex gap-2 justify-content-end mt-3 pt-3 border-top">
                                  <Button
                                    color="primary"
                                    size="sm"
                                    outline
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditBranch(branch.id);
                                    }}
                                  >
                                    <i className="mdi mdi-pencil"></i>
                                  </Button>
                                  <Button
                                    color="danger"
                                    size="sm"
                                    outline
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteBranch(branch.id);
                                    }}
                                  >
                                    <i className="mdi mdi-trash-can"></i>
                                  </Button>
                                </div>
                              </CardBody>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Modal de Sucursal */}
        {currentCompany && (
          <BranchFormModal
            isOpen={branchModalOpen}
            toggle={() => setBranchModalOpen(false)}
            branch={selectedBranch}
            companyId={currentCompany.id}
            onSubmit={handleSubmitBranch}
            loading={loading}
          />
        )}
      </Container>
    </div>
  );
};

export default Company;
