import React from "react";
import PropTypes from "prop-types";
import { Button, Card, CardBody, CardHeader } from "reactstrap";
import { AzTable, AzTableColumns } from "../../../../../components/aziende/AzTable";
import FilterSummary from "../../../../../components/aziende/FilterSummary";

/**
 * Ejemplo de tabla CON FilterSummary
 *
 * CÓMO USAR:
 * - Pasa solo 'data' y 'columns' a FilterSummary
 * - FilterSummary gestiona automáticamente filtros y ordenamientos
 * - Usa render props para pasar datos filtrados a AzTable
 * - El summary de filtros aparece/desaparece automáticamente
 */
const TableWithFilter = ({ data, columns }) => {
  return (
    <Card>
      <CardHeader>
        <h5 className="mb-0">
          <i className="mdi mdi-filter me-2 text-primary"></i>
          Tabla CON FilterSummary (Container Pattern)
        </h5>
        <small className="text-muted">
          FilterSummary gestiona todo el estado. Solo pasa data y columns.
        </small>
      </CardHeader>
      <CardBody className="p-0">
        {/*
          IMPLEMENTACIÓN CON FILTERSUMMARY:

          1. FilterSummary recibe:
             - data: Array de datos originales
             - columns: Configuración de columnas

          2. FilterSummary proporciona via render props:
             - filteredData: Datos ya filtrados y ordenados
             - filters: Estado actual de filtros
             - sorting: Estado actual de ordenamiento
             - onFilterChange: Función para cambiar filtros
             - onSortChange: Función para cambiar ordenamiento
             - onClearAll: Función para limpiar todo

          3. El summary aparece automáticamente cuando hay filtros activos
        */}
        <FilterSummary data={data} columns={columns}>
          {({ filteredData, filters, sorting, onFilterChange, onSortChange }) => (
            <AzTable
              data={filteredData}  // ✅ Datos ya filtrados
              columns={columns}
              selectedItems={[]}
              pagination={false}
              showActions={true}

              // Estados controlados por FilterSummary
              filters={filters}
              sorting={sorting}
              onFilterChange={onFilterChange}
              onSortChange={onSortChange}

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
          )}
        </FilterSummary>
      </CardBody>
    </Card>
  );
};

TableWithFilter.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired
};

export default TableWithFilter;