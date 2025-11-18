import React, { useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import Header from './components/Header';
import OrganizationChartView from './components/OrganizationChartView';
import RequirementsSidebar from './components/RequirementsSidebar';
import { useWorkStations } from './hooks/useWorkStations';
import { useWorkStationsFetch } from './hooks/useWorkStationsFetch';
import { WorkStationMockService } from './services/WorkStationMockService';
import './styles/organizationChart.scss';

const workStationService = new WorkStationMockService();

const WorkStations: React.FC = () => {
  const { workStations } = useWorkStations();
  const { fetchWorkStationsByCompany } = useWorkStationsFetch(workStationService);

  useEffect(() => {
    // Obtener puestos de trabajo de la compañía 1
    fetchWorkStationsByCompany(1);
  }, []);

  useEffect(() => {
    // Mostrar en consola cada vez que cambian los workStations
    console.log('🔄 WorkStations actualizados en Redux:', workStations);
  }, [workStations]);

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col xs="12">
              <Header />
            </Col>
          </Row>

          <Row>
            <Col xs="12">
              <OrganizationChartView />
            </Col>
          </Row>
        </Container>
      </div>

      <RequirementsSidebar />
    </>
  );
};

export default WorkStations;
