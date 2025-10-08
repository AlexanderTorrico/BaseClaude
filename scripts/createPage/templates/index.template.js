export default (moduleName) => `export default function ${moduleName}() {
  return (
    <div className="page-content">
      <h1>${moduleName} Module</h1>
      <p>TODO: Implementar componente ${moduleName}</p>
    </div>
  );
}
`;
