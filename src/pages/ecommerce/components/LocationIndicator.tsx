import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import { LocationModel, LocationChangeDto } from '../models/LocationModel';

interface LocationIndicatorProps {
  location: LocationModel | null;
  loading: boolean;
  isManualLocation: boolean;
  onChangeLocation: (location: LocationChangeDto) => void;
  onResetLocation: () => void;
}

const LocationIndicator: React.FC<LocationIndicatorProps> = ({
  location,
  loading,
  isManualLocation,
  onChangeLocation,
  onResetLocation,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<LocationChangeDto>({
    country: '',
    countryCode: '',
    region: '',
    regionCode: '',
    city: '',
  });

  const toggleModal = () => {
    if (!modalOpen && location) {
      setFormData({
        country: location.country,
        countryCode: location.countryCode,
        region: location.region,
        regionCode: location.regionCode,
        city: location.city,
      });
    }
    setModalOpen(!modalOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChangeLocation(formData);
    toggleModal();
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center gap-2 text-muted">
        <i className="mdi mdi-loading mdi-spin font-size-16"></i>
        <small>Detectando ubicación...</small>
      </div>
    );
  }

  if (!location) {
    return (
      <Button color="light" size="sm" onClick={toggleModal}>
        <i className="mdi mdi-map-marker-plus me-1"></i>
        Establecer ubicación
      </Button>
    );
  }

  return (
    <>
      <div className="d-flex align-items-center gap-2">
        <i className="mdi mdi-map-marker text-primary font-size-16"></i>
        <small className="fw-medium mb-0">
          {location.city}, {location.region}, {location.country}
        </small>
        {isManualLocation && (
          <i
            className="mdi mdi-pencil text-info font-size-12"
            title="Ubicación manual"
          ></i>
        )}

        <div className="d-flex gap-1">
          {isManualLocation && (
            <Button
              color="light"
              size="sm"
              className="p-1 px-2"
              onClick={onResetLocation}
              title="Detectar automáticamente"
            >
              <i className="mdi mdi-refresh font-size-14"></i>
            </Button>
          )}
          <Button
            color="light"
            size="sm"
            className="p-1 px-2"
            onClick={toggleModal}
            title="Cambiar ubicación"
          >
            <i className="mdi mdi-pencil font-size-14"></i>
          </Button>
        </div>
      </div>

      <Modal isOpen={modalOpen} toggle={toggleModal} size="sm">
        <ModalHeader toggle={toggleModal}>Cambiar Ubicación</ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <Label for="country" className="font-size-13">
                País
              </Label>
              <Input
                type="text"
                id="country"
                name="country"
                size="sm"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Ej: Bolivia"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="countryCode" className="font-size-13">
                Código de País
              </Label>
              <Input
                type="text"
                id="countryCode"
                name="countryCode"
                size="sm"
                value={formData.countryCode}
                onChange={handleInputChange}
                placeholder="Ej: BO"
                maxLength={2}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="region" className="font-size-13">
                Región/Departamento
              </Label>
              <Input
                type="text"
                id="region"
                name="region"
                size="sm"
                value={formData.region}
                onChange={handleInputChange}
                placeholder="Ej: Santa Cruz"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="regionCode" className="font-size-13">
                Código de Región
              </Label>
              <Input
                type="text"
                id="regionCode"
                name="regionCode"
                size="sm"
                value={formData.regionCode}
                onChange={handleInputChange}
                placeholder="Ej: SC"
                maxLength={3}
              />
            </FormGroup>

            <FormGroup className="mb-0">
              <Label for="city" className="font-size-13">
                Ciudad
              </Label>
              <Input
                type="text"
                id="city"
                name="city"
                size="sm"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Ej: Santa Cruz de la Sierra"
                required
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="light" size="sm" onClick={toggleModal}>
              Cancelar
            </Button>
            <Button color="primary" size="sm" type="submit">
              <i className="mdi mdi-check me-1"></i>
              Guardar
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default LocationIndicator;
