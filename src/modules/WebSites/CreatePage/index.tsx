import React, { useState, useEffect } from 'react';
import {
  Container,
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
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { TemplateModel } from './models/TemplateModel';
import { GeneratePageDto } from './models/GeneratePageDto';
import { CreatePageApiService } from './services/CreatePageApiService';


// Base URL del backend para las imágenes
const API_BASE_URL = 'http://localhost:8000';

// Tipos para templates
interface PageTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  preview?: string;
}

// Mock data de templates organizados por categoría
const TEMPLATE_CATEGORIES = [
  { id: 'landing', nameKey: 'createPage.categories.landing', icon: 'mdi-rocket-launch' },
  { id: 'business', nameKey: 'createPage.categories.business', icon: 'mdi-briefcase' },
  { id: 'ecommerce', nameKey: 'createPage.categories.ecommerce', icon: 'mdi-cart' },
  { id: 'portfolio', nameKey: 'createPage.categories.portfolio', icon: 'mdi-palette' },
  { id: 'blog', nameKey: 'createPage.categories.blog', icon: 'mdi-post' },
];

const MOCK_TEMPLATES: PageTemplate[] = [
  // Landing Pages
  { id: 'lp-1', name: 'createPage.templates.startupModern', description: 'createPage.templates.startupModernDesc', thumbnail: 'https://via.placeholder.com/400x300/667eea/ffffff?text=Startup+Modern', category: 'landing' },
  { id: 'lp-2', name: 'createPage.templates.appShowcase', description: 'createPage.templates.appShowcaseDesc', thumbnail: 'https://via.placeholder.com/400x300/764ba2/ffffff?text=App+Showcase', category: 'landing' },
  { id: 'lp-3', name: 'createPage.templates.saasProduct', description: 'createPage.templates.saasProductDesc', thumbnail: 'https://via.placeholder.com/400x300/f093fb/ffffff?text=SaaS+Product', category: 'landing' },

  // Business
  { id: 'biz-1', name: 'createPage.templates.corporatePro', description: 'createPage.templates.corporateProDesc', thumbnail: 'https://via.placeholder.com/400x300/4facfe/ffffff?text=Corporate+Pro', category: 'business' },
  { id: 'biz-2', name: 'createPage.templates.consultingAgency', description: 'createPage.templates.consultingAgencyDesc', thumbnail: 'https://via.placeholder.com/400x300/00f2fe/ffffff?text=Consulting', category: 'business' },

  // E-Commerce
  { id: 'shop-1', name: 'createPage.templates.fashionStore', description: 'createPage.templates.fashionStoreDesc', thumbnail: 'https://via.placeholder.com/400x300/43e97b/ffffff?text=Fashion+Store', category: 'ecommerce' },
  { id: 'shop-2', name: 'createPage.templates.techShop', description: 'createPage.templates.techShopDesc', thumbnail: 'https://via.placeholder.com/400x300/38f9d7/ffffff?text=Tech+Shop', category: 'ecommerce' },

  // Portfolio
  { id: 'port-1', name: 'createPage.templates.creativePortfolio', description: 'createPage.templates.creativePortfolioDesc', thumbnail: 'https://via.placeholder.com/400x300/fa709a/ffffff?text=Creative', category: 'portfolio' },
  { id: 'port-2', name: 'createPage.templates.developerPortfolio', description: 'createPage.templates.developerPortfolioDesc', thumbnail: 'https://via.placeholder.com/400x300/fee140/ffffff?text=Developer', category: 'portfolio' },

  // Blog
  { id: 'blog-1', name: 'createPage.templates.minimalBlog', description: 'createPage.templates.minimalBlogDesc', thumbnail: 'https://via.placeholder.com/400x300/30cfd0/ffffff?text=Minimal+Blog', category: 'blog' },
  { id: 'blog-2', name: 'createPage.templates.magazineStyle', description: 'createPage.templates.magazineStyleDesc', thumbnail: 'https://via.placeholder.com/400x300/330867/ffffff?text=Magazine', category: 'blog' },
];

