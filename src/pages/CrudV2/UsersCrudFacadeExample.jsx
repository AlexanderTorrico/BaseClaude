import React from "react";
import { Button } from "reactstrap";
import { CrudFacade } from "../../components/CrudFacade";
import DeleteModal from "../../components/Common/DeleteModal";
import UserModal from "../../components/CrudComponents/UserModal";
import { generateUsers } from "../../components/CrudUtils/userGenerator";
import { opcionesFormulario } from "./config/userConstants";

const userFields = {
  nombre: {
    label: 'Nombre Completo',
    type: 'text',
    required: true,
    sortable: true,
    filterable: true,
    defaultValue: ''
  },
  email: {
    label: 'Correo Electrónico',
    type: 'email',
    required: true,
    sortable: true,
    filterable: true,
    defaultValue: ''
  },
  telefono: {
    label: 'Teléfono',
    type: 'text',
    required: false,
    sortable: false,
    filterable: true,
    defaultValue: ''
  },
  rol: {
    label: 'Rol',
    type: 'select',
    required: true,
    sortable: true,
    filterable: true,
    options: opcionesFormulario.rol,
    defaultValue: 'Usuario'
  },
  departamento: {
    label: 'Departamento',
    type: 'select',
    required: true,
    sortable: true,
    filterable: true,
    options: opcionesFormulario.departamento,
    defaultValue: 'Administración'
  },
  estado: {
    label: 'Estado',
    type: 'select',
    required: true,
    sortable: true,
    filterable: true,
    options: opcionesFormulario.estado,
    defaultValue: 'Activo'
  },
  ciudad: {
    label: 'Ciudad',
    type: 'text',
    required: false,
    sortable: true,
    filterable: true,
    defaultValue: 'Madrid'
  },
  empresa: {
    label: 'Empresa',
    type: 'text',
    required: false,
    sortable: true,
    filterable: true,
    defaultValue: 'TechSoft'
  },
  salario: {
    label: 'Salario',
    type: 'number',
    required: false,
    sortable: true,
    filterable: true,
    format: 'currency',
    defaultValue: 30000
  },
  experiencia: {
    label: 'Años de Experiencia',
    type: 'number',
    required: false,
    sortable: true,
    filterable: true,
    defaultValue: 1
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

      {/* Modales usando el sistema de slots */}
      <CrudFacade.Modal>
        {({ 
          isOpen, 
          toggle, 
          deleteModal, 
          toggleDeleteModal, 
          confirmDelete, 
          isEditing,
          formData,
          setFormData,
          onSave,
          ...props 
        }) => (
          <>
            {/* Modal para crear/editar usuario */}
            <UserModal 
              isOpen={isOpen}
              toggle={toggle}
              esEdicion={isEditing}
              datosFormulario={formData || {}}
              setDatosFormulario={setFormData}
              onSave={onSave}
            />

            {/* Modal de eliminación */}
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