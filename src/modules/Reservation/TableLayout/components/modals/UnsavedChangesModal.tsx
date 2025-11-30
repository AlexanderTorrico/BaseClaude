import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  zoneName: string;
  saving?: boolean;
  onCancel: () => void;
  onDiscard: () => void;
  onSave: () => void;
}

const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  zoneName,
  saving = false,
  onCancel,
  onDiscard,
  onSave,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={saving ? undefined : onCancel} centered>
      <ModalHeader toggle={saving ? undefined : onCancel}>
        <i className="mdi mdi-alert-circle-outline text-warning me-2"></i>
        Cambios sin guardar
      </ModalHeader>
      <ModalBody>
        <div className="text-center py-3">
          {saving ? (
            <>
              <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Guardando...</span>
              </div>
              <h5 className="mt-3 mb-2">Guardando cambios...</h5>
              <p className="text-muted mb-0">
                Por favor espera mientras guardamos las posiciones de las mesas.
              </p>
            </>
          ) : (
            <>
              <i className="mdi mdi-alert-circle-outline text-warning" style={{ fontSize: '4rem' }}></i>
              <h5 className="mt-3 mb-2">Tienes cambios sin guardar</h5>
              <p className="text-muted mb-0">
                Has realizado cambios en las posiciones de las mesas de la zona <strong>"{zoneName}"</strong>.
              </p>
              <p className="text-muted">
                ¿Qué deseas hacer con estos cambios?
              </p>
            </>
          )}
        </div>
      </ModalBody>
      <ModalFooter className="d-flex justify-content-center gap-2">
        <Button color="light" onClick={onCancel} disabled={saving}>
          <i className="mdi mdi-close me-1"></i>
          Cancelar
        </Button>
        <Button color="danger" outline onClick={onDiscard} disabled={saving}>
          <i className="mdi mdi-delete-outline me-1"></i>
          Descartar cambios
        </Button>
        <Button color="success" onClick={onSave} disabled={saving}>
          {saving ? (
            <>
              <i className="mdi mdi-loading mdi-spin me-1"></i>
              Guardando...
            </>
          ) : (
            <>
              <i className="mdi mdi-content-save me-1"></i>
              Guardar y continuar
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UnsavedChangesModal;
