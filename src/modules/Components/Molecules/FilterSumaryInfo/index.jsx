import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Badge,
  CardHeader
} from "reactstrap";
import FilterSummary from "../../../../components/aziende/FilterSummary";

// Componente UserCard para mostrar información de usuario
const UserCard = ({ user }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Activo': return 'success';
      case 'Inactivo': return 'danger';
      case 'Pendiente': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <Card className="h-100">
      <CardBody>
        <div className="d-flex align-items-center mb-3">
          <div className="avatar-sm rounded-circle bg-light d-flex align-items-center justify-content-center me-3">
            <i className="mdi mdi-account mdi-18px text-primary"></i>
          </div>
          <div>
            <h6 className="mb-1">{user.nombre}</h6>
            <p className="text-muted mb-0 small">{user.email}</p>
          </div>
        </div>

        <div className="mb-2">
          <small className="text-muted">Departamento:</small>
          <p className="mb-1 fw-medium">{user.departamento}</p>
        </div>

        <div className="mb-2">
          <small className="text-muted">Estado:</small>
          <div>
            <Badge color={getStatusColor(user.estado)} className="me-2">
              {user.estado}
            </Badge>
          </div>
        </div>

        <div className="mb-2">
          <small className="text-muted">Edad:</small>
          <p className="mb-1">{user.edad} años</p>
        </div>

        <div className="mb-0">
          <small className="text-muted">Fecha Ingreso:</small>
          <p className="mb-0">{new Date(user.fechaIngreso).toLocaleDateString('es-ES')}</p>
        </div>
      </CardBody>
    </Card>
  );
};

