import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
} from "reactstrap";
import CustomSelect from "./CustomSelect";
import { opcionesFormulario } from "../../pages/CrudV2/config/userConstants.js";

const UserModal = ({
  isOpen,          // Boolean - Controls if the modal is open
  toggle,          // Function - Function to toggle modal visibility
  isEditing,       // Boolean - Indicates if we're editing (true) or creating (false)
  formData,        // Object - Form data for editing or creating
  setFormData,     // Function - Function to update form data
  onSave           // Function - Callback executed when saving
}) => {
  return (
    <Modal 
      isOpen={isOpen} 
      toggle={toggle} 
      size="lg"
      centered
      className="modal-responsive"
    >
      <ModalHeader toggle={toggle} className="border-bottom">
        <div>
          <h5 className="mb-0">{isEditing ? "Editar Usuario" : "Nuevo Usuario"}</h5>
          <p className="text-muted mb-0">Complete la información del usuario</p>
        </div>
      </ModalHeader>
      <ModalBody className="p-3">
        <Form>
          <Row>
            <Col xs={12} className="mb-2">
              <FormGroup>
                <Label htmlFor="nombre">Nombre Completo *</Label>
                <Input
                  type="text"
                  id="nombre"
                  value={formData.nombre || ''}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Ingresa el nombre completo"
                  bsSize="sm"
                />
              </FormGroup>
            </Col>
            <Col xs={12} className="mb-2">
              <FormGroup>
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  type="email"
                  id="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="correo@empresa.com"
                  bsSize="sm"
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={12} className="mb-2">
              <FormGroup>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  type="text"
                  id="telefono"
                  value={formData.telefono || ''}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  placeholder="+34 123 456 789"
                  bsSize="sm"
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={12} className="mb-2">
              <FormGroup>
                <Label htmlFor="ciudad">Ciudad</Label>
                <Input
                  type="text"
                  id="ciudad"
                  value={formData.ciudad || ''}
                  onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                  placeholder="Madrid"
                  bsSize="sm"
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={12} className="mb-2">
              <FormGroup>
                <Label htmlFor="rol">Rol</Label>
                <CustomSelect
                  value={formData.rol || 'Usuario'}
                  onChange={(value) => setFormData({...formData, rol: value})}
                  options={opcionesFormulario.rol}
                  placeholder="Selecciona un rol"
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={12} className="mb-2">
              <FormGroup>
                <Label htmlFor="departamento">Departamento</Label>
                <CustomSelect
                  value={formData.departamento || 'Administración'}
                  onChange={(value) => setFormData({...formData, departamento: value})}
                  options={opcionesFormulario.departamento}
                  placeholder="Selecciona un departamento"
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={12} className="mb-2">
              <FormGroup>
                <Label htmlFor="estado">Estado</Label>
                <CustomSelect
                  value={formData.estado || 'Activo'}
                  onChange={(value) => setFormData({...formData, estado: value})}
                  options={opcionesFormulario.estado}
                  placeholder="Selecciona un estado"
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={12} className="mb-2">
              <FormGroup>
                <Label htmlFor="empresa">Empresa</Label>
                <Input
                  type="text"
                  id="empresa"
                  value={formData.empresa || ''}
                  onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                  placeholder="TechSoft"
                  bsSize="sm"
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={12} className="mb-2">
              <FormGroup>
                <Label htmlFor="salario">Salario (€)</Label>
                <Input
                  type="number"
                  id="salario"
                  value={formData.salario || 0}
                  onChange={(e) => setFormData({...formData, salario: parseInt(e.target.value) || 0})}
                  bsSize="sm"
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={12} className="mb-2">
              <FormGroup>
                <Label htmlFor="experiencia">Años de experiencia</Label>
                <Input
                  type="number"
                  id="experiencia"
                  value={formData.experiencia || 0}
                  onChange={(e) => setFormData({...formData, experiencia: parseInt(e.target.value) || 0})}
                  bsSize="sm"
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter className="border-top">
        <div className="d-flex flex-column flex-sm-row gap-2 w-100 justify-content-end">
          <Button color="light" onClick={toggle} className="order-2 order-sm-1" size="sm">
            Cancelar
          </Button>
          <Button color="primary" onClick={onSave} className="order-1 order-sm-2" size="sm">
            <i className="mdi mdi-check me-1"></i>
            {isEditing ? "Actualizar Usuario" : "Crear Usuario"}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default UserModal;

