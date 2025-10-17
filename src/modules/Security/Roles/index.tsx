import React from 'react';
import { Container } from 'reactstrap';
import Header from './components/Header';
import ContentTable from './components/ContentTable';

/**
 * Módulo principal de Gestión de Roles
 * Componente abstracto que solo renderiza submódulos
 */
const Roles: React.FC = () => {
  return (
    <div className="page-content">
      <Container fluid>
        <Header />
        <ContentTable />
      </Container>
    </div>
  );
};

export default Roles;
