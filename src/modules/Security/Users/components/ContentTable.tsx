import React, { useEffect } from 'react';
import { Row, Col, Button, Alert } from 'reactstrap';
import AzFilterSummary from '../../../../components/aziende/AzFilterSummary';
import AzTable from '../../../../components/aziende/AzTable';
import { userTableColumns } from '../config/tableColumns';
import { useUsers } from '../hooks/useUsers';
import { UserModel } from '../models/UserModel';

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

const ContentTable: React.FC = () => {
  const { users, loading, error, loadUsers } = useUsers();

  const handleEditUser = (userId: number) => {
    console.log('Editar usuario:', userId);
  };

  const handleDeleteUser = (userId: number) => {
    console.log('Eliminar usuario:', userId);
  };

  const handleViewUser = (userId: number) => {
    console.log('Ver detalles usuario:', userId);
  };

  const handleCreateUser = () => {
    console.log('Crear nuevo usuario');
  };

  useEffect(() => {
    loadUsers(1);
  }, []);

  return (
    <>
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
                loading={loading}
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
    </>
  );
};

export default ContentTable;
