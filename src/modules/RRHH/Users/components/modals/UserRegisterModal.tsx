import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, Button, Form, FormGroup, Label, Input, FormFeedback, Spinner, Alert, Row, Col } from 'reactstrap';
import { Formik, FormikHelpers } from 'formik';
import { RegisterUserDto } from '../../models/RegisterUserDto';
import { UpdateUserDto } from '../../models/UpdateUserDto';
import { UserModel } from '../../models/UserModel';
import { userRegistrationSchema, userEditSchema } from '../../validations/userValidationSchema';
import { validateAvatar } from '../../validations/userValidationHelpers';
import { useWorkStations } from '@/modules/RRHH/WorkStations/hooks/useWorkStations';

interface UserRegisterModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSuccess: () => void;
  onRegister: (dto: RegisterUserDto) => Promise<{ success: boolean; message: string }>;
  onUpdate?: (dto: UpdateUserDto) => Promise<{ success: boolean; message: string }>;
  userToEdit?: UserModel | null;
  companyId?: string;
}

type FormValues = RegisterUserDto | UpdateUserDto;

const getInitialValues = (companyId: string, userToEdit?: UserModel | null): FormValues => {
  if (userToEdit) {
    // Modo edición: pre-cargar datos del usuario, contraseñas vacías
    return {
      id: userToEdit.id,
      name: userToEdit.name,
      lastName: userToEdit.lastName,
      email: userToEdit.email,
      phone: userToEdit.phone || '',
      password: '',
      repeatPassword: '',
      gbl_company_id: companyId,
      workStationId: userToEdit.workStation?.id || 0,
      avatar: null,
    };
  }

  // Modo creación: valores vacíos
  return {
    name: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    repeatPassword: '',
    gbl_company_id: companyId,
    workStationId: 0,
    avatar: null,
  };
};

