import React from "react";
import { CrudFacade } from "../../components/CrudFacade";
import { generateAtomos } from "../../components/CrudUtils/atomoGenerator";
import { atomoFields } from "./config/atomoFieldsConfig";
import TableContent from "./components/TableContent";
import CardsContent from "./components/CardsContent";

const AtomoCrudFacadeExample = () => {
  return (
    <CrudFacade 
      entity="atomos"
      title="Gestión de Elementos Químicos"
      description="Sistema de administración de elementos atómicos de la tabla periódica"
      fields={atomoFields}
      dataGenerator={generateAtomos}
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

      {/* Modal personalizado - usando el modal genérico */}
      <CrudFacade.Modal>
        {({ 
          isOpen,        // Boolean - Controla si el modal está abierto o cerrado
          toggle,        // Function - Función para alternar el estado del modal (abrir/cerrar)
          isEditing,     // Boolean - Indica si estamos en modo edición (true) o creación (false)
          formData,      // Object - Datos del formulario para editar o crear
          setFormData,   // Function - Función para actualizar los datos del formulario
          onSave         // Function - Callback que se ejecuta al guardar el formulario
        }) => (
          <div>
            {/* Aquí se puede implementar un modal específico para átomos si es necesario */}
            {/* Por ahora usamos el comportamiento por defecto del CrudFacade */}
            {isOpen && (
              <div className="modal show d-block" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">
                        {isEditing ? 'Editar Elemento' : 'Nuevo Elemento'}
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={toggle}
                      />
                    </div>
                    <div className="modal-body">
                      <p className="text-muted">
                        Modal para {isEditing ? 'editar' : 'crear'} elementos químicos.
                      </p>
                      <p className="small text-info">
                        Implementación del modal específico para átomos pendiente.
                      </p>
                      {formData && (
                        <pre className="bg-light p-3 rounded">
                          {JSON.stringify(formData, null, 2)}
                        </pre>
                      )}
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={toggle}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          onSave(formData || {});
                          toggle();
                        }}
                      >
                        {isEditing ? 'Actualizar' : 'Crear'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CrudFacade.Modal>
    </CrudFacade>
  );
};

export default AtomoCrudFacadeExample;