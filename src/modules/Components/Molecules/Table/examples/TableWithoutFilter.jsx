import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Button, Card, CardBody, CardHeader } from "reactstrap";
import { AzTable, AzTableColumns } from "../../../../../components/aziende/AzTable";

/**
 * Ejemplo de tabla SIN FilterSummary
 *
 * CÓMO USAR:
 * - Gestiona manualmente los estados de filtros y ordenamientos
 * - Pasa callbacks para manejar cambios
 * - AzTable funciona de forma independiente
 * - NO hay summary automático de filtros
 */
const TableWithoutFilter = ({ data, columns }) => {
  // Estados manuales para filtros y ordenamientos
  const [filters, setFilters] = useState({});
  const [sorting, setSorting] = useState({ field: "", direction: "" });

  // Función manual para manejar cambios en filtros
  const handleFilterChange = useCallback((column, value) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
  }, []);

  // Función manual para manejar cambios en ordenamiento
  const handleSortChange = useCallback((sortConfig) => {
    setSorting(sortConfig);
  }, []);

  return (
    <Card>
      <CardHeader>
        <h5 className="mb-0">
          <i className="mdi mdi-table me-2 text-success"></i>
          Tabla SIN FilterSummary (Gestión Manual)
        </h5>
        <small className="text-muted">
          Gestión manual de estados. AzTable funciona independiente.
        </small>
      </CardHeader>
      <CardBody className="p-0">
        {/*
          IMPLEMENTACIÓN SIN FILTERSUMMARY:

          1. Estados gestionados manualmente:
             - filters: useState para filtros
             - sorting: useState para ordenamiento

          2. Callbacks manuales:
             - handleFilterChange: Actualiza estado de filtros
             - handleSortChange: Actualiza estado de ordenamiento

          3. AzTable recibe:
             - data: Datos originales (sin filtrar)
             - filters: Estado actual de filtros
             - sorting: Estado actual de ordenamiento
             - callbacks para manejar cambios

          4. AzTable aplica internamente filtros y ordenamientos
          5. NO hay summary automático de filtros
        */}
        <AzTable
          data={data}  // ✅ Datos originales (AzTable los filtra internamente)
          columns={columns}
          selectedItems={[]}
          pagination={false}
          showActions={true}

          // Estados gestionados manualmente
          filters={filters}
          sorting={sorting}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}

          components={
            <>
              <Button
                color="primary"
                size="sm"
                onClick={() => console.log("Edit")}
                title="Editar"
              >
                <i className="mdi mdi-pencil"></i>
              </Button>
              <Button
                color="danger"
                size="sm"
                onClick={() => console.log("Delete")}
                title="Eliminar"
              >
                <i className="mdi mdi-delete"></i>
              </Button>
            </>
          }
        />
      </CardBody>
    </Card>
  );
};

TableWithoutFilter.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired
};

export default TableWithoutFilter;