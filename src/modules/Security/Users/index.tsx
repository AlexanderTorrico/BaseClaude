import React from 'react';
import { Container } from 'reactstrap';
import Header from './components/Header';
import ContentTable from './components/ContentTable';

const Users: React.FC = () => {
  return (
    <div className="page-content">
      <Container fluid>
        <Header />
        <ContentTable />
      </Container>
    </div>
  );
};

export default Users;
