import React, { useState } from 'react';
import { Row, Col, Spinner, Card, CardBody } from 'reactstrap';
import { WorkStationModel } from '../models/WorkStationModel';
import { useWorkStations } from '../hooks/useWorkStations';
import VerticalOrgChart from './VerticalOrgChart';
import WorkStationDetailsPanel from './WorkStationDetailsPanel';

/**
 * Vista de Organigrama (árbol vertical compacto)
 * Layout: 4 columnas para árbol + 8 columnas para detalles
 */

const OrganizationChartView: React.FC = () => {
  const {
    workStationTree,
    loading,
    error,
    openSidebar
  } = useWorkStations();

  // Estado para el nodo seleccionado
  const [selectedNode, setSelectedNode] = useState<WorkStationModel | null>(null);

  /**
   * Manejar selección de nodo
   */
  const handleSelectNode = (workStation: WorkStationModel) => {
    setSelectedNode(workStation);
  };

  /**
   * Manejar acciones sobre el nodo
   */
  const handleViewRequirements = (workStation: WorkStationModel) => {
    openSidebar(workStation);
  };

  const handleEdit = (workStation: WorkStationModel) => {
    console.log('Edit:', workStation);
    // TODO: Implementar modal de edición
  };

  const handleDelete = (workStation: WorkStationModel) => {
    console.log('Delete:', workStation);
    // TODO: Implementar confirmación de eliminación
  };

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardBody className="text-center py-5">
          <Spinner color="primary" />
          <div className="mt-2">Cargando organigrama...</div>
        </CardBody>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardBody className="text-center py-5">
          <i className="mdi mdi-alert-circle text-danger" style={{ fontSize: '48px' }}></i>
          <div className="mt-2 text-danger">{error}</div>
        </CardBody>
      </Card>
    );
  }

  // Empty state
  if (!workStationTree || workStationTree.length === 0) {
    return (
      <Card>
        <CardBody className="text-center py-5">
          <i className="mdi mdi-file-tree-outline text-muted" style={{ fontSize: '48px' }}></i>
          <div className="mt-2 text-muted">No hay puestos de trabajo para mostrar</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Row>
      {/* Columna del Árbol Vertical - 4/12 (33%) */}
      <Col lg={4} md={5} sm={12} className="mb-3 mb-lg-0">
        <VerticalOrgChart
          workStations={workStationTree}
          onSelectNode={handleSelectNode}
          selectedNodeId={selectedNode?.id}
          onViewRequirements={handleViewRequirements}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Col>

      {/* Columna del Panel de Detalles - 8/12 (67%) */}
      <Col lg={8} md={7} sm={12}>
        <WorkStationDetailsPanel
          workStation={selectedNode}
          onViewRequirements={handleViewRequirements}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Col>
    </Row>
  );
};

export default OrganizationChartView;
