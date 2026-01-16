import React, { useState, useEffect } from 'react';
import {
    Container, Card, CardBody, CardHeader, Spinner, Alert, Button,
    Input, Collapse, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SectionsResponse, SectionTextModel, SectionImageModel } from './models';
import { AIContentApiService } from './services';

const SectionViewer: React.FC = () => {
    const { rubroId, templatePageId } = useParams<{ rubroId: string; templatePageId: string }>();
    const navigate = useNavigate();

    const [data, setData] = useState<SectionsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openSections, setOpenSections] = useState<number[]>([]);
    const [editingText, setEditingText] = useState<string | null>(null); // "sectionId-textId"
    const [editValue, setEditValue] = useState('');
    const [saving, setSaving] = useState(false);

    // Estado para edición de imágenes
    const [editingImage, setEditingImage] = useState<{ sectionId: number; image: SectionImageModel; imageIndex: number } | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [savingImage, setSavingImage] = useState(false);

    // Estado para verificación
    const [verifying, setVerifying] = useState(false);
    const [verificationCount, setVerificationCount] = useState(0);
    const [verifiedByCurrentUser, setVerifiedByCurrentUser] = useState(false);

    // Modal de verificación
    const [verifyModalOpen, setVerifyModalOpen] = useState(false);
    const [verifyDescription, setVerifyDescription] = useState('');

    const service = new AIContentApiService();

    const fetchSections = async () => {
        if (!templatePageId) return;

        setError(null);
        const response = await service.getSectionsByTemplatePage(parseInt(templatePageId), setLoading);

        if (response.status === 200 && response.data) {
            setData(response.data);
            // Abrir primera sección por defecto
            const sections = response.data.sections;
            if (sections && sections.length > 0 && sections[0]) {
                setOpenSections([sections[0].id]);
            }

            // Cargar contador de verificaciones - siempre llamar al endpoint de verificaciones
            const tp = response.data.rubro_template_page;
            if (tp) {
                try {
                    const verificationsResponse = await service.getTemplateVerifications(tp.id);

                    if (verificationsResponse.status === 200) {
                        const responseData = verificationsResponse.data as any;
                        let count = 0;

                        // El backend devuelve: { stats: { total_verifications: N }, verifications: [...] }
                        if (responseData?.stats?.total_verifications !== undefined) {
                            count = responseData.stats.total_verifications;
                        } else if (Array.isArray(responseData?.verifications)) {
                            count = responseData.verifications.length;
                        } else if (Array.isArray(responseData)) {
                            count = responseData.length;
                        }

                        setVerificationCount(count);
                    }
                } catch (err) {
                    console.error('Error fetching verifications:', err);
                    setVerificationCount(0);
                }
            }
        } else {
            setError('Error al cargar las secciones');
        }
    };

    const openVerifyModal = () => {
        setVerifyDescription('');
        setVerifyModalOpen(true);
    };

    const closeVerifyModal = () => {
        setVerifyModalOpen(false);
        setVerifyDescription('');
    };

    const handleVerify = async () => {
        if (!data?.rubro_template_page?.id || !verifyDescription.trim()) return;
        closeVerifyModal();
        setVerifying(true);
        try {
            const response = await service.verifyTemplate(data.rubro_template_page.id, verifyDescription.trim());
            if (response.status === 200 || response.status === 201) {
                setVerificationCount(prev => prev + 1);
                setVerifiedByCurrentUser(true);
                toast.success('Template verificado correctamente');
            }
        } catch (error) {
            toast.error('Error al verificar el template');
        } finally {
            setVerifying(false);
        }
    };

    useEffect(() => {
        fetchSections();
    }, [templatePageId]);

    const toggleSection = (sectionId: number) => {
        setOpenSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const startEditing = (sectionId: number, text: SectionTextModel) => {
        setEditingText(`${sectionId}-${text.id}`);
        setEditValue(text.value);
    };

    const cancelEditing = () => {
        setEditingText(null);
        setEditValue('');
    };

    const saveText = async (sectionId: number, text: SectionTextModel, textIndex: number) => {
        setSaving(true);
        try {
            const response = await service.updateSectionText(text.section_text_id, {
                lbl: text.lbl,
                value: editValue,
                index: text.index
            });

            if (response.status === 200) {
                toast.success('Texto actualizado');
                // Actualizar localmente usando sectionId y textIndex para match exacto
                if (data) {
                    const updatedSections = data.sections.map(section => {
                        if (section.id !== sectionId) return section;
                        return {
                            ...section,
                            texts: section.texts.map((t, idx) =>
                                idx === textIndex ? { ...t, value: editValue } : t
                            )
                        };
                    });
                    setData({ ...data, sections: updatedSections });
                }
                cancelEditing();
            } else {
                toast.error('Error al guardar');
            }
        } catch {
            toast.error('Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    // URL base del backend
    const API_BASE_URL = 'http://127.0.0.1:8000';

    // Funciones para edición de imágenes
    const getImageUrl = (img: SectionImageModel): string => {
        let url = '';

        if (typeof img.data === 'string') {
            url = img.data;
        } else {
            url = img.data?.url || '';
        }

        // Si es una ruta relativa, agregar la URL base
        if (url && url.startsWith('/')) {
            return `${API_BASE_URL}${url}`;
        }

        return url;
    };

    const startEditingImage = (sectionId: number, image: SectionImageModel, imageIndex: number) => {
        const currentUrl = getImageUrl(image);
        setEditingImage({ sectionId, image, imageIndex });
        setImagePreview(currentUrl);
        setImageFile(null);
    };

    const cancelEditingImage = () => {
        setEditingImage(null);
        setImageFile(null);
        setImagePreview('');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Crear preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const saveImage = async () => {
        if (!editingImage || !imageFile) return;

        setSavingImage(true);
        try {
            const imgId = editingImage.image.section_img_id || editingImage.image.id;
            const lbl = editingImage.image.lbl || 'image';
            const response = await service.uploadSectionImage(imgId, imageFile, lbl);

            console.log('Upload response:', response);

            if (response.status === 200) {
                toast.success('Imagen actualizada');
                // Obtener la nueva URL de la respuesta
                // La estructura es: response.data.data.data.url o response.data.url
                const responseData = response.data;
                let newUrl = '';

                // Intentar diferentes rutas donde podría estar la URL
                if (responseData?.data?.data?.url) {
                    newUrl = responseData.data.data.url;
                } else if (responseData?.data?.url) {
                    newUrl = responseData.data.url;
                } else if (responseData?.url) {
                    newUrl = responseData.url;
                } else {
                    // Usar el preview como fallback
                    newUrl = imagePreview;
                }

                console.log('New image URL:', newUrl);

                // Actualizar localmente
                if (data && newUrl) {
                    const updatedSections = data.sections.map(section => {
                        if (section.id !== editingImage.sectionId) return section;
                        return {
                            ...section,
                            images: section.images.map((img, idx) =>
                                idx === editingImage.imageIndex
                                    ? { ...img, data: newUrl }
                                    : img
                            )
                        };
                    });
                    setData({ ...data, sections: updatedSections });
                }
                cancelEditingImage();
            } else {
                toast.error('Error al subir imagen');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Error al subir imagen');
        } finally {
            setSavingImage(false);
        }
    };

    const getSectionIcon = (code: string): string => {
        const icons: Record<string, string> = {
            'Header': 'mdi-page-layout-header',
            'Hero': 'mdi-image-area',
            'About': 'mdi-information-outline',
            'Menu': 'mdi-menu',
            'CTA': 'mdi-cursor-default-click',
            'Gallery': 'mdi-image-multiple',
            'Booking': 'mdi-calendar-clock',
            'Map': 'mdi-map-marker',
            'Footer': 'mdi-page-layout-footer',
        };
        const prefix = code.split('_')[0] ?? '';
        return icons[prefix] || 'mdi-card-text-outline';
    };

    if (loading) {
        return (
            <div className="page-content">
                <Container fluid>
                    <div className="text-center py-5">
                        <Spinner color="primary" />
                        <p className="text-muted mt-2">Cargando secciones...</p>
                    </div>
                </Container>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="page-content">
                <Container fluid>
                    <Alert color="danger">
                        <i className="mdi mdi-alert-circle me-2"></i>
                        {error || 'No se encontraron secciones'}
                    </Alert>
                    <Button color="light" onClick={() => navigate(`/websites/ai-content/${rubroId}`)}>
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
                        onClick={() => navigate(`/websites/ai-content/${rubroId}`)}
                    >
                        <i className="mdi mdi-arrow-left me-1"></i>
                        Volver a {data.rubro.name}
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
                        <Row className="align-items-center">
                            <Col>
                                <div className="d-flex align-items-center mb-2">
                                    <div
                                        className="d-flex align-items-center justify-content-center me-3"
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            background: 'rgba(255,255,255,0.2)',
                                            borderRadius: '12px',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    >
                                        <i className="mdi mdi-robot text-white" style={{ fontSize: '24px' }}></i>
                                    </div>
                                    <div>
                                        <h4 className="mb-0 text-white text-capitalize fw-semibold">
                                            {data.rubro.name}
                                        </h4>
                                        <p className="mb-0 text-white-50" style={{ fontSize: '13px' }}>
                                            Template {data.rubro_template_page.template_page_id} • {data.rubro_template_page.language}
                                        </p>
                                    </div>
                                </div>
                            </Col>
                            <Col xs="auto">
                                <div className="d-flex align-items-center gap-2">
                                    {/* Contador de verificaciones */}
                                    <div
                                        className="px-3 py-2 text-white d-flex align-items-center gap-1"
                                        style={{
                                            background: 'rgba(255,255,255,0.15)',
                                            borderRadius: '20px',
                                            backdropFilter: 'blur(10px)',
                                            fontSize: '13px'
                                        }}
                                    >
                                        <i className="mdi mdi-check-circle"></i>
                                        {verificationCount} verificaciones
                                    </div>
                                    {/* Botón verificar */}
                                    <button
                                        onClick={openVerifyModal}
                                        disabled={verifying}
                                        style={{
                                            background: verifiedByCurrentUser ? 'rgba(34, 197, 94, 0.9)' : 'rgba(255,255,255,0.2)',
                                            border: 'none',
                                            color: '#fff',
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            cursor: verifying ? 'not-allowed' : 'pointer',
                                            backdropFilter: 'blur(10px)',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            opacity: verifying ? 0.7 : 1
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!verifying) {
                                                e.currentTarget.style.background = verifiedByCurrentUser
                                                    ? 'rgba(34, 197, 94, 1)'
                                                    : 'rgba(255,255,255,0.3)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = verifiedByCurrentUser
                                                ? 'rgba(34, 197, 94, 0.9)'
                                                : 'rgba(255,255,255,0.2)';
                                        }}
                                    >
                                        <i className={`mdi ${verifying ? 'mdi-loading mdi-spin' : 'mdi-plus-circle-outline'}`}></i>
                                        Verificar
                                    </button>
                                    {/* Badge secciones */}
                                    <div
                                        className="px-3 py-2 text-white fw-medium"
                                        style={{
                                            background: 'rgba(255,255,255,0.2)',
                                            borderRadius: '20px',
                                            backdropFilter: 'blur(10px)',
                                            fontSize: '14px'
                                        }}
                                    >
                                        {data.sections.length} secciones
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                {/* Sections accordion - Diseño moderno */}
                {data.sections.map((section) => (
                    <Card
                        key={section.id}
                        className="mb-3 border-0"
                        style={{
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            overflow: 'hidden'
                        }}
                    >
                        <CardHeader
                            className="d-flex justify-content-between align-items-center border-0"
                            onClick={() => toggleSection(section.id)}
                            style={{
                                cursor: 'pointer',
                                background: openSections.includes(section.id) ? '#f8f9ff' : '#fff',
                                padding: '16px 20px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div className="d-flex align-items-center">
                                <div
                                    className="d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <i className={`mdi ${getSectionIcon(section.code)} text-white`} style={{ fontSize: '18px' }}></i>
                                </div>
                                <div>
                                    <span className="fw-semibold" style={{ fontSize: '15px', color: '#1a1a2e' }}>
                                        {section.code}
                                    </span>
                                    <div className="d-flex align-items-center gap-2 mt-1">
                                        <span
                                            className="d-flex align-items-center"
                                            style={{ fontSize: '12px', color: '#6c757d' }}
                                        >
                                            <i className="mdi mdi-text-box-outline me-1"></i>
                                            {section.texts.length} textos
                                        </span>
                                        {section.images.length > 0 && (
                                            <span
                                                className="d-flex align-items-center"
                                                style={{
                                                    fontSize: '12px',
                                                    color: '#667eea',
                                                    background: '#eef2ff',
                                                    padding: '2px 8px',
                                                    borderRadius: '10px'
                                                }}
                                            >
                                                <i className="mdi mdi-image-outline me-1"></i>
                                                {section.images.length}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                    width: '28px',
                                    height: '28px',
                                    background: openSections.includes(section.id) ? '#667eea' : '#f0f0f5',
                                    borderRadius: '6px',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <i
                                    className={`mdi mdi-chevron-${openSections.includes(section.id) ? 'up' : 'down'}`}
                                    style={{
                                        color: openSections.includes(section.id) ? '#fff' : '#6c757d',
                                        fontSize: '16px'
                                    }}
                                ></i>
                            </div>
                        </CardHeader>
                        <Collapse isOpen={openSections.includes(section.id)}>
                            <CardBody style={{ background: '#fafbfc', borderTop: '1px solid #f0f0f5' }}>
                                {/* Contenido organizado: Textos con imágenes por posición */}
                                {(() => {
                                    return (
                                        <>
                                            {section.texts.map((text, textIndex) => {
                                                const textKey = `${section.id}-${text.id}`;

                                                // Contar cuántos "Description" hay antes de este texto
                                                const descriptionIndex = section.texts
                                                    .slice(0, textIndex + 1)
                                                    .filter(t => t.lbl === 'Description').length - 1;

                                                // Solo mostrar imagen si es un texto "Description"
                                                // y hay una imagen disponible en esa posición
                                                const matchingImage = text.lbl === 'Description' && descriptionIndex < section.images.length
                                                    ? section.images[descriptionIndex]
                                                    : null;

                                                return (
                                                    <div key={`${section.id}-${text.id}-${textIndex}`} className="mb-4">
                                                        {/* Texto - Diseño moderno */}
                                                        <div
                                                            style={{
                                                                background: '#fff',
                                                                borderRadius: '10px',
                                                                padding: '16px 20px',
                                                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                                                border: '1px solid #edf0f5',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                        >
                                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                                <span
                                                                    style={{
                                                                        fontSize: '11px',
                                                                        fontWeight: 600,
                                                                        textTransform: 'uppercase',
                                                                        letterSpacing: '0.5px',
                                                                        color: text.lbl === 'Title' ? '#667eea' :
                                                                            text.lbl === 'SubTitle' ? '#764ba2' :
                                                                                text.lbl === 'Description' ? '#2d9cdb' : '#6c757d',
                                                                        background: text.lbl === 'Title' ? '#eef2ff' :
                                                                            text.lbl === 'SubTitle' ? '#f5f0ff' :
                                                                                text.lbl === 'Description' ? '#e8f5fc' : '#f5f5f5',
                                                                        padding: '4px 10px',
                                                                        borderRadius: '6px'
                                                                    }}
                                                                >
                                                                    {text.lbl}
                                                                </span>
                                                                {editingText !== textKey && (
                                                                    <button
                                                                        onClick={() => startEditing(section.id, text)}
                                                                        style={{
                                                                            background: 'transparent',
                                                                            border: 'none',
                                                                            padding: '6px 10px',
                                                                            borderRadius: '6px',
                                                                            cursor: 'pointer',
                                                                            color: '#6c757d',
                                                                            transition: 'all 0.2s ease'
                                                                        }}
                                                                        onMouseEnter={(e) => {
                                                                            e.currentTarget.style.background = '#f0f0f5';
                                                                            e.currentTarget.style.color = '#667eea';
                                                                        }}
                                                                        onMouseLeave={(e) => {
                                                                            e.currentTarget.style.background = 'transparent';
                                                                            e.currentTarget.style.color = '#6c757d';
                                                                        }}
                                                                    >
                                                                        <i className="mdi mdi-pencil-outline" style={{ fontSize: '16px' }}></i>
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {editingText === textKey ? (
                                                                <div>
                                                                    <Input
                                                                        type="textarea"
                                                                        rows={3}
                                                                        value={editValue}
                                                                        onChange={(e) => setEditValue(e.target.value)}
                                                                        disabled={saving}
                                                                        style={{
                                                                            borderRadius: '8px',
                                                                            border: '1px solid #e0e6ed',
                                                                            fontSize: '14px'
                                                                        }}
                                                                    />
                                                                    <div className="mt-3 d-flex gap-2">
                                                                        <Button
                                                                            size="sm"
                                                                            onClick={() => saveText(section.id, text, textIndex)}
                                                                            disabled={saving}
                                                                            style={{
                                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                                border: 'none',
                                                                                borderRadius: '6px',
                                                                                padding: '8px 16px'
                                                                            }}
                                                                        >
                                                                            {saving ? <Spinner size="sm" /> : 'Guardar'}
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            onClick={cancelEditing}
                                                                            disabled={saving}
                                                                            style={{
                                                                                background: '#f5f5f5',
                                                                                border: 'none',
                                                                                borderRadius: '6px',
                                                                                padding: '8px 16px',
                                                                                color: '#6c757d'
                                                                            }}
                                                                        >
                                                                            Cancelar
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <p
                                                                    className="mb-0"
                                                                    style={{
                                                                        fontSize: '14px',
                                                                        lineHeight: '1.6',
                                                                        color: '#4a5568'
                                                                    }}
                                                                >
                                                                    {text.value}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Imagen correspondiente - UI mejorada */}
                                                        {matchingImage && (
                                                            <div className="mt-3">
                                                                <div
                                                                    className="position-relative d-inline-block"
                                                                    style={{
                                                                        borderRadius: '12px',
                                                                        overflow: 'hidden',
                                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                                        transition: 'all 0.3s ease',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                    onMouseEnter={(e) => {
                                                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                                                    }}
                                                                >
                                                                    {getImageUrl(matchingImage).startsWith('http') ? (
                                                                        <img
                                                                            src={getImageUrl(matchingImage)}
                                                                            alt={typeof matchingImage.data === 'object' ? matchingImage.data.alt : 'Section'}
                                                                            style={{
                                                                                maxHeight: '180px',
                                                                                width: 'auto',
                                                                                display: 'block'
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div
                                                                            className="d-flex align-items-center justify-content-center bg-light"
                                                                            style={{ width: '180px', height: '120px' }}
                                                                        >
                                                                            <i className="mdi mdi-image-outline text-muted" style={{ fontSize: '48px' }}></i>
                                                                        </div>
                                                                    )}
                                                                    {/* Overlay con botón de editar */}
                                                                    <div
                                                                        className="position-absolute d-flex align-items-center justify-content-center"
                                                                        style={{
                                                                            top: 0,
                                                                            left: 0,
                                                                            right: 0,
                                                                            bottom: 0,
                                                                            background: 'rgba(0,0,0,0.4)',
                                                                            opacity: 0,
                                                                            transition: 'opacity 0.2s ease'
                                                                        }}
                                                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                                                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                                                                    >
                                                                        <Button
                                                                            size="sm"
                                                                            color="light"
                                                                            className="rounded-circle"
                                                                            style={{ width: '40px', height: '40px' }}
                                                                            onClick={() => startEditingImage(section.id, matchingImage, textIndex)}
                                                                        >
                                                                            <i className="mdi mdi-pencil"></i>
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                            {/* Imágenes extra (las que sobran después de emparejar con Descriptions) */}
                                            {(() => {
                                                // Contar cuántos textos son Description
                                                const descriptionCount = section.texts.filter(t => t.lbl === 'Description').length;
                                                // Imágenes que no se emparejaron
                                                const remainingImages = section.images.slice(descriptionCount);

                                                if (remainingImages.length === 0) return null;

                                                return (
                                                    <div className="mt-3">
                                                        <h6 className="text-muted mb-2">
                                                            <i className="mdi mdi-image me-1"></i>
                                                            Otras Imágenes
                                                        </h6>
                                                        <div className="d-flex flex-wrap gap-3">
                                                            {remainingImages.map((img, idx) => {
                                                                const imgUrl = getImageUrl(img);
                                                                const originalIndex = section.images.indexOf(img);
                                                                return (
                                                                    <div
                                                                        key={`remaining-${section.id}-${img.id}-${idx}`}
                                                                        className="position-relative"
                                                                        style={{
                                                                            borderRadius: '12px',
                                                                            overflow: 'hidden',
                                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                                            transition: 'all 0.3s ease',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                        onMouseEnter={(e) => {
                                                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                                                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                                                                        }}
                                                                        onMouseLeave={(e) => {
                                                                            e.currentTarget.style.transform = 'translateY(0)';
                                                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                                                        }}
                                                                    >
                                                                        {imgUrl.startsWith('http') ? (
                                                                            <img
                                                                                src={imgUrl}
                                                                                alt={typeof img.data === 'object' ? img.data.alt : 'Section'}
                                                                                style={{
                                                                                    maxHeight: '140px',
                                                                                    width: 'auto',
                                                                                    display: 'block'
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <div
                                                                                className="d-flex align-items-center justify-content-center bg-light"
                                                                                style={{ width: '140px', height: '100px' }}
                                                                            >
                                                                                <i className="mdi mdi-image-outline text-muted" style={{ fontSize: '40px' }}></i>
                                                                            </div>
                                                                        )}
                                                                        {/* Overlay con botón de editar */}
                                                                        <div
                                                                            className="position-absolute d-flex align-items-center justify-content-center"
                                                                            style={{
                                                                                top: 0,
                                                                                left: 0,
                                                                                right: 0,
                                                                                bottom: 0,
                                                                                background: 'rgba(0,0,0,0.4)',
                                                                                opacity: 0,
                                                                                transition: 'opacity 0.2s ease'
                                                                            }}
                                                                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                                                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                                                                        >
                                                                            <Button
                                                                                size="sm"
                                                                                color="light"
                                                                                className="rounded-circle"
                                                                                style={{ width: '36px', height: '36px' }}
                                                                                onClick={() => startEditingImage(section.id, img, originalIndex)}
                                                                            >
                                                                                <i className="mdi mdi-pencil"></i>
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </>
                                    );
                                })()}

                                {section.texts.length === 0 && section.images.length === 0 && (
                                    <p className="text-muted mb-0">Esta sección no tiene contenido</p>
                                )}
                            </CardBody>
                        </Collapse>
                    </Card>
                ))}

                {/* Modal para subir imagen */}
                <Modal isOpen={!!editingImage} toggle={cancelEditingImage}>
                    <ModalHeader toggle={cancelEditingImage}>
                        Cambiar Imagen
                    </ModalHeader>
                    <ModalBody>
                        <div className="mb-3">
                            <label className="form-label">Seleccionar nueva imagen</label>
                            <Input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/jpg"
                                onChange={handleFileChange}
                            />
                            <small className="text-muted">
                                Formatos aceptados: JPG, PNG, WebP. Max 2MB.
                            </small>
                        </div>
                        {imagePreview && (
                            <div className="text-center border rounded p-3">
                                <p className="text-muted mb-2 font-size-12">
                                    {imageFile ? 'Nueva imagen:' : 'Imagen actual:'}
                                </p>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="img-fluid rounded"
                                    style={{ maxHeight: '200px' }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                {imageFile && (
                                    <p className="text-muted mt-2 mb-0 font-size-12">
                                        {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
                                    </p>
                                )}
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="light" onClick={cancelEditingImage} disabled={savingImage}>
                            Cancelar
                        </Button>
                        <Button color="primary" onClick={saveImage} disabled={savingImage || !imageFile}>
                            {savingImage ? <Spinner size="sm" /> : 'Subir Imagen'}
                        </Button>
                    </ModalFooter>
                </Modal>

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
                            disabled={!verifyDescription.trim() || verifying}
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

export default SectionViewer;
