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

interface CreateWithAIModalProps {
    isOpen: boolean;
    toggle: () => void;
    pageName: string;
    onPageNameChange: (name: string) => void;
    prompt: string;
    onPromptChange: (prompt: string) => void;
    selectedTemplateId: number | null;
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
                    <div className="py-4">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="text-muted" style={{ fontSize: '13px' }}>
                                <i className="mdi mdi-robot me-1"></i>
                                Generando página con IA...
                            </span>
                            <span className="text-muted" style={{ fontSize: '12px' }}>
                                Esto puede tardar unos minutos
                            </span>
                        </div>
                        <div
                            style={{
                                height: '8px',
                                background: '#e9ecef',
                                borderRadius: '4px',
                                overflow: 'hidden'
                            }}
                        >
                            <div
                                style={{
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: '4px',
                                    animation: 'progressAnimation 2s ease-in-out infinite',
                                    width: '30%'
                                }}
                            />
                        </div>
                        <style>
                            {`
                                @keyframes progressAnimation {
                                    0% { width: 5%; margin-left: 0; }
                                    50% { width: 40%; margin-left: 30%; }
                                    100% { width: 5%; margin-left: 95%; }
                                }
                            `}
                        </style>
                        <div className="d-flex align-items-center justify-content-center mt-3 gap-3">
                            <span style={{
                                fontSize: '12px',
                                color: '#667eea',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <i className="mdi mdi-check-circle"></i>
                                Procesando prompt
                            </span>
                            <span style={{
                                fontSize: '12px',
                                color: '#9ca3af',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <i className="mdi mdi-loading mdi-spin"></i>
                                Generando contenido
                            </span>
                            <span style={{
                                fontSize: '12px',
                                color: '#d1d5db',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <i className="mdi mdi-circle-outline"></i>
                                Finalizando
                            </span>
                        </div>
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
