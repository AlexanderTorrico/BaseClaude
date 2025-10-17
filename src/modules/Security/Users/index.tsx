import React from 'react';
import { Container, Row, Col, Alert } from 'reactstrap';
import { useUsers } from './hooks/useUsers';
import AzFilterSummary from '../../../components/aziende/AzFilterSummary';
import { userTableColumns } from './config/tableColumns';
import Header from './components/Header';
import ContentTable from './components/ContentTable';
import ContentCards from './components/ContentCards';

const Users: React.FC = () => {
  const { currentView, users, error } = useUsers();

  return (
    <div className="page-content">
      <Container fluid>
        <Header />

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
