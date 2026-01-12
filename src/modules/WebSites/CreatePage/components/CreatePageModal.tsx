import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner
} from 'reactstrap';
import { useTranslation } from 'react-i18next';

interface CreatePageModalProps {
  isOpen: boolean;
  toggle: () => void;
  pageName: string;
  onPageNameChange: (name: string) => void;
  onGenerate: () => Promise<void>;
  generating: boolean;
  selectedTemplateName: string;
}

const CreatePageModal: React.FC<CreatePageModalProps> = ({
  isOpen,
  toggle,
  pageName,
  onPageNameChange,
  onGenerate,
  generating,
  selectedTemplateName
}) => {
  const { t } = useTranslation();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && pageName.trim() && !generating) {
      onGenerate();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        {t("createPage.modal.title") || "Nombra tu página"}
      </ModalHeader>
      <ModalBody>
        {selectedTemplateName && (
          <div className="mb-3 p-2 bg-light rounded">
            <small className="text-muted">{t("createPage.modal.template") || "Template seleccionado"}:</small>
            <div className="fw-medium">{selectedTemplateName}</div>
          </div>
        )}
        <FormGroup>
          <Label for="pageName">{t("createPage.modal.pageName") || "Nombre de la página"}</Label>
          <Input
            type="text"
            id="pageName"
            placeholder={t("createPage.modal.placeholder") || "Ej. Mi Nuevo Sitio"}
            value={pageName}
            onChange={(e) => onPageNameChange(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="light" onClick={toggle} disabled={generating}>
          {t("createPage.cancel") || "Cancelar"}
        </Button>
        <Button
          color="primary"
          onClick={onGenerate}
          disabled={generating || !pageName.trim()}
        >
          {generating ? (
            <>
              <Spinner size="sm" className="me-2" />
              {t("createPage.modal.processing") || "Procesando..."}
            </>
          ) : (
            t("createPage.modal.create") || "Crear"
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreatePageModal;
