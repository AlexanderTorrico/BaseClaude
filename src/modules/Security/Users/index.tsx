import React, { useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { useUsers } from './hooks/useUsers';
import AzFilterSummary from '../../../components/aziende/AzFilterSummary';
import { userTableColumns } from './config/tableColumns';
import Header from './components/Header';
import ContentTable from './components/ContentTable';
import ContentCards from './components/ContentCards';
import { UserMockService } from './services/UserMockService';
import { UserApiService } from './services/UserApiService';

const Users: React.FC = () => {
  const userService = new UserApiService();
  const { currentView, users, fetchUsersByCompany } = useUsers(userService);

  useEffect(() => {
    fetchUsersByCompany(1);
  }, []);

  return (
    <div className="page-content" style={{ overflowX: 'clip' }}>
      <style>{`
        /* Eliminar scroll del wrapper externo de AzTable */
        .az-table-container.table-responsive {
          overflow-x: visible !important;
        }
        /* Mantener scroll solo en el div interno de la tabla */
        .az-table-container .table-responsive {
          overflow-x: auto !important;
        }
      `}</style>
      <Container fluid style={{ overflowX: 'clip' }}>
        <Header />

        {/* Filter Summary envolviendo ambas vistas */}
        <AzFilterSummary
          data={users}
          columns={userTableColumns}
          alwaysVisible={true}
          showCount="always"
          countPosition="top"
        >
          {({ filteredData, filters, sorting, onFilterChange, onSortChange }) => (
            <>
              {/* Vista Tabla */}
              {currentView === '0' && (
                <Row>
                  <Col xl={12}>
                    <ContentTable
                      filteredUsers={filteredData}
                      filters={filters}
                      sorting={sorting}
                      onFilterChange={onFilterChange}
                      onSortChange={onSortChange}
                    />
                  </Col>
                </Row>
              )}

              {/* Vista Cards */}
              {currentView === '1' && (
                <ContentCards filteredUsers={filteredData} />
              )}
            </>
          )}
        </AzFilterSummary>
      </Container>
    </div>
  );
};

export default Users;
