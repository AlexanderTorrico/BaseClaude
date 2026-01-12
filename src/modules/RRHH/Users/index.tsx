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
const MOBILE_BREAKPOINT = 768;

const Users: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentView, users } = useUsers();
  const { loading, fetchUsersByCompany, createUser, updateUserData } = useUsersFetch(userService);
  const [userToEdit, setUserToEdit] = useState<UserModel | null>(null);

  // Detectar si estamos en móvil
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  // Columnas de tabla con traducciones - se regeneran cuando cambia el idioma
  const userTableColumns = useMemo(() => getUserTableColumns(t), [t, i18n.language]);

  // Detectar cambios en el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchUsersByCompany(1);
  }, []);

  // En móvil siempre mostrar cards ('1'), en desktop respetar selección del usuario
  const effectiveView = isMobile ? '1' : currentView;

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
              {effectiveView === '0' && (
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

              {effectiveView === '1' && (
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
