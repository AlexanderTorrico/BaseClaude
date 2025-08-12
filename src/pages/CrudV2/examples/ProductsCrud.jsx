import React from "react";
import { Button } from "reactstrap";
import { CrudFacade } from "../../../components/CrudFacade";
import DeleteModal from "../../../components/Common/DeleteModal";
import { generateProducts, productFields } from "./data/productsData";

const ProductsCrud = () => {
  return (
    <CrudFacade 
      entity="productos"
      title="Gestión de Productos"
      description="Sistema de administración de productos con inventario"
      fields={productFields}
      dataGenerator={generateProducts}
      defaultViewMode="cards"
    >
      {/* Ejemplo de botones personalizados en el header */}
      <CrudFacade.HeaderActions>
        {({ viewMode, setViewMode, selectedItems, onAddItem, onBulkDelete }) => (
          <div className="d-flex flex-wrap gap-2 justify-content-lg-end justify-content-center">
            <Button color="success" size="sm">
              <i className="mdi mdi-upload me-1"></i>
              Importar
            </Button>
            
            <Button color="info" outline size="sm">
              <i className="mdi mdi-download me-1"></i>
              Exportar
            </Button>
            
            <Button color="primary" onClick={onAddItem} size="sm">
              <i className="mdi mdi-plus me-1"></i>
              Nuevo Producto
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

      {/* Modal personalizado para productos */}
      <CrudFacade.Modal>
        {({ isOpen, toggle, deleteModal, toggleDeleteModal, confirmDelete, ...props }) => (
          <>
            {/* Aquí puedes agregar tu modal personalizado para productos */}
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

export default ProductsCrud;