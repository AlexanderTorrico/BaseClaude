import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'reactstrap';
import AzTable from '../../../../components/aziende/AzTable';
import { userTableColumns } from '../config/tableColumns';
import { useUsers } from '../hooks/useUsers';
import { UserModel } from '../models/UserModel';
import UserRolesPermissionsModal from './UserRolesPermissionsModal';

interface ContentTableProps {
  filteredUsers: UserModel[];
  filters?: Record<string, string>;
  sorting?: { field: string; direction: string };
  onFilterChange?: (column: string, value: string) => void;
  onSortChange?: (config: { field: string; direction: string }) => void;
}

const ContentTable: React.FC<ContentTableProps> = ({
  filteredUsers,
  filters,
  sorting,
  onFilterChange,
  onSortChange
}) => {
  const { loading, fetchUsersByCompany } = useUsers();

  // Estado para modal de roles/permisos
  const [isRolesPermissionsModalOpen, setIsRolesPermissionsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);

  const handleManageRolesPermissions = (userId: number) => {
    const user = filteredUsers.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsRolesPermissionsModalOpen(true);
    }
  };

  const handleRolesPermissionsUpdated = () => {
    setIsRolesPermissionsModalOpen(false);
    setSelectedUser(null);
    fetchUsersByCompany(1, { force: true }); // Recargar datos
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
    fetchUsersByCompany(1);
  }, []);

  return (
    <>
      <Row>
        <Col xl={12}>
          <AzTable
            data={filteredUsers}
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
                color="success"
                outline
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as UserModel;
                  handleManageRolesPermissions(rowData.id);
                }}
                title="Gestionar roles y permisos"
              >
                <i className="mdi mdi-shield-account"></i>
              </Button>
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
        </Col>
      </Row>

      {/* Modal para gestionar roles y permisos */}
      {selectedUser && (
        <UserRolesPermissionsModal
          isOpen={isRolesPermissionsModalOpen}
          toggle={() => setIsRolesPermissionsModalOpen(false)}
          user={selectedUser}
          onSuccess={handleRolesPermissionsUpdated}
        />
      )}
    </>
  );
};

export default ContentTable;