const CreatePage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [apiTemplates, setApiTemplates] = useState<TemplateModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estado para el modal de creación
  const [modalOpen, setModalOpen] = useState(false);
  const [pageName, setPageName] = useState('');
  const [generating, setGenerating] = useState(false);

  // Cargar templates del API
  useEffect(() => {
    const fetchTemplates = async () => {
      const service = new CreatePageApiService();
      const response = await service.getTemplates(setLoading);
      if (response.status === 200 && response.data) {
        setApiTemplates(response.data);
      }
    };
    fetchTemplates();
  }, []);

  // Construir URL completa de la imagen
  const getTemplateImageUrl = (template: TemplateModel): string => {
    if (!template.url) return 'https://via.placeholder.com/400x300/667eea/ffffff?text=No+Image';
    // Si la URL ya es absoluta, usarla directamente
    if (template.url.startsWith('http')) return template.url;
    // Si no, construir la URL completa
    return `${API_BASE_URL}/${template.url}`;
  };

  // Agregar estilos para el hover effect
  useEffect(() => {
    const styleId = 'template-card-styles';

    // Verificar si ya existe el estilo
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

  // Filtrar templates por categoría (para los mock - solo referencia visual si fallara API)
  const filteredTemplates = MOCK_TEMPLATES.filter(t => t.category === activeTab);

  // Obtener el conteo de templates por categoría
  const getTemplateCount = (categoryId: string) => {
    return MOCK_TEMPLATES.filter(t => t.category === categoryId).length;
  };

  const handleCreateWithAI = () => {
    console.log('Crear página con IA');
    // Aquí iría la lógica para crear con IA
  };

  const handleSelectTemplate = (templateId: number) => {
    setSelectedTemplate(templateId);
    setPageName('');
    setModalOpen(true);
  };

  const toggleModal = () => setModalOpen(!modalOpen);


  const handleGenerate = async () => {
    if (!selectedTemplate || !pageName.trim()) return;

    setGenerating(true);
    try {
      const service = new CreatePageApiService();
      const dto: GeneratePageDto = {
        conf: {},
        description: '',
        gbl_company_id: 1, // Por defecto como solicitado
        name: pageName,
        template_page_id: selectedTemplate
      };

      const res = await service.generatePage(dto);
      if (res.status === 200 || res.status === 201) {
        console.log('Page generated successfully:', res.data);
        toggleModal();
        toast.success(
          `✅ Página creada: ${pageName}`,
          { autoClose: 3000 }
        );
        // Aquí se podría redirigir a la edición de la página
        // history.push(`/pages/edit/${res.data.id}`);
      }
    } catch (error) {
      console.error('Error generating page:', error);
    } finally {
      setGenerating(false);
    }
  };

  const getSelectedTemplateName = () => {
    const template = apiTemplates.find(t => t.id === selectedTemplate);
    return template ? template.name : '';
  };

  return (
    <div className="page-content" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', overflowX: 'hidden' }}>
      <Container fluid style={{ flex: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', overflowX: 'hidden' }}>
        {/* Header - Fijo */}
        <Row className="mb-3" style={{ flexShrink: 0 }}>
          <Col xs={12}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-1">{t("createPage.title")}</h4>
                <p className="text-muted mb-0">
                  {t("createPage.subtitle")}
                </p>
              </div>
              <Button color="primary" size="lg" onClick={handleCreateWithAI}>
                <i className="mdi mdi-auto-fix me-2"></i>
                {t("createPage.createWithAI")}
              </Button>
            </div>
          </Col>
        </Row>

        {/* Tabs de Categorías - Área con scroll */}
        <Row style={{ flex: '1', overflow: 'hidden', overflowX: 'hidden' }}>
          <Col xs={12} style={{ height: '100%', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
            <Card className="shadow-sm" style={{ flex: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', overflowX: 'hidden' }}>
              <CardBody style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', overflowX: 'hidden', padding: '1.25rem' }}>
                {/* Select para móviles y tablets (visible solo en xs y sm) - Fijo */}
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
                      onChange={(e) => setActiveTab(e.target.value)}
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

                {/* Tabs para desktop (visible solo en lg y superiores) - Fijo */}
                <Nav tabs className="nav-tabs-custom nav-justified mb-3 d-none d-lg-flex" style={{ flexShrink: 0 }}>
                  {TEMPLATE_CATEGORIES.map(category => (
                    <NavItem key={category.id}>
                      <NavLink
                        className={activeTab === category.id ? 'active' : ''}
                        onClick={() => setActiveTab(category.id)}
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

                {/* Contenido de Templates - Con scroll vertical únicamente */}
                <TabContent activeTab={activeTab} style={{ flex: '1', overflowY: 'auto', overflowX: 'hidden' }}>
                  <TabPane tabId={activeTab} style={{ height: '100%' }}>
                    {loading ? (
                      <div className="text-center py-5">
                        <Spinner color="primary" />
                        <p className="text-muted mt-3">
                          {t("createPage.loading") || "Cargando templates..."}
                        </p>
                      </div>
                    ) : apiTemplates.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="mdi mdi-package-variant display-4 text-muted"></i>
                        <p className="text-muted mt-3">
                          {t("createPage.noTemplates")}
                        </p>
                      </div>
                    ) : (
                      <Row>
                        {apiTemplates.map(template => (
                          <Col key={template.id} xs={12} sm={6} lg={4} xl={3} className="mb-4">
                            <Card
                              className={`border shadow-sm template-card ${selectedTemplate === template.id ? 'border-primary' : ''
                                }`}
                              style={{
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                overflow: 'hidden',
                                padding: 0
                              }}
                            >
                              {/* Thumbnail - Formato horizontal (16:10 aprox) simulando pantalla PC */}
                              <div
                                className="template-thumbnail"
                                style={{
                                  width: '100%',
                                  paddingTop: '62.5%', // Aspect ratio 16:10 (10/16 = 0.625)
                                  backgroundImage: `url(${getTemplateImageUrl(template)})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  position: 'relative',
                                  borderRadius: '0.25rem'
                                }}
                              >
                                {/* Indicador de selección - siempre visible */}
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
                                  {/* Solo los 2 botones */}
                                  <Button
                                    color={selectedTemplate === template.id ? 'primary' : 'light'}
                                    size="sm"
                                    style={{ pointerEvents: 'auto' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelectTemplate(template.id);
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
                                      console.log('Vista previa:', template.id);
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
          </Col>
        </Row>



        {/* Modal para nombrar la página */}
        <Modal isOpen={modalOpen} toggle={toggleModal} centered>
          <ModalHeader toggle={toggleModal}>
            {"Nombra tu página"}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="pageName">{"Nombre de la página"}</Label>
              <Input
                type="text"
                id="pageName"
                placeholder="Ej. Mi Nuevo Sitio"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                autoFocus
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal} disabled={generating}>
              {"Cancelar"}
            </Button>
            <Button
              color="primary"
              onClick={handleGenerate}
              disabled={generating || !pageName.trim()}
            >
              {generating ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  {"Procesando..."}
                </>
              ) : (
                "Crear"
              )}
            </Button>
          </ModalFooter>
        </Modal>

      </Container>
    </div>
  );
};

export default CreatePage;
