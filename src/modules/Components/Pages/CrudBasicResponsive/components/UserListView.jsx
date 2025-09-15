import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

/**
 * Vista de lista para tablets (vista intermedia)
 */
const UserListView = ({ users, onEdit, onDelete }) => {
  if (!users || users.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="avatar-lg mx-auto mb-4">
          <div className="avatar-title rounded-circle bg-soft-primary text-primary">
            <i className="mdi mdi-account-group font-size-24"></i>
          </div>
        </div>
        <h5 className="text-muted">No hay usuarios disponibles</h5>
        <p className="text-muted mb-0">Agrega algunos usuarios para verlos aquí</p>
      </div>
    );
  }

  return (
    <Card>
      <CardBody className="px-0">
        <div className="table-responsive">
          <div className="list-group list-group-flush">
            {users.map((user, index) => (
              <div key={user.id} className={`list-group-item list-group-item-action ${index % 2 === 0 ? 'bg-light' : ''}`}>
                <Row className="align-items-center">
                  <Col xs={2} sm={1}>
                    <div className="avatar-sm">
                      <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                        {user.nombre.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </Col>

                  <Col xs={6} sm={4}>
                    <div>
                      <h6 className="mb-1 font-weight-bold">{user.nombre}</h6>
                      <p className="text-muted mb-0 text-truncate" style={{ fontSize: '0.875rem' }}>
                        {user.email}
                      </p>
                    </div>
                  </Col>

                  <Col xs={4} sm={2} className="text-center">
                    <span className="badge bg-soft-info text-info px-2 py-1">
                      {user.departamento}
                    </span>
                  </Col>

                  <Col sm={2} className="text-center d-none d-sm-block">
                    <span className={`badge bg-soft-${
                      user.rol === 'Administrador' ? 'danger' :
                      user.rol === 'Editor' ? 'warning' : 'success'
                    } text-${
                      user.rol === 'Administrador' ? 'danger' :
                      user.rol === 'Editor' ? 'warning' : 'success'
                    }`}>
                      {user.rol}
                    </span>
                  </Col>

                  <Col sm={2} className="text-center d-none d-sm-block">
                    <span className={`badge bg-soft-${user.estado === 'Activo' ? 'success' : 'danger'} text-${user.estado === 'Activo' ? 'success' : 'danger'}`}>
                      {user.estado}
                    </span>
                  </Col>

                  <Col xs={4} sm={1} className="text-end">
                    <UncontrolledDropdown>
                      <DropdownToggle tag="button" className="btn btn-sm btn-soft-secondary">
                        <i className="mdi mdi-dots-vertical"></i>
                      </DropdownToggle>
                      <DropdownMenu end>
                        <DropdownItem onClick={() => onEdit(user)}>
                          <i className="mdi mdi-pencil me-2"></i>
                          Editar
                        </DropdownItem>
                        <DropdownItem onClick={() => onDelete(user)} className="text-danger">
                          <i className="mdi mdi-delete me-2"></i>
                          Eliminar
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </Col>
                </Row>

                {/* Información adicional para pantallas pequeñas */}
                <Row className="mt-2 d-sm-none">
                  <Col xs={6}>
                    <small className="text-muted">
                      <i className="mdi mdi-phone me-1"></i>
                      {user.telefono || 'Sin teléfono'}
                    </small>
                  </Col>
                  <Col xs={6} className="text-end">
                    <small className="text-muted">
                      {new Date(user.fechaCreacion).toLocaleDateString('es-ES')}
                    </small>
                  </Col>
                </Row>

                <Row className="mt-1 d-sm-none">
                  <Col xs={6}>
                    <span className={`badge bg-soft-${
                      user.rol === 'Administrador' ? 'danger' :
                      user.rol === 'Editor' ? 'warning' : 'success'
                    } text-${
                      user.rol === 'Administrador' ? 'danger' :
                      user.rol === 'Editor' ? 'warning' : 'success'
                    } me-1`}>
                      {user.rol}
                    </span>
                    <span className={`badge bg-soft-${user.estado === 'Activo' ? 'success' : 'danger'} text-${user.estado === 'Activo' ? 'success' : 'danger'}`}>
                      {user.estado}
                    </span>
                  </Col>
                  {user.salario && (
                    <Col xs={6} className="text-end">
                      <small className="text-success fw-bold">
                        {new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0
                        }).format(user.salario)}
                      </small>
                    </Col>
                  )}
                </Row>
              </div>
            ))}
          </div>
        </div>

        {/* Header para pantallas medianas y grandes */}
        <style jsx>{`
          .list-group-item:first-child::before {
            content: '';
            position: absolute;
            top: -40px;
            left: 0;
            right: 0;
            height: 40px;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
          }

          @media (min-width: 576px) {
            .list-group::before {
              content: '';
              display: block;
              padding: 0.75rem 1.25rem;
              background-color: #f8f9fa;
              border-bottom: 1px solid #dee2e6;
              font-weight: 600;
              color: #495057;
              font-size: 0.875rem;
            }
          }
        `}</style>
      </CardBody>
    </Card>
  );
};

UserListView.propTypes = {
  users: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default UserListView;