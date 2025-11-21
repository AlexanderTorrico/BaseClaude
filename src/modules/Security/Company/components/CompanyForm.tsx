import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  FormFeedback,
} from 'reactstrap';
import { Formik, FormikHelpers } from 'formik';
import { companyFormSchema } from '../validations/companyValidationSchema';
import { validateLogo } from '../validations/companyValidationHelpers';
import { CompanyValidationRules } from '../validations/companyValidationRules';
import { CompanyModel, CompanyDto } from '../models/CompanyModel';
import { INDUSTRIES, TIME_ZONES } from '../config/companyOptions';

interface CompanyFormProps {
  company?: CompanyModel | null;
  onSubmit: (dto: CompanyDto) => Promise<{ success: boolean; message: string }>;
  loading?: boolean;
}

interface FormValues {
  name: string;
  detail: number;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  openingDateCompany: string;
  companySize: string;
  timeZone: string;
  language: string;
  logo?: File | null;
}

/**
 * Formulario para crear/editar compañía
 */
const CompanyForm: React.FC<CompanyFormProps> = ({ company, onSubmit, loading = false }) => {
  const isEditMode = !!company;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [logoPreview, setLogoPreview] = useState<string>(company?.logo || '');
  const [logoError, setLogoError] = useState<string>('');

  // Actualizar preview cuando cambie la compañía
  useEffect(() => {
    if (company?.logo) {
      setLogoPreview(company.logo);
    } else {
      setLogoPreview('');
    }
  }, [company?.logo]);

  const initialValues: FormValues = {
    name: company?.name || '',
    detail: company?.detail || 6, // Default: Tecnologic
    email: company?.email || '',
    phoneCountryCode: company?.phone[0] || '591',
    phoneNumber: company?.phone[1] || '',
    openingDateCompany: company?.openingDateCompany || '',
    companySize: company?.companySize || '2-9',
    timeZone: company?.timeZone || 'America/La_Paz',
    language: company?.language || 'es',
    logo: null,
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setLogoError('');

    if (file) {
      const validation = validateLogo(file);

      if (!validation.valid) {
        setLogoError(validation.error || '');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Crear preview con FileReader para archivos locales
      const reader = new FileReader();
      reader.onloadend = () => {
        // El resultado es data:image/... que se puede usar directamente
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(company?.logo || '');
    }
  };

  const handleSubmitForm = async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
    const dto: CompanyDto = {
      name: values.name,
      detail: values.detail,
      email: values.email,
      phone: [values.phoneCountryCode, values.phoneNumber],
      openingDateCompany: values.openingDateCompany,
      companySize: values.companySize,
      timeZone: values.timeZone,
      language: values.language,
      logo: fileInputRef.current?.files?.[0] || null,
    };

    const result = await onSubmit(dto);

    if (result.success) {
      // Solo limpiar formulario si NO estamos en modo edición (creación de nueva compañía)
      if (!isEditMode) {
        helpers.resetForm();
        setLogoPreview('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        // En modo edición, solo limpiar el input de archivo (no el preview)
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // El logoPreview se actualizará automáticamente via useEffect cuando Redux actualice company.logo
      }
    }
  };

  return (
    <Card className="shadow-sm">
      <CardBody>
        <div className="d-flex align-items-center mb-4">
          <i className="mdi mdi-office-building text-primary me-2" style={{ fontSize: '1.5rem' }}></i>
          <h5 className="mb-0">{isEditMode ? 'Editar Compañía' : 'Datos de la Compañía'}</h5>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={companyFormSchema}
          onSubmit={handleSubmitForm}
          enableReinitialize={true}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                {/* Logo a la izquierda */}
                <Col md={3}>
                  <FormGroup>
                    <Label>Logo</Label>
                    <div
                      className="border rounded d-flex justify-content-center align-items-center bg-light position-relative"
                      style={{ width: '100%', height: '150px', overflow: 'hidden', cursor: 'pointer' }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {logoPreview ? (
                        <img
                          src={logoPreview.startsWith('data:')
                            ? logoPreview
                            : `${import.meta.env.VITE_API_BASE_URL}/${logoPreview}`}
                          alt="Logo preview"
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      ) : (
                        <i className="mdi mdi-image-outline text-muted" style={{ fontSize: '3rem' }}></i>
                      )}
                      {/* Ícono de lápiz para editar */}
                      <div
                        className="position-absolute bg-primary rounded-circle d-flex justify-content-center align-items-center"
                        style={{
                          top: '5px',
                          right: '5px',
                          width: '24px',
                          height: '24px',
                        }}
                      >
                        <i className="mdi mdi-pencil text-white" style={{ fontSize: '0.875rem' }}></i>
                      </div>
                    </div>
                    <Input
                      type="file"
                      innerRef={fileInputRef}
                      accept={CompanyValidationRules.logo.acceptedFormats.join(',')}
                      onChange={handleLogoChange}
                      invalid={!!logoError}
                      style={{ display: 'none' }}
                    />
                    {logoError && <div className="text-danger" style={{ fontSize: '0.75rem', marginTop: '4px' }}>{logoError}</div>}
                  </FormGroup>
                </Col>

                {/* Nombre y Teléfono en columna a la derecha */}
                <Col md={9}>
                  <Row>
                    {/* Nombre de la Compañía */}
                    <Col md={12}>
                      <FormGroup>
                        <Label>Nombre de la Compañía *</Label>
                        <Input
                          type="text"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={touched.name && !!errors.name}
                        />
                        <FormFeedback>{errors.name}</FormFeedback>
                      </FormGroup>
                    </Col>

                    {/* Teléfono con select de código de país */}
                    <Col md={12}>
                      <FormGroup>
                        <Label>Teléfono *</Label>
                        <Row>
                          <Col xs={4}>
                            <Input
                              type="select"
                              name="phoneCountryCode"
                              value={values.phoneCountryCode}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              invalid={touched.phoneCountryCode && !!errors.phoneCountryCode}
                            >
                              <option value="39">+39 (Italia)</option>
                              <option value="34">+34 (España)</option>
                              <option value="591">+591 (Bolivia)</option>
                              <option value="54">+54 (Argentina)</option>
                              <option value="56">+56 (Chile)</option>
                              <option value="57">+57 (Colombia)</option>
                              <option value="593">+593 (Ecuador)</option>
                              <option value="51">+51 (Perú)</option>
                              <option value="55">+55 (Brasil)</option>
                              <option value="52">+52 (México)</option>
                              <option value="1">+1 (USA/Canadá)</option>
                            </Input>
                            <FormFeedback>{errors.phoneCountryCode}</FormFeedback>
                          </Col>
                          <Col xs={8}>
                            <Input
                              type="text"
                              name="phoneNumber"
                              placeholder="Número"
                              value={values.phoneNumber}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              invalid={touched.phoneNumber && !!errors.phoneNumber}
                            />
                            <FormFeedback>{errors.phoneNumber}</FormFeedback>
                          </Col>
                        </Row>
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* Resto de campos en 2 columnas */}
              <Row>
                {/* Email */}
                <Col md={6}>
                  <FormGroup>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.email && !!errors.email}
                    />
                    <FormFeedback>{errors.email}</FormFeedback>
                  </FormGroup>
                </Col>

                {/* Fecha de Apertura */}
                <Col md={6}>
                  <FormGroup>
                    <Label>Fecha de Apertura *</Label>
                    <Input
                      type="date"
                      name="openingDateCompany"
                      value={values.openingDateCompany}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.openingDateCompany && !!errors.openingDateCompany}
                    />
                    <FormFeedback>{errors.openingDateCompany}</FormFeedback>
                  </FormGroup>
                </Col>

                {/* Tamaño de Empresa */}
                <Col md={6}>
                  <FormGroup>
                    <Label>Tamaño de la Empresa *</Label>
                    <Input
                      type="select"
                      name="companySize"
                      value={values.companySize}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.companySize && !!errors.companySize}
                    >
                      <option value="1">1 empleado</option>
                      <option value="2-9">2-9 empleados</option>
                      <option value="10-99">10-99 empleados</option>
                      <option value="100-299">100-299 empleados</option>
                      <option value="300+">300+ empleados</option>
                    </Input>
                    <FormFeedback>{errors.companySize}</FormFeedback>
                  </FormGroup>
                </Col>

                {/* Rubro/Detalle */}
                <Col md={6}>
                  <FormGroup>
                    <Label>Rubro *</Label>
                    <Input
                      type="select"
                      name="detail"
                      value={values.detail}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.detail && !!errors.detail}
                    >
                      {INDUSTRIES.map(industry => (
                        <option key={industry.id} value={industry.id}>
                          {industry.name}
                        </option>
                      ))}
                    </Input>
                    <FormFeedback>{errors.detail}</FormFeedback>
                  </FormGroup>
                </Col>

                {/* Zona Horaria */}
                <Col md={6}>
                  <FormGroup>
                    <Label>Zona Horaria *</Label>
                    <Input
                      type="select"
                      name="timeZone"
                      value={values.timeZone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.timeZone && !!errors.timeZone}
                    >
                      {TIME_ZONES.map(tz => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </Input>
                    <FormFeedback>{errors.timeZone}</FormFeedback>
                  </FormGroup>
                </Col>

                {/* Idioma */}
                <Col md={6}>
                  <FormGroup>
                    <Label>Idioma *</Label>
                    <Input
                      type="select"
                      name="language"
                      value={values.language}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.language && !!errors.language}
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="pt">Português</option>
                      <option value="de">Deutsch</option>
                      <option value="fr">Français</option>
                    </Input>
                    <FormFeedback>{errors.language}</FormFeedback>
                  </FormGroup>
                </Col>

                {/* Submit Button */}
                <Col md={12} className="mt-3">
                  <Button color="primary" type="submit" disabled={loading} className="me-2">
                    {loading && <i className="mdi mdi-loading mdi-spin me-2"></i>}
                    <i className="mdi mdi-content-save me-1"></i>
                    {isEditMode ? 'Guardar Cambios (Compañía y Sucursales)' : 'Guardar Compañía'}
                  </Button>
                  {isEditMode && (
                    <small className="text-muted d-block mt-2">
                      <i className="mdi mdi-information-outline me-1"></i>
                      Al guardar se actualizarán todos los cambios de la compañía y sus sucursales
                    </small>
                  )}
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </CardBody>
    </Card>
  );
};

export default CompanyForm;
