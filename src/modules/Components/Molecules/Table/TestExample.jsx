import React, { useState, useCallback, useMemo } from "react";
import { Button, Container } from "reactstrap";

// Datos de prueba simples
const testData = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan@test.com",
    estado: "Activo",
    salario: 50000
  },
  {
    id: 2,
    nombre: "María García",
    email: "maria@test.com",
    estado: "Inactivo",
    salario: 45000
  },
  {
    id: 3,
    nombre: "Carlos López",
    email: "carlos@test.com",
    estado: "Activo",
    salario: 55000
  }
];

const TestAzTable = ({ Table, AzTableColumn }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [sorting, setSorting] = useState({ field: "", direction: "" });
  const [filters, setFilters] = useState({});

  const handleEdit = useCallback((row) => {
    alert(`Editar: ${row.nombre}`);
  }, []);

  const handleDelete = useCallback((row) => {
    alert(`Eliminar: ${row.nombre}`);
  }, []);

  const handleSort = useCallback((sortConfig) => {
    setSorting(sortConfig);
  }, []);

  const handleFilter = useCallback((column, value) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
  }, []);

  // Configuración básica de columnas
  const columns = useMemo(() => [
    {
      key: "nombre",
      header: "Nombre",
      sortable: true,
      filterable: true,
      cell: AzTableColumn.Avatar({
        nameField: "nombre",
        emailField: "email"
      })
    },
    {
      key: "estado",
      header: "Estado",
      sortable: true,
      filterable: true,
      cell: AzTableColumn.Badge({
        colorMap: {
          "Activo": "success",
          "Inactivo": "danger"
        }
      })
    },
    {
      key: "salario",
      header: "Salario",
      sortable: true,
      filterable: true,
      cell: AzTableColumn.Currency({
        locale: "es-ES",
        currency: "EUR"
      })
    }
  ], []);

  return (
    <Container fluid className="p-4">
      <h3>Prueba del Componente AzTable</h3>
      <p>Elementos seleccionados: {selectedItems.length}</p>

      <Table
        data={testData}
        columns={columns}
        selectedItems={selectedItems}
        onSelectedChange={setSelectedItems}
        pagination={true}
        sorting={sorting}
        onSortChange={handleSort}
        filters={filters}
        onFilterChange={handleFilter}
      >
        <Table.Actions>
          <Button
            color="primary"
            size="sm"
            onClick={(e) => {
              const row = JSON.parse(e.target.getAttribute('data-row'));
              handleEdit(row);
            }}
          >
            <i className="mdi mdi-pencil"></i>
          </Button>
          <Button
            color="danger"
            size="sm"
            onClick={(e) => {
              const row = JSON.parse(e.target.getAttribute('data-row'));
              handleDelete(row);
            }}
          >
            <i className="mdi mdi-delete"></i>
          </Button>
        </Table.Actions>
      </Table>

      <div className="mt-4">
        <h5>Estado actual:</h5>
        <pre>{JSON.stringify({ selectedItems, sorting, filters }, null, 2)}</pre>
      </div>
    </Container>
  );
};

export default TestAzTable;