import React from "react";
import { Container, Card, CardBody } from "reactstrap";

const SimpleTest = () => {
  return (
    <Container fluid className="p-4">
      <Card>
        <CardBody>
          <h3>🔥 Componente AzTable funcionando!</h3>
          <p>Si ves esto, el componente se está renderizando correctamente.</p>
        </CardBody>
      </Card>
    </Container>
  );
};

export default SimpleTest;