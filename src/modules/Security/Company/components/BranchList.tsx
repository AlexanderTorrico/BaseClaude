import React from 'react';
import { Row, Col, Card, CardBody, Button, Badge } from 'reactstrap';
import AzTable from '@/components/aziende/AzTable';
import { branchTableColumns } from '../config/tableBranchColumns';
import { BranchModel } from '../models/CompanyModel';

interface BranchListProps {
  branches: BranchModel[];
  currentView: string; // '0' = tabla, '1' = cards
  onEdit: (branchId: number) => void;
  onDelete: (branchId: number) => void;
  loading?: boolean;
}

/**
 * Card individual de sucursal
 */
const BranchCard: React.FC<{
  branch: BranchModel;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ branch, onEdit, onDelete }) => {
  const hasCoordinates = branch.lat !== null && branch.lng !== null;

  return (
    <Card className="border shadow-sm h-100">
      <CardBody>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <h6 className="mb-1">
              <i className="mdi mdi-map-marker text-danger me-2"></i>
              {branch.name}
            </h6>
            {hasCoordinates ? (
              <Badge color="info" pill className="font-size-11">
                <i className="mdi mdi-map-marker-check me-1"></i>
                Ubicación definida
              </Badge>
            ) : (
              <Badge color="light" className="text-muted font-size-11">
                Sin ubicación
              </Badge>
            )}
          </div>
        </div>

        <div className="text-muted" style={{ fontSize: '0.875rem' }}>
          <p className="mb-2">
            <i className="mdi mdi-phone me-2"></i>
            {branch.phone}
          </p>

          {branch.email && (
            <p className="mb-2">
              <i className="mdi mdi-email me-2"></i>
              {branch.email}
            </p>
          )}

          <p className="mb-2">
            <i className="mdi mdi-map-marker-outline me-2"></i>
            {branch.address}
          </p>

          {hasCoordinates && (
            <p className="mb-0 text-info" style={{ fontSize: '0.75rem' }}>
              <i className="mdi mdi-crosshairs-gps me-1"></i>
              {branch.lat!.toFixed(4)}, {branch.lng!.toFixed(4)}
            </p>
          )}
        </div>

        <div className="d-flex gap-2 justify-content-end mt-3 pt-3 border-top">
          <Button color="primary" size="sm" outline onClick={onEdit}>
            <i className="mdi mdi-pencil"></i>
          </Button>
          <Button color="danger" size="sm" outline onClick={onDelete}>
            <i className="mdi mdi-trash-can"></i>
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

/**
 * Componente Lista de Sucursales (Tabla o Cards)
 */
const BranchList: React.FC<BranchListProps> = ({
  branches,
  currentView,
  onEdit,
  onDelete,
  loading = false,
}) => {
  if (branches.length === 0) {
    return (
      <div className="text-center text-muted p-5 border rounded bg-light">
        <i className="mdi mdi-map-marker-off" style={{ fontSize: '3rem' }}></i>
        <p className="mt-3 mb-0">
          No hay sucursales registradas
        </p>
        <p style={{ fontSize: '0.875rem' }}>
          Agrega tu primera sucursal usando el botón "Agregar Sucursal"
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Vista Tabla */}
      {currentView === '0' && (
        <AzTable
          data={branches}
          columns={branchTableColumns}
          pagination={true}
          loading={loading}
          className="table-centered"
        >
          <AzTable.Actions>
            {({ row }) => (
              <>
                <Button
                  size="sm"
                  color="primary"
                  outline
                  title="Editar"
                  onClick={() => onEdit(row.original.id)}
                >
                  <i className="mdi mdi-pencil"></i>
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  outline
                  title="Eliminar"
                  onClick={() => onDelete(row.original.id)}
                >
                  <i className="mdi mdi-trash-can"></i>
                </Button>
              </>
            )}
          </AzTable.Actions>
        </AzTable>
      )}

      {/* Vista Cards */}
      {currentView === '1' && (
        <Row>
          {branches.map(branch => (
            <Col key={branch.id} xs={12} sm={6} lg={4} xl={3} className="mb-4">
              <BranchCard
                branch={branch}
                onEdit={() => onEdit(branch.id)}
                onDelete={() => onDelete(branch.id)}
              />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default BranchList;
