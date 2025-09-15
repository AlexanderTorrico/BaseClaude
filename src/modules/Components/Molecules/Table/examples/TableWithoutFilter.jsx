import React from "react";
import PropTypes from "prop-types";
import { Button, Card, CardBody, CardHeader } from "reactstrap";
import { AzTable, AzTableColumns } from "../../../../../components/aziende/AzTable";

/**
 * Ejemplo de tabla SIN FilterSummary (Uso Independiente)
 *
 * CÓMO USAR:
 * - Pasa solo 'data' y 'columns' a AzTable
 * - AzTable gestiona automáticamente su estado interno
 * - NO requiere gestión manual de estados
 * - NO hay summary automático de filtros
 * - Funcionamiento completamente independiente
 */
const TableWithoutFilter = ({ data, columns }) => {

  return (
    <Card>
      <CardHeader>
        <h5 className="mb-0">
          <i className="mdi mdi-table me-2 text-success"></i>
          Tabla SIN FilterSummary (Uso Independiente)
        </h5>
        <small className="text-muted">
          AzTable con estado interno automático. Sin gestión externa.
        </small>
      </CardHeader>

      <CardBody className="p-4">
        {/*
          ESTRUCTURA SIN FILTERSUMMARY: Card > CardBody > AzTable

          1. Card: Wrapper externo (responsabilidad del desarrollador)
          2. CardBody: Contenedor con padding
          3. AzTable: Solo tabla con estado interno

          AzTable gestiona automáticamente:
          - Estado interno de filtros
          - Estado interno de ordenamientos
          - Callbacks internos por defecto
          - NO hay summary automático de filtros
        */}
        <AzTable
          data={data}        // ✅ Solo datos originales
          columns={columns}  // ✅ Solo configuración de columnas
          selectedItems={[]}
          pagination={false}
          showActions={true}

          // ✅ NO se necesitan estos props - AzTable usa estado interno:
          // filters={...}       - Estado interno automático
          // sorting={...}       - Estado interno automático
          // onFilterChange={...} - Callback interno automático
          // onSortChange={...}   - Callback interno automático

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