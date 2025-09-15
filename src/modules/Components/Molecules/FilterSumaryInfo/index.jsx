import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, Badge, CardHeader } from "reactstrap";
import FilterSummary from "../../../../components/aziende/AzFilterSummary";

const UserCard = ({ user }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Activo': 'success',
      'Inactivo': 'danger',
      'Pendiente': 'warning'
    };
    return colors[status] || 'secondary';
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
          <Badge color={getStatusColor(user.estado)}>{user.estado}</Badge>
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

  const columns = [
    { key: "nombre", header: "Nombre", filterType: "text" },
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
    { key: "edad", header: "Edad", filterType: "text" }
  ];

  return (
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
                <div className="mb-4">
                  <Row className="g-3 align-items-end">
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

                    <Col lg={3} md={6}>
                      <label className="form-label small">Departamento</label>
                      <select
                        className="form-select form-select-sm"
                        value={filters.departamento || ""}
                        onChange={(e) => onFilterChange("departamento", e.target.value)}
                      >
                        <option value="">Todos los departamentos</option>
                        {columns.find(c => c.key === 'departamento')?.filterOptions?.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </Col>

                    <Col lg={2} md={6}>
                      <label className="form-label small">Estado</label>
                      <select
                        className="form-select form-select-sm"
                        value={filters.estado || ""}
                        onChange={(e) => onFilterChange("estado", e.target.value)}
                      >
                        <option value="">Todos los estados</option>
                        {columns.find(c => c.key === 'estado')?.filterOptions?.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </Col>

                    <Col lg={2} md={4}>
                      <label className="form-label small">Ordenar por</label>
                      <select
                        className="form-select form-select-sm"
                        value={sorting.field || ""}
                        onChange={(e) => onSortChange({ field: e.target.value, direction: sorting.direction || "asc" })}
                      >
                        <option value="">Sin orden</option>
                        <option value="nombre">Nombre</option>
                        <option value="edad">Edad</option>
                        <option value="fechaIngreso">Fecha Ingreso</option>
                      </select>
                    </Col>

                    <Col lg={2} md={2}>
                      <label className="form-label small">Dirección</label>
                      <div className="btn-group w-100" role="group">
                        <button
                          type="button"
                          className={`btn btn-sm ${sorting.direction === 'asc' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => onSortChange({ field: sorting.field || "", direction: "asc" })}
                          disabled={!sorting.field}
                        >
                          <i className="mdi mdi-arrow-up"></i>
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${sorting.direction === 'desc' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => onSortChange({ field: sorting.field || "", direction: "desc" })}
                          disabled={!sorting.field}
                        >
                          <i className="mdi mdi-arrow-down"></i>
                        </button>
                      </div>
                    </Col>

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

                <div className="mb-3">
                  <h6 className="text-muted">
                    Mostrando {filteredData.length} de {users.length} usuarios
                    {hasActiveItems && <span className="text-primary"> (filtrados)</span>}
                  </h6>
                </div>

                <Row>
                  {filteredData.map(user => (
                    <Col xl={4} lg={6} md={6} sm={12} key={user.id} className="mb-4">
                      <UserCard user={user} />
                    </Col>
                  ))}

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

      </Container>
    </div>
  );
}

export default FilterSumaryInfo;