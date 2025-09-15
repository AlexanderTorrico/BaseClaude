import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Spinner,
  Alert
} from 'reactstrap';
import { useTranslation } from 'react-i18next';

/**
 * Modal para crear o editar usuarios
 */
const UserFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  user = null,
  loading = false,
  error = null
}) => {
  const { t } = useTranslation();
  const isEdit = !!user;

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    estado: 'Activo',
    rol: 'Usuario',
    departamento: '',
    edad: '',
    salario: '',
    experiencia: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Resetear formulario cuando se abre/cierra o cambia el usuario
  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData({
          nombre: user.nombre || '',
          email: user.email || '',
          telefono: user.telefono || '',
          estado: user.estado || 'Activo',
          rol: user.rol || 'Usuario',
          departamento: user.departamento || '',
          edad: user.edad?.toString() || '',
          salario: user.salario?.toString() || '',
          experiencia: user.experiencia?.toString() || ''
        });
      } else {
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          estado: 'Activo',
          rol: 'Usuario',
          departamento: '',
          edad: '',
          salario: '',
          experiencia: ''
        });
      }
      setFormErrors({});
    }
  }, [isOpen, user]);

  // Manejar cambios en los campos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};

    // Validaciones requeridas
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Formato de email inválido';
    }

    if (!formData.departamento.trim()) {
      errors.departamento = 'El departamento es requerido';
    }

    // Validaciones numéricas
    if (formData.edad && (isNaN(formData.edad) || formData.edad < 18 || formData.edad > 100)) {
      errors.edad = 'La edad debe ser un número entre 18 y 100';
    }

    if (formData.salario && (isNaN(formData.salario) || formData.salario < 0)) {
      errors.salario = 'El salario debe ser un número positivo';
    }

    if (formData.experiencia && (isNaN(formData.experiencia) || formData.experiencia < 0)) {
      errors.experiencia = 'La experiencia debe ser un número positivo';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Preparar datos para envío
    const submitData = {
      ...formData,
      edad: formData.edad ? parseInt(formData.edad) : null,
      salario: formData.salario ? parseFloat(formData.salario) : null,
      experiencia: formData.experiencia ? parseFloat(formData.experiencia) : null
    };

    const success = await onSubmit(submitData);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} size="lg" backdrop="static">
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={onClose}>
          {isEdit ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </ModalHeader>

        <ModalBody>
          {error && (
            <Alert color="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Row>
            {/* Nombre */}
            <Col md={6}>
              <FormGroup>
                <Label for="nombre">
                  Nombre <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  invalid={!!formErrors.nombre}
                  placeholder="Ingrese el nombre completo"
                />
                {formErrors.nombre && (
                  <div className="invalid-feedback d-block">
                    {formErrors.nombre}
                  </div>
                )}
              </FormGroup>
            </Col>

            {/* Email */}
            <Col md={6}>
              <FormGroup>
                <Label for="email">
                  Email <span className="text-danger">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  invalid={!!formErrors.email}
                  placeholder="ejemplo@correo.com"
                />
                {formErrors.email && (
                  <div className="invalid-feedback d-block">
                    {formErrors.email}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            {/* Teléfono */}
            <Col md={6}>
              <FormGroup>
                <Label for="telefono">Teléfono</Label>
                <Input
                  type="text"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="+34 666 123 456"
                />
              </FormGroup>
            </Col>

            {/* Departamento */}
            <Col md={6}>
              <FormGroup>
                <Label for="departamento">
                  Departamento <span className="text-danger">*</span>
                </Label>
                <Input
                  type="select"
                  id="departamento"
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleInputChange}
                  invalid={!!formErrors.departamento}
                >
                  <option value="">Seleccione un departamento</option>
                  <option value="Desarrollo">Desarrollo</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Ventas">Ventas</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="Soporte">Soporte</option>
                </Input>
                {formErrors.departamento && (
                  <div className="invalid-feedback d-block">
                    {formErrors.departamento}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            {/* Estado */}
            <Col md={4}>
              <FormGroup>
                <Label for="estado">Estado</Label>
                <Input
                  type="select"
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </Input>
              </FormGroup>
            </Col>

            {/* Rol */}
            <Col md={4}>
              <FormGroup>
                <Label for="rol">Rol</Label>
                <Input
                  type="select"
                  id="rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputChange}
                >
                  <option value="Usuario">Usuario</option>
                  <option value="Editor">Editor</option>
                  <option value="Administrador">Administrador</option>
                </Input>
              </FormGroup>
            </Col>

            {/* Edad */}
            <Col md={4}>
              <FormGroup>
                <Label for="edad">Edad</Label>
                <Input
                  type="number"
                  id="edad"
                  name="edad"
                  value={formData.edad}
                  onChange={handleInputChange}
                  invalid={!!formErrors.edad}
                  placeholder="25"
                  min="18"
                  max="100"
                />
                {formErrors.edad && (
                  <div className="invalid-feedback d-block">
                    {formErrors.edad}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            {/* Salario */}
            <Col md={6}>
              <FormGroup>
                <Label for="salario">Salario</Label>
                <Input
                  type="number"
                  id="salario"
                  name="salario"
                  value={formData.salario}
                  onChange={handleInputChange}
                  invalid={!!formErrors.salario}
                  placeholder="45000"
                  min="0"
                  step="1000"
                />
                {formErrors.salario && (
                  <div className="invalid-feedback d-block">
                    {formErrors.salario}
                  </div>
                )}
              </FormGroup>
            </Col>

            {/* Experiencia */}
            <Col md={6}>
              <FormGroup>
                <Label for="experiencia">Experiencia (años)</Label>
                <Input
                  type="number"
                  id="experiencia"
                  name="experiencia"
                  value={formData.experiencia}
                  onChange={handleInputChange}
                  invalid={!!formErrors.experiencia}
                  placeholder="3.5"
                  min="0"
                  step="0.5"
                />
                {formErrors.experiencia && (
                  <div className="invalid-feedback d-block">
                    {formErrors.experiencia}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button color="primary" type="submit" disabled={loading}>
            {loading && <Spinner size="sm" className="me-2" />}
            {isEdit ? 'Actualizar' : 'Crear'}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

UserFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  user: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.string
};

export default UserFormModal;