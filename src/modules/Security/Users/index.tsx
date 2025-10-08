import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'reactstrap';
import { AzHeaderCard } from '../../../components/aziende/AzHeader';
import AzFilterSummary from '../../../components/aziende/AzFilterSummary';
import AzTable from '../../../components/aziende/AzTable';
import { mockUsers, User } from './data/mockUsers';
import { userTableColumns } from './config/tableColumns';
import { useUsers } from './hooks/useUsers';

// Tipos para el render props de AzFilterSummary
interface FilterSummaryRenderProps {
  filteredData: User[];
  originalData: User[];
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
  const { fetchUsersByCompany } = useUsers();

  const handleCreateUser = () => {
    console.log('Crear nuevo usuario');
  };

  const handleEditUser = (userId: string) => {
    console.log('Editar usuario:', userId);
  };

  const handleDeleteUser = (userId: string) => {
    console.log('Eliminar usuario:', userId);
  };

  const handleViewUser = (userId: string) => {
    console.log('Ver detalles usuario:', userId);
  };


  // Calcular estadísticas para el header
  const activeUsers = mockUsers.filter(user => user.status === 'active').length;
  const totalUsers = mockUsers.length;

  useEffect(() => {
    fetchUsersByCompany(1).then(response => {
      if (response.success) {
        console.log('Usuarios cargados desde API:', response.data);
      } else {
        console.error('Error al cargar usuarios:', response.error);
      }
    });
  }, []);

  return (
    <div className="page-content">
      <Container fluid>
        {/* Header Section */}
        <AzHeaderCard
          title="Gestión de Usuarios"
          description="Administra los usuarios del sistema, sus roles y permisos"
          showBadge={true}
          badgeColor="primary"
          badgeCount={activeUsers}
          badgeTotal={totalUsers}
          contentTopRight={
            <Button
              color="warning"
              onClick={handleCreateUser}
              className="d-flex align-items-center"
            >
              <i className="mdi mdi-plus me-1"></i>
              Nuevo Usuario
            </Button>
          }
        />

        <Row>
          <Col xl={12}>
        
            {/* Filter Summary y Table */}
            <AzFilterSummary
            data={mockUsers}
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
                        const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as User;
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
                        const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as User;
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
                        const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as User;
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
        
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Users;
