import React, { useState, useEffect } from 'react';
import { Container, Card, CardBody, Spinner, Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { RubroModel, RubroTemplatePageModel } from './models';
import { AIContentApiService } from './services';

const RubroDetail: React.FC = () => {
    const { rubroId } = useParams<{ rubroId: string }>();
    const navigate = useNavigate();

    const [rubro, setRubro] = useState<RubroModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [verifyingId, setVerifyingId] = useState<number | null>(null);

    // Modal de verificación
    const [verifyModalOpen, setVerifyModalOpen] = useState(false);
    const [verifyTemplateId, setVerifyTemplateId] = useState<number | null>(null);
    const [verifyDescription, setVerifyDescription] = useState('');

    const service = new AIContentApiService();

    const fetchRubro = async () => {
        if (!rubroId) return;

        setError(null);
        setLoading(true);

        // Obtener rubro con template_pages incluidos
        const rubroResponse = await service.getRubroById(parseInt(rubroId));

        if (rubroResponse.status === 200 && rubroResponse.data) {
            let rubroData = rubroResponse.data;

            // Obtener verificaciones de los templates
            const verificationsResponse = await service.getTemplatesWithVerifications(parseInt(rubroId));

            if (verificationsResponse.status === 200 && verificationsResponse.data) {
                // Mapear los datos de verificación a los template_pages existentes
                const verificationsMap = new Map(
                    verificationsResponse.data.map((tp: any) => [tp.id, tp])
                );

                if (rubroData.template_pages) {
                    rubroData = {
                        ...rubroData,
                        template_pages: rubroData.template_pages.map((tp: RubroTemplatePageModel) => {
                            const verificationData = verificationsMap.get(tp.id) as any;
                            return {
                                ...tp,
                                verification_count: verificationData?.verification_count || verificationData?.verifications_count || 0,
                                verified_by_current_user: verificationData?.verified_by_current_user || false
                            };
                        })
                    };
                }
            }

            setRubro(rubroData);
        } else {
            setError('Error al cargar el rubro');
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchRubro();
    }, [rubroId]);

    const handleViewSections = (templatePageId: number) => {
        navigate(`/websites/ai-content/${rubroId}/template/${templatePageId}`);
    };

    const openVerifyModal = (templatePageId: number) => {
        setVerifyTemplateId(templatePageId);
        setVerifyDescription('');
        setVerifyModalOpen(true);
    };

    const closeVerifyModal = () => {
        setVerifyModalOpen(false);
        setVerifyTemplateId(null);
        setVerifyDescription('');
    };

    const handleVerify = async () => {
        if (!verifyTemplateId || !verifyDescription.trim()) return;

        setVerifyingId(verifyTemplateId);
        closeVerifyModal();

        try {
            const response = await service.verifyTemplate(verifyTemplateId, verifyDescription.trim());
            if (response.status === 200 || response.status === 201) {
                // Actualizar el contador de verificaciones localmente
                if (rubro && rubro.template_pages) {
                    const updatedTemplates = rubro.template_pages.map(tp => {
                        if (tp.id === verifyTemplateId) {
                            return {
                                ...tp,
                                verification_count: (tp.verification_count || 0) + 1,
                                verified_by_current_user: true
                            };
                        }
                        return tp;
                    });
                    setRubro({ ...rubro, template_pages: updatedTemplates });
                }
            }
        } catch (error) {
            console.error('Error al verificar:', error);
        } finally {
            setVerifyingId(null);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="page-content">
                <Container fluid>
                    <div className="text-center py-5">
                        <Spinner color="primary" />
                        <p className="text-muted mt-2">Cargando rubro...</p>
                    </div>
                </Container>
            </div>
        );
    }

    if (error || !rubro) {
        return (
            <div className="page-content">
                <Container fluid>
                    <Alert color="danger">
                        <i className="mdi mdi-alert-circle me-2"></i>
                        {error || 'Rubro no encontrado'}
                    </Alert>
                    <Button color="light" onClick={() => navigate('/websites/ai-content')}>
                        <i className="mdi mdi-arrow-left me-1"></i>
                        Volver
                    </Button>
                </Container>
            </div>
        );
    }

    return (
        <div className="page-content">
            <Container fluid>
                {/* Breadcrumb */}
                <div className="mb-3">
                    <Button
                        color="link"
                        className="p-0 text-muted"
                        onClick={() => navigate('/websites/ai-content')}
                    >
                        <i className="mdi mdi-arrow-left me-1"></i>
                        Volver a Rubros
                    </Button>
                </div>

                {/* Header - Diseño moderno con gradiente */}
                <Card
                    className="mb-4 border-0 overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '16px'
                    }}
                >
                    <CardBody className="py-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <div
                                    className="d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: '56px',
                                        height: '56px',
                                        background: 'rgba(255,255,255,0.2)',
                                        borderRadius: '14px',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                >
                                    <i className="mdi mdi-tag text-white" style={{ fontSize: '28px' }}></i>
                                </div>
                                <div>
                                    <h4 className="mb-1 text-white text-capitalize fw-semibold" style={{ fontSize: '22px' }}>
                                        {rubro.name}
                                    </h4>
                                    <div className="d-flex align-items-center text-white-50" style={{ fontSize: '13px' }}>
                                        <i className="mdi mdi-clock-outline me-1"></i>
                                        Creado: {formatDate(rubro.created_at)}
                                    </div>
                                </div>
                            </div>
                            <div
                                className="px-4 py-2 text-white fw-semibold"
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    borderRadius: '25px',
                                    backdropFilter: 'blur(10px)',
                                    fontSize: '14px'
                                }}
                            >
                                {rubro.template_pages?.length ?? 0} diseños
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Templates list - Encabezado de sección */}
                <div className="d-flex align-items-center mb-4">
                    <div
                        className="d-flex align-items-center justify-content-center me-2"
                        style={{
                            width: '32px',
                            height: '32px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '8px'
                        }}
                    >
                        <i className="mdi mdi-palette text-white" style={{ fontSize: '16px' }}></i>
                    </div>
                    <h5 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
                        Diseños Generados
                    </h5>
                </div>

                {(!rubro.template_pages || rubro.template_pages.length === 0) ? (
                    <Card
                        className="border-0"
                        style={{
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            background: 'linear-gradient(135deg, #f8f9ff 0%, #f5f0ff 100%)'
                        }}
                    >
                        <CardBody className="text-center py-5">
                            <i className="mdi mdi-folder-open-outline text-muted" style={{ fontSize: '48px' }}></i>
                            <p className="text-muted mt-3 mb-0">No hay diseños asociados a este rubro</p>
                        </CardBody>
                    </Card>
                ) : (
                    <Card
                        className="border-0"
                        style={{
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f8f9ff', borderBottom: '1px solid #edf0f5' }}>
                                        <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            ID
                                        </th>
                                        <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Template
                                        </th>
                                        <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Idioma
                                        </th>
                                        <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Versión
                                        </th>
                                        <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Fecha
                                        </th>
                                        <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>
                                            Verificaciones
                                        </th>
                                        <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rubro.template_pages.map((tp: RubroTemplatePageModel, index: number) => (
                                        <tr
                                            key={tp.id}
                                            style={{
                                                borderBottom: index < rubro.template_pages!.length - 1 ? '1px solid #f0f0f5' : 'none',
                                                transition: 'background 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#fafbfc'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={{ padding: '16px 20px' }}>
                                                <span
                                                    style={{
                                                        background: '#f0f0f5',
                                                        color: '#6c757d',
                                                        padding: '4px 10px',
                                                        borderRadius: '6px',
                                                        fontSize: '13px',
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    #{tp.id}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 20px' }}>
                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className="d-flex align-items-center justify-content-center me-2"
                                                        style={{
                                                            width: '28px',
                                                            height: '28px',
                                                            background: '#eef2ff',
                                                            borderRadius: '6px'
                                                        }}
                                                    >
                                                        <i className="mdi mdi-file-document-outline" style={{ color: '#667eea', fontSize: '14px' }}></i>
                                                    </div>
                                                    <span style={{ fontSize: '14px', color: '#1a1a2e', fontWeight: 500 }}>
                                                        Template {tp.template_page_id}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 20px' }}>
                                                <div className="d-flex align-items-center">
                                                    <i className="mdi mdi-translate me-1" style={{ color: '#764ba2' }}></i>
                                                    <span style={{ fontSize: '14px', color: '#4a5568' }}>
                                                        {tp.language}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 20px' }}>
                                                <span
                                                    style={{
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        color: '#fff',
                                                        padding: '4px 12px',
                                                        borderRadius: '12px',
                                                        fontSize: '12px',
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    v{tp.version}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 20px' }}>
                                                <span style={{ fontSize: '13px', color: '#6c757d' }}>
                                                    {formatDate(tp.created_at)}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                                <div className="d-flex align-items-center justify-content-center gap-2">
                                                    <span
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            fontSize: '13px',
                                                            color: tp.verification_count ? '#22c55e' : '#9ca3af',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        <i className={`mdi ${tp.verification_count ? 'mdi-check-circle' : 'mdi-circle-outline'}`}></i>
                                                        {tp.verification_count || 0}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                                <div className="d-flex align-items-center justify-content-end gap-2">
                                                    <button
                                                        onClick={() => openVerifyModal(tp.id)}
                                                        disabled={verifyingId === tp.id}
                                                        style={{
                                                            background: tp.verified_by_current_user ? '#22c55e' : '#f0fdf4',
                                                            border: '1px solid #22c55e',
                                                            color: tp.verified_by_current_user ? '#fff' : '#22c55e',
                                                            padding: '8px 14px',
                                                            borderRadius: '8px',
                                                            fontSize: '13px',
                                                            fontWeight: 500,
                                                            cursor: verifyingId === tp.id ? 'not-allowed' : 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            opacity: verifyingId === tp.id ? 0.7 : 1
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (!tp.verified_by_current_user && verifyingId !== tp.id) {
                                                                e.currentTarget.style.background = '#22c55e';
                                                                e.currentTarget.style.color = '#fff';
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (!tp.verified_by_current_user) {
                                                                e.currentTarget.style.background = '#f0fdf4';
                                                                e.currentTarget.style.color = '#22c55e';
                                                            }
                                                        }}
                                                    >
                                                        <i className={`mdi ${verifyingId === tp.id ? 'mdi-loading mdi-spin' : 'mdi-plus-circle-outline'}`}></i>
                                                        Verificar
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewSections(tp.id)}
                                                        style={{
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            border: 'none',
                                                            color: '#fff',
                                                            padding: '8px 16px',
                                                            borderRadius: '8px',
                                                            fontSize: '13px',
                                                            fontWeight: 500,
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '6px'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.transform = 'translateY(0)';
                                                            e.currentTarget.style.boxShadow = 'none';
                                                        }}
                                                    >
                                                        <i className="mdi mdi-eye-outline"></i>
                                                        Ver Secciones
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {/* Modal de verificación */}
                <Modal isOpen={verifyModalOpen} toggle={closeVerifyModal}>
                    <ModalHeader toggle={closeVerifyModal}>
                        <i className="mdi mdi-check-circle-outline me-2" style={{ color: '#22c55e' }}></i>
                        Verificar Template
                    </ModalHeader>
                    <ModalBody>
                        <p style={{ color: '#4a5568', marginBottom: '16px' }}>
                            Ingresa una descripción de la verificación realizada:
                        </p>
                        <Input
                            type="textarea"
                            rows={3}
                            placeholder="Ej: Textos e imágenes revisadas, todo correcto..."
                            value={verifyDescription}
                            onChange={(e) => setVerifyDescription(e.target.value)}
                            style={{
                                borderRadius: '8px',
                                border: '1px solid #e0e6ed'
                            }}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="light" onClick={closeVerifyModal}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleVerify}
                            disabled={!verifyDescription.trim() || verifyingId !== null}
                            style={{
                                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                border: 'none'
                            }}
                        >
                            <i className="mdi mdi-check me-1"></i>
                            Confirmar Verificación
                        </Button>
                    </ModalFooter>
                </Modal>
            </Container>
        </div>
    );
};

export default RubroDetail;
