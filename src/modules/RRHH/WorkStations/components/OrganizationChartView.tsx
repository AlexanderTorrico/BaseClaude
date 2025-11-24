import React, { useState } from 'react';
import { Row, Col, Spinner, Card, CardBody } from 'reactstrap';
import { UserOrgNode } from '@/modules/RRHH/shared/hooks/useSharedUsers';
import UserOrgChart from './UserOrgChart';
import UserDetailsPanel from './UserDetailsPanel';

interface OrganizationChartViewProps {
  userOrgTree: UserOrgNode[];
  loading?: boolean;
  onRefresh?: () => void;
}

const OrganizationChartView: React.FC<OrganizationChartViewProps> = ({
  userOrgTree,
  loading = false,
  onRefresh
}) => {
  const [selectedUser, setSelectedUser] = useState<UserOrgNode | null>(null);

  const handleSelectNode = (user: UserOrgNode) => {
    setSelectedUser(user);
  };

  const handleEdit = (user: UserOrgNode) => {
    console.log('Edit user:', user);
  };

  const handleViewDetails = (user: UserOrgNode) => {
    setSelectedUser(user);
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

  if (!userOrgTree || userOrgTree.length === 0) {
    return (
      <Card>
        <CardBody className="text-center py-5">
          <i className="mdi mdi-account-group-outline text-muted" style={{ fontSize: '48px' }}></i>
          <div className="mt-2 text-muted">No hay usuarios con puestos asignados</div>
          <small className="text-muted d-block mt-1">
            Asigna puestos de trabajo a los usuarios para ver el organigrama
          </small>
        </CardBody>
      </Card>
    );
  }

  return (
    <Row>
      <Col lg={4} md={5} sm={12} className="mb-3 mb-lg-0">
        <UserOrgChart
          users={userOrgTree}
          onSelectNode={handleSelectNode}
          selectedNodeId={selectedUser?.id}
          onEdit={handleEdit}
          onViewDetails={handleViewDetails}
        />
      </Col>

      <Col lg={8} md={7} sm={12}>
        <UserDetailsPanel user={selectedUser} onRefresh={onRefresh} />
      </Col>
    </Row>
  );
};

export default OrganizationChartView;
