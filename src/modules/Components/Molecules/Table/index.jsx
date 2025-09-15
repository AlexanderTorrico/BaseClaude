import PropTypes from "prop-types";
import { Button } from "reactstrap";
import { AzTable, AzTableColumns } from "../../../../components/aziende/AzTable";
import FilterSummary from "../../../../components/aziende/FilterSummary";
import TableWithFilter from "./examples/TableWithFilter";
import TableWithoutFilter from "./examples/TableWithoutFilter";

const Table = (props) => {
  // Para pruebas - usar datos de ejemplo si no se proporcionan props
  if (Object.keys(props).length === 0) {
    // Para probar el mensaje de "sin datos", descomenta la línea siguiente y comenta el array de datos
    // const testData = [];

    const testData = [
      {
        id: 1,
        nombre: "Juan Pérez",
        email: "juan@test.com",
        estado: "Activo",
        salario: 50000,
        fechaIngreso: "2023-01-15",
        departamento: "Desarrollo",
        edad: 28,
        activo: true,
        experiencia: 5.5,
        website: "https://juanperez.dev"
      },
      {
        id: 2,
        nombre: "María García",
        email: "maria@test.com",
        estado: "Inactivo",
        salario: 45000,
        fechaIngreso: "2022-03-22",
        departamento: "Marketing",
        edad: 32,
        activo: false,
        experiencia: 8.2,
        website: "https://maria-garcia.com"
      },
      {
        id: 3,
        nombre: "Carlos López",
        email: "carlos@test.com",
        estado: "Activo",
        salario: 55000,
        fechaIngreso: "2021-07-10",
        departamento: "Ventas",
        edad: 29,
        activo: true,
        experiencia: 7.0,
        website: "https://carloslopez.net"
      },
      {
        id: 4,
        nombre: "Ana Martínez",
        email: "ana@test.com",
        estado: "Activo",
        salario: 62000,
        fechaIngreso: "2020-11-05",
        departamento: "Desarrollo",
        edad: 35,
        activo: true,
        experiencia: 10.5,
        website: "https://anamartinez.io"
      },
      {
        id: 5,
        nombre: "Pedro Rodríguez",
        email: "pedro@test.com",
        estado: "Pendiente",
        salario: 48000,
        fechaIngreso: "2023-06-18",
        departamento: "Soporte",
        edad: 26,
        activo: true,
        experiencia: 3.5,
        website: "https://pedro-rodriguez.com"
      },
      {
        id: 6,
        nombre: "Laura Sánchez",
        email: "laura@test.com",
        estado: "Inactivo",
        salario: 52000,
        fechaIngreso: "2019-09-30",
        departamento: "Recursos Humanos",
        edad: 41,
        activo: false,
        experiencia: 15.2,
        website: null
      },
      {
        id: 7,
        nombre: "Miguel Torres",
        email: "miguel@test.com",
        estado: "Activo",
        salario: 58000,
        fechaIngreso: "2022-12-12",
        departamento: "Finanzas",
        edad: 33,
        activo: true,
        experiencia: 9.8,
        website: "https://migueltorres.biz"
      },
      {
        id: 8,
        nombre: "Carmen Jiménez",
        email: "carmen@test.com",
        estado: "Activo",
        salario: 46000,
        fechaIngreso: "2023-04-08",
        departamento: "Marketing",
        edad: 24,
        activo: true,
        experiencia: 2.0,
        website: "https://carmenjimenez.org"
      }
    ];

    const columns = [
      {
        key: "nombre",
        header: "Usuario",
        sortable: true,
        filterable: true,
        cell: AzTableColumns.Avatar({ nameField: "nombre", emailField: "email" })
      },
      {
        key: "departamento",
        header: "Departamento",
        sortable: true,
        filterable: true,
        cell: AzTableColumns.Text({ transform: "capitalize", className: "fw-medium" })
      },
      {
        key: "estado",
        header: "Estado",
        sortable: true,
        filterable: true,
        filterType: "select",
        filterOptions: ["Activo", "Inactivo", "Pendiente"],
        cell: AzTableColumns.Badge({
          colorMap: {
            "Activo": "success",
            "Inactivo": "danger",
            "Pendiente": "warning"
          }
        })
      },
      {
        key: "fechaIngreso",
        header: "Fecha Ingreso",
        sortable: true,
        filterable: true,
        cell: AzTableColumns.Date({ locale: "es-ES", showTime: false })
      },
      {
        key: "edad",
        header: "Edad",
        sortable: true,
        filterable: true,
        cell: AzTableColumns.Number({ suffix: " años", className: "text-muted" })
      },
      {
        key: "experiencia",
        header: "Experiencia",
        sortable: true,
        filterable: true,
        cell: AzTableColumns.Number({
          maximumFractionDigits: 1,
          suffix: " años",
          className: "text-info fw-semibold"
        })
      },
      {
        key: "salario",
        header: "Salario",
        sortable: true,
        filterable: true,
        cell: AzTableColumns.Currency({ locale: "es-ES", currency: "EUR", className:"fw-bold text-success" })
        //- fw-bold - Negrilla
        //- fw-semibold - Semi-negrilla
        //- fw-medium - Medio
        //- fw-normal - Normal
        //- fw-light - Ligero
      },
      {
        key: "activo",
        header: "Activo",
        sortable: true,
        filterable: true,
        filterType: "select",
        filterOptions: ["Sí", "No"],
        cell: AzTableColumns.Boolean({
          trueText: "Sí",
          falseText: "No",
          trueColor: "success",
          falseColor: "danger"
        })
      },
      {
        key: "website",
        header: "Website",
        sortable: false,
        filterable: true,
        cell: AzTableColumns.Link({
          target: "_blank",
          className: "text-primary text-decoration-underline"
        })
      }
    ];

    return (
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between mb-4">
                <h4 className="mb-0">Ejemplos de Implementación - AzTable</h4>
                <div className="page-title-right">
                  <small className="text-muted">Comparación: Con FilterSummary vs Sin FilterSummary</small>
                </div>
              </div>
            </div>
          </div>

          {/* Ejemplo 1: Tabla CON FilterSummary (Container Pattern) */}
          <div className="row mb-4">
            <div className="col-12">
              <TableWithFilter data={testData} columns={columns} />
            </div>
          </div>

          {/* Ejemplo 2: Tabla SIN FilterSummary (Gestión Manual) */}
          <div className="row mb-4">
            <div className="col-12">
              <TableWithoutFilter data={testData} columns={columns} />
            </div>
          </div>

          {/* Información adicional */}
          <div className="row">
            <div className="col-12">
              <div className="alert alert-info">
                <h6 className="alert-heading">
                  <i className="mdi mdi-information me-2"></i>
                  Diferencias Clave
                </h6>
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-primary">✅ CON FilterSummary</h6>
                    <ul className="mb-0">
                      <li>Gestión automática de estado</li>
                      <li>Summary de filtros automático</li>
                      <li>Container pattern (render props)</li>
                      <li>Menos código en implementación</li>
                      <li>Reutilizable con cualquier vista</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-success">✅ SIN FilterSummary</h6>
                    <ul className="mb-0">
                      <li>Control total del estado</li>
                      <li>Más flexibilidad para casos específicos</li>
                      <li>Implementación directa</li>
                      <li>Componente independiente</li>
                      <li>Sin dependencias adicionales</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Componente real - Mantener compatibilidad con uso directo de AzTable
  return <AzTable {...props} />;
};

Table.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  selectedItems: PropTypes.array,
  onSelectedChange: PropTypes.func,
  pagination: PropTypes.bool,
  sorting: PropTypes.object,
  onSortChange: PropTypes.func,
  filters: PropTypes.object,
  onFilterChange: PropTypes.func,
  className: PropTypes.string,
  tableProps: PropTypes.object,
  children: PropTypes.node,
  showActions: PropTypes.bool,
  components: PropTypes.node
};

// Asignar subcomponentes para compatibilidad
Table.Actions = AzTable.Actions;
Table.Column = AzTableColumns;

export default Table;