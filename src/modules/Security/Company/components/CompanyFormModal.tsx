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
} from 'reactstrap';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { CompanyModel } from '../models/CompanyModel';

interface CompanyFormModalProps {
  isOpen: boolean;
  toggle: () => void;
  company: CompanyModel;
  onSubmit: (data: Partial<CompanyModel>) => Promise<boolean>;
}

interface CompanyFormData {
  name: string;
  openingDateCompany: string;
  phone: string;
  email: string;
  companySize: string;
  language: string;
  timeZone: string;
  logo: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es requerido').min(3, 'Mínimo 3 caracteres'),
  openingDateCompany: Yup.date().required('La fecha de apertura es requerida'),
  phone: Yup.string().required('El teléfono es requerido'),
  email: Yup.string().required('El email es requerido').email('Email inválido'),
  companySize: Yup.string().required('El tamaño de empresa es requerido'),
  language: Yup.string().required('El idioma es requerido'),
  timeZone: Yup.string().required('La zona horaria es requerida'),
  logo: Yup.string().url('Debe ser una URL válida'),
});

const CompanyFormModal: React.FC<CompanyFormModalProps> = ({
  isOpen,
  toggle,
  company,
  onSubmit,
}) => {
  const [logoPreview, setLogoPreview] = useState<string>(company.logo);

  const initialValues: CompanyFormData = {
    name: company.name,
    openingDateCompany: company.openingDateCompany,
    phone: company.phone.join(' - '),
    email: company.email,
    companySize: company.companySize,
    language: company.language,
    timeZone: company.timeZone,
    logo: company.logo,
  };

  const handleSubmit = async (
    values: CompanyFormData,
    { setSubmitting }: FormikHelpers<CompanyFormData>
  ) => {
    const phoneArray = values.phone.split('-').map(p => p.trim());

    const updateData: Partial<CompanyModel> = {
      name: values.name,
      openingDateCompany: values.openingDateCompany,
      phone: phoneArray,
      email: values.email,
      companySize: values.companySize,
      language: values.language,
      timeZone: values.timeZone,
      logo: values.logo,
    };

    const success = await onSubmit(updateData);
    setSubmitting(false);

    if (success) {
      toggle();
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    const url = e.target.value;
    setFieldValue('logo', url);
    setLogoPreview(url);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" backdrop="static">
      <ModalHeader toggle={toggle}>
        <i className="mdi mdi-office-building me-2"></i>
        Editar Información de la Compañía
      </ModalHeader>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleSubmit, isSubmitting, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <ModalBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {/* Logo */}
              <FormGroup>
                <Label for="logo">Logo (URL)</Label>
                <Input
                  type="url"
                  name="logo"
                  id="logo"
                  value={values.logo}
                  onChange={e => handleLogoChange(e, setFieldValue)}
                  invalid={touched.logo && !!errors.logo}
                />
                <FormFeedback>{errors.logo}</FormFeedback>
                {logoPreview && (
                  <div className="mt-2 text-center">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      style={{
                        maxWidth: '150px',
                        maxHeight: '150px',
                        objectFit: 'contain',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        padding: '8px',
                      }}
                      onError={() => setLogoPreview('')}
                    />
                  </div>
                )}
              </FormGroup>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="name">
                      Nombre de la Compañía <span className="text-danger">*</span>
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
                <Col md={6}>
                  <FormGroup>
                    <Label for="openingDateCompany">
                      Fecha de Apertura <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="date"
                      name="openingDateCompany"
                      id="openingDateCompany"
                      value={values.openingDateCompany}
                      onChange={handleChange}
                      invalid={touched.openingDateCompany && !!errors.openingDateCompany}
                    />
                    <FormFeedback>{errors.openingDateCompany}</FormFeedback>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="email">
                      Email <span className="text-danger">*</span>
                    </Label>
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
                <Col md={6}>
                  <FormGroup>
                    <Label for="phone">
                      Teléfono <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="591 - 12345678"
                      value={values.phone}
                      onChange={handleChange}
                      invalid={touched.phone && !!errors.phone}
                    />
                    <FormFeedback>{errors.phone}</FormFeedback>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Label for="companySize">
                      Tamaño de Empresa <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="select"
                      name="companySize"
                      id="companySize"
                      value={values.companySize}
                      onChange={handleChange}
                      invalid={touched.companySize && !!errors.companySize}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="1">1 empleado</option>
                      <option value="2-9">2-9 empleados</option>
                      <option value="10-49">10-49 empleados</option>
                      <option value="50-199">50-199 empleados</option>
                      <option value="200-999">200-999 empleados</option>
                      <option value="1000+">1000+ empleados</option>
                    </Input>
                    <FormFeedback>{errors.companySize}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="language">
                      Idioma <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="select"
                      name="language"
                      id="language"
                      value={values.language}
                      onChange={handleChange}
                      invalid={touched.language && !!errors.language}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="pt">Português</option>
                    </Input>
                    <FormFeedback>{errors.language}</FormFeedback>
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
                      <option value="">Seleccionar...</option>
                      <option value="America/La_Paz">America/La_Paz (BOT)</option>
                      <option value="America/Buenos_Aires">America/Buenos_Aires (ART)</option>
                      <option value="America/Sao_Paulo">America/Sao_Paulo (BRT)</option>
                      <option value="America/Santiago">America/Santiago (CLT)</option>
                      <option value="America/Lima">America/Lima (PET)</option>
                      <option value="America/Bogota">America/Bogota (COT)</option>
                      <option value="America/Mexico_City">America/Mexico_City (CST)</option>
                    </Input>
                    <FormFeedback>{errors.timeZone}</FormFeedback>
                  </FormGroup>
                </Col>
              </Row>
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
                    Guardar Cambios
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

export default CompanyFormModal;
