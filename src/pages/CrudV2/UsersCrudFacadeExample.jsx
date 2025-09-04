import React from "react";
import { Button } from "reactstrap";
import { CrudFacade } from "../../components/CrudFacade";
import DeleteModal from "../../components/Common/DeleteModal";
import UserModal from "../../components/CrudComponents/UserModal";
import { generateUsers } from "../../components/CrudUtils/userGenerator";
import { userFields } from "./config/userFieldsConfig";
import TableContent from "./components/TableContent";
import CardsContent from "./components/CardsContent";

const UsersCrudFacadeExample = () => {
  return (
    <CrudFacade 
      entity="usuarios"
      title="Gestión de Usuarios V2"
      description="Sistema moderno de administración de usuarios con filtros avanzados"
      fields={userFields}
      dataGenerator={generateUsers}
      defaultViewMode="auto"
      breakpoints={{
        mobile: 768,
        tablet: 1024,
        desktop: 1200
      }}
    >
      {/* Contenido de tabla personalizado */}
      <CrudFacade.TableSlot>
        {(tableProps) => (
          <TableContent 
            {...tableProps}
            fields={userFields}
          />
        )}
      </CrudFacade.TableSlot>

      {/* Contenido de cards personalizado */}
      <CrudFacade.CardsSlot>
        {(cardsProps) => (
          <CardsContent 
            {...cardsProps}
            fields={userFields}
            cardsPerRow={responsiveConfig.layout[deviceType]?.cardsPerRow || 3}
          />
        )}
      </CrudFacade.CardsSlot>

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