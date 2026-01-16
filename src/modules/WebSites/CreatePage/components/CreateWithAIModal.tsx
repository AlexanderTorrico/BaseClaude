import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Label,
    FormGroup,
    Spinner
} from 'reactstrap';
import { TemplateModel } from '../models/TemplateModel';

interface CreateWithAIModalProps {
    isOpen: boolean;
    toggle: () => void;
    pageName: string;
    onPageNameChange: (name: string) => void;
    prompt: string;
    onPromptChange: (prompt: string) => void;
    selectedTemplateId: number | null;
    onTemplateChange: (templateId: number) => void;
    templates: TemplateModel[];
    onGenerate: () => void;
    generating: boolean;
}

const CreateWithAIModal: React.FC<CreateWithAIModalProps> = ({
    isOpen,
    toggle,
    pageName,
    onPageNameChange,
    prompt,
    onPromptChange,
    selectedTemplateId,
    onTemplateChange,
    templates,
    onGenerate,
    generating
}) => {
    const isValid = pageName.trim().length > 0 && prompt.trim().length > 0 && selectedTemplateId !== null;

    return (
        <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
            <ModalHeader toggle={toggle}>
                <i className="mdi mdi-robot me-2 text-primary"></i>
                Crear Página con IA
            </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label for="templateSelect">Selecciona un diseño base</Label>
                    <Input
                        id="templateSelect"
                        type="select"
                        value={selectedTemplateId || ''}
                        onChange={(e) => onTemplateChange(Number(e.target.value))}
                        disabled={generating}
                    >
                        <option value="">-- Seleccionar diseño --</option>
                        {templates.map((template) => (
                            <option key={template.id} value={template.id}>
                                {template.name}
                            </option>
                        ))}
                    </Input>
                    <small className="text-muted">
                        La IA usará este diseño como base para crear tu página.
                    </small>
                </FormGroup>

                <FormGroup>
                    <Label for="pageName">Nombre de la página</Label>
                    <Input
                        id="pageName"
                        type="text"
                        placeholder="Ej: Mi tienda online"
                        value={pageName}
                        onChange={(e) => onPageNameChange(e.target.value)}
                        disabled={generating}
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="prompt">Describe tu negocio o página</Label>
                    <Input
                        id="prompt"
                        type="textarea"
                        rows={4}
                        placeholder="Ej: Tengo una tienda de ropa deportiva especializada en running y ciclismo. Quiero destacar mis productos premium y ofrecer envío gratis..."
                        value={prompt}
                        onChange={(e) => onPromptChange(e.target.value)}
                        disabled={generating}
                    />
                    <small className="text-muted">
                        Cuanto más detallada sea tu descripción, mejor será el resultado.
                    </small>
                </FormGroup>

                {generating && (
                    <div className="text-center py-3">
                        <Spinner color="primary" className="me-2" />
                        <span className="text-muted">Generando página con IA... Esto puede tardar unos minutos.</span>
                    </div>
                )}
            </ModalBody>
            <ModalFooter>
                <Button color="light" onClick={toggle} disabled={generating}>
                    Cancelar
                </Button>
                <Button
                    color="primary"
                    onClick={onGenerate}
                    disabled={!isValid || generating}
                >
                    {generating ? (
                        <>
                            <Spinner size="sm" className="me-2" />
                            Generando...
                        </>
                    ) : (
                        <>
                            <i className="mdi mdi-auto-fix me-1"></i>
                            Generar con IA
                        </>
                    )}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default CreateWithAIModal;
