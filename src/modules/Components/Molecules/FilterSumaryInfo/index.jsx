import React, { useState, useMemo } from "react";
import { withTranslation } from "react-i18next";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Badge,
  Button,
  InputGroup,
  Label
} from "reactstrap";
import FilterSummary from "../../../../components/aziende/FilterSummary";

// Componente UserCard para mostrar información de usuario


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
    }
  ]);

  // Estados para filtros
  const [filters, setFilters] = useState({
    nombre: "",
    departamento: "",
    estado: "",
    edad: ""
  });

  // Estado para ordenamiento
  const [sorting, setSorting] = useState({
    field: "",
    direction: ""
  });

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
      filterOptions: ["Desarrollo", "Marketing", "Ventas", "Soporte", "Recursos Humanos"]
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

  // Función para manejar cambios en filtros
  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  // Función para manejar cambios en ordenamiento
  const handleSortChange = (field) => {
    setSorting(prev => {
      if (prev.field === field) {
        // Cambiar dirección
        const newDirection = prev.direction === 'asc' ? 'desc' : prev.direction === 'desc' ? '' : 'asc';
        return {
          field: newDirection ? field : '',
          direction: newDirection
        };
      } else {
        // Nuevo campo
        return {
          field,
          direction: 'asc'
        };
      }
    });
  };

  // Función para limpiar todos los filtros y ordenamientos
  const handleClearAll = () => {
    setFilters({
      nombre: "",
      departamento: "",
      estado: "",
      edad: ""
    });
    setSorting({
      field: "",
      direction: ""
    });
  };

  // Filtrar y ordenar usuarios
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        result = result.filter(user => {
          const userValue = user[key];
          if (userValue == null) return false;

          // Para filtros de texto
          if (key === "nombre" || key === "edad") {
            return userValue.toString().toLowerCase().includes(value.toLowerCase());
          }

          // Para filtros de select (exactos)
          return userValue.toString() === value;
        });
      }
    });

    // Aplicar ordenamiento
    if (sorting.field && sorting.direction) {
      result.sort((a, b) => {
        const aValue = a[sorting.field];
        const bValue = b[sorting.field];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        let comparison = 0;
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else {
          comparison = aValue.toString().localeCompare(bValue.toString());
        }

        return sorting.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [users, filters, sorting]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between mb-4">
                <h4 className="mb-0">Ejemplo FilterSummary con Cards</h4>
                <div className="page-title-right">
                  <small className="text-muted">Demostración del componente FilterSummary reutilizable</small>
                </div>
              </div>
            </div>
          </div>

          {/* Card con filtros y FilterSummary */}
          <Card className="mb-4">
            <CardBody>
              {/* FilterSummary - Muestra filtros y ordenamientos activos */}
              <FilterSummary
                filters={filters}
                sorting={sorting}
                columns={columns}
                onClearAll={handleClearAll}
                className="mb-4"
              />

              {/* Controles de filtro */}
              <Row className="mb-4">
                <Col md={3}>
                  <Label for="filterNombre">Filtrar por nombre:</Label>
                  <Input
                    id="filterNombre"
                    type="text"
                    placeholder="Buscar nombre..."
                    value={filters.nombre}
                    onChange={(e) => handleFilterChange('nombre', e.target.value)}
                  />
                </Col>
                <Col md={3}>
                  <Label for="filterDepartamento">Filtrar por departamento:</Label>
                  <Input
                    id="filterDepartamento"
                    type="select"
                    value={filters.departamento}
                    onChange={(e) => handleFilterChange('departamento', e.target.value)}
                  >
                    <option value="">Todos los departamentos</option>
                    <option value="Desarrollo">Desarrollo</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Ventas">Ventas</option>
                    <option value="Soporte">Soporte</option>
                    <option value="Recursos Humanos">Recursos Humanos</option>
                  </Input>
                </Col>
                <Col md={3}>
                  <Label for="filterEstado">Filtrar por estado:</Label>
                  <Input
                    id="filterEstado"
                    type="select"
                    value={filters.estado}
                    onChange={(e) => handleFilterChange('estado', e.target.value)}
                  >
                    <option value="">Todos los estados</option>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                    <option value="Pendiente">Pendiente</option>
                  </Input>
                </Col>
                <Col md={3}>
                  <Label for="filterEdad">Filtrar por edad:</Label>
                  <Input
                    id="filterEdad"
                    type="text"
                    placeholder="Ej: 30"
                    value={filters.edad}
                    onChange={(e) => handleFilterChange('edad', e.target.value)}
                  />
                </Col>
              </Row>

              {/* Controles de ordenamiento */}
              <Row className="mb-4">
                <Col md={12}>
                  <Label>Ordenar por:</Label>
                  <div className="d-flex gap-2 flex-wrap">
                    <Button
                      outline={sorting.field !== 'nombre'}
                      color="primary"
                      size="sm"
                      onClick={() => handleSortChange('nombre')}
                    >
                      Nombre {sorting.field === 'nombre' && (sorting.direction === 'asc' ? '↑' : '↓')}
                    </Button>
                    <Button
                      outline={sorting.field !== 'departamento'}
                      color="primary"
                      size="sm"
                      onClick={() => handleSortChange('departamento')}
                    >
                      Departamento {sorting.field === 'departamento' && (sorting.direction === 'asc' ? '↑' : '↓')}
                    </Button>
                    <Button
                      outline={sorting.field !== 'edad'}
                      color="primary"
                      size="sm"
                      onClick={() => handleSortChange('edad')}
                    >
                      Edad {sorting.field === 'edad' && (sorting.direction === 'asc' ? '↑' : '↓')}
                    </Button>
                    <Button
                      outline={sorting.field !== 'fechaIngreso'}
                      color="primary"
                      size="sm"
                      onClick={() => handleSortChange('fechaIngreso')}
                    >
                      Fecha Ingreso {sorting.field === 'fechaIngreso' && (sorting.direction === 'asc' ? '↑' : '↓')}
                    </Button>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* Resultados */}
          <div className="mb-3">
            <h5>Usuarios encontrados: {filteredUsers.length}</h5>
          </div>

          {/* Cards de usuarios */}
          <Row>
            {filteredUsers.map(user => (
              <Col xl={4} lg={6} md={6} sm={12} key={user.id} className="mb-4">
                <UserCard user={user} />
              </Col>
            ))}

            {filteredUsers.length === 0 && (
              <Col xs={12}>
                <Card>
                  <CardBody className="text-center py-5">
                    <div className="avatar-lg rounded-circle bg-light mx-auto mb-4 d-flex align-items-center justify-content-center">
                      <i className="mdi mdi-account-search mdi-36px text-muted"></i>
                    </div>
                    <h5 className="mb-3">No se encontraron usuarios</h5>
                    <p className="text-muted mb-4">
                      No hay usuarios que coincidan con los criterios de búsqueda y filtros aplicados.
                    </p>
                    <Button
                      color="primary"
                      outline
                      onClick={handleClearAll}
                      className="d-inline-flex align-items-center"
                      size="sm"
                    >
                      <i className="mdi mdi-filter-remove me-2"></i>
                      Limpiar filtros
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            )}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

FilterSumaryInfo.propTypes = {};

export default withTranslation()(FilterSumaryInfo);










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