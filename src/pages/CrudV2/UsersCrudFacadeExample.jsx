import React from "react";
import { Button } from "reactstrap";
import { CrudFacade } from "../../components/CrudFacade";
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
      {/* Vista Web - Se usa para table y card (si no hay CardView específico) */}
      <CrudFacade.WebView>
        {(webProps) => (
          <TableContent 
            {...webProps}
            fields={userFields}
          />
        )}
      </CrudFacade.WebView>

      {/* Vista Card - Override específico para vista de cards */}
      <CrudFacade.CardView>
        {(cardProps) => (
          <CardsContent 
            {...cardProps}
            fields={userFields}
            cardsPerRow={3}
          />
        )}
      </CrudFacade.CardView>

      {/* Modal personalizado - sólo el modal principal */}
      <CrudFacade.Modal>
        {({ 
          isOpen, 
          toggle, 
          isEditing,
          formData,
          setFormData,
          onSave
        }) => (
          <UserModal 
            isOpen={isOpen}
            toggle={toggle}
            esEdicion={isEditing}
            datosFormulario={formData || {}}
            setDatosFormulario={setFormData}
            onSave={onSave}
          />
        )}
      </CrudFacade.Modal>
    </CrudFacade>
  );
};

export default UsersCrudFacadeExample;