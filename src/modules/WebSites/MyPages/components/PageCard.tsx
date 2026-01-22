import React, { useState } from 'react';
import { Card, CardBody, Button, Row, Col, Input, Collapse, Modal, ModalHeader, ModalBody, ModalFooter, Spinner, FormGroup, Label } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { MyPagesModel } from '../models/MyPagesModel';
import { useUserPermissions, WEB_SITES_PERMISSIONS } from '@/core/auth';
import VisitsChart from './VisitsChart';
import { MyPagesApiService } from '../services/MyPagesApiService';
import { toast } from 'react-toastify';

interface PageCardProps {
  page: MyPagesModel;
  onUpdateName: (pageId: number, newName: string) => Promise<{ success: boolean; message: string }>;
  isLatest?: boolean;
}

const PageCard: React.FC<PageCardProps> = ({ page, onUpdateName, isLatest = false }) => {
  const { t } = useTranslation();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(page.name);
  const [isSaving, setIsSaving] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Convert to Template modal state
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [categoryId, setCategoryId] = useState(1);
  const [isConverting, setIsConverting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const service = new MyPagesApiService();

  // Obtener permisos del usuario
  const { hasPermission } = useUserPermissions();

  // Verificar permisos específicos usando constantes
  const canEdit = hasPermission(WEB_SITES_PERMISSIONS.EDIT);
  const canViewHosting = hasPermission(WEB_SITES_PERMISSIONS.HOSTING);
  const canViewDomain = hasPermission(WEB_SITES_PERMISSIONS.DOMAIN);

  // URL base del proyecto para compartir (usa el dominio actual)
  const shareUrl = `${window.location.origin}/viewer/${page.viewKey}`;

  // Calcular visitas totales desde page.count
  const visits = page.count
    ? Object.values(page.count).reduce((sum, val) => sum + (parseInt(val, 10) || 0), 0)
    : 0;
  const reservations = 56; // Placeholder

  // Determinar si tiene dominio personalizado
  const hasDomain = page.rutName && page.rutName.length > 0;

  // URL completa de la imagen (backend base)
  const imageUrl = `https://backend.aziende.us${page.image}`;

  // Se usa prop isLatest para determinar si mostrar badge


  /**
   * Inicia el modo de edición
   */
  const handleStartEdit = () => {
    setEditedName(page.name);
    setIsEditingName(true);
  };

  /**
   * Cancela la edición
   */
  const handleCancelEdit = () => {
    setEditedName(page.name);
    setIsEditingName(false);
  };

  /**
   * Guarda el nombre editado
   */
  const handleSaveName = async () => {
    if (editedName.trim() === page.name) {
      setIsEditingName(false);
      return;
    }

    setIsSaving(true);
    const result = await onUpdateName(page.id, editedName.trim());
    setIsSaving(false);

    if (result.success) {
      setIsEditingName(false);
    } else {
      // El error ya se muestra con toast en el hook
      setEditedName(page.name);
    }
  };

  /**
   * Maneja el Enter y Escape en el input
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  /**
   * Abre el editor en una nueva pestaña con el pageId en la URL
   */
  const handleEditPage = () => {
    // Abre el Editor en una nueva pestaña con pageId como query param
    window.open(`/editor/?pageId=${page.id}`, '_blank');
  };

  /**
   * Handles sharing the page - gets preview URL from backend and opens it
   */
  const handleShare = async () => {
    setIsSharing(true);
    try {
      const response = await service.getPreviewUrl(page.viewKey);
      if ((response.status === 200 || response.status === 201) && response.data) {
        window.open(response.data, '_blank');
      } else {
        toast.error(response.message || 'Error getting preview URL');
      }
    } catch (error) {
      toast.error('Error getting preview URL');
      console.error('Error getting preview URL:', error);
    } finally {
      setIsSharing(false);
    }
  };

  /**
   * Opens the convert to template modal
   */
  const openConvertModal = () => {
    setTemplateName(page.name);
    setTemplateDescription('');
    setCategoryId(1);
    setShowConvertModal(true);
  };

  /**
   * Closes the convert to template modal
   */
  const closeConvertModal = () => {
    setShowConvertModal(false);
    setTemplateName('');
    setTemplateDescription('');
  };

  /**
   * Handles converting the page to a template
   */
  const handleConvertToTemplate = async () => {
    if (!templateName.trim()) {
      toast.error('Template name is required');
      return;
    }

    setIsConverting(true);
    try {
      const response = await service.convertToTemplate(
        page.id,
        templateName.trim(),
        templateDescription.trim(),
        categoryId
      );

      if (response.status === 200 || response.status === 201) {
        toast.success('Page converted to template successfully!');
        closeConvertModal();
      } else {
        toast.error(response.message || 'Error converting to template');
      }
    } catch (error) {
      toast.error('Error converting to template');
      console.error('Error converting to template:', error);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <Card className="border shadow-sm mb-3 position-relative">
      <CardBody className="p-3">
        <Row>
          {/* Columna izquierda: Preview de imagen */}
          <Col xs={12} md={4} lg={3} className="mb-3 mb-md-0">
            <div
              className="border rounded position-relative"
              style={{
                width: '100%',
                paddingTop: '75%', // Aspect ratio 4:3
                overflow: 'hidden',
                backgroundColor: '#f8f9fa'
              }}
            >
              <img
                src={imageUrl}
                alt={`Preview de ${page.name}`}
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ objectFit: 'cover' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"%3E%3Crect fill="%23f8f9fa" width="200" height="150"/%3E%3Ctext fill="%236c757d" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ESin preview%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          </Col>

          {/* Columna derecha: Información y acciones */}
          <Col xs={12} md={8} lg={9}>
            <div className="d-flex flex-column h-100">
              {/* Título y nombre de la página */}
              <div className="mb-3">
                {isEditingName ? (
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isSaving}
                      autoFocus
                      className="fw-bold"
                      style={{ maxWidth: '300px' }}
                    />
                    <Button
                      color="success"
                      size="sm"
                      onClick={handleSaveName}
                      disabled={isSaving || !editedName.trim()}
                    >
                      <i className="mdi mdi-check"></i>
                    </Button>
                    <Button
                      color="light"
                      size="sm"
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                    >
                      <i className="mdi mdi-close"></i>
                    </Button>
                  </div>
                ) : (
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h5 className="mb-0 fw-bold">{page.name}</h5>
                    {/* Solo mostrar botón de editar nombre si tiene permiso de editar */}
                    {canEdit && (
                      <Button
                        color="light"
                        size="sm"
                        className="p-1"
                        onClick={handleStartEdit}
                        title={t("myPages.editName")}
                      >
                        <i className="mdi mdi-pencil font-size-14"></i>
                      </Button>
                    )}
                  </div>
                )}
                {hasDomain ? (
                  <a
                    href={page.rutName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-decoration-none"
                  >
                    <i className="mdi mdi-link-variant me-1"></i>
                    {page.rutName}
                  </a>
                ) : (
                  <span className="text-muted">
                    <i className="mdi mdi-link-off me-1"></i>
                    {t("myPages.noDomain")}
                  </span>
                )}
              </div>

              {/* Métricas */}
              <Row className="mb-3">
                <Col xs={6} sm={4}>
                  <div className="d-flex align-items-center">
                    <i className="mdi mdi-eye text-info me-2 font-size-20"></i>
                    <div>
                      <div className="text-muted font-size-12">{t("myPages.visits")}</div>
                      <div className="fw-medium">{visits.toLocaleString()}</div>
                    </div>
                  </div>
                </Col>
                <Col xs={6} sm={4}>
                  <div className="d-flex align-items-center">
                    <i className="mdi mdi-calendar-check text-success me-2 font-size-20"></i>
                    <div>
                      <div className="text-muted font-size-12">{t("myPages.reservations")}</div>
                      <div className="fw-medium">{reservations.toLocaleString()}</div>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Paleta de colores */}
              <div className="mb-3">
                <div className="text-muted font-size-12 mb-2">{t("myPages.colorPalette")}</div>
                <div className="d-flex gap-2 align-items-center">
                  {/* Color de acento */}
                  {page.palette.ac && (
                    <div
                      className="border rounded"
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: page.palette.ac,
                        cursor: 'pointer'
                      }}
                      title={`${t("myPages.accent")}: ${page.palette.ac}`}
                    />
                  )}
                  {/* Color de fondo */}
                  {page.palette.bg && (
                    <div
                      className="border rounded"
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: page.palette.bg,
                        cursor: 'pointer'
                      }}
                      title={`${t("myPages.background")}: ${page.palette.bg}`}
                    />
                  )}
                  {/* Color de texto */}
                  {page.palette.tx && (
                    <div
                      className="border rounded"
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: page.palette.tx,
                        cursor: 'pointer'
                      }}
                      title={`${t("myPages.text")}: ${page.palette.tx}`}
                    />
                  )}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="d-flex flex-wrap gap-2 mt-auto">
                <Button color="light" size="sm" disabled>
                  <i className="mdi mdi-magnify me-1"></i>
                  {t("myPages.seo")}
                </Button>
                <Button
                  color={showAnalytics ? "primary" : "light"}
                  size="sm"
                  onClick={() => setShowAnalytics(!showAnalytics)}
                >
                  <i className="mdi mdi-chart-line me-1"></i>
                  {t("myPages.analytics")}
                </Button>

                {/* Solo mostrar Hospedaje y Dominio si tiene permiso */}
                {(canViewHosting || canViewDomain) && (
                  <Button color="light" size="sm" disabled>
                    <i className="mdi mdi-server me-1"></i>
                    {t("myPages.hosting")}
                  </Button>
                )}

                <Button
                  color="primary"
                  size="sm"
                  onClick={() => window.open(shareUrl, '_blank')}
                >
                  <i className="mdi mdi-share-variant me-1"></i>
                  {t("myPages.share")}
                </Button>

                {/* Solo mostrar botón Editar si tiene permiso de editar */}
                {canEdit && (
                  <Button color="warning" size="sm" onClick={handleEditPage}>
                    <i className="mdi mdi-pencil me-1"></i>
                    {t("myPages.edit")}
                  </Button>
                )}

                {/* Convert to Template button */}
                <Button color="info" size="sm" onClick={openConvertModal}>
                  <i className="mdi mdi-file-document-outline me-1"></i>
                  Convert to Template
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Panel de Analytics - Full width */}
        <Collapse isOpen={showAnalytics}>
          <hr className="my-3" />
          <VisitsChart data={page.count} height={180} />
        </Collapse>
      </CardBody>
      {/* Badge "New" - Visible si es el último creado, posicionado en el Card */}
      {isLatest && (
        <span
          className="position-absolute badge bg-primary"
          style={{ zIndex: 10, fontSize: '0.65rem', padding: '0.25em 0.5em', top: '12px', right: '12px' }}
        >
          New
        </span>
      )}

      {/* Convert to Template Modal */}
      <Modal isOpen={showConvertModal} toggle={closeConvertModal}>
        <ModalHeader toggle={closeConvertModal}>
          <i className="mdi mdi-file-document-outline me-2"></i>
          Convert to Template
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="templateName">Template Name *</Label>
            <Input
              type="text"
              id="templateName"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
            />
          </FormGroup>
          <FormGroup>
            <Label for="templateDescription">Description</Label>
            <Input
              type="textarea"
              id="templateDescription"
              rows={3}
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              placeholder="Enter template description (optional)"
            />
          </FormGroup>
          <FormGroup>
            <Label for="categoryId">Category ID</Label>
            <Input
              type="number"
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(parseInt(e.target.value, 10) || 1)}
              min={1}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={closeConvertModal} disabled={isConverting}>
            Cancel
          </Button>
          <Button
            color="info"
            onClick={handleConvertToTemplate}
            disabled={isConverting || !templateName.trim()}
          >
            {isConverting ? <Spinner size="sm" className="me-1" /> : <i className="mdi mdi-check me-1"></i>}
            Convert
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  );
};

export default PageCard;
