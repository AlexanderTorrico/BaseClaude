import React from "react";
import PropTypes from "prop-types";
import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";

const ProductModals = ({
  modals,
  setModals,
  onCreate,
  onUpdate,
  creating,
  updating,
  editingProduct
}) => {
  const handleCloseCreate = () => {
    setModals(prev => ({ ...prev, create: false }));
  };

  const handleCloseEdit = () => {
    setModals(prev => ({ ...prev, edit: false }));
  };

  return (
    <>
      <CreateProductModal
        isOpen={modals.create || false}
        onClose={handleCloseCreate}
        onCreate={onCreate}
        creating={creating}
      />

      <EditProductModal
        isOpen={modals.edit || false}
        onClose={handleCloseEdit}
        onUpdate={onUpdate}
        product={editingProduct}
        updating={updating}
      />
    </>
  );
};

ProductModals.propTypes = {
  modals: PropTypes.object.isRequired,
  setModals: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  creating: PropTypes.bool,
  updating: PropTypes.bool,
  editingProduct: PropTypes.object
};

ProductModals.defaultProps = {
  creating: false,
  updating: false,
  editingProduct: null
};

export default ProductModals;