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
import { CreatePermissionDto } from '../../models/CreatePermissionDto';
import { ModuleModel } from '../../models/ModuleModel';
import { ModuleApiService } from '../../services/ModuleApiService';

interface PermissionFormModalProps {
    isOpen: boolean;
    toggle: () => void;
    onSuccess: () => void;
    onCreate: (dto: CreatePermissionDto) => Promise<{ success: boolean; message: string }>;
}

interface FormValuesInternal {
    name: string;
    description: string;
    gbl_module_id: string; // string para el select, se convierte a number
}

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('El nombre del permiso es requerido')
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede exceder 50 caracteres'),
    description: Yup.string()
        .max(200, 'La descripción no puede exceder 200 caracteres'),
    gbl_module_id: Yup.string()
});

const initialValues: FormValuesInternal = {
    name: '',
    description: '',
    gbl_module_id: '',
};

const moduleService = new ModuleApiService();

const PermissionFormModal: React.FC<PermissionFormModalProps> = ({
    isOpen,
    toggle,
    onSuccess,
    onCreate,
}) => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [modules, setModules] = useState<ModuleModel[]>([]);
    const [loadingModules, setLoadingModules] = useState(false);

    // Cargar módulos cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            fetchModules();
        } else {
            setServerError(null);
        }
    }, [isOpen]);

    const fetchModules = async () => {
        setLoadingModules(true);
        try {
            const result = await moduleService.getAllModules();
            if (result.data) {
                setModules(result.data);
            }
        } catch (error) {
            console.error('Error fetching modules:', error);
        } finally {
            setLoadingModules(false);
        }
    };

    const handleSubmit = async (
        values: FormValuesInternal,
        { setSubmitting, resetForm }: FormikHelpers<FormValuesInternal>
    ) => {
        setServerError(null);

        const createDto: CreatePermissionDto = {
            name: values.name.trim(),
        };

        if (values.description.trim()) {
            createDto.description = values.description.trim();
        }
        if (values.gbl_module_id) {
            createDto.gbl_module_id = parseInt(values.gbl_module_id, 10);
        }

        const result = await onCreate(createDto);

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
                <i className="mdi mdi-key-plus text-info me-2"></i>
                Crear Nuevo Permiso
            </ModalHeader>
            <ModalBody>
                <Formik
                    initialValues={initialValues}
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
                                    <FormGroup>
                                        <Label for="name">
                                            Nombre del Permiso <span className="text-danger">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Ej: create_users, edit_roles..."
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
                                    <FormGroup>
                                        <Label for="gbl_module_id">Módulo</Label>
                                        <Input
                                            id="gbl_module_id"
                                            name="gbl_module_id"
                                            type="select"
                                            value={values.gbl_module_id}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            disabled={isSubmitting || loadingModules}
                                        >
                                            <option value="">
                                                {loadingModules ? 'Cargando módulos...' : 'Seleccione un módulo'}
                                            </option>
                                            {modules.map((mod) => (
                                                <option key={mod.id} value={mod.id}>
                                                    {mod.name}
                                                </option>
                                            ))}
                                        </Input>
                                        <small className="text-muted">
                                            Selecciona el módulo al que pertenece este permiso
                                        </small>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label for="description">Descripción</Label>
                                        <Input
                                            id="description"
                                            name="description"
                                            type="textarea"
                                            rows={3}
                                            placeholder="Describe qué permite hacer este permiso..."
                                            value={values.description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            invalid={Boolean(touched.description && errors.description)}
                                            disabled={isSubmitting}
                                        />
                                        {touched.description && errors.description && (
                                            <FormFeedback>{errors.description}</FormFeedback>
                                        )}
                                        <small className="text-muted">
                                            {values.description.length}/200 caracteres
                                        </small>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <div className="d-flex gap-2 justify-content-end mt-4 pt-3 border-top">
                                <Button color="light" onClick={toggle} disabled={isSubmitting}>
                                    <i className="mdi mdi-close me-1"></i>
                                    Cancelar
                                </Button>
                                <Button color="info" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Spinner size="sm" className="me-2" />
                                            Creando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="mdi mdi-check me-1"></i>
                                            Crear Permiso
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

export default PermissionFormModal;
