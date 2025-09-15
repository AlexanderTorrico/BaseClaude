import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown
} from 'reactstrap';

/**
 * Vista móvil de usuarios en formato cards
 */
const UserMobileView = ({ users, onEdit, onDelete }) => {
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
    <Row>
      {users.map((user) => (
        <Col lg={4} md={6} key={user.id} className="mb-3">
          <Card className="h-100">
            <CardBody>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center">
                  <div className="avatar-sm me-3">
                    <span className="avatar-title rounded-circle bg-soft-primary text-primary font-size-16">
                      {user.nombre.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h6 className="mb-1 font-weight-bold">{user.nombre}</h6>
                    <span className={`badge bg-soft-${user.estado === 'Activo' ? 'success' : 'danger'} text-${user.estado === 'Activo' ? 'success' : 'danger'}`}>
                      {user.estado}
                    </span>
                  </div>
                </div>

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
              </div>

              <div className="mb-3">
                <div className="row">
                  <div className="col-6">
                    <p className="text-muted mb-2">
                      <i className="mdi mdi-email-outline me-1"></i>
                      <small>Email</small>
                    </p>
                    <p className="mb-0 text-truncate" title={user.email}>
                      {user.email}
                    </p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted mb-2">
                      <i className="mdi mdi-phone me-1"></i>
                      <small>Teléfono</small>
                    </p>
                    <p className="mb-0">{user.telefono || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="row">
                  <div className="col-6">
                    <p className="text-muted mb-2">
                      <i className="mdi mdi-office-building me-1"></i>
                      <small>Departamento</small>
                    </p>
                    <span className="badge bg-soft-info text-info">
                      {user.departamento}
                    </span>
                  </div>
                  <div className="col-6">
                    <p className="text-muted mb-2">
                      <i className="mdi mdi-account-tie me-1"></i>
                      <small>Rol</small>
                    </p>
                    <span className={`badge bg-soft-${
                      user.rol === 'Administrador' ? 'danger' :
                      user.rol === 'Editor' ? 'warning' : 'success'
                    } text-${
                      user.rol === 'Administrador' ? 'danger' :
                      user.rol === 'Editor' ? 'warning' : 'success'
                    }`}>
                      {user.rol}
                    </span>
                  </div>
                </div>
              </div>

              {(user.edad || user.experiencia) && (
                <div className="mb-3">
                  <div className="row">
                    {user.edad && (
                      <div className="col-6">
                        <p className="text-muted mb-2">
                          <i className="mdi mdi-account-clock me-1"></i>
                          <small>Edad</small>
                        </p>
                        <p className="mb-0">{user.edad} años</p>
                      </div>
                    )}
                    {user.experiencia && (
                      <div className="col-6">
                        <p className="text-muted mb-2">
                          <i className="mdi mdi-star me-1"></i>
                          <small>Experiencia</small>
                        </p>
                        <p className="mb-0">{user.experiencia} años</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-2 border-top">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-0">
                      <i className="mdi mdi-calendar me-1"></i>
                      <small>Creado: {new Date(user.fechaCreacion).toLocaleDateString('es-ES')}</small>
                    </p>
                  </div>
                  {user.salario && (
                    <div>
                      <p className="text-success mb-0 font-weight-bold">
                        {new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        }).format(user.salario)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

UserMobileView.propTypes = {
  users: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default UserMobileView;