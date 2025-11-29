import React from 'react';
import { Container } from 'reactstrap';

const Reservations: React.FC = () => {
  return (
    <div className="page-content">
      <Container fluid style={{ overflowX: 'hidden' }}>
        <h1>Reservations</h1>
      </Container>
    </div>
  );
};

export default Reservations;
