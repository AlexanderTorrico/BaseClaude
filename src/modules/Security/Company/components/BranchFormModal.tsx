import React, { useState } from 'react';
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
  FormFeedback,
  Row,
  Col,
  Spinner,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Branch } from '../models/CompanyModel';
import BranchMapPicker from './BranchMapPicker';

interface BranchFormModalProps {
  isOpen: boolean;
  toggle: () => void;
  branch: Branch | null;
  mode: 'create' | 'edit';
  onSubmit: (data: Partial<Branch>) => Promise<boolean>;
  companyId: number;
}

interface BranchFormData {
  name: string;
  email: string;
  detail: string;
  address: string;
  phone: string;
  schedules: string;
  lat: number | null;
  lng: number | null;
  active: boolean;
  timeZone: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es requerido').min(3, 'Mínimo 3 caracteres'),
  email: Yup.string().email('Email inválido').nullable(),
  detail: Yup.string().nullable(),
  address: Yup.string().required('La dirección es requerida').min(5, 'Mínimo 5 caracteres'),
  phone: Yup.string().required('El teléfono es requerido'),
  schedules: Yup.string().nullable(),
  lat: Yup.number().nullable().min(-90, 'Latitud inválida').max(90, 'Latitud inválida'),
  lng: Yup.number().nullable().min(-180, 'Longitud inválida').max(180, 'Longitud inválida'),
  active: Yup.boolean().required(),
  timeZone: Yup.string().required('La zona horaria es requerida'),
});