const UserRegisterModal: React.FC<UserRegisterModalProps> = ({
  isOpen,
  toggle,
  onSuccess,
  onRegister,
  onUpdate,
  userToEdit,
  companyId = '1',
}) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showWorkStationPicker, setShowWorkStationPicker] = useState(false);

  const { workStations } = useWorkStations();
  const isEditMode = !!userToEdit;
  const validationSchema = isEditMode ? userEditSchema : userRegistrationSchema;

  // Pre-cargar avatar si existe en modo edición
  useEffect(() => {
    if (isEditMode && userToEdit?.avatar) {
      setAvatarPreview(userToEdit.avatar);
    } else {
      setAvatarPreview(null);
    }
  }, [isEditMode, userToEdit]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    // Validar usando el helper centralizado
    const validation = validateAvatar(file);

    if (!validation.valid) {
      setServerError(validation.error || 'Error al validar el avatar');
      setAvatarFile(null);
      setAvatarPreview(null);
      return;
    }

    // Si pasa la validación, procesar el archivo
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setServerError(null);
    } else {
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    setServerError(null);

    let result: { success: boolean; message: string };

    if (isEditMode && onUpdate) {
      // Modo edición: llamar onUpdate
      const updateDto: UpdateUserDto = {
        id: (values as UpdateUserDto).id,
        name: values.name,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        gbl_company_id: values.gbl_company_id,
        avatar: avatarFile,
        // Solo incluir password si se ingresó (opcional en edición)
        ...(values.password && {
          password: values.password,
          repeatPassword: values.repeatPassword,
        }),
      };

      result = await onUpdate(updateDto);
    } else {
      // Modo creación: llamar onRegister
      const registerDto: RegisterUserDto = {
        ...values,
        avatar: avatarFile,
      };

      result = await onRegister(registerDto);
    }

    if (result.success) {
      resetForm();
      setAvatarPreview(null);
      setAvatarFile(null);
      onSuccess();
      toggle();
    } else {
      setServerError(result.message);
    }

    setSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        <i className={`mdi ${isEditMode ? 'mdi-account-edit' : 'mdi-account-plus'} text-primary me-2`}></i>
        {isEditMode ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
      </ModalHeader>
      <ModalBody>
        <Formik
          initialValues={getInitialValues(companyId, userToEdit)}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              {serverError && (
                <Alert color="danger" className="mb-3">
                  <i className="mdi mdi-alert-circle me-2"></i>
                  {serverError}
                </Alert>
              )}

              {/* Avatar + Nombre/Apellido Section */}
              <Row className="mb-3">
                {/* Avatar a la izquierda */}
                <Col md={3} className="d-flex flex-column align-items-center justify-content-start">
                  <div className="position-relative">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="rounded-circle shadow-sm"
                        style={{ width: '120px', height: '120px', objectFit: 'cover', border: '3px solid #f8f9fa' }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-light d-flex align-items-center justify-content-center shadow-sm"
                        style={{ width: '120px', height: '120px', border: '3px solid #f8f9fa' }}
                      >
                        <i className="mdi mdi-camera text-muted" style={{ fontSize: '48px' }}></i>
                      </div>
                    )}
                    <Label
                      for="avatar"
                      className="position-absolute bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: '36px',
                        height: '36px',
                        bottom: '0',
                        right: '0',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                      title="Seleccionar avatar"
                    >
                      <i className="mdi mdi-pencil"></i>
                    </Label>
                    <Input
                      id="avatar"
                      name="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={isSubmitting}
                      className="d-none"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <small className="text-muted">JPG, PNG o GIF<br />(max 5MB)</small>
                  </div>
                </Col>

                {/* Nombre y Apellido a la derecha (en columnas) */}
                <Col md={9}>
                  {/* Nombre */}
                  <FormGroup>
                    <Label for="name">Nombre <span className="text-danger">*</span></Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Ingrese el nombre"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.name && !!errors.name}
                      disabled={isSubmitting}
                    />
                    {touched.name && errors.name && (
                      <FormFeedback>{errors.name}</FormFeedback>
                    )}
                  </FormGroup>

                  {/* Apellido */}
                  <FormGroup>
                    <Label for="lastName">Apellido <span className="text-danger">*</span></Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Ingrese el apellido"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.lastName && !!errors.lastName}
                      disabled={isSubmitting}
                    />
                    {touched.lastName && errors.lastName && (
                      <FormFeedback>{errors.lastName}</FormFeedback>
                    )}
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                {/* Email */}
                <Col md={6}>
                  <FormGroup>
                    <Label for="email">Email <span className="text-danger">*</span></Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.email && !!errors.email}
                      disabled={isSubmitting}
                    />
                    {touched.email && errors.email && (
                      <FormFeedback>{errors.email}</FormFeedback>
                    )}
                  </FormGroup>
                </Col>

                {/* Teléfono */}
                <Col md={6}>
                  <FormGroup>
                    <Label for="phone">Teléfono <span className="text-danger">*</span></Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="text"
                      placeholder="+591 777-12345"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.phone && !!errors.phone}
                      disabled={isSubmitting}
                    />
                    {touched.phone && errors.phone && (
                      <FormFeedback>{errors.phone}</FormFeedback>
                    )}
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                {/* Contraseña */}
                <Col md={6}>
                  <FormGroup>
                    <Label for="password">
                      Contraseña {!isEditMode && <span className="text-danger">*</span>}
                      {isEditMode && <span className="text-muted">(dejar vacío para no cambiar)</span>}
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder={isEditMode ? "Dejar vacío para mantener la actual" : "Mínimo 8 caracteres"}
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.password && !!errors.password}
                      disabled={isSubmitting}
                    />
                    {touched.password && errors.password && (
                      <FormFeedback>{errors.password}</FormFeedback>
                    )}
                  </FormGroup>
                </Col>

                {/* Confirmar Contraseña */}
                <Col md={6}>
                  <FormGroup>
                    <Label for="repeatPassword">
                      Confirmar Contraseña {!isEditMode && <span className="text-danger">*</span>}
                    </Label>
                    <Input
                      id="repeatPassword"
                      name="repeatPassword"
                      type="password"
                      placeholder={isEditMode ? "Confirmar nueva contraseña" : "Repita la contraseña"}
                      value={values.repeatPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.repeatPassword && !!errors.repeatPassword}
                      disabled={isSubmitting}
                    />
                    {touched.repeatPassword && errors.repeatPassword && (
                      <FormFeedback>{errors.repeatPassword}</FormFeedback>
                    )}
                  </FormGroup>
                </Col>
              </Row>

              {/* WorkStation Picker - Collapser en la parte inferior */}
              <Row className="mt-3">
                <Col md={12}>
                  <FormGroup>
                    <Label>
                      Puesto de Trabajo <span className="text-danger">*</span>
                    </Label>
                    <div
                      className={`border rounded p-2 d-flex align-items-center justify-content-between ${
                        touched.workStationId && errors.workStationId ? 'border-danger' : ''
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setShowWorkStationPicker(!showWorkStationPicker)}
                    >
                      <span className={values.workStationId === 0 ? 'text-muted' : ''}>
                        {values.workStationId === 0
                          ? 'Selecciona un puesto de trabajo'
                          : workStations.find(ws => ws.id === values.workStationId)?.name || 'Selecciona un puesto de trabajo'}
                      </span>
                      <i
                        className={`mdi mdi-chevron-${showWorkStationPicker ? 'up' : 'down'}`}
                      ></i>
                    </div>

                    {showWorkStationPicker && (
                      <div
                        className="border rounded mt-2 p-2"
                        style={{ maxHeight: '250px', overflowY: 'auto' }}
                      >
                        {workStations.length === 0 ? (
                          <div className="text-center text-muted p-3">
                            No hay puestos de trabajo disponibles
                          </div>
                        ) : (
                          workStations.map((ws) => (
                            <div
                              key={ws.id}
                              className={`p-2 rounded mb-1 ${
                                values.workStationId === ws.id
                                  ? 'bg-primary text-white'
                                  : 'hover-bg-light'
                              }`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                setFieldValue('workStationId', ws.id);
                                setShowWorkStationPicker(false);
                              }}
                            >
                              <div className="fw-medium">{ws.name}</div>
                              {ws.description && (
                                <small
                                  className={
                                    values.workStationId === ws.id
                                      ? 'text-white-50'
                                      : 'text-muted'
                                  }
                                >
                                  {ws.description}
                                </small>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {touched.workStationId && errors.workStationId && (
                      <div className="text-danger font-size-12 mt-1">
                        {errors.workStationId}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>

              {/* Buttons */}
              <div className="d-flex gap-2 justify-content-end mt-4 pt-3 border-top">
                <Button color="light" onClick={toggle} disabled={isSubmitting}>
                  <i className="mdi mdi-close me-1"></i>
                  Cancelar
                </Button>
                <Button color="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      {isEditMode ? 'Guardando...' : 'Registrando...'}
                    </>
                  ) : (
                    <>
                      <i className="mdi mdi-check me-1"></i>
                      {isEditMode ? 'Guardar Cambios' : 'Registrar Usuario'}
                    </>
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </ModalBody>
    </Modal>
  );
};

export default UserRegisterModal;
