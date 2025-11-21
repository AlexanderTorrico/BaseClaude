import React, { useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import Header from './components/Header';
import OrganizationChartView from './components/OrganizationChartView';
import RequirementsSidebar from './components/RequirementsSidebar';
import { useWorkStations } from './hooks/useWorkStations';
import { useWorkStationsFetch } from './hooks/useWorkStationsFetch';
import { WorkStationApiService } from './services/WorkStationApiService';
import { useSharedUsers } from '@/modules/RRHH/shared/hooks/useSharedUsers';
import { useSharedUsersFetch } from '@/modules/RRHH/shared/hooks/useSharedUsersFetch';
import { UserApiService } from '@/modules/RRHH/Users/services/UserApiService';
import './styles/organizationChart.scss';

const workStationService = new WorkStationApiService();
const userService = new UserApiService();

const WorkStations: React.FC = () => {
  const { workStations } = useWorkStations();
  const { fetchWorkStationsByCompany } = useWorkStationsFetch(workStationService);
  const { userOrgTree, usersWithWorkStation } = useSharedUsers();
  const { fetchUsers } = useSharedUsersFetch(userService);

  useEffect(() => {
    fetchWorkStationsByCompany(1);
    fetchUsers(1);
  }, []);

  useEffect(() => {
    console.log('🔄 WorkStations actualizados en Redux:', workStations);
  }, [workStations]);

  useEffect(() => {
    console.log('👥 Usuarios con WorkStation:', usersWithWorkStation);
    console.log('🌳 Árbol de organigrama (usuarios):', userOrgTree);
  }, [usersWithWorkStation, userOrgTree]);

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
              <OrganizationChartView userOrgTree={userOrgTree} />
            </Col>
          </Row>
        </Container>
      </div>

      <RequirementsSidebar />
    </>
  );
};

export default WorkStations;
