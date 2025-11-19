import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
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
import { branchFormSchema } from '../../validations/companyValidationSchema';
import { BranchModel, BranchDto } from '../../models/CompanyModel';

interface BranchFormModalProps {
  isOpen: boolean;
  toggle: () => void;
  branch?: BranchModel | null;
  companyId: number;
  onSubmit: (companyId: number, dto: BranchDto) => Promise<{ success: boolean; message: string }>;
  loading?: boolean;
}

interface FormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  lat: string;
  lng: string;
}

/**
 * Modal para agregar/editar sucursales
 */
const BranchFormModal: React.FC<BranchFormModalProps> = ({
  isOpen,
  toggle,
  branch,
  companyId,
  onSubmit,
  loading = false,
}) => {
  const isEditMode = !!branch;

  const initialValues: FormValues = {
    name: branch?.name || '',
    email: branch?.email || '',
    phone: branch?.phone || '',
    address: branch?.address || '',
    lat: branch?.lat !== null && branch?.lat !== undefined ? branch.lat.toString() : '-17.783327',
    lng: branch?.lng !== null && branch?.lng !== undefined ? branch.lng.toString() : '-63.182140',
  };

  const handleSubmitForm = async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
    const dto: BranchDto = {
      id: branch?.id,
      name: values.name,
      email: values.email || undefined,
      phone: values.phone,
      address: values.address,
      lat: values.lat ? parseFloat(values.lat) : null,
      lng: values.lng ? parseFloat(values.lng) : null,
      gblCompanyId: companyId,
    };

    const result = await onSubmit(companyId, dto);

    if (result.success) {
      helpers.resetForm();
      toggle();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        <i className="mdi mdi-map-marker me-2 text-danger"></i>
        {isEditMode ? 'Editar Sucursal' : 'Nueva Sucursal'}
      </ModalHeader>
      <ModalBody>
        <Formik
          initialValues={initialValues}
          validationSchema={branchFormSchema}
          onSubmit={handleSubmitForm}
          enableReinitialize={true}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Row>
                {/* Nombre */}
                <Col md={12}>
                  <FormGroup>
                    <Label>Nombre de la Sucursal *</Label>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Ej: Oficina Central"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.name && !!errors.name}
                    />
                    <FormFeedback>{errors.name}</FormFeedback>
                  </FormGroup>
                </Col>

                {/* Teléfono */}
                <Col md={6}>
                  <FormGroup>
                    <Label>Teléfono *</Label>
                    <Input
                      type="text"
                      name="phone"
                      placeholder="Ej: 72345678"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.phone && !!errors.phone}
                    />
                    <FormFeedback>{errors.phone}</FormFeedback>
                  </FormGroup>
                </Col>

                {/* Email */}
                <Col md={6}>
                  <FormGroup>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="sucursal@empresa.com"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.email && !!errors.email}
                    />
                    <FormFeedback>{errors.email}</FormFeedback>
                  </FormGroup>
                </Col>

                {/* Dirección */}
                <Col md={12}>
                  <FormGroup>
                    <Label>Dirección *</Label>
                    <Input
                      type="textarea"
                      name="address"
                      placeholder="Ej: 4to Anillo, Av. Banzer #123"
                      rows={2}
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.address && !!errors.address}
                    />
                    <FormFeedback>{errors.address}</FormFeedback>
                  </FormGroup>
                </Col>

                {/* Coordenadas */}
                <Col md={12}>
                  <div className="border-top pt-3 mb-3">
                    <p className="text-muted mb-3" style={{ fontSize: '0.875rem' }}>
                      <i className="mdi mdi-map-marker-check me-1 text-info"></i>
                      <strong>Ubicación en el Mapa:</strong> Puedes ingresar las coordenadas manualmente o
                      seleccionar la ubicación directamente en el mapa después de guardar la sucursal.
                    </p>
                  </div>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label>Latitud</Label>
                    <Input
                      type="number"
                      step="any"
                      name="lat"
                      placeholder="Ej: -17.783327"
                      value={values.lat}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.lat && !!errors.lat}
                    />
                    <FormFeedback>{errors.lat}</FormFeedback>
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label>Longitud</Label>
                    <Input
                      type="number"
                      step="any"
                      name="lng"
                      placeholder="Ej: -63.182140"
                      value={values.lng}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.lng && !!errors.lng}
                    />
                    <FormFeedback>{errors.lng}</FormFeedback>
                  </FormGroup>
                </Col>

                {/* Buttons */}
                <Col md={12} className="mt-3">
                  <div className="d-flex gap-2 justify-content-end">
                    <Button color="light" onClick={toggle} disabled={loading}>
                      Cancelar
                    </Button>
                    <Button color="primary" type="submit" disabled={loading}>
                      {loading && <i className="mdi mdi-loading mdi-spin me-2"></i>}
                      <i className="mdi mdi-content-save me-1"></i>
                      {isEditMode ? 'Actualizar Sucursal' : 'Guardar Sucursal'}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </ModalBody>
    </Modal>
  );
};

export default BranchFormModal;
