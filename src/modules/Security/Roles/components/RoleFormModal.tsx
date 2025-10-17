import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, FormFeedback, Spinner } from 'reactstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { RoleModel, RoleFormData } from '../models/RoleModel';

interface RoleFormModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSuccess: (roleName: string) => void;
  mode: 'create' | 'edit';
  roleData?: RoleModel;
}

/**
 * Modal para crear o editar un rol
 * Usa Formik + Yup para validación
 */
const RoleFormModal: React.FC<RoleFormModalProps> = ({
  isOpen,
  toggle,
  onSuccess,
  mode,
  roleData,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  // Valores iniciales del formulario
  const initialValues: RoleFormData = {
    name: roleData?.name || '',
    description: roleData?.description || '',
    isActive: roleData?.isActive ?? true,
  };

  // Esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('El nombre del rol es requerido')
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .max(50, 'El nombre no puede exceder 50 caracteres')
      .matches(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        'El nombre solo puede contener letras y espacios'
      ),
    description: Yup.string()
      .required('La descripción es requerida')
      .min(10, 'La descripción debe tener al menos 10 caracteres')
      .max(200, 'La descripción no puede exceder 200 caracteres'),
    isActive: Yup.boolean().required(),
  });

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (values: RoleFormData) => {
    setIsSaving(true);

    try {
      // Simular guardado en backend (2 segundos)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular éxito
      if (mode === 'create') {
        toast.success(`✅ Rol "${values.name}" creado exitosamente`, {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.success(`✅ Rol "${values.name}" actualizado exitosamente`, {
          position: 'top-right',
          autoClose: 3000,
        });
      }

      // Llamar callback de éxito
      onSuccess(values.name);
    } catch (error) {
      toast.error('❌ Error al guardar el rol. Intente nuevamente.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" backdrop="static">
      <ModalHeader toggle={toggle}>
        <div className="d-flex align-items-center gap-2">
          <i className={`mdi mdi-${mode === 'create' ? 'plus-circle' : 'pencil'} font-size-20 text-${mode === 'create' ? 'success' : 'primary'}`}></i>
          <span>{mode === 'create' ? 'Crear Nuevo Rol' : 'Editar Rol'}</span>
        </div>
      </ModalHeader>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              {/* Campo: Nombre del Rol */}
              <FormGroup>
                <Label for="name" className="fw-semibold">
                  Nombre del Rol <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Ej: Administrador, Gerente, Supervisor"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.name && !!errors.name}
                  disabled={isSaving}
                />
                {touched.name && errors.name && (
                  <FormFeedback>{errors.name}</FormFeedback>
                )}
                <small className="text-muted">
                  Nombre descriptivo que identifique claramente el rol
                </small>
              </FormGroup>

              {/* Campo: Descripción */}
              <FormGroup>
                <Label for="description" className="fw-semibold">
                  Descripción <span className="text-danger">*</span>
                </Label>
                <Input
                  type="textarea"
                  name="description"
                  id="description"
                  rows={4}
                  placeholder="Describe las responsabilidades y alcance de este rol..."
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.description && !!errors.description}
                  disabled={isSaving}
                />
                {touched.description && errors.description && (
                  <FormFeedback>{errors.description}</FormFeedback>
                )}
                <small className="text-muted">
                  {values.description.length}/200 caracteres
                </small>
              </FormGroup>

              {/* Campo: Estado (Switch) */}
              <FormGroup className="mb-0">
                <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded">
                  <div>
                    <Label className="mb-0 fw-semibold">Estado del Rol</Label>
                    <div className="text-muted small">
                      {values.isActive
                        ? 'El rol está activo y puede ser asignado a usuarios'
                        : 'El rol está inactivo y no puede ser asignado'}
                    </div>
                  </div>
                  <div className="form-check form-switch form-switch-lg">
                    <Input
                      type="switch"
                      name="isActive"
                      id="isActive"
                      checked={values.isActive}
                      onChange={(e) => setFieldValue('isActive', e.target.checked)}
                      disabled={isSaving}
                      className="form-check-input"
                    />
                    <Label className="form-check-label" for="isActive">
                      <span className={`badge badge-soft-${values.isActive ? 'success' : 'danger'}`}>
                        {values.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </Label>
                  </div>
                </div>
              </FormGroup>

              {/* Información adicional en modo edición */}
              {mode === 'edit' && roleData && (
                <div className="alert alert-info mt-3 mb-0">
                  <div className="d-flex align-items-start gap-2">
                    <i className="mdi mdi-information-outline font-size-18 mt-1"></i>
                    <div>
                      <strong>Información del Rol:</strong>
                      <ul className="mb-0 mt-2">
                        <li>Usuarios con este rol: <strong>{roleData.userCount}</strong></li>
                        <li>Permisos asignados: <strong>{roleData.permissionIds.length}</strong></li>
                        <li>
                          Creado: <strong>{new Date(roleData.createdAt).toLocaleDateString('es-ES')}</strong>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                color="secondary"
                onClick={toggle}
                disabled={isSaving}
                outline
              >
                <i className="mdi mdi-close me-1"></i>
                Cancelar
              </Button>
              <Button
                color={mode === 'create' ? 'success' : 'primary'}
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Spinner size="sm" className="me-1" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className={`mdi mdi-${mode === 'create' ? 'check' : 'content-save'} me-1`}></i>
                    {mode === 'create' ? 'Crear Rol' : 'Guardar Cambios'}
                  </>
                )}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default RoleFormModal;
