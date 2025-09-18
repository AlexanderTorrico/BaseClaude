import React from "react";
import {
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Progress
} from "reactstrap";
import { User } from "@/models";
import { obtenerBadgeEstado, obtenerColorRendimiento } from "../CrudUtils/userHelpers";

interface UserCardProps {
  usuario: User & {
    nombre: string;
    rol: string;
    estado: string;
    departamento: string;
    telefono: string;
    ciudad: string;
    rendimiento: number;
    proyectos: number;
    experiencia: number;
    salario: number;
    ultimaActividad: string;
  };
  onEdit: (user: UserCardProps['usuario']) => void;
  onDelete: (user: UserCardProps['usuario']) => void;
}

const UserCard: React.FC<UserCardProps> = ({ usuario, onEdit, onDelete }) => {
  return (
    <Card className="user-card h-100 shadow-sm border-0">
      <CardBody className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center">
            <div className="avatar-md rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3">
              {usuario.nombre.charAt(0)}
            </div>
            <div>
              <h6 className="mb-1 font-weight-bold">{usuario.nombre}</h6>
              <p className="text-muted mb-0 small">{usuario.rol}</p>
            </div>
          </div>
          
          <UncontrolledDropdown>
            <DropdownToggle tag="button" className="btn btn-light btn-sm">
              <i className="mdi mdi-dots-vertical"></i>
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem onClick={() => onEdit(usuario)}>
                <i className="mdi mdi-pencil me-2"></i>Editar
              </DropdownItem>
              <DropdownItem onClick={() => onDelete(usuario)}>
                <i className="mdi mdi-delete me-2"></i>Eliminar
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>
                <i className="mdi mdi-eye me-2"></i>Ver perfil
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          {obtenerBadgeEstado(usuario.estado)}
          <span className="badge bg-light text-dark">{usuario.departamento}</span>
        </div>

        <div className="mb-3">
          <p className="mb-1 small text-muted">
            <i className="mdi mdi-email-outline me-2"></i>
            {usuario.email}
          </p>
          <p className="mb-1 small text-muted">
            <i className="mdi mdi-phone me-2"></i>
            {usuario.telefono}
          </p>
          <p className="mb-0 small text-muted">
            <i className="mdi mdi-map-marker me-2"></i>
            {usuario.ciudad}
          </p>
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <small className="text-muted">Rendimiento</small>
            <small className="font-weight-bold">{usuario.rendimiento}%</small>
          </div>
          <Progress 
            value={usuario.rendimiento} 
            color={obtenerColorRendimiento(usuario.rendimiento)}
            className="progress-sm"
          />
        </div>

        <div className="row g-2 mt-3 pt-3 border-top">
          <div className="col-4 text-center">
            <h6 className="mb-0">{usuario.proyectos}</h6>
            <small className="text-muted">Proyectos</small>
          </div>
          <div className="col-4 text-center">
            <h6 className="mb-0">{usuario.experiencia}</h6>
            <small className="text-muted">Años exp.</small>
          </div>
          <div className="col-4 text-center">
            <h6 className="mb-0">€{(usuario.salario / 1000).toFixed(0)}K</h6>
            <small className="text-muted">Salario</small>
          </div>
        </div>

        <div className="mt-3 pt-3 border-top">
          <small className="text-muted">
            <i className="mdi mdi-clock-outline me-1"></i>
            {usuario.ultimaActividad}
          </small>
        </div>
      </CardBody>
    </Card>
  );
};

export default UserCard;
