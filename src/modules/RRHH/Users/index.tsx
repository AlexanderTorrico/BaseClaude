import React, { useEffect, useState, useMemo } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { useUsers } from './hooks/useUsers';
import { useUsersFetch } from './hooks/useUsersFetch';
import AzFilterSummary from '../../../components/aziende/AzFilterSummary';
import { getUserTableColumns } from './config/tableColumns';
import Header from './components/Header';
import ContentTable from './components/ContentTable';
import ContentCards from './components/ContentCards';
import { UserApiService } from './services/UserApiService';
import { UserModel } from './models/UserModel';
//import { UserMockService } from './services/UserMockService';

const userService = new UserApiService();

const Users: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentView, users } = useUsers();
  const { loading, fetchUsersByCompany, createUser, updateUserData } = useUsersFetch(userService);
  const [userToEdit, setUserToEdit] = useState<UserModel | null>(null);

  // Columnas de tabla con traducciones - se regeneran cuando cambia el idioma
  const userTableColumns = useMemo(() => getUserTableColumns(t), [t, i18n.language]);

  useEffect(() => {
    fetchUsersByCompany(1);
  }, []);

  const handleEditUser = (userUuid: string) => {
    const user = users.find(u => u.uuid === userUuid);
    if (user) {
      setUserToEdit(user);
    }
  };

  return (
    <div className="page-content" style={{ overflowX: 'clip' }}>
      <Container fluid style={{ overflowX: 'clip' }}>
        <Header
          loading={loading}
          onRefresh={fetchUsersByCompany}
          onRegisterUser={createUser}
          onUpdateUser={updateUserData}
          userToEdit={userToEdit}
          onCloseEditModal={() => setUserToEdit(null)}
        />

        <AzFilterSummary
          data={users}
          columns={userTableColumns}
          alwaysVisible={true}
          showCount="always"
          countPosition="top"
        >
          {({ filteredData, filters, sorting, onFilterChange, onSortChange }) => (
            <>
              {currentView === '0' && (
                <Row>
                  <Col xl={12}>
                    <ContentTable
                      filteredUsers={filteredData}
                      filters={filters}
                      sorting={sorting}
                      onFilterChange={onFilterChange}
                      onSortChange={onSortChange}
                      loading={loading}
                      onRefresh={fetchUsersByCompany}
                      onEdit={handleEditUser}
                    />
                  </Col>
                </Row>
              )}

              {currentView === '1' && (
                <ContentCards
                  filteredUsers={filteredData}
                  onRefresh={fetchUsersByCompany}
                  onEdit={handleEditUser}
                />
              )}
            </>
          )}
        </AzFilterSummary>
      </Container>
    </div>
  );
};

export default Users;
