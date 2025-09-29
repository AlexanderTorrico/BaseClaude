import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'reactstrap';
import { AzHeaderCard } from '../../../components/aziende/AzHeader';
import AzFilterSummary from '../../../components/aziende/AzFilterSummary';
import AzTable from '../../../components/aziende/AzTable';
import { mockUsers, User } from './data/mockUsers';
import { userTableColumns } from './config/tableColumns';

const Users: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

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

  const handleBulkDelete = () => {
    if (selectedUsers.length > 0) {
      console.log('Eliminar usuarios seleccionados:', selectedUsers);
      setSelectedUsers([]);
    }
  };

  const handleBulkActivate = () => {
    if (selectedUsers.length > 0) {
      console.log('Activar usuarios seleccionados:', selectedUsers);
      setSelectedUsers([]);
    }
  };

  const handleBulkDeactivate = () => {
    if (selectedUsers.length > 0) {
      console.log('Desactivar usuarios seleccionados:', selectedUsers);
      setSelectedUsers([]);
    }
  };

  // Calcular estadísticas para el header
  const activeUsers = mockUsers.filter(user => user.estado).length;
  const totalUsers = mockUsers.length;

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
          showBottomRow={selectedUsers.length > 0}
          contentTopRight={
            <Button
              color="primary"
              onClick={handleCreateUser}
              className="d-flex align-items-center"
            >
              <i className="mdi mdi-plus me-1"></i>
              Nuevo Usuario
            </Button>
          }
          bottomLeftSlot={
            selectedUsers.length > 0 && (
              <div className="d-flex align-items-center">
                <i className="mdi mdi-information-outline text-info me-2"></i>
                <span className="text-muted">
                  {selectedUsers.length} usuario{selectedUsers.length !== 1 ? 's' : ''} seleccionado{selectedUsers.length !== 1 ? 's' : ''}
                </span>
              </div>
            )
          }
          bottomRightSlot={
            selectedUsers.length > 0 && (
              <>
                <Button
                  color="success"
                  size="sm"
                  onClick={handleBulkActivate}
                  className="d-flex align-items-center"
                >
                  <i className="mdi mdi-check-circle me-1"></i>
                  Activar
                </Button>
                <Button
                  color="warning"
                  size="sm"
                  onClick={handleBulkDeactivate}
                  className="d-flex align-items-center"
                >
                  <i className="mdi mdi-pause-circle me-1"></i>
                  Desactivar
                </Button>
                <Button
                  color="danger"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="d-flex align-items-center"
                >
                  <i className="mdi mdi-delete me-1"></i>
                  Eliminar
                </Button>
              </>
            )
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
            {({ filteredData, onFilterChange, onSortChange, filters, sorting }) => (
                <AzTable
                data={filteredData}
                columns={userTableColumns}
                selectedItems={selectedUsers}
                onSelectedChange={setSelectedUsers}
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
                    onClick={(e) => {
                        const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}');
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
                    onClick={(e) => {
                        const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}');
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
                    onClick={(e) => {
                        const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}');
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
