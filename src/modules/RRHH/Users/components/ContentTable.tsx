import React, { useState, useMemo } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import AzTable from '../../../../components/aziende/AzTable';
import { getUserTableColumns } from '../config/tableColumns';
import { UserModel } from '../models/UserModel';
import UserPermissionsModal from './UserPermissionsModal';
import UserRolesModal from './UserRolesModal';
import UserDetailsModal from './modals/UserDetailsModal';

interface ContentTableProps {
  filteredUsers: UserModel[];
  filters?: Record<string, string>;
  sorting?: { field: string; direction: string };
  onFilterChange?: (column: string, value: string) => void;
  onSortChange?: (config: { field: string; direction: string }) => void;
  loading: boolean;
  onRefresh: (companyId: number) => Promise<void>;
  onEdit: (userUuid: string) => void;
}

const ContentTable: React.FC<ContentTableProps> = ({
  filteredUsers,
  filters,
  sorting,
  onFilterChange,
  onSortChange,
  loading,
  onRefresh,
  onEdit,
}) => {
  const { t, i18n } = useTranslation();
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);

  // Columnas con traducciones - se regeneran cuando cambia el idioma
  const columns = useMemo(() => getUserTableColumns(t), [t, i18n.language]);

  const handleManageRoles = (userUuid: string) => {
    const user = filteredUsers.find(u => u.uuid === userUuid);
    if (user) {
      setSelectedUser(user);
      setIsRolesModalOpen(true);
    }
  };

  const handleManagePermissions = (userUuid: string) => {
    const user = filteredUsers.find(u => u.uuid === userUuid);
    if (user) {
      setSelectedUser(user);
      setIsPermissionsModalOpen(true);
    }
  };

  const handlePermissionsUpdated = () => {
    setIsPermissionsModalOpen(false);
    setSelectedUser(null);
    onRefresh(1);
  };

  const handleRolesUpdated = () => {
    setIsRolesModalOpen(false);
    setSelectedUser(null);
    onRefresh(1);
  };

  const handleDeleteUser = (userUuid: string) => {
    console.log('Eliminar usuario:', userUuid);
  };

  const handleViewUser = (userUuid: string) => {
    const user = filteredUsers.find(u => u.uuid === userUuid);
    if (user) {
      setSelectedUser(user);
      setIsDetailsModalOpen(true);
    }
  };

  return (
    <>
      <Row>
        <Col xl={12}>
          <AzTable
            data={filteredUsers}
            columns={columns}
            pagination={true}
            filters={filters}
            onFilterChange={onFilterChange}
            sorting={sorting}
            onSortChange={onSortChange}
            className="table-centered"
            loading={loading}
          >
            <AzTable.Actions>
              {/* Botón Roles */}
              <Button
                size="sm"
                color="warning"
                outline
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as UserModel;
                  handleManageRoles(rowData.uuid);
                }}
                title={t('users.roles.manageTitle')}
              >
                <i className="mdi mdi-account-group"></i>
              </Button>
              {/* Botón Permisos */}
              <Button
                size="sm"
                color="success"
                outline
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as UserModel;
                  handleManagePermissions(rowData.uuid);
                }}
                title={t('users.permissions.manageTitle')}
              >
                <i className="mdi mdi-key-variant"></i>
              </Button>
              <Button
                size="sm"
                color="info"
                outline
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as UserModel;
                  handleViewUser(rowData.uuid);
                }}
                title={t('users.actions.viewTitle')}
              >
                <i className="mdi mdi-eye"></i>
              </Button>
              <Button
                size="sm"
                color="primary"
                outline
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as UserModel;
                  onEdit(rowData.uuid);
                }}
                title={t('users.actions.editTitle')}
              >
                <i className="mdi mdi-pencil"></i>
              </Button>
              <Button
                size="sm"
                color="danger"
                outline
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as UserModel;
                  handleDeleteUser(rowData.uuid);
                }}
                title={t('users.actions.deleteTitle')}
              >
                <i className="mdi mdi-trash-can"></i>
              </Button>
            </AzTable.Actions>
          </AzTable>
        </Col>
      </Row>

      {/* Modal para gestionar permisos */}
      {selectedUser && (
        <UserPermissionsModal
          isOpen={isPermissionsModalOpen}
          toggle={() => setIsPermissionsModalOpen(false)}
          user={selectedUser}
          onSuccess={handlePermissionsUpdated}
        />
      )}

      {/* Modal para gestionar roles */}
      {selectedUser && (
        <UserRolesModal
          isOpen={isRolesModalOpen}
          toggle={() => setIsRolesModalOpen(false)}
          user={selectedUser}
          onSuccess={handleRolesUpdated}
        />
      )}

      {/* Modal para ver detalles del usuario */}
      {selectedUser && (
        <UserDetailsModal
          isOpen={isDetailsModalOpen}
          toggle={() => setIsDetailsModalOpen(false)}
          user={selectedUser}
        />
      )}
    </>
  );
};

export default ContentTable;
