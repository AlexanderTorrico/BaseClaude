import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col,
  Spinner
} from 'reactstrap';

/**
 * Modal de confirmación para eliminar usuario
 */
const UserDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  loading = false
}) => {
  if (!user) return null;

  const handleConfirm = async () => {
    const success = await onConfirm();
    if (success) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} size="md" backdrop="static">
      <ModalHeader toggle={onClose} className="bg-danger text-white">
        <i className="mdi mdi-alert-circle-outline me-2"></i>
        Confirmar Eliminación
      </ModalHeader>

      <ModalBody>
        <div className="text-center">
          <div className="avatar-lg mx-auto mb-4">
            <div className="avatar-title rounded-circle bg-soft-danger text-danger">
              <i className="mdi mdi-delete-forever font-size-24"></i>
            </div>
          </div>

          <h5 className="mb-3">¿Estás seguro de eliminar este usuario?</h5>

          <div className="bg-light p-3 rounded mb-3">
            <Row className="text-start">
              <Col sm={4}>
                <strong>Nombre:</strong>
              </Col>
              <Col sm={8}>
                {user.nombre}
              </Col>
            </Row>
            <Row className="text-start">
              <Col sm={4}>
                <strong>Email:</strong>
              </Col>
              <Col sm={8}>
                {user.email}
              </Col>
            </Row>
            <Row className="text-start">
              <Col sm={4}>
                <strong>Departamento:</strong>
              </Col>
              <Col sm={8}>
                {user.departamento}
              </Col>
            </Row>
            <Row className="text-start">
              <Col sm={4}>
                <strong>Rol:</strong>
              </Col>
              <Col sm={8}>
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
            </Row>
          </div>

          <div className="alert alert-warning">
            <i className="mdi mdi-alert-triangle-outline me-2"></i>
            <strong>Advertencia:</strong> Esta acción no se puede deshacer.
            El usuario será eliminado permanentemente del sistema.
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button color="danger" onClick={handleConfirm} disabled={loading}>
          {loading && <Spinner size="sm" className="me-2" />}
          <i className="mdi mdi-delete me-1"></i>
          Eliminar Usuario
        </Button>
      </ModalFooter>
    </Modal>
  );
};

UserDeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  user: PropTypes.object,
  loading: PropTypes.bool
};

export default UserDeleteModal;