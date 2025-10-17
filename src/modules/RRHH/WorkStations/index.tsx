import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { useWorkStations } from './hooks/useWorkStations';
import Header from './components/Header';
import OrganizationChartView from './components/OrganizationChartView';
import WorkStationListView from './components/WorkStationListView';
import WorkStationTableView from './components/WorkStationTableView';
import RequirementsSidebar from './components/RequirementsSidebar';
import './styles/organizationChart.scss';

/**
 * Página principal del módulo de WorkStations (Puestos de Trabajo)
 *
 * Vistas disponibles:
 * - '0': Organigrama (árbol vertical jerárquico)
 * - '1': Lista jerárquica (agrupada por niveles)
 * - '2': Tabla (con filtros y ordenamiento)
 *
 * Características:
 * - Filtro por nivel
 * - Sidebar lateral para gestionar requisitos
 * - Visualización jerárquica de dependencias
 * - Responsive design
 */

const WorkStations: React.FC = () => {
  const { currentView } = useWorkStations();

  return (
    <>
      {/* Header con filtros y view switcher */}
      <Header />

      {/* Contenido principal */}
      <Container fluid>
        <Row>
          <Col xs="12">
            {/* Renderizado condicional según vista activa */}
            {currentView === '0' && <OrganizationChartView />}
            {currentView === '1' && <WorkStationListView />}
            {currentView === '2' && <WorkStationTableView />}
          </Col>
        </Row>
      </Container>

      {/* Sidebar lateral para requisitos */}
      <RequirementsSidebar />
    </>
  );
};

export default WorkStations;
