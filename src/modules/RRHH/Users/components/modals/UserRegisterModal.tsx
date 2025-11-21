import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, Button, Form, FormGroup, Label, Input, FormFeedback, Spinner, Alert, Row, Col } from 'reactstrap';
import { Formik, FormikHelpers } from 'formik';
import { RegisterUserDto } from '../../models/RegisterUserDto';
import { UpdateUserDto } from '../../models/UpdateUserDto';
import { UserModel } from '../../models/UserModel';
import { userRegistrationSchema, userEditSchema } from '../../validations/userValidationSchema';
import { validateAvatar } from '../../validations/userValidationHelpers';
import { useSharedWorkStations } from '@/modules/RRHH/shared/hooks/useSharedWorkStations';
import { useSharedWorkStationsFetch } from '@/modules/RRHH/shared/hooks/useSharedWorkStationsFetch';
import { WorkStationApiService } from '@/modules/RRHH/WorkStations/services/WorkStationApiService';
import { useUsers } from '../../hooks/useUsers';

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

interface FormValuesInternal {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  repeatPassword: string;
  gbl_company_id: string;
  workStationName: string;
  selectedDependencyUserId: number | null;
  avatar: File | null;
  id?: number;
}

const getInitialValues = (companyId: string, userToEdit?: UserModel | null): FormValuesInternal => {
  if (userToEdit) {
    // Modo edición: pre-cargar datos del usuario
    let workStationName = '';
    let dependencyUserId = null;

    if (userToEdit.workStation) {
      workStationName = userToEdit.workStation.name || '';
      dependencyUserId = userToEdit.workStation.dependencyId || null;
    }

    return {
      id: userToEdit.id,
      name: userToEdit.name,
      lastName: userToEdit.lastName,
      email: userToEdit.email,
      phone: userToEdit.phone || '',
      password: '',
      repeatPassword: '',
      gbl_company_id: companyId,
      workStationName,
      selectedDependencyUserId: dependencyUserId,
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
    workStationName: '',
    selectedDependencyUserId: null,
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
  const [showWorkStationSection, setShowWorkStationSection] = useState(false);
  const [showWorkStationSuggestions, setShowWorkStationSuggestions] = useState(false);
  const [showDependencyPicker, setShowDependencyPicker] = useState(false);

  const workStationService = new WorkStationApiService();
  const { workStationsForPicker } = useSharedWorkStations();
  const { loading: loadingWS, fetchWorkStations, workStationsLoaded } = useSharedWorkStationsFetch(workStationService);
  const { users } = useUsers();
  const isEditMode = !!userToEdit;
  const validationSchema = isEditMode ? userEditSchema : userRegistrationSchema;

  const usersWithWorkStations = users.filter(user => user.workStation && user.workStation.name);

  // Pre-cargar avatar si existe en modo edición
  useEffect(() => {
    if (isEditMode && userToEdit?.avatar) {
      setAvatarPreview(userToEdit.avatar);
    } else {
      setAvatarPreview(null);
    }
  }, [isEditMode, userToEdit]);

  // Cargar WorkStations al abrir modal si no existen
  useEffect(() => {
    if (isOpen && !workStationsLoaded) {
      fetchWorkStations(parseInt(companyId));
    }
  }, [isOpen, workStationsLoaded, companyId]);

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
    values: FormValuesInternal,
    { setSubmitting, resetForm }: FormikHelpers<FormValuesInternal>
  ) => {
    setServerError(null);

    // Construir workStation JSON string
    const workStationJson = JSON.stringify({
      name: values.workStationName.trim(),
      dependency_id: values.selectedDependencyUserId || null,
    });

    let result: { success: boolean; message: string };

    if (isEditMode && onUpdate) {
      // Modo edición: llamar onUpdate
      const updateDto: UpdateUserDto = {
        id: values.id!,
        name: values.name,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        gbl_company_id: values.gbl_company_id,
        workStation: workStationJson,
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
        name: values.name,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        repeatPassword: values.repeatPassword,
        gbl_company_id: values.gbl_company_id,
        workStation: workStationJson,
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
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
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

              {/* WorkStation Section - Acordeón (Opcional) */}
              <Row className="mt-3">
                <Col md={12}>
                  <FormGroup>
                    {/* Header del acordeón con título y botón collapse */}
                    <div
                      className="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setShowWorkStationSection(!showWorkStationSection)}
                    >
                      <Label className="mb-0 d-flex align-items-center">
                        <i className="mdi mdi-briefcase-outline me-2 text-muted"></i>
                        <span className="fw-medium">Puesto de Trabajo</span>
                        <span className="text-muted ms-2">(opcional)</span>
                        {values.workStationName && (
                          <span className="badge bg-soft-success text-success ms-2 font-size-10">
                            <i className="mdi mdi-check-circle me-1"></i>
                            Asignado
                          </span>
                        )}
                      </Label>
                      <Button
                        color="light"
                        size="sm"
                        className="border-0 p-1"
                        style={{
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowWorkStationSection(!showWorkStationSection);
                        }}
                      >
                        <i className={`mdi mdi-chevron-${showWorkStationSection ? 'up' : 'down'} font-size-16`}></i>
                      </Button>
                    </div>

                    {/* Panel desplegable con inputs de WorkStation */}
                    {showWorkStationSection && (
                      <div className="border rounded mt-2 p-3 bg-light">
                        <Row>
                          {/* Input 1: Nombre del Puesto de Trabajo (Autocomplete) */}
                          <Col md={6}>
                            <FormGroup>
                              <Label for="workStationName" className="fw-medium">
                                Nombre del Puesto
                              </Label>
                              <div className="position-relative">
                                <Input
                                  id="workStationName"
                                  name="workStationName"
                                  type="text"
                                  placeholder="Ej: Analista RRHH, Gerente de Ventas..."
                                  value={values.workStationName}
                                  onChange={(e) => {
                                    handleChange(e);
                                    setShowWorkStationSuggestions(e.target.value.length > 0);
                                  }}
                                  onBlur={(e) => {
                                    handleBlur(e);
                                    setTimeout(() => setShowWorkStationSuggestions(false), 200);
                                  }}
                                  onFocus={() => {
                                    if (values.workStationName.length > 0) {
                                      setShowWorkStationSuggestions(true);
                                    }
                                  }}
                                  disabled={isSubmitting || loadingWS}
                                />

                                {/* Sugerencias de WorkStations existentes */}
                                {showWorkStationSuggestions && workStationsForPicker.length > 0 && (
                                  <div
                                    className="position-absolute w-100 border rounded shadow-sm bg-white"
                                    style={{
                                      top: '100%',
                                      left: 0,
                                      zIndex: 1000,
                                      maxHeight: '200px',
                                      overflowY: 'auto',
                                      marginTop: '2px'
                                    }}
                                  >
                                    {workStationsForPicker
                                      .filter(ws =>
                                        ws.name.toLowerCase().includes(values.workStationName.toLowerCase())
                                      )
                                      .slice(0, 5)
                                      .map((ws) => (
                                        <div
                                          key={ws.id}
                                          className="p-2 border-bottom"
                                          style={{
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s'
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '#fff';
                                          }}
                                          onMouseDown={() => {
                                            setFieldValue('workStationName', ws.name);
                                            setShowWorkStationSuggestions(false);
                                          }}
                                        >
                                          <div className="d-flex align-items-center">
                                            <i className="mdi mdi-briefcase-outline text-muted me-2"></i>
                                            <div>
                                              <div className="fw-medium">{ws.name}</div>
                                              {ws.description && (
                                                <small className="text-muted">{ws.description}</small>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                )}
                              </div>
                            </FormGroup>
                          </Col>

                          {/* Input 2: De quién depende (Selector de Usuario) */}
                          <Col md={6}>
                            <FormGroup className="position-relative">
                              <Label className="fw-medium">
                                Depende de
                              </Label>
                              <div
                                className="form-control d-flex align-items-center justify-content-between"
                                style={{
                                  cursor: 'pointer',
                                  minHeight: '38px',
                                  paddingRight: '8px'
                                }}
                                onClick={() => setShowDependencyPicker(!showDependencyPicker)}
                              >
                                <div className="d-flex align-items-center flex-grow-1">
                                  {values.selectedDependencyUserId ? (
                                    <>
                                      <i className="mdi mdi-account-supervisor-circle me-2 text-primary"></i>
                                      <span className="text-dark me-2">
                                        {usersWithWorkStations.find(u => u.workStation?.id === values.selectedDependencyUserId)?.fullName || 'Usuario no encontrado'}
                                      </span>
                                      <span className="badge bg-soft-primary text-primary font-size-10">
                                        <i className="mdi mdi-briefcase me-1"></i>
                                        {usersWithWorkStations.find(u => u.workStation?.id === values.selectedDependencyUserId)?.workStation?.name || ''}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <i className="mdi mdi-account-supervisor-circle me-2 text-muted"></i>
                                      <span className="text-muted">Seleccionar usuario</span>
                                    </>
                                  )}
                                </div>
                                <Button
                                  color="light"
                                  size="sm"
                                  className="border-0 p-1"
                                  style={{
                                    width: '28px',
                                    height: '28px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDependencyPicker(!showDependencyPicker);
                                  }}
                                >
                                  <i className={`mdi mdi-chevron-${showDependencyPicker ? 'up' : 'down'} font-size-16`}></i>
                                </Button>
                              </div>

                              {/* Panel desplegable con usuarios */}
                              {showDependencyPicker && (
                                <div
                                  className="position-absolute border rounded mt-2 shadow-sm"
                                  style={{
                                    maxHeight: '250px',
                                    overflowY: 'auto',
                                    backgroundColor: '#fff',
                                    zIndex: 1050,
                                    top: '100%',
                                    left: 0,
                                    right: 0
                                  }}
                                >
                                  {usersWithWorkStations.length === 0 ? (
                                    <div className="text-center text-muted p-4">
                                      <i className="mdi mdi-information-outline font-size-24 d-block mb-2"></i>
                                      <span>No hay usuarios con puestos de trabajo</span>
                                    </div>
                                  ) : (
                                    <div className="p-2">
                                      {/* Opción para limpiar selección */}
                                      <div
                                        className="p-2 rounded mb-2 bg-light border"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                          setFieldValue('selectedDependencyUserId', null);
                                          setShowDependencyPicker(false);
                                        }}
                                      >
                                        <div className="d-flex align-items-center">
                                          <i className="mdi mdi-close-circle text-muted me-2"></i>
                                          <span className="text-muted">Sin dependencia</span>
                                        </div>
                                      </div>

                                      {usersWithWorkStations.map((user) => (
                                        <div
                                          key={user.id}
                                          className={`p-3 rounded mb-2 ${
                                            values.selectedDependencyUserId === user.workStation?.id
                                              ? 'bg-primary text-white'
                                              : 'bg-light'
                                          }`}
                                          style={{
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            border: values.selectedDependencyUserId === user.workStation?.id
                                              ? '2px solid #556ee6'
                                              : '1px solid #eff2f7'
                                          }}
                                          onMouseEnter={(e) => {
                                            if (values.selectedDependencyUserId !== user.workStation?.id) {
                                              e.currentTarget.style.backgroundColor = '#f8f9fa';
                                              e.currentTarget.style.borderColor = '#d1d5db';
                                            }
                                          }}
                                          onMouseLeave={(e) => {
                                            if (values.selectedDependencyUserId !== user.workStation?.id) {
                                              e.currentTarget.style.backgroundColor = '#f8f9fa';
                                              e.currentTarget.style.borderColor = '#eff2f7';
                                            }
                                          }}
                                          onClick={() => {
                                            setFieldValue('selectedDependencyUserId', user.workStation?.id || null);
                                            setShowDependencyPicker(false);
                                          }}
                                        >
                                          <div className="d-flex align-items-center justify-content-between">
                                            <div className="flex-grow-1">
                                              <div className={`fw-medium mb-1 ${
                                                values.selectedDependencyUserId === user.workStation?.id
                                                  ? 'text-white'
                                                  : 'text-dark'
                                              }`}>
                                                {user.fullName}
                                              </div>
                                              <div className="d-flex align-items-center gap-2">
                                                <span
                                                  className={`badge ${
                                                    values.selectedDependencyUserId === user.workStation?.id
                                                      ? 'bg-white text-primary'
                                                      : 'bg-soft-primary text-primary'
                                                  } font-size-10`}
                                                >
                                                  <i className="mdi mdi-briefcase me-1"></i>
                                                  {user.workStation?.name}
                                                </span>
                                              </div>
                                            </div>
                                            {values.selectedDependencyUserId === user.workStation?.id && (
                                              <i className="mdi mdi-check-circle font-size-20 text-white"></i>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </FormGroup>
                          </Col>
                        </Row>
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
