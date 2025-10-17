import React, { useEffect, useState } from 'react';
import { Offcanvas, OffcanvasHeader, OffcanvasBody, Badge, ListGroup, ListGroupItem, Spinner, Button } from 'reactstrap';
import { useWorkStations } from '../hooks/useWorkStations';
import { RequirementModel } from '../models/RequirementModel';
import { groupRequirementsByCategory } from '../adapters/requirementAdapter';

/**
 * Sidebar lateral para mostrar y gestionar Requirements
 * Se abre cuando se selecciona un WorkStation
 */

const RequirementsSidebar: React.FC = () => {
  const {
    isSidebarOpen,
    selectedWorkStation,
    requirements,
    loadingRequirements,
    closeSidebar,
    loadRequirementsByWorkStation
  } = useWorkStations();

  const [groupedRequirements, setGroupedRequirements] = useState<Record<string, RequirementModel[]>>({});

  // Cargar requirements cuando se abre el sidebar
  useEffect(() => {
    if (isSidebarOpen && selectedWorkStation) {
      loadRequirementsByWorkStation(selectedWorkStation.id);
    }
  }, [isSidebarOpen, selectedWorkStation]);

  // Agrupar requirements por categor�a
  useEffect(() => {
    const grouped = groupRequirementsByCategory(requirements);
    setGroupedRequirements(grouped);
  }, [requirements]);

  const handleAddRequirement = () => {
    console.log('Add requirement for:', selectedWorkStation);
    // TODO: Abrir modal de agregar requisito
  };

  const handleEditRequirement = (requirement: RequirementModel) => {
    console.log('Edit requirement:', requirement);
    // TODO: Abrir modal de edici�n
  };

  const handleDeleteRequirement = (requirementId: number) => {
    console.log('Delete requirement:', requirementId);
    // TODO: Confirmar y eliminar
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'Educaci�n':
        return 'mdi mdi-school';
      case 'Experiencia':
        return 'mdi mdi-briefcase';
      case 'Competencias':
        return 'mdi mdi-head-lightbulb';
      case 'Habilidades T�cnicas':
        return 'mdi mdi-tools';
      case 'Certificaciones':
        return 'mdi mdi-certificate';
      default:
        return 'mdi mdi-clipboard-list';
    }
  };

  return (
    <Offcanvas
      isOpen={isSidebarOpen}
      toggle={closeSidebar}
      direction="end"
      style={{ width: '500px' }}
    >
      <OffcanvasHeader toggle={closeSidebar}>
        <div>
          <h5 className="mb-0">Requisitos del Puesto</h5>
          {selectedWorkStation && (
            <div className="text-muted small mt-1">{selectedWorkStation.name}</div>
          )}
        </div>
      </OffcanvasHeader>

      <OffcanvasBody>
        {!selectedWorkStation && (
          <div className="text-center py-5 text-muted">
            <i className="mdi mdi-information-outline" style={{ fontSize: '48px' }}></i>
            <div className="mt-2">Selecciona un puesto para ver sus requisitos</div>
          </div>
        )}

        {selectedWorkStation && (
          <>
            {/* Informaci�n del puesto */}
            <div className="border rounded p-3 mb-3" style={{ backgroundColor: '#f8f9fa' }}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="fw-medium">{selectedWorkStation.name}</div>
                <Badge
                  color="primary"
                  pill
                >
                  Nivel {selectedWorkStation.level}
                </Badge>
              </div>
              <div className="text-muted small">
                {selectedWorkStation.levelName}
              </div>
              <div className="d-flex gap-3 mt-2">
                <span className="small">
                  <i className="mdi mdi-account-group me-1"></i>
                  {selectedWorkStation.employeeCount || 0} empleados
                </span>
                <span className="small">
                  <i className="mdi mdi-clipboard-list me-1"></i>
                  {requirements.length} requisitos
                </span>
              </div>
            </div>

            {/* Bot�n agregar requisito */}
            <Button
              color="primary"
              size="sm"
              className="w-100 mb-3"
              onClick={handleAddRequirement}
            >
              <i className="mdi mdi-plus me-1"></i>
              Agregar Requisito
            </Button>

            {/* Loading state */}
            {loadingRequirements && (
              <div className="text-center py-5">
                <Spinner color="primary" size="sm" />
                <div className="mt-2 small">Cargando requisitos...</div>
              </div>
            )}

            {/* Empty state */}
            {!loadingRequirements && requirements.length === 0 && (
              <div className="text-center py-5 text-muted">
                <i className="mdi mdi-clipboard-alert-outline" style={{ fontSize: '48px' }}></i>
                <div className="mt-2">No hay requisitos definidos</div>
                <div className="small">Agrega el primer requisito para este puesto</div>
              </div>
            )}

            {/* Lista de requisitos agrupados por categor�a */}
            {!loadingRequirements && requirements.length > 0 && (
              <div>
                {Object.entries(groupedRequirements).map(([category, reqs]) => (
                  <div key={category} className="mb-4">
                    {/* Header de categor�a */}
                    <div className="d-flex align-items-center mb-2">
                      <i className={`${getCategoryIcon(category)} me-2 text-primary`}></i>
                      <h6 className="mb-0">{category}</h6>
                      <Badge color="secondary" pill className="ms-2">
                        {reqs.length}
                      </Badge>
                    </div>

                    {/* Lista de requisitos */}
                    <ListGroup flush>
                      {reqs.map(req => (
                        <ListGroupItem
                          key={req.id}
                          className="px-0 d-flex justify-content-between align-items-start"
                        >
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-start">
                              {req.isRequired ? (
                                <i className="mdi mdi-check-circle text-success me-2 mt-1"></i>
                              ) : (
                                <i className="mdi mdi-circle-outline text-muted me-2 mt-1"></i>
                              )}
                              <div>
                                <div>{req.description}</div>
                                {!req.isRequired && (
                                  <Badge color="secondary" size="sm" className="mt-1">
                                    Opcional
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Acciones */}
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-soft-warning"
                              onClick={() => handleEditRequirement(req)}
                              title="Editar"
                            >
                              <i className="mdi mdi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-soft-danger"
                              onClick={() => handleDeleteRequirement(req.id)}
                              title="Eliminar"
                            >
                              <i className="mdi mdi-delete"></i>
                            </button>
                          </div>
                        </ListGroupItem>
                      ))}
                    </ListGroup>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default RequirementsSidebar;
