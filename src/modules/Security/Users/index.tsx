import React, { useEffect } from 'react';
import { Container, Row, Col, Button, Spinner, Alert } from 'reactstrap';
import { AzHeaderCard } from '../../../components/aziende/AzHeader';
import AzFilterSummary from '../../../components/aziende/AzFilterSummary';
import AzTable from '../../../components/aziende/AzTable';
import { userTableColumns } from './config/tableColumns';
import { useUsers } from './hooks/useUsers';
import { UserModel } from './models/UserModel';

// Tipos para el render props de AzFilterSummary
interface FilterSummaryRenderProps {
  filteredData: UserModel[];
  originalData: UserModel[];
  filters: Record<string, string>;
  sorting: { field: string; direction: string };
  onFilterChange: (filterKey: string, value: string) => void;
  onSortChange: (sortConfig: { field: string; direction: string }) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
  hasActiveSorting: boolean;
  hasActiveItems: boolean;
  columns: any[];
}

const Users: React.FC = () => {
  const { users, loading, error, fetchUsersByCompany, getTotalUsers } = useUsers();

  const handleCreateUser = () => {
    console.log('Crear nuevo usuario');
  };

  const handleEditUser = (userId: number) => {
    console.log('Editar usuario:', userId);
  };

  const handleDeleteUser = (userId: number) => {
    console.log('Eliminar usuario:', userId);
  };

  const handleViewUser = (userId: number) => {
    console.log('Ver detalles usuario:', userId);
  };

  useEffect(() => {
    fetchUsersByCompany(1).then(response => {
      if (response.success) {
        console.log('✅ Usuarios cargados desde API:', response.data);
      } else {
        console.error('❌ Error al cargar usuarios:', response.error);
      }
    });
  }, []);

  // Loading state
  if (loading && users.length === 0) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
            <Spinner color="primary" />
            <span className="ms-2">Cargando usuarios...</span>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        {/* Header Section */}
        <AzHeaderCard
          title="Gestión de Usuarios"
          description="Administra los usuarios del sistema"
          showBadge={true}
          badgeColor="primary"
          badgeCount={getTotalUsers()}
          badgeTotal={getTotalUsers()}
          contentTopRight={
            <Button
              color="warning"
              onClick={handleCreateUser}
              className="d-flex align-items-center"
              disabled={loading}
            >
              <i className="mdi mdi-plus me-1"></i>
              Nuevo Usuario
            </Button>
          }
        />

        {/* Error Alert */}
        {error && (
          <Row className="mb-3">
            <Col>
              <Alert color="danger" className="d-flex align-items-center">
                <i className="mdi mdi-alert-circle-outline me-2"></i>
                <div>
                  <strong>Error:</strong> {error}
                </div>
              </Alert>
            </Col>
          </Row>
        )}

        <Row>
          <Col xl={12}>
            {/* Filter Summary y Table */}
            <AzFilterSummary
              data={users}
              columns={userTableColumns}
              alwaysVisible={true}
              showCount="always"
              countPosition="top"
            >
              {({ filteredData, onFilterChange, onSortChange, filters, sorting }: FilterSummaryRenderProps) => (
                <AzTable
                  data={filteredData}
                  columns={userTableColumns}
                  pagination={true}
                  filters={filters}
                  onFilterChange={onFilterChange}
                  sorting={sorting}
                  onSortChange={onSortChange}
                  className="table-centered"
                >
                  <AzTable.Actions>
                    <Button
                      size="sm"
                      color="info"
                      outline
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as UserModel;
                        handleViewUser(rowData.id);
                      }}
                      title="Ver detalles"
                    >
                      <i className="mdi mdi-eye"></i>
                    </Button>
                    <Button
                      size="sm"
                      color="primary"
                      outline
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as UserModel;
                        handleEditUser(rowData.id);
                      }}
                      title="Editar usuario"
                    >
                      <i className="mdi mdi-pencil"></i>
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      outline
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as UserModel;
                        handleDeleteUser(rowData.id);
                      }}
                      title="Eliminar usuario"
                    >
                      <i className="mdi mdi-trash-can"></i>
                    </Button>
                  </AzTable.Actions>
                </AzTable>
              )}
            </AzFilterSummary>

            {/* Empty State */}
            {!loading && users.length === 0 && (
              <div className="text-center py-5">
                <i className="mdi mdi-account-off-outline display-4 text-muted"></i>
                <h5 className="mt-3">No hay usuarios disponibles</h5>
                <p className="text-muted">
                  Agrega tu primer usuario para comenzar
                </p>
                <Button color="primary" onClick={handleCreateUser}>
                  <i className="mdi mdi-plus me-1"></i>
                  Crear Usuario
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Users;
