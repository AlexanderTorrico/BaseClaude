import React from "react";
import PropTypes from "prop-types";
import { Button, Card, CardBody, CardHeader } from "reactstrap";
import { AzTable, AzTableColumns } from "../../../../../components/aziende/AzTable";
import FilterSummary from "../../../../../components/aziende/AzFilterSummary";

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

      {/*
        NUEVA ESTRUCTURA: Card > FilterSummary > AzTable

        1. Card: Wrapper externo (responsabilidad del desarrollador)
        2. FilterSummary: Maneja CardBody + Summary + render props
        3. AzTable: Solo tabla, sin Card wrapper

        FilterSummary ahora incluye internamente:
        - CardBody con padding
        - Summary de filtros (si hay filtros activos)
        - Renderizado del componente hijo
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
    </Card>
  );
};

TableWithFilter.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired
};

export default TableWithFilter;