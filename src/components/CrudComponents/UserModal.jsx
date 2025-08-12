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
import { opcionesFormulario } from "../CrudUtils/constants.js";

const UserModal = ({
  isOpen,
  toggle,
  esEdicion,
  datosFormulario,
  setDatosFormulario,
  onSave
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
          <h5 className="mb-0">{esEdicion ? "Editar Usuario" : "Nuevo Usuario"}</h5>
          <p className="text-muted mb-0">Complete la información del usuario</p>
        </div>
      </ModalHeader>
      <ModalBody className="p-4">
        <Form>
          <Row>
            <Col xs={12} className="mb-3">
              <FormGroup>
                <Label htmlFor="nombre">Nombre Completo *</Label>
                <Input
                  type="text"
                  id="nombre"
                  value={datosFormulario.nombre}
                  onChange={(e) => setDatosFormulario({...datosFormulario, nombre: e.target.value})}
                  placeholder="Ingresa el nombre completo"
                />
              </FormGroup>
            </Col>
            <Col xs={12} className="mb-3">
              <FormGroup>
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  type="email"
                  id="email"
                  value={datosFormulario.email}
                  onChange={(e) => setDatosFormulario({...datosFormulario, email: e.target.value})}
                  placeholder="correo@empresa.com"
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={12} className="mb-3">
              <FormGroup>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  type="text"
                  id="telefono"
                  value={datosFormulario.telefono}
                  onChange={(e) => setDatosFormulario({...datosFormulario, telefono: e.target.value})}
                  placeholder="+34 123 456 789"
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={12} className="mb-3">
              <FormGroup>
                <Label htmlFor="ciudad">Ciudad</Label>
                <Input
                  type="text"
                  id="ciudad"
                  value={datosFormulario.ciudad}
                  onChange={(e) => setDatosFormulario({...datosFormulario, ciudad: e.target.value})}
                  placeholder="Madrid"
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={12} className="mb-3">
              <FormGroup>
                <Label htmlFor="rol">Rol</Label>
                <CustomSelect
                  value={datosFormulario.rol}
                  onChange={(value) => setDatosFormulario({...datosFormulario, rol: value})}
                  options={opcionesFormulario.rol}
                  placeholder="Selecciona un rol"
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={12} className="mb-3">
              <FormGroup>
                <Label htmlFor="departamento">Departamento</Label>
                <CustomSelect
                  value={datosFormulario.departamento}
                  onChange={(value) => setDatosFormulario({...datosFormulario, departamento: value})}
                  options={opcionesFormulario.departamento}
                  placeholder="Selecciona un departamento"
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={12} className="mb-3">
              <FormGroup>
                <Label htmlFor="estado">Estado</Label>
                <CustomSelect
                  value={datosFormulario.estado}
                  onChange={(value) => setDatosFormulario({...datosFormulario, estado: value})}
                  options={opcionesFormulario.estado}
                  placeholder="Selecciona un estado"
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={12} className="mb-3">
              <FormGroup>
                <Label htmlFor="empresa">Empresa</Label>
                <Input
                  type="text"
                  id="empresa"
                  value={datosFormulario.empresa}
                  onChange={(e) => setDatosFormulario({...datosFormulario, empresa: e.target.value})}
                  placeholder="TechSoft"
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={12} className="mb-3">
              <FormGroup>
                <Label htmlFor="salario">Salario (€)</Label>
                <Input
                  type="number"
                  id="salario"
                  value={datosFormulario.salario}
                  onChange={(e) => setDatosFormulario({...datosFormulario, salario: parseInt(e.target.value)})}
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={12} className="mb-3">
              <FormGroup>
                <Label htmlFor="experiencia">Años de experiencia</Label>
                <Input
                  type="number"
                  id="experiencia"
                  value={datosFormulario.experiencia}
                  onChange={(e) => setDatosFormulario({...datosFormulario, experiencia: parseInt(e.target.value)})}
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter className="border-top">
        <div className="d-flex flex-column flex-sm-row gap-2 w-100 justify-content-end">
          <Button color="light" onClick={toggle} className="order-2 order-sm-1">
            Cancelar
          </Button>
          <Button color="primary" onClick={onSave} className="order-1 order-sm-2">
            <i className="mdi mdi-check me-1"></i>
            {esEdicion ? "Actualizar Usuario" : "Crear Usuario"}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default UserModal;