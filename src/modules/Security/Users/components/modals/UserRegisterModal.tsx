import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
  Input,
  FormFeedback,
  FormGroup,
  Row,
  Col,
} from 'reactstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { userRegistrationSchema, userEditSchema } from '../../validations/userValidationSchema';
import { validateAvatar } from '../../validations/userValidationHelpers';
import { RegisterUserDto } from '../../models/RegisterUserDto';
import { UpdateUserDto } from '../../models/UpdateUserDto';
import { UserModel } from '../../models/UserModel';
import { useWorkStations } from '@/modules/RRHH/WorkStations/hooks/useWorkStations';

interface UserRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: UserModel | null;
  onRegister: (dto: RegisterUserDto) => Promise<{ success: boolean; message: string }>;
  onUpdate?: (dto: UpdateUserDto) => Promise<{ success: boolean; message: string }>;
}

const UserRegisterModal: React.FC<UserRegisterModalProps> = ({
  isOpen,
  onClose,
  userToEdit,
  onRegister,
  onUpdate,
}) => {
  const { workStations } = useWorkStations();
  const isEditMode = !!userToEdit;

  const [showWorkStationPicker, setShowWorkStationPicker] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const validationSchema = isEditMode ? userEditSchema : userRegistrationSchema;

  const initialValues = isEditMode && userToEdit
    ? {
        name: userToEdit.name,
        lastName: userToEdit.lastName,
        email: userToEdit.email,
        phone: userToEdit.phone || '',
        password: '',
        repeatPassword: '',
        gbl_company_id: '1',
        workStationId: userToEdit.workStation?.id || 0,
        avatar: null,
      }
    : {
        name: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        repeatPassword: '',
        gbl_company_id: '1',
        workStationId: 0,
        avatar: null,
      };

  useEffect(() => {
    if (isEditMode && userToEdit?.avatar) {
      setAvatarPreview(userToEdit.avatar);
    } else {
      setAvatarPreview(null);
    }
    setAvatarError(null);
  }, [isEditMode, userToEdit]);

  const handleAvatarChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = event.target.files?.[0] || null;
    const validation = validateAvatar(file);

    if (!validation.valid) {
      setAvatarError(validation.error || null);
      setFieldValue('avatar', null);
      setAvatarPreview(null);
      return;
    }

    setAvatarError(null);
    setFieldValue('avatar', file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      let result;

      if (isEditMode && userToEdit && onUpdate) {
        const updateDto: UpdateUserDto = {
          id: userToEdit.id,
          ...values,
        };
        result = await onUpdate(updateDto);
      } else {
        const registerDto: RegisterUserDto = values;
        result = await onRegister(registerDto);
      }

      if (result.success) {
        onClose();
      }
    } catch (error) {
      console.error('Error en el formulario:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getSelectedWorkStationName = (workStationId: number): string => {
    const ws = workStations.find((w) => w.id === workStationId);
    return ws?.name || 'Selecciona un puesto de trabajo';
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} size="lg">
      <ModalHeader toggle={onClose}>
        {isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}
      </ModalHeader>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting, setFieldValue, values, errors, touched }) => (
          <Form>
            <ModalBody>
              <Row>
                <Col md={12} className="mb-3">
                  <div className="text-center">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="rounded-circle"
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center"
                        style={{ width: '120px', height: '120px' }}
                      >
                        <i className="mdi mdi-account font-size-48 text-muted"></i>
                      </div>
                    )}
                    <div className="mt-2">
                      <Label for="avatar" className="btn btn-sm btn-primary">
                        <i className="mdi mdi-upload me-1"></i>
                        {avatarPreview ? 'Cambiar Avatar' : 'Subir Avatar'}
                      </Label>
                      <Input
                        id="avatar"
                        name="avatar"
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={(e) => handleAvatarChange(e, setFieldValue)}
                        className="d-none"
                      />
                      {avatarError && (
                        <div className="text-danger font-size-12 mt-1">{avatarError}</div>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="name">
                      Nombre <span className="text-danger">*</span>
                    </Label>
                    <Field name="name">
                      {({ field }: any) => (
                        <Input
                          {...field}
                          type="text"
                          id="name"
                          invalid={!!(touched.name && errors.name)}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="name">
                      {(msg) => <FormFeedback>{msg}</FormFeedback>}
                    </ErrorMessage>
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label for="lastName">
                      Apellido <span className="text-danger">*</span>
                    </Label>
                    <Field name="lastName">
                      {({ field }: any) => (
                        <Input
                          {...field}
                          type="text"
                          id="lastName"
                          invalid={!!(touched.lastName && errors.lastName)}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="lastName">
                      {(msg) => <FormFeedback>{msg}</FormFeedback>}
                    </ErrorMessage>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="email">
                      Email <span className="text-danger">*</span>
                    </Label>
                    <Field name="email">
                      {({ field }: any) => (
                        <Input
                          {...field}
                          type="email"
                          id="email"
                          invalid={!!(touched.email && errors.email)}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="email">
                      {(msg) => <FormFeedback>{msg}</FormFeedback>}
                    </ErrorMessage>
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label for="phone">
                      Teléfono <span className="text-danger">*</span>
                    </Label>
                    <Field name="phone">
                      {({ field }: any) => (
                        <Input
                          {...field}
                          type="text"
                          id="phone"
                          invalid={!!(touched.phone && errors.phone)}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="phone">
                      {(msg) => <FormFeedback>{msg}</FormFeedback>}
                    </ErrorMessage>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="password">
                      Contraseña {!isEditMode && <span className="text-danger">*</span>}
                    </Label>
                    <Field name="password">
                      {({ field }: any) => (
                        <Input
                          {...field}
                          type="password"
                          id="password"
                          placeholder={isEditMode ? 'Dejar vacío para no cambiar' : ''}
                          invalid={!!(touched.password && errors.password)}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="password">
                      {(msg) => <FormFeedback>{msg}</FormFeedback>}
                    </ErrorMessage>
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label for="repeatPassword">
                      Confirmar Contraseña {!isEditMode && <span className="text-danger">*</span>}
                    </Label>
                    <Field name="repeatPassword">
                      {({ field }: any) => (
                        <Input
                          {...field}
                          type="password"
                          id="repeatPassword"
                          placeholder={isEditMode ? 'Dejar vacío para no cambiar' : ''}
                          invalid={!!(touched.repeatPassword && errors.repeatPassword)}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="repeatPassword">
                      {(msg) => <FormFeedback>{msg}</FormFeedback>}
                    </ErrorMessage>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
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
                        {getSelectedWorkStationName(values.workStationId)}
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
            </ModalBody>

            <ModalFooter>
              <Button color="light" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button color="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <i className="mdi mdi-loading mdi-spin me-1"></i>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="mdi mdi-content-save me-1"></i>
                    {isEditMode ? 'Actualizar' : 'Registrar'}
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

export default UserRegisterModal;
