export default (moduleName) => `
import React from 'react';

const  ${moduleName} : React.FC = () => {
  return (
    <div className="page-content">
      <h1>${moduleName} Module</h1>
      <p>TODO: Implementar componente ${moduleName}</p>
    </div>
  );
}

export default ${moduleName};
`;
