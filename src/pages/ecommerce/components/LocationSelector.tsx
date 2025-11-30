import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Badge,
  UncontrolledTooltip,
} from 'reactstrap';
import { LocationModel, LocationChangeDto } from '../models/LocationModel';

interface LocationSelectorProps {
  location: LocationModel | null;
  loading: boolean;
  isManualLocation: boolean;
  onChangeLocation: (location: LocationChangeDto) => void;
  onResetLocation: () => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
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
      <Card className="border-0 shadow-sm">
        <CardBody className="d-flex align-items-center gap-2">
          <i className="mdi mdi-loading mdi-spin text-primary font-size-20"></i>
          <span className="text-muted">Detectando ubicación...</span>
        </CardBody>
      </Card>
    );
  }

  if (!location) {
    return (
      <Card className="border-0 shadow-sm">
        <CardBody>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <i className="mdi mdi-alert-circle text-warning font-size-20"></i>
              <span className="text-muted">No se pudo detectar la ubicación</span>
            </div>
            <Button color="primary" size="sm" onClick={toggleModal}>
              <i className="mdi mdi-map-marker-plus me-1"></i>
              Establecer Ubicación
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardBody>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <i className="mdi mdi-map-marker text-primary font-size-24"></i>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h6 className="mb-0">
                    {location.city}, {location.region}
                  </h6>
                  {isManualLocation && (
                    <>
                      <Badge color="info" pill id="manual-location-badge">
                        Manual
                      </Badge>
                      <UncontrolledTooltip
                        placement="top"
                        target="manual-location-badge"
                      >
                        Ubicación establecida manualmente
                      </UncontrolledTooltip>
                    </>
                  )}
                </div>
                <p className="text-muted mb-0 font-size-12">
                  <i className="mdi mdi-earth me-1"></i>
                  {location.country}
                  {location.ip && (
                    <span className="ms-2">
                      <i className="mdi mdi-ip-network me-1"></i>
                      {location.ip}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="d-flex gap-2">
              {isManualLocation && (
                <Button
                  color="light"
                  size="sm"
                  onClick={onResetLocation}
                  id="reset-location-btn"
                >
                  <i className="mdi mdi-refresh"></i>
                </Button>
              )}
              <Button color="warning" size="sm" onClick={toggleModal}>
                <i className="mdi mdi-pencil me-1"></i>
                Cambiar
              </Button>
            </div>
            {isManualLocation && (
              <UncontrolledTooltip placement="top" target="reset-location-btn">
                Detectar ubicación automáticamente
              </UncontrolledTooltip>
            )}
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Cambiar Ubicación</ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <Label for="country">País</Label>
              <Input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Ej: Bolivia"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="countryCode">Código de País</Label>
              <Input
                type="text"
                id="countryCode"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleInputChange}
                placeholder="Ej: BO"
                maxLength={2}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="region">Región/Departamento</Label>
              <Input
                type="text"
                id="region"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                placeholder="Ej: Santa Cruz"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="regionCode">Código de Región</Label>
              <Input
                type="text"
                id="regionCode"
                name="regionCode"
                value={formData.regionCode}
                onChange={handleInputChange}
                placeholder="Ej: SC"
                maxLength={3}
              />
            </FormGroup>

            <FormGroup>
              <Label for="city">Ciudad</Label>
              <Input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Ej: Santa Cruz de la Sierra"
                required
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="light" onClick={toggleModal}>
              Cancelar
            </Button>
            <Button color="primary" type="submit">
              <i className="mdi mdi-check me-1"></i>
              Guardar Ubicación
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default LocationSelector;
