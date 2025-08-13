import React from "react";
import { Button } from "reactstrap";
import { CrudFacade } from "../../components/CrudFacade";
import DeleteModal from "../../components/Common/DeleteModal";
import { generateUsers } from "../../components/CrudUtils/userGenerator";
import { opcionesFormulario } from "../../components/CrudUtils/constants";

const userFields = {
  nombre: {
    label: 'Nombre Completo',
    type: 'text',
    required: true,
    sortable: true,
    filterable: true
  },
  email: {
    label: 'Correo Electrónico',
    type: 'email',
    required: true,
    sortable: true,
    filterable: true
  },
  telefono: {
    label: 'Teléfono',
    type: 'text',
    required: false,
    sortable: false,
    filterable: true
  },
  rol: {
    label: 'Rol',
    type: 'select',
    required: true,
    sortable: true,
    filterable: true,
    options: opcionesFormulario.rol
  },
  departamento: {
    label: 'Departamento',
    type: 'select',
    required: true,
    sortable: true,
    filterable: true,
    options: opcionesFormulario.departamento
  },
  estado: {
    label: 'Estado',
    type: 'select',
    required: true,
    sortable: true,
    filterable: true,
    options: opcionesFormulario.estado
  },
  ciudad: {
    label: 'Ciudad',
    type: 'text',
    required: false,
    sortable: true,
    filterable: true
  },
  empresa: {
    label: 'Empresa',
    type: 'text',
    required: false,
    sortable: true,
    filterable: true
  },
  salario: {
    label: 'Salario',
    type: 'number',
    required: false,
    sortable: true,
    filterable: true,
    format: 'currency'
  },
  experiencia: {
    label: 'Años de Experiencia',
    type: 'number',
    required: false,
    sortable: true,
    filterable: true
  }
};

const UsersCrudFacadeExample = () => {
  return (
    <CrudFacade 
      entity="usuarios"
      title="Gestión de Usuarios V2"
      description="Sistema moderno de administración de usuarios con filtros avanzados"
      fields={userFields}
      dataGenerator={generateUsers}
      defaultViewMode="cards"
    >
      {/* Header usa botones por defecto del facade */}

      {/* Modal usando el sistema de slots */}
      <CrudFacade.Modal>
        {({ isOpen, toggle, deleteModal, toggleDeleteModal, confirmDelete, ...props }) => (
          <>
            {/* Aquí se puede agregar modal personalizado para usuarios */}
            {/* Por ahora usamos el modal de eliminación existente */}
            <DeleteModal
              show={deleteModal}
              onDeleteClick={confirmDelete}
              onCloseClick={toggleDeleteModal}
            />
          </>
        )}
      </CrudFacade.Modal>
    </CrudFacade>
  );
};

export default UsersCrudFacadeExample;