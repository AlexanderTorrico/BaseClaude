import React, { useState } from 'react';
import { Card, CardBody, Badge, Input, Button, Spinner } from 'reactstrap';
import { UserOrgNode } from '@/modules/RRHH/shared/hooks/useSharedUsers';
import UserAvatar from '@/components/Common/UserAvatar';
import { WorkStationApiService } from '../services/WorkStationApiService';
import { useWorkStations } from '../hooks/useWorkStations';
import { toast } from 'react-toastify';

interface UserDetailsPanelProps {
  user: UserOrgNode | null;
  onRefresh?: () => void;
}

const workStationService = new WorkStationApiService();

const UserDetailsPanel: React.FC<UserDetailsPanelProps> = ({ user, onRefresh }) => {
  const [newRequirement, setNewRequirement] = useState('');
  const [newResponsability, setNewResponsability] = useState('');
  const [loadingRequirement, setLoadingRequirement] = useState(false);
  const [loadingResponsability, setLoadingResponsability] = useState(false);
  const [showRequirementInput, setShowRequirementInput] = useState(false);
  const [showResponsabilityInput, setShowResponsabilityInput] = useState(false);

  const { workStations } = useWorkStations();

  // Obtener el workStation completo del slice por ID
  const fullWorkStation = user?.workStation?.id
    ? workStations.find(ws => ws.id === user.workStation?.id)
    : null;

  // Debug: verificar datos
  console.log('👤 Usuario seleccionado:', user?.fullName, 'WorkStation ID:', user?.workStation?.id);
  console.log('📋 WorkStations en Redux:', workStations.length);
  console.log('🎯 FullWorkStation encontrado:', fullWorkStation?.name, 'Requirements:', fullWorkStation?.requirements?.length, 'Responsabilities:', fullWorkStation?.responsabilities?.length);

  if (!user) {
    return (
      <Card className="h-100">
        <CardBody className="d-flex flex-column align-items-center justify-content-center text-center py-5">
          <i className="mdi mdi-account-search-outline text-muted" style={{ fontSize: '64px' }}></i>
          <h5 className="mt-3 text-muted">Selecciona un usuario</h5>
          <p className="text-muted mb-0">
            Haz clic en un usuario del organigrama para ver sus detalles
          </p>
        </CardBody>
      </Card>
    );
  }

  const getLevelColor = (level: number = 0) => {
    const colors = ['primary', 'success', 'warning', 'info', 'danger'];
    return colors[level % colors.length];
  };

  const handleAddRequirement = async () => {
    if (!newRequirement.trim() || !user.workStation?.id) return;

    setLoadingRequirement(true);
    try {
      const result = await workStationService.addRequirement({
        description: newRequirement.trim(),
        workStationId: user.workStation.id
      });

      if (result.status === 200 || result.status === 201) {
        toast.success('Requisito agregado exitosamente');
        setNewRequirement('');
        setShowRequirementInput(false);
        onRefresh?.();
      } else {
        toast.error(result.message || 'Error al agregar requisito');
      }
    } catch {
      toast.error('Error al agregar requisito');
    } finally {
      setLoadingRequirement(false);
    }
  };

  const handleAddResponsability = async () => {
    if (!newResponsability.trim() || !user.workStation?.id) return;

    setLoadingResponsability(true);
    try {
      const result = await workStationService.addResponsability({
        description: newResponsability.trim(),
        workStationId: user.workStation.id
      });

      if (result.status === 200 || result.status === 201) {
        toast.success('Responsabilidad agregada exitosamente');
        setNewResponsability('');
        setShowResponsabilityInput(false);
        onRefresh?.();
      } else {
        toast.error(result.message || 'Error al agregar responsabilidad');
      }
    } catch {
      toast.error('Error al agregar responsabilidad');
    } finally {
      setLoadingResponsability(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'requirement' | 'responsability') => {
    if (e.key === 'Enter') {
      if (type === 'requirement') {
        handleAddRequirement();
      } else {
        handleAddResponsability();
      }
    } else if (e.key === 'Escape') {
      if (type === 'requirement') {
        setShowRequirementInput(false);
        setNewRequirement('');
      } else {
        setShowResponsabilityInput(false);
        setNewResponsability('');
      }
    }
  };

  const handleCancelRequirement = () => {
    setShowRequirementInput(false);
    setNewRequirement('');
  };

  const handleCancelResponsability = () => {
    setShowResponsabilityInput(false);
    setNewResponsability('');
  };

  // Filtrar requirements y responsabilities visibles (no ocultos ni eliminados)
  const visibleRequirements = fullWorkStation?.requirements?.filter(
    r => r.isHidden === 0 && r.isDelete === 0
  ) || [];

  const visibleResponsabilities = fullWorkStation?.responsabilities?.filter(
    r => r.isHidden === 0 && r.isDelete === 0
  ) || [];

  return (
    <Card className="h-100">
      <CardBody>
        {/* Header con Avatar al lado */}
        <div className="d-flex align-items-center border-bottom pb-4 mb-4">
          <UserAvatar
            fullName={user.fullName}
            avatar={user.avatar}
            size="lg"
          />
          <div className="ms-3">
            <h5 className="mb-1">{user.fullName}</h5>
            {user.workStation && (
              <Badge color={getLevelColor(user.workStation.level)} pill className="px-3 py-1">
                <i className="mdi mdi-briefcase me-1"></i>
                {user.workStation.name}
              </Badge>
            )}
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="mb-4">
          <h6 className="text-uppercase text-muted mb-3">
            <i className="mdi mdi-card-account-details-outline me-2"></i>
            Información de Contacto
          </h6>

          {user.phone && (
            <div className="d-flex align-items-center mb-2">
              <i className="mdi mdi-phone text-muted me-2"></i>
              <span>{user.phone}</span>
            </div>
          )}

          <div className="d-flex align-items-center mb-2">
            <i className="mdi mdi-email text-muted me-2"></i>
            <span>{user.email}</span>
          </div>
        </div>

        {/* Información del Puesto */}
        {user.workStation && (
          <div className="mb-4">
            <h6 className="text-uppercase text-muted mb-3">
              <i className="mdi mdi-briefcase-outline me-2"></i>
              Información del Puesto
            </h6>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Nivel Jerárquico:</span>
              <Badge color={getLevelColor(user.workStation.level)}>
                Nivel {user.workStation.level}
              </Badge>
            </div>

            {(fullWorkStation?.description || user.workStation.description) && (
              <div className="mb-3">
                <span className="text-muted d-block mb-1">Descripción:</span>
                <p className="mb-0 bg-light p-2 rounded">
                  {fullWorkStation?.description || user.workStation.description}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Requisitos */}
        {user.workStation && (
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="text-uppercase text-muted mb-0">
                <i className="mdi mdi-clipboard-check-outline me-2"></i>
                Requisitos ({visibleRequirements.length})
              </h6>
              {!showRequirementInput && (
                <Button
                  color="primary"
                  size="sm"
                  outline
                  onClick={() => setShowRequirementInput(true)}
                >
                  <i className="mdi mdi-plus me-1"></i>
                  Agregar
                </Button>
              )}
            </div>

            {visibleRequirements.length > 0 ? (
              <div className="mb-3">
                {visibleRequirements.map(req => (
                  <div key={req.id} className="d-flex align-items-center mb-2 bg-light p-2 rounded">
                    <i className="mdi mdi-check-circle text-primary me-2"></i>
                    <span>{req.description}</span>
                  </div>
                ))}
              </div>
            ) : (
              !showRequirementInput && (
                <p className="text-muted mb-3 fst-italic">Sin requisitos definidos</p>
              )
            )}

            {/* Input para agregar requisito */}
            {showRequirementInput && (
              <div className="d-flex gap-2">
                <Input
                  type="text"
                  placeholder="Escribir requisito..."
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, 'requirement')}
                  className="form-control-sm"
                  disabled={loadingRequirement}
                  autoFocus
                />
                <Button
                  color="primary"
                  size="sm"
                  onClick={handleAddRequirement}
                  disabled={!newRequirement.trim() || loadingRequirement}
                >
                  {loadingRequirement ? (
                    <Spinner size="sm" />
                  ) : (
                    <i className="mdi mdi-content-save"></i>
                  )}
                </Button>
                <Button
                  color="light"
                  size="sm"
                  onClick={handleCancelRequirement}
                  disabled={loadingRequirement}
                >
                  <i className="mdi mdi-close"></i>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Responsabilidades */}
        {user.workStation && (
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="text-uppercase text-muted mb-0">
                <i className="mdi mdi-account-check-outline me-2"></i>
                Responsabilidades ({visibleResponsabilities.length})
              </h6>
              {!showResponsabilityInput && (
                <Button
                  color="success"
                  size="sm"
                  outline
                  onClick={() => setShowResponsabilityInput(true)}
                >
                  <i className="mdi mdi-plus me-1"></i>
                  Agregar
                </Button>
              )}
            </div>

            {visibleResponsabilities.length > 0 ? (
              <div className="mb-3">
                {visibleResponsabilities.map(resp => (
                  <div key={resp.id} className="d-flex align-items-center mb-2 bg-light p-2 rounded">
                    <i className="mdi mdi-check-circle text-success me-2"></i>
                    <span>{resp.description}</span>
                  </div>
                ))}
              </div>
            ) : (
              !showResponsabilityInput && (
                <p className="text-muted mb-3 fst-italic">Sin responsabilidades definidas</p>
              )
            )}

            {/* Input para agregar responsabilidad */}
            {showResponsabilityInput && (
              <div className="d-flex gap-2">
                <Input
                  type="text"
                  placeholder="Escribir responsabilidad..."
                  value={newResponsability}
                  onChange={(e) => setNewResponsability(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, 'responsability')}
                  className="form-control-sm"
                  disabled={loadingResponsability}
                  autoFocus
                />
                <Button
                  color="success"
                  size="sm"
                  onClick={handleAddResponsability}
                  disabled={!newResponsability.trim() || loadingResponsability}
                >
                  {loadingResponsability ? (
                    <Spinner size="sm" />
                  ) : (
                    <i className="mdi mdi-content-save"></i>
                  )}
                </Button>
                <Button
                  color="light"
                  size="sm"
                  onClick={handleCancelResponsability}
                  disabled={loadingResponsability}
                >
                  <i className="mdi mdi-close"></i>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Subordinados */}
        {user.children && user.children.length > 0 && (
          <div>
            <h6 className="text-uppercase text-muted mb-3">
              <i className="mdi mdi-account-group me-2"></i>
              Subordinados ({user.children.length})
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {user.children.map(child => (
                <Badge key={child.id} color="light" className="text-dark border">
                  <i className="mdi mdi-account me-1"></i>
                  {child.fullName}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default UserDetailsPanel;
