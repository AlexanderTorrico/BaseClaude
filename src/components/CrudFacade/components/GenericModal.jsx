import React from "react";
import PropTypes from "prop-types";
import DeleteModal from "../../Common/DeleteModal";

/**
 * Componente genérico para manejo de modales en CRUD
 * Encapsula la lógica común y permite personalizar el modal específico
 */
const GenericModal = ({ 
  children, 
  deleteModalProps = {} 
}) => {
  return (
    <>
      {/* Modal personalizable */}
      {children}

      {/* Modal de eliminación genérico */}
      <DeleteModal
        show={deleteModalProps.show || false}
        onDeleteClick={deleteModalProps.onDeleteClick}
        onCloseClick={deleteModalProps.onCloseClick}
        title={deleteModalProps.title}
        message={deleteModalProps.message}
        {...deleteModalProps}
      />
    </>
  );
};

GenericModal.propTypes = {
  // Modal principal personalizable
  children: PropTypes.node,
  
  // Props para el modal de eliminación
  deleteModalProps: PropTypes.shape({
    show: PropTypes.bool,
    onDeleteClick: PropTypes.func,
    onCloseClick: PropTypes.func,
    title: PropTypes.string,
    message: PropTypes.string
  })
};

export default GenericModal;