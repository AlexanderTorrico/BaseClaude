import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    FormFeedback,
    Spinner,
    Alert,
    Row,
    Col
} from 'reactstrap';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { CreateRoleDto } from '../../models/CreateRoleDto';
import { UpdateRoleDto } from '../../models/UpdateRoleDto';
import { RoleModel } from '../../models/RoleModel';

interface RoleFormModalProps {
    isOpen: boolean;
    toggle: () => void;
    onSuccess: () => void;
    onCreate: (dto: CreateRoleDto) => Promise<{ success: boolean; message: string }>;
    onUpdate?: (dto: UpdateRoleDto) => Promise<{ success: boolean; message: string }>;
    roleToEdit?: RoleModel | null;
}

interface FormValuesInternal {
    name: string;
    detail: string;
    id?: number;
}

// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('El nombre del rol es requerido')
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede exceder 50 caracteres'),
    detail: Yup.string()
        .required('La descripción es requerida')
        .min(5, 'La descripción debe tener al menos 5 caracteres')
        .max(200, 'La descripción no puede exceder 200 caracteres')
});

const getInitialValues = (roleToEdit?: RoleModel | null): FormValuesInternal => {
    if (roleToEdit) {
        return {
            id: roleToEdit.id,
            name: roleToEdit.name,
            detail: roleToEdit.detail || '',
        };
    }

    return {
        name: '',
        detail: '',
    };
};

const RoleFormModal: React.FC<RoleFormModalProps> = ({
    isOpen,
    toggle,
    onSuccess,
    onCreate,
    onUpdate,
    roleToEdit,
}) => {
    const [serverError, setServerError] = useState<string | null>(null);
    const isEditMode = !!roleToEdit;

    // Resetear error al cambiar el estado del modal
    useEffect(() => {
        if (!isOpen) {
            setServerError(null);
        }
    }, [isOpen]);

    const handleSubmit = async (
        values: FormValuesInternal,
        { setSubmitting, resetForm }: FormikHelpers<FormValuesInternal>
    ) => {
        setServerError(null);

        let result: { success: boolean; message: string };

        if (isEditMode && onUpdate) {
            const updateDto: UpdateRoleDto = {
                id: values.id!,
                name: values.name.trim(),
                detail: values.detail.trim(),
            };

            result = await onUpdate(updateDto);
        } else {
            const createDto: CreateRoleDto = {
                name: values.name.trim(),
                detail: values.detail.trim(),
            };

            result = await onCreate(createDto);
        }

        if (result.success) {
            resetForm();
            onSuccess();
            toggle();
        } else {
            setServerError(result.message);
        }

        setSubmitting(false);
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="md">
            <ModalHeader toggle={toggle}>
                <i className={`mdi ${isEditMode ? 'mdi-shield-edit' : 'mdi-shield-plus'} text-primary me-2`}></i>
                {isEditMode ? 'Editar Rol' : 'Crear Nuevo Rol'}
            </ModalHeader>
            <ModalBody>
                <Formik
                    initialValues={getInitialValues(roleToEdit)}
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

                            <Row>
                                <Col md={12}>
                                    {/* Nombre del Rol */}
                                    <FormGroup>
                                        <Label for="name">
                                            Nombre del Rol <span className="text-danger">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Ej: Administrador, Editor, Viewer..."
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            invalid={Boolean(touched.name && errors.name)}
                                            disabled={isSubmitting}
                                        />
                                        {touched.name && errors.name && (
                                            <FormFeedback>{errors.name}</FormFeedback>
                                        )}
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12}>
                                    {/* Descripción */}
                                    <FormGroup>
                                        <Label for="detail">
                                            Descripción <span className="text-danger">*</span>
                                        </Label>
                                        <Input
                                            id="detail"
                                            name="detail"
                                            type="textarea"
                                            rows={3}
                                            placeholder="Describe las responsabilidades y alcance de este rol..."
                                            value={values.detail}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            invalid={Boolean(touched.detail && errors.detail)}
                                            disabled={isSubmitting}
                                        />
                                        {touched.detail && errors.detail && (
                                            <FormFeedback>{errors.detail}</FormFeedback>
                                        )}
                                        <small className="text-muted">
                                            {values.detail.length}/200 caracteres
                                        </small>
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
                                            {isEditMode ? 'Guardando...' : 'Creando...'}
                                        </>
                                    ) : (
                                        <>
                                            <i className="mdi mdi-check me-1"></i>
                                            {isEditMode ? 'Guardar Cambios' : 'Crear Rol'}
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

export default RoleFormModal;
