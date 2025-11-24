import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, Row, Col, FormFeedback } from 'reactstrap';
import { Formik, FormikHelpers } from 'formik';
import { CreateTableDto, ZoneModel } from '../../models/TableLayoutModel';
import { createTableSchema } from '../../validations/tableLayoutValidationSchema';

interface CreateTableModalProps {
  isOpen: boolean;
  zones: ZoneModel[];
  onClose: () => void;
  onSubmit: (dto: CreateTableDto) => Promise<{ success: boolean; message: string }>;
}

interface TableFormValues {
  number: string;
  capacity: number;
  booZoneId: number;
  shape: 'square' | 'circle' | 'rectangle';
  automaticReservationLevel: number;
}

const CreateTableModal: React.FC<CreateTableModalProps> = ({ isOpen, zones, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);

  const initialValues: TableFormValues = {
    number: '',
    capacity: 4,
    booZoneId: 0,
    shape: 'square',
    automaticReservationLevel: 0,
  };

  const handleSubmit = async (values: TableFormValues, { resetForm }: FormikHelpers<TableFormValues>) => {
    setLoading(true);
    const result = await onSubmit({
      number: values.number.trim(),
      capacity: values.capacity,
      automaticReservationLevel: values.automaticReservationLevel,
      booZoneId: values.booZoneId,
      position: { x: 50, y: 50 },
      shape: values.shape,
      gblCompanyId: 1,
    });
    setLoading(false);

    if (result.success) {
      resetForm();
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} toggle={loading ? undefined : handleClose}>
      <ModalHeader toggle={loading ? undefined : handleClose}>
        <i className="mdi mdi-table-furniture me-2 text-success"></i>
        Crear Nueva Mesa
      </ModalHeader>
      <Formik
        initialValues={initialValues}
        validationSchema={createTableSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, handleSubmit: formikSubmit }) => (
          <Form onSubmit={formikSubmit}>
            <ModalBody>
              <FormGroup>
                <Label for="tableNumber">Número/Nombre de Mesa *</Label>
                <Input
                  id="tableNumber"
                  name="number"
                  type="text"
                  placeholder="Ej: Mesa 1, A1, VIP-1"
                  value={values.number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.number && !!errors.number}
                  disabled={loading}
                />
                {touched.number && errors.number && <FormFeedback>{errors.number}</FormFeedback>}
              </FormGroup>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="tableCapacity">Capacidad *</Label>
                    <Input
                      id="tableCapacity"
                      name="capacity"
                      type="number"
                      min={1}
                      max={20}
                      value={values.capacity}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.capacity && !!errors.capacity}
                      disabled={loading}
                    />
                    {touched.capacity && errors.capacity && <FormFeedback>{errors.capacity}</FormFeedback>}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="tableShape">Forma *</Label>
                    <Input
                      id="tableShape"
                      name="shape"
                      type="select"
                      value={values.shape}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.shape && !!errors.shape}
                      disabled={loading}
                    >
                      <option value="square">Cuadrada</option>
                      <option value="circle">Circular</option>
                      <option value="rectangle">Rectangular</option>
                    </Input>
                    {touched.shape && errors.shape && <FormFeedback>{errors.shape}</FormFeedback>}
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="tableReservationLevel">Nivel de Reserva Automática *</Label>
                    <Input
                      id="tableReservationLevel"
                      name="automaticReservationLevel"
                      type="select"
                      value={values.automaticReservationLevel}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.automaticReservationLevel && !!errors.automaticReservationLevel}
                      disabled={loading}
                    >
                      <option value={0}>Ninguno</option>
                      <option value={1}>Propietario</option>
                      <option value={2}>Secundario</option>
                    </Input>
                    {touched.automaticReservationLevel && errors.automaticReservationLevel && (
                      <FormFeedback>{errors.automaticReservationLevel}</FormFeedback>
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="tableZone">Zona *</Label>
                    <Input
                      id="tableZone"
                      name="booZoneId"
                      type="select"
                      value={values.booZoneId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.booZoneId && !!errors.booZoneId}
                      disabled={loading}
                    >
                      <option value={0}>Selecciona una zona...</option>
                      {zones.map(zone => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name} ({zone.booTables.length} mesas)
                        </option>
                      ))}
                    </Input>
                    {touched.booZoneId && errors.booZoneId && <FormFeedback>{errors.booZoneId}</FormFeedback>}
                  </FormGroup>
                </Col>
              </Row>

              <div className="alert alert-info mb-0">
                <i className="mdi mdi-information-outline me-2"></i>
                La mesa se creará en la posición inicial (50, 50). Podrás moverla después usando el editor.
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="light" onClick={handleClose} disabled={loading}>
                Cancelar
              </Button>
              <Button color="success" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <i className="mdi mdi-loading mdi-spin me-1"></i>
                    Creando...
                  </>
                ) : (
                  <>
                    <i className="mdi mdi-check me-1"></i>
                    Crear Mesa
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

export default CreateTableModal;
