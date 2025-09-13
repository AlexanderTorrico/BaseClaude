import React, { useState } from "react";
import { Button } from "reactstrap";
import { AzTable, AzTableColumn } from "./";

// Datos de ejemplo
const sampleData = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan@example.com",
    rol: "Admin",
    departamento: "IT",
    estado: "Activo",
    telefono: "123-456-789",
    salario: 45000,
    fechaIngreso: "2023-01-15",
    activo: true
  },
  {
    id: 2,
    nombre: "María García",
    email: "maria@example.com",
    rol: "Usuario",
    departamento: "Marketing",
    estado: "Inactivo",
    telefono: "987-654-321",
    salario: 35000,
    fechaIngreso: "2023-03-20",
    activo: false
  },
  {
    id: 3,
    nombre: "Carlos López",
    email: "carlos@example.com",
    rol: "Usuario",
    departamento: "Ventas",
    estado: "Activo",
    telefono: "456-789-123",
    salario: 38000,
    fechaIngreso: "2023-02-10",
    activo: true
  }
];

const AzTableExample = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [sorting, setSorting] = useState({ field: "", direction: "" });
  const [filters, setFilters] = useState({});

  const handleEdit = (row) => {
    console.log("Editar:", row);
  };

  const handleDelete = (row) => {
    console.log("Eliminar:", row);
  };

  const handleSort = (sortConfig) => {
    setSorting(sortConfig);
    console.log("Ordenar por:", sortConfig);
  };

  const handleFilter = (column, value) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
    console.log("Filtrar:", column, value);
  };

  // Configuración de columnas
  const columns = [
    {
      key: "nombre",
      header: "Usuario",
      sortable: true,
      filterable: true,
      cell: AzTableColumn.Avatar({
        nameField: "nombre",
        emailField: "email"
      })
    },
    {
      key: "rol",
      header: "Rol",
      sortable: true,
      filterable: true
    },
    {
      key: "departamento",
      header: "Departamento",
      sortable: true,
      filterable: true
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
    },
    {
      key: "fechaIngreso",
      header: "Fecha Ingreso",
      sortable: true,
      cell: AzTableColumn.Date({
        locale: "es-ES"
      })
    },
    {
      key: "activo",
      header: "Activo",
      cell: AzTableColumn.Boolean()
    }
  ];

  return (
    <div>
      <h4>Ejemplo de AzTable</h4>
      <p>Elementos seleccionados: {selectedItems.length}</p>

      <AzTable
        data={sampleData}
        columns={columns}
        selectedItems={selectedItems}
        onSelectedChange={setSelectedItems}
        pagination={true}
        sorting={sorting}
        onSortChange={handleSort}
        filters={filters}
        onFilterChange={handleFilter}
      >
        <AzTable.Actions>
          <Button
            color="primary"
            size="sm"
            onClick={(e) => {
              const row = e.target.getAttribute('data-row');
              if (row) handleEdit(JSON.parse(row));
            }}
          >
            <i className="mdi mdi-pencil"></i>
          </Button>
          <Button
            color="danger"
            size="sm"
            onClick={(e) => {
              const row = e.target.getAttribute('data-row');
              if (row) handleDelete(JSON.parse(row));
            }}
          >
            <i className="mdi mdi-delete"></i>
          </Button>
        </AzTable.Actions>
      </AzTable>
    </div>
  );
};

export default AzTableExample;