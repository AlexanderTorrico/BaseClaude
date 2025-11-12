import React from 'react';
import { Card, CardBody, Row, Col, Badge, Button } from 'reactstrap';

interface BranchesHeaderProps {
  totalBranches: number;
  activeBranches: number;
  onRefresh: () => void;
  onAddNew: () => void;
}

const BranchesHeader: React.FC<BranchesHeaderProps> = ({
  totalBranches,
  activeBranches,
  onRefresh,
  onAddNew,
}) => {
  return (
    <Card className="mb-3">
      <CardBody>
        <Row className="align-items-center">
          <Col xs={12} md={6} className="mb-3 mb-md-0">
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div
                  className="avatar-md bg-soft-warning rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '56px', height: '56px' }}
                >
                  <i className="mdi mdi-store font-size-24 text-warning"></i>
                </div>
              </div>
              <div className="flex-grow-1">
                <h4 className="mb-1">
                  Sucursales
                  <Badge color="warning" pill className="ms-2">
                    {totalBranches}
                  </Badge>
                </h4>
                <p className="text-muted mb-0">
                  <i className="mdi mdi-check-circle text-success me-1"></i>
                  <span className="fw-medium">{activeBranches}</span> activas
                  <span className="mx-2">•</span>
                  <i className="mdi mdi-close-circle text-danger me-1"></i>
                  <span className="fw-medium">{totalBranches - activeBranches}</span> inactivas
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} md={6}>
            <div className="d-flex gap-2 justify-content-md-end">
              <Button color="light" onClick={onRefresh}>
                <i className="mdi mdi-refresh me-1"></i>
                Actualizar
              </Button>
              <Button color="warning" onClick={onAddNew}>
                <i className="mdi mdi-plus me-1"></i>
                Nueva Sucursal
              </Button>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default BranchesHeader;
