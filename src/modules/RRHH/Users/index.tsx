import React, { useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { useUsers } from './hooks/useUsers';
import { useUsersFetch } from './hooks/useUsersFetch';
import AzFilterSummary from '../../../components/aziende/AzFilterSummary';
import { userTableColumns } from './config/tableColumns';
import Header from './components/Header';
import ContentTable from './components/ContentTable';
import ContentCards from './components/ContentCards';
import { UserApiService } from './services/UserApiService';
//import { UserMockService } from './services/UserMockService';

const userService = new UserApiService();

const Users: React.FC = () => {
  const { currentView, users } = useUsers();
  const { loading, fetchUsersByCompany, registerUser } = useUsersFetch(userService);

  useEffect(() => {
    fetchUsersByCompany(1);
  }, []);

  return (
    <div className="page-content" style={{ overflowX: 'clip' }}>
      <Container fluid style={{ overflowX: 'clip' }}>
        <Header
          loading={loading}
          onRefresh={fetchUsersByCompany}
          onRegisterUser={registerUser}
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
                    />
                  </Col>
                </Row>
              )}

              {currentView === '1' && (
                <ContentCards
                  filteredUsers={filteredData}
                  onRefresh={fetchUsersByCompany}
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
