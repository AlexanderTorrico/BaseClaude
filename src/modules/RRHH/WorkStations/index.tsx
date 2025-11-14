import React, { useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import Header from './components/Header';
import OrganizationChartView from './components/OrganizationChartView';
import RequirementsSidebar from './components/RequirementsSidebar';
import { useWorkStationsFetch } from './hooks/useWorkStationsFetch';
import { WorkStationMockService } from './services/WorkStationMockService';
import './styles/organizationChart.scss';

const workStationService = new WorkStationMockService();

const WorkStations: React.FC = () => {
  const { fetchWorkStations } = useWorkStationsFetch(workStationService);

  useEffect(() => {
    fetchWorkStations();
  }, []);

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