const BranchFormModal: React.FC<BranchFormModalProps> = ({
  isOpen,
  toggle,
  branch,
  mode,
  onSubmit,
  companyId,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'location'>('info');

  const initialValues: BranchFormData = {
    name: branch?.name || '',
    email: branch?.email || '',
    detail: branch?.detail || '',
    address: branch?.address || '',
    phone: branch?.phone || '',
    schedules: branch?.schedules || '',
    lat: branch?.lat || null,
    lng: branch?.lng || null,
    active: branch?.active ?? true,
    timeZone: branch?.timeZone || 'America/La_Paz',
  };

  const handleSubmit = async (
    values: BranchFormData,
    { setSubmitting }: FormikHelpers<BranchFormData>
  ) => {
    const branchData: any = {
      name: values.name,
      email: values.email || null,
      detail: values.detail || null,
      address: values.address,
      phone: values.phone,
      schedules: values.schedules || null,
      lat: values.lat,
      lng: values.lng,
      active: values.active,
      timeZone: values.timeZone,
      companyId: companyId,
    };

    const success = await onSubmit(branchData);
    setSubmitting(false);

    if (success) {
      toggle();
      setActiveTab('info'); // Reset tab
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" backdrop="static">
      <ModalHeader toggle={toggle}>
        <i className="mdi mdi-store me-2"></i>
        {mode === 'create' ? 'Nueva Sucursal' : `Editar Sucursal: ${branch?.name}`}
      </ModalHeader>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleSubmit, isSubmitting, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              {/* Tabs */}
              <Nav tabs className="mb-3">
                <NavItem>
                  <NavLink
                    className={activeTab === 'info' ? 'active' : ''}
                    onClick={() => setActiveTab('info')}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="mdi mdi-information me-1"></i>
                    Información General
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={activeTab === 'location' ? 'active' : ''}
                    onClick={() => setActiveTab('location')}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="mdi mdi-map-marker me-1"></i>
                    Ubicación
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeTab}>
                {/* Tab: Información General */}
                <TabPane tabId="info">
                  <Row>
                    <Col md={8}>
                      <FormGroup>
                        <Label for="name">
                          Nombre de la Sucursal <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="text"
                          name="name"
                          id="name"
                          value={values.name}
                          onChange={handleChange}
                          invalid={touched.name && !!errors.name}
                        />
                        <FormFeedback>{errors.name}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="active">Estado</Label>
                        <Input
                          type="select"
                          name="active"
                          id="active"
                          value={values.active ? '1' : '0'}
                          onChange={e => setFieldValue('active', e.target.value === '1')}
                        >
                          <option value="1">Activo</option>
                          <option value="0">Inactivo</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  <FormGroup>
                    <Label for="address">
                      Dirección <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="address"
                      id="address"
                      value={values.address}
                      onChange={handleChange}
                      invalid={touched.address && !!errors.address}
                    />
                    <FormFeedback>{errors.address}</FormFeedback>
                  </FormGroup>

                  <FormGroup>
                    <Label for="detail">Descripción</Label>
                    <Input
                      type="textarea"
                      name="detail"
                      id="detail"
                      rows={2}
                      value={values.detail}
                      onChange={handleChange}
                      invalid={touched.detail && !!errors.detail}
                    />
                    <FormFeedback>{errors.detail}</FormFeedback>
                  </FormGroup>

                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="phone">
                          Teléfono <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="text"
                          name="phone"
                          id="phone"
                          value={values.phone}
                          onChange={handleChange}
                          invalid={touched.phone && !!errors.phone}
                        />
                        <FormFeedback>{errors.phone}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="email">Email</Label>
                        <Input
                          type="email"
                          name="email"
                          id="email"
                          value={values.email}
                          onChange={handleChange}
                          invalid={touched.email && !!errors.email}
                        />
                        <FormFeedback>{errors.email}</FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={8}>
                      <FormGroup>
                        <Label for="schedules">Horarios de Atención</Label>
                        <Input
                          type="text"
                          name="schedules"
                          id="schedules"
                          placeholder="Ej: Lunes a Viernes 8:00 - 18:00"
                          value={values.schedules}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="timeZone">
                          Zona Horaria <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="select"
                          name="timeZone"
                          id="timeZone"
                          value={values.timeZone}
                          onChange={handleChange}
                          invalid={touched.timeZone && !!errors.timeZone}
                        >
                          <option value="America/La_Paz">America/La_Paz</option>
                          <option value="America/Buenos_Aires">America/Buenos_Aires</option>
                          <option value="America/Sao_Paulo">America/Sao_Paulo</option>
                          <option value="America/Santiago">America/Santiago</option>
                          <option value="America/Lima">America/Lima</option>
                          <option value="America/Bogota">America/Bogota</option>
                        </Input>
                        <FormFeedback>{errors.timeZone}</FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>
                </TabPane>

                {/* Tab: Ubicación */}
                <TabPane tabId="location">
                  <BranchMapPicker
                    initialLat={values.lat}
                    initialLng={values.lng}
                    onLocationChange={(lat, lng, address) => {
                      setFieldValue('lat', lat);
                      setFieldValue('lng', lng);
                      if (address && !values.address) {
                        setFieldValue('address', address);
                      }
                    }}
                  />

                  <Row className="mt-3">
                    <Col md={6}>
                      <FormGroup>
                        <Label for="lat">Latitud</Label>
                        <Input
                          type="number"
                          name="lat"
                          id="lat"
                          step="0.000001"
                          value={values.lat || ''}
                          onChange={handleChange}
                          invalid={touched.lat && !!errors.lat}
                        />
                        <FormFeedback>{errors.lat}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="lng">Longitud</Label>
                        <Input
                          type="number"
                          name="lng"
                          id="lng"
                          step="0.000001"
                          value={values.lng || ''}
                          onChange={handleChange}
                          invalid={touched.lng && !!errors.lng}
                        />
                        <FormFeedback>{errors.lng}</FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </ModalBody>

            <ModalFooter>
              <Button color="secondary" onClick={toggle} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button color="warning" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="mdi mdi-content-save me-1"></i>
                    {mode === 'create' ? 'Crear Sucursal' : 'Guardar Cambios'}
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

export default BranchFormModal;
