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
      title="Gestión de Usuarios con Facade"
      description="Sistema moderno de administración de usuarios usando el patrón facade"
      fields={userFields}
      dataGenerator={generateUsers}
      defaultViewMode="cards"
    >
      {/* Ejemplo de botones personalizados en el header */}
      <CrudFacade.HeaderActions>
        {({ viewMode, setViewMode, selectedItems, onAddItem, onBulkDelete }) => (
          <div className="d-flex flex-wrap gap-2 justify-content-lg-end justify-content-center">
            <Button color="success" size="sm">
              <i className="mdi mdi-upload me-1"></i>
              Importar CSV
            </Button>
            
            <Button color="info" outline size="sm">
              <i className="mdi mdi-download me-1"></i>
              Exportar Excel
            </Button>
            
            <Button color="primary" onClick={onAddItem} size="sm">
              <i className="mdi mdi-plus me-1"></i>
              Nuevo Usuario
            </Button>
            
            {selectedItems.length > 0 && (
              <Button color="danger" outline onClick={onBulkDelete} size="sm">
                <i className="mdi mdi-delete me-1"></i>
                Eliminar ({selectedItems.length})
              </Button>
            )}

            <div className="btn-group d-none d-md-flex" role="group">
              <Button 
                color={viewMode === 'cards' ? 'primary' : 'light'}
                onClick={() => setViewMode('cards')}
                size="sm"
                title="Vista de tarjetas"
              >
                <i className="mdi mdi-view-grid"></i>
              </Button>
              <Button 
                color={viewMode === 'table' ? 'primary' : 'light'}
                onClick={() => setViewMode('table')}
                size="sm"
                title="Vista de tabla"
              >
                <i className="mdi mdi-view-list"></i>
              </Button>
            </div>
          </div>
        )}
      </CrudFacade.HeaderActions>

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