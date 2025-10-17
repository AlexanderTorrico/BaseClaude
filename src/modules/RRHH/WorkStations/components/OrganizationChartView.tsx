import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { Card, CardBody, Spinner } from 'reactstrap';
import { WorkStationModel } from '../models/WorkStationModel';
import { useWorkStations } from '../hooks/useWorkStations';
import WorkStationNode from './WorkStationNode';

/**
 * Vista de Organigrama (Árbol vertical)
 * Usa react-organizational-chart para visualización jerárquica
 */

const OrganizationChartView: React.FC = () => {
  const {
    workStationTree,
    loading,
    error,
    openSidebar
  } = useWorkStations();

  /**
   * Renderizar nodo del árbol recursivamente
   */
  const renderTreeNode = (workStation: WorkStationModel): JSX.Element => {
    return (
      <TreeNode
        key={workStation.id}
        label={
          <WorkStationNode
            workStation={workStation}
            onViewRequirements={(ws) => openSidebar(ws)}
            onEdit={(ws) => console.log('Edit:', ws)}
            onDelete={(ws) => console.log('Delete:', ws)}
          />
        }
      >
        {workStation.children && workStation.children.length > 0 && (
          <>
            {workStation.children.map(child => renderTreeNode(child))}
          </>
        )}
      </TreeNode>
    );
  };

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
    <Card>
      <CardBody>
        <div
          className="organization-chart-container"
          style={{
            overflowX: 'auto',
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 300px)',
            padding: '20px'
          }}
        >
          {/* Árbol organizacional vertical */}
          {workStationTree.map(root => (
            <Tree
              key={root.id}
              lineWidth="2px"
              lineColor="#e0e0e0"
              lineBorderRadius="8px"
              label={
                <WorkStationNode
                  workStation={root}
                  onViewRequirements={(ws) => openSidebar(ws)}
                  onEdit={(ws) => console.log('Edit:', ws)}
                  onDelete={(ws) => console.log('Delete:', ws)}
                />
              }
            >
              {root.children && root.children.length > 0 && (
                <>
                  {root.children.map(child => renderTreeNode(child))}
                </>
              )}
            </Tree>
          ))}
        </div>

        {/* Leyenda de niveles */}
        <div className="mt-3 pt-3 border-top">
          <div className="text-muted small mb-2">
            <i className="mdi mdi-information me-1"></i>
            Haz clic en el menú de acciones (î) para ver requisitos, editar o eliminar un puesto
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default OrganizationChartView;
