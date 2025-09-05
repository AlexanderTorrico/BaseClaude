import React from "react";
import PropTypes from "prop-types";
import DeleteModal from "../../Common/DeleteModal";

/**
 * Componente genérico para manejo de modales en CRUD
 * Encapsula la lógica común y permite personalizar el modal específico
 * 
 * @param {React.Node} children - Modal personalizable (render prop o JSX)
 * @param {Object} deleteModalProps - Props para el modal de eliminación
 * @param {Boolean} deleteModalProps.show - Controla si el modal de eliminación está visible
 * @param {Function} deleteModalProps.onDeleteClick - Callback cuando se confirma la eliminación
 * @param {Function} deleteModalProps.onCloseClick - Callback cuando se cierra el modal
 * @param {String} deleteModalProps.title - Título personalizado del modal de eliminación
 * @param {String} deleteModalProps.message - Mensaje personalizado del modal de eliminación
 */
const GenericModal = ({ 
  children,              // React.Node - Custom modal content (render prop or JSX)
  deleteModalProps = {}  // Object - Props for delete modal configuration
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