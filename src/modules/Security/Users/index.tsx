import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'reactstrap';
import { AzHeaderCard } from '../../../components/aziende/AzHeader';
import AzFilterSummary from '../../../components/aziende/AzFilterSummary';
import AzTable from '../../../components/aziende/AzTable';
import { mockUsers, User } from './data/mockUsers';
import { userTableColumns } from './config/tableColumns';

const Users: React.FC = () => {

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
            {({ filteredData, onFilterChange, onSortChange, filters, sorting }) => (
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
