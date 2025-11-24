import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { Formik, FormikHelpers } from 'formik';
import { CreateZoneDto } from '../../models/TableLayoutModel';
import { createZoneSchema } from '../../validations/tableLayoutValidationSchema';

interface CreateZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateZoneDto) => Promise<{ success: boolean; message: string }>;
}

interface ZoneFormValues {
  name: string;
}

const CreateZoneModal: React.FC<CreateZoneModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);

  const initialValues: ZoneFormValues = {
    name: '',
  };

  const handleSubmit = async (values: ZoneFormValues, { resetForm }: FormikHelpers<ZoneFormValues>) => {
    setLoading(true);
    const result = await onSubmit({
      name: values.name.trim(),
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
        <i className="mdi mdi-map-marker-plus me-2 text-primary"></i>
        Crear Nueva Zona
      </ModalHeader>
      <Formik
        initialValues={initialValues}
        validationSchema={createZoneSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit: formikSubmit }) => (
          <Form onSubmit={formikSubmit}>
            <ModalBody>
              <FormGroup>
                <Label for="zoneName">Nombre de la Zona *</Label>
                <Input
                  id="zoneName"
                  name="name"
                  type="text"
                  placeholder="Ej: Zona Principal, Terraza, VIP"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.name && !!errors.name}
                  disabled={loading}
                />
                {touched.name && errors.name && <FormFeedback>{errors.name}</FormFeedback>}
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="light" onClick={handleClose} disabled={loading}>
                Cancelar
              </Button>
              <Button color="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <i className="mdi mdi-loading mdi-spin me-1"></i>
                    Creando...
                  </>
                ) : (
                  <>
                    <i className="mdi mdi-check me-1"></i>
                    Crear Zona
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

export default CreateZoneModal;