const FilterSumaryInfo = () => {
  // Datos de usuarios de ejemplo
  const [users] = useState([
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan@test.com",
      estado: "Activo",
      departamento: "Desarrollo",
      edad: 28,
      fechaIngreso: "2023-01-15"
    },
    {
      id: 2,
      nombre: "María García",
      email: "maria@test.com",
      estado: "Inactivo",
      departamento: "Marketing",
      edad: 32,
      fechaIngreso: "2022-03-22"
    },
    {
      id: 3,
      nombre: "Carlos López",
      email: "carlos@test.com",
      estado: "Activo",
      departamento: "Ventas",
      edad: 29,
      fechaIngreso: "2021-07-10"
    },
    {
      id: 4,
      nombre: "Ana Martínez",
      email: "ana@test.com",
      estado: "Activo",
      departamento: "Desarrollo",
      edad: 35,
      fechaIngreso: "2020-11-05"
    },
    {
      id: 5,
      nombre: "Pedro Rodríguez",
      email: "pedro@test.com",
      estado: "Pendiente",
      departamento: "Soporte",
      edad: 26,
      fechaIngreso: "2023-06-18"
    },
    {
      id: 6,
      nombre: "Laura Sánchez",
      email: "laura@test.com",
      estado: "Inactivo",
      departamento: "Recursos Humanos",
      edad: 41,
      fechaIngreso: "2019-09-30"
    },
    {
      id: 7,
      nombre: "Roberto Silva",
      email: "roberto@test.com",
      estado: "Activo",
      departamento: "Finanzas",
      edad: 30,
      fechaIngreso: "2022-08-12"
    },
    {
      id: 8,
      nombre: "Sofia Herrera",
      email: "sofia@test.com",
      estado: "Pendiente",
      departamento: "Marketing",
      edad: 27,
      fechaIngreso: "2023-03-05"
    }
  ]);

  // Definición de columnas para el FilterSummary
  const columns = [
    {
      key: "nombre",
      header: "Nombre",
      filterType: "text"
    },
    {
      key: "departamento",
      header: "Departamento",
      filterType: "select",
      filterOptions: ["Desarrollo", "Marketing", "Ventas", "Soporte", "Recursos Humanos", "Finanzas"]
    },
    {
      key: "estado",
      header: "Estado",
      filterType: "select",
      filterOptions: ["Activo", "Inactivo", "Pendiente"]
    },
    {
      key: "edad",
      header: "Edad",
      filterType: "text"
    }
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between mb-4">
                <h4 className="mb-0">FilterSummary con Lista de Cards</h4>
                <div className="page-title-right">
                  <small className="text-muted">Demostración: FilterSummary sin tabla, solo cards</small>
                </div>
              </div>
            </div>
          </div>

          {/*
            IMPLEMENTACIÓN CON FILTERSUMMARY PARA CARDS:

            Estructura: Card > FilterSummary > Lista de Cards

            1. Card: Wrapper externo (responsabilidad del desarrollador)
            2. FilterSummary: Maneja CardBody + Summary + render props + lógica de filtros
            3. Lista de Cards: Recibe datos filtrados automáticamente

            Ventajas:
            - FilterSummary gestiona automáticamente filtros y ordenamientos
            - Summary aparece/desaparece automáticamente
            - Reutilizable para cualquier tipo de vista (no solo tablas)
            - Mínima configuración: solo data y columns
          */}
          <Card>
            <CardHeader>
              <h5 className="mb-0">
                <i className="mdi mdi-filter me-2 text-primary"></i>
                Lista de Usuarios con FilterSummary
              </h5>
              <small className="text-muted">
                FilterSummary gestiona filtros y ordenamientos automáticamente. Solo pasa data y columns.
              </small>
            </CardHeader>

            <FilterSummary data={users} columns={columns}>
              {({ filteredData, hasActiveItems, filters, sorting, onFilterChange, onSortChange, onClearAll }) => (
                <>
                  {/* Controles de filtrado y ordenamiento */}
                  <div className="mb-4">
                    <Row className="g-3 align-items-end">
                      {/* Filtro por nombre */}
                      <Col lg={3} md={6}>
                        <label className="form-label small">Buscar por nombre</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Escribir nombre..."
                          value={filters.nombre || ""}
                          onChange={(e) => onFilterChange("nombre", e.target.value)}
                        />
                      </Col>

                      {/* Filtro por departamento */}
                      <Col lg={3} md={6}>
                        <label className="form-label small">Departamento</label>
                        <select
                          className="form-select form-select-sm"
                          value={filters.departamento || ""}
                          onChange={(e) => onFilterChange("departamento", e.target.value)}
                        >
                          <option value="">Todos los departamentos</option>
                          <option value="Desarrollo">Desarrollo</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Ventas">Ventas</option>
                          <option value="Soporte">Soporte</option>
                          <option value="Recursos Humanos">Recursos Humanos</option>
                          <option value="Finanzas">Finanzas</option>
                        </select>
                      </Col>

                      {/* Filtro por estado */}
                      <Col lg={2} md={6}>
                        <label className="form-label small">Estado</label>
                        <select
                          className="form-select form-select-sm"
                          value={filters.estado || ""}
                          onChange={(e) => onFilterChange("estado", e.target.value)}
                        >
                          <option value="">Todos los estados</option>
                          <option value="Activo">Activo</option>
                          <option value="Inactivo">Inactivo</option>
                          <option value="Pendiente">Pendiente</option>
                        </select>
                      </Col>

                      {/* Ordenamiento */}
                      <Col lg={3} md={6}>
                        <label className="form-label small">Ordenar por</label>
                        <select
                          className="form-select form-select-sm"
                          value={sorting.field ? `${sorting.field}-${sorting.direction}` : ""}
                          onChange={(e) => {
                            if (e.target.value) {
                              const [field, direction] = e.target.value.split('-');
                              onSortChange({ field, direction });
                            } else {
                              onSortChange({ field: "", direction: "" });
                            }
                          }}
                        >
                          <option value="">Sin ordenamiento</option>
                          <option value="nombre-asc">Nombre A-Z</option>
                          <option value="nombre-desc">Nombre Z-A</option>
                          <option value="edad-asc">Edad ↑</option>
                          <option value="edad-desc">Edad ↓</option>
                          <option value="fechaIngreso-desc">Más recientes</option>
                          <option value="fechaIngreso-asc">Más antiguos</option>
                        </select>
                      </Col>

                      {/* Botón limpiar */}
                      <Col lg={1} md={6}>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm w-100"
                          onClick={onClearAll}
                          title="Limpiar filtros y ordenamiento"
                        >
                          <i className="mdi mdi-close"></i>
                        </button>
                      </Col>
                    </Row>
                  </div>

                  {/* Contador de resultados */}
                  <div className="mb-3">
                    <h6 className="text-muted">
                      Mostrando {filteredData.length} de {users.length} usuarios
                      {hasActiveItems && <span className="text-primary"> (filtrados)</span>}
                    </h6>
                  </div>

                  {/* Lista de cards de usuarios */}
                  <Row>
                    {filteredData.map(user => (
                      <Col xl={4} lg={6} md={6} sm={12} key={user.id} className="mb-4">
                        <UserCard user={user} />
                      </Col>
                    ))}

                    {/* Mensaje cuando no hay resultados */}
                    {filteredData.length === 0 && (
                      <Col xs={12}>
                        <div className="text-center py-5">
                          <div className="avatar-lg rounded-circle bg-light mx-auto mb-4 d-flex align-items-center justify-content-center">
                            <i className="mdi mdi-account-search mdi-36px text-muted"></i>
                          </div>
                          <h5 className="mb-3">No se encontraron usuarios</h5>
                          <p className="text-muted mb-0">
                            No hay usuarios que coincidan con los criterios de búsqueda aplicados.
                          </p>
                        </div>
                      </Col>
                    )}
                  </Row>
                </>
              )}
            </FilterSummary>
          </Card>

          {/* Información de implementación */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="alert alert-info">
                <h6 className="alert-heading">
                  <i className="mdi mdi-code-tags me-2"></i>
                  Código de Implementación
                </h6>
                <pre className="mb-0 small">
{`<Card>
  <CardHeader>Título</CardHeader>
  <FilterSummary data={users} columns={columns}>
    {({ filteredData, filters, onFilterChange, onSortChange, onClearAll }) => (
      <>
        {/* Controles de filtrado */}
        <Row className="g-3 align-items-end mb-4">
          <Col lg={3}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Buscar nombre..."
              value={filters.nombre || ""}
              onChange={(e) => onFilterChange("nombre", e.target.value)}
            />
          </Col>
          <Col lg={3}>
            <select
              className="form-select form-select-sm"
              value={filters.departamento || ""}
              onChange={(e) => onFilterChange("departamento", e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Desarrollo">Desarrollo</option>
              {/* ... más opciones */}
            </select>
          </Col>
          <Col lg={1}>
            <button onClick={onClearAll} className="btn btn-outline-secondary btn-sm">
              <i className="mdi mdi-close"></i>
            </button>
          </Col>
        </Row>

        {/* Lista de cards */}
        <Row>
          {filteredData.map(user => (
            <Col xl={4} lg={6} key={user.id}>
              <UserCard user={user} />
            </Col>
          ))}
        </Row>
      </>
    )}
  </FilterSummary>
</Card>`}
                </pre>
                <hr />
                <p className="mb-0">
                  <strong>Ventajas de FilterSummary:</strong>
                </p>
                <ul className="mb-0 small">
                  <li>✅ Gestiona automáticamente estado de filtros y ordenamientos</li>
                  <li>✅ Proporciona datos filtrados a través de render props</li>
                  <li>✅ Muestra summary automático cuando hay filtros activos</li>
                  <li>✅ Funciones <code>onFilterChange</code>, <code>onSortChange</code>, <code>onClearAll</code> incluidas</li>
                  <li>✅ Reutilizable para tablas, cards, listas, cualquier vista</li>
                  <li>✅ Solo necesitas pasar <code>data</code> y <code>columns</code></li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
}

FilterSumaryInfo.propTypes = {};

export default withTranslation()(FilterSumaryInfo);