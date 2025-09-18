import React from "react";
import { CrudFacade } from "../../components/CrudFacade";
import UserModal from "../../components/CrudComponents/UserModal";
import { generateUsers } from "../../components/CrudUtils/userGenerator";
import { userFields } from "./config/userFieldsConfig";
import TableContent from "./components/TableContent";
import CardsContent from "./components/CardsContent";

const UsersCrudFacadeExample: React.FC = () => {
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
      {/* Vista Web - Se usa para table (vista por defecto en escritorio) */}
      <CrudFacade.WebView>
        {(webProps) => (
          <TableContent {...webProps} />
        )}
      </CrudFacade.WebView>

      {/* Vista Card - Se usa para cards (vista por defecto en móvil) */}
      <CrudFacade.CardView>
        {(cardProps) => (
          <CardsContent 
            {...cardProps}
            cardsPerRow={3}
          />
        )}
      </CrudFacade.CardView>

      {/* Modal personalizado - sólo el modal principal */}
      <CrudFacade.Modal>
        {({ 
          isOpen,        // Boolean - Controla si el modal está abierto o cerrado
          toggle,        // Function - Función para alternar el estado del modal (abrir/cerrar)
          isEditing,     // Boolean - Indica si estamos en modo edición (true) o creación (false)
          formData,      // Object - Datos del formulario para editar o crear
          setFormData,   // Function - Función para actualizar los datos del formulario
          onSave         // Function - Callback que se ejecuta al guardar el formulario
        }) => (
          <UserModal 
            isOpen={isOpen}
            toggle={toggle}
            isEditing={isEditing}
            formData={formData || {}}
            setFormData={setFormData}
            onSave={onSave}
          />
        )}
      </CrudFacade.Modal>
    </CrudFacade>
  );
};

export default UsersCrudFacadeExample;