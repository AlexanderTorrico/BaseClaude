export default (moduleName) => `import React from 'react';
import { Container } from 'reactstrap';

const ${moduleName}: React.FC = () => {
  return (
    <div className="page-content">
      <Container fluid style={{ overflowX: 'hidden' }}>
        <h1>${moduleName}</h1>
      </Container>
    </div>
  );
};

export default ${moduleName};
`;
