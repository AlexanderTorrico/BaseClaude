import React, { useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  Badge,
  Input,
  Label,
  FormGroup,
  Spinner
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { TemplateModel } from '../models/TemplateModel';

// Base URL del backend para las imágenes
const API_BASE_URL = 'http://localhost:8000';

// Categorías de templates
const TEMPLATE_CATEGORIES = [
  { id: 'landing', nameKey: 'createPage.categories.landing', icon: 'mdi-rocket-launch' },
  { id: 'business', nameKey: 'createPage.categories.business', icon: 'mdi-briefcase' },
  { id: 'ecommerce', nameKey: 'createPage.categories.ecommerce', icon: 'mdi-cart' },
  { id: 'portfolio', nameKey: 'createPage.categories.portfolio', icon: 'mdi-palette' },
  { id: 'blog', nameKey: 'createPage.categories.blog', icon: 'mdi-post' },
];

// Mock templates por categoría (referencia visual si falla API)
const MOCK_TEMPLATES_COUNT: Record<string, number> = {
  landing: 3,
  business: 2,
  ecommerce: 2,
  portfolio: 2,
  blog: 2,
};

interface ContentTemplatesProps {
  templates: TemplateModel[];
  loading: boolean;
  activeTab: string;
  selectedTemplate: number | null;
  onTabChange: (tab: string) => void;
  onSelectTemplate: (templateId: number) => void;
  onPreviewTemplate: (templateId: number) => void;
}

const ContentTemplates: React.FC<ContentTemplatesProps> = ({
  templates,
  loading,
  activeTab,
  selectedTemplate,
  onTabChange,
  onSelectTemplate,
  onPreviewTemplate
}) => {
  const { t } = useTranslation();

  // Construir URL completa de la imagen
  const getTemplateImageUrl = (template: TemplateModel): string => {
    if (!template.url) return 'https://via.placeholder.com/400x300/667eea/ffffff?text=No+Image';
    if (template.url.startsWith('http')) return template.url;
    return `${API_BASE_URL}/${template.url}`;
  };

  // Obtener el conteo de templates por categoría
  const getTemplateCount = (categoryId: string) => {
    return MOCK_TEMPLATES_COUNT[categoryId] || 0;
  };

  // Agregar estilos para el hover effect
  useEffect(() => {
    const styleId = 'template-card-styles';

    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .template-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.15) !important;
        }
        .template-thumbnail:hover .template-overlay {
          opacity: 1 !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      const style = document.getElementById(styleId);
      if (style) {
        style.remove();
      }
    };
  }, []);

  return (
    <Card className="border-0 shadow-sm" style={{ flex: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CardBody style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '1.25rem' }}>
        {/* Select para móviles y tablets (visible solo en xs y sm) */}
        <div className="d-block d-lg-none mb-3" style={{ flexShrink: 0 }}>
          <FormGroup className="mb-0">
            <Label for="category-select" className="fw-medium mb-2">
              <i className="mdi mdi-view-grid me-2"></i>
              {t("createPage.category")}
            </Label>
            <Input
              type="select"
              id="category-select"
              value={activeTab}
              onChange={(e) => onTabChange(e.target.value)}
              className="form-select form-select-lg"
            >
              {TEMPLATE_CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {t(category.nameKey)} ({getTemplateCount(category.id)})
                </option>
              ))}
            </Input>
          </FormGroup>
        </div>

        {/* Tabs para desktop (visible solo en lg y superiores) */}
        <Nav tabs className="nav-tabs-custom nav-justified mb-3 d-none d-lg-flex" style={{ flexShrink: 0 }}>
          {TEMPLATE_CATEGORIES.map(category => (
            <NavItem key={category.id}>
              <NavLink
                className={activeTab === category.id ? 'active' : ''}
                onClick={() => onTabChange(category.id)}
                style={{ cursor: 'pointer' }}
              >
                <i className={`mdi ${category.icon} me-2`}></i>
                {t(category.nameKey)}
                <Badge color="light" className="ms-2" pill>
                  {getTemplateCount(category.id)}
                </Badge>
              </NavLink>
            </NavItem>
          ))}
        </Nav>

        {/* Contenido de Templates - Con scroll vertical */}
        <TabContent activeTab={activeTab} style={{ flex: '1', overflowY: 'auto', overflowX: 'hidden' }}>
          <TabPane tabId={activeTab} style={{ height: '100%' }}>
            {loading ? (
              <div className="text-center py-5">
                <Spinner color="primary" />
                <p className="text-muted mt-3">
                  {t("createPage.loading") || "Cargando templates..."}
                </p>
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-5">
                <i className="mdi mdi-package-variant display-4 text-muted"></i>
                <p className="text-muted mt-3">
                  {t("createPage.noTemplates")}
                </p>
              </div>
            ) : (
              <Row>
                {templates.map(template => (
                  <Col key={template.id} xs={12} sm={6} lg={4} xl={3} className="mb-4">
                    <Card
                      className={`border shadow-sm template-card ${selectedTemplate === template.id ? 'border-primary' : ''}`}
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        overflow: 'hidden',
                        padding: 0
                      }}
                    >
                      {/* Thumbnail - Formato horizontal (16:10 aprox) */}
                      <div
                        className="template-thumbnail"
                        style={{
                          width: '100%',
                          paddingTop: '62.5%',
                          backgroundImage: `url(${getTemplateImageUrl(template)})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative',
                          borderRadius: '0.25rem'
                        }}
                      >
                        {/* Indicador de selección */}
                        {selectedTemplate === template.id && (
                          <div
                            className="position-absolute top-0 end-0 m-2"
                            style={{
                              backgroundColor: 'rgba(102, 126, 234, 0.95)',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 2
                            }}
                          >
                            <i className="mdi mdi-check text-white"></i>
                          </div>
                        )}

                        {/* Overlay con botones - visible solo en hover */}
                        <div
                          className="template-overlay"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            pointerEvents: 'none'
                          }}
                        >
                          <Button
                            color={selectedTemplate === template.id ? 'primary' : 'light'}
                            size="sm"
                            style={{ pointerEvents: 'auto' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectTemplate(template.id);
                            }}
                          >
                            <i className="mdi mdi-check me-1"></i>
                            {t("createPage.select")}
                          </Button>
                          <Button
                            color="light"
                            size="sm"
                            outline
                            style={{ pointerEvents: 'auto' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onPreviewTemplate(template.id);
                            }}
                            title={t("createPage.preview")}
                          >
                            <i className="mdi mdi-eye me-1"></i>
                            {t("createPage.preview")}
                          </Button>
                        </div>
                      </div>
                      {/* Nombre del template */}
                      <CardBody className="p-2">
                        <h6 className="mb-1 text-truncate" title={template.name}>
                          {template.name}
                        </h6>
                        <div className="d-flex align-items-center gap-2">
                          <small className="text-muted">
                            <i className="mdi mdi-star text-warning me-1"></i>
                            {template.score}
                          </small>
                          <small className="text-muted">
                            <i className="mdi mdi-download me-1"></i>
                            {template.count}
                          </small>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </TabPane>
        </TabContent>
      </CardBody>
    </Card>
  );
};

export default ContentTemplates;
