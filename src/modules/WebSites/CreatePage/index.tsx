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
  FormGroup
} from 'reactstrap';

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
  { id: 'landing', name: 'Landing Pages', icon: 'mdi-rocket-launch' },
  { id: 'business', name: 'Negocios', icon: 'mdi-briefcase' },
  { id: 'ecommerce', name: 'E-Commerce', icon: 'mdi-cart' },
  { id: 'portfolio', name: 'Portfolio', icon: 'mdi-palette' },
  { id: 'blog', name: 'Blog', icon: 'mdi-post' },
];

const MOCK_TEMPLATES: PageTemplate[] = [
  // Landing Pages
  { id: 'lp-1', name: 'Startup Modern', description: 'Landing page moderna para startups tecnológicas', thumbnail: 'https://via.placeholder.com/400x300/667eea/ffffff?text=Startup+Modern', category: 'landing' },
  { id: 'lp-2', name: 'App Showcase', description: 'Ideal para presentar aplicaciones móviles', thumbnail: 'https://via.placeholder.com/400x300/764ba2/ffffff?text=App+Showcase', category: 'landing' },
  { id: 'lp-3', name: 'SaaS Product', description: 'Landing page para productos SaaS', thumbnail: 'https://via.placeholder.com/400x300/f093fb/ffffff?text=SaaS+Product', category: 'landing' },

  // Business
  { id: 'biz-1', name: 'Corporate Pro', description: 'Diseño corporativo profesional', thumbnail: 'https://via.placeholder.com/400x300/4facfe/ffffff?text=Corporate+Pro', category: 'business' },
  { id: 'biz-2', name: 'Consulting Agency', description: 'Para agencias de consultoría', thumbnail: 'https://via.placeholder.com/400x300/00f2fe/ffffff?text=Consulting', category: 'business' },

  // E-Commerce
  { id: 'shop-1', name: 'Fashion Store', description: 'Tienda online de moda', thumbnail: 'https://via.placeholder.com/400x300/43e97b/ffffff?text=Fashion+Store', category: 'ecommerce' },
  { id: 'shop-2', name: 'Tech Shop', description: 'E-commerce de tecnología', thumbnail: 'https://via.placeholder.com/400x300/38f9d7/ffffff?text=Tech+Shop', category: 'ecommerce' },

  // Portfolio
  { id: 'port-1', name: 'Creative Portfolio', description: 'Portfolio para diseñadores creativos', thumbnail: 'https://via.placeholder.com/400x300/fa709a/ffffff?text=Creative', category: 'portfolio' },
  { id: 'port-2', name: 'Developer Portfolio', description: 'Portfolio para desarrolladores', thumbnail: 'https://via.placeholder.com/400x300/fee140/ffffff?text=Developer', category: 'portfolio' },

  // Blog
  { id: 'blog-1', name: 'Minimal Blog', description: 'Blog minimalista y elegante', thumbnail: 'https://via.placeholder.com/400x300/30cfd0/ffffff?text=Minimal+Blog', category: 'blog' },
  { id: 'blog-2', name: 'Magazine Style', description: 'Estilo revista para blogs', thumbnail: 'https://via.placeholder.com/400x300/330867/ffffff?text=Magazine', category: 'blog' },
];

const CreatePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

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

  // Filtrar templates por categoría
  const filteredTemplates = MOCK_TEMPLATES.filter(t => t.category === activeTab);

  // Obtener el conteo de templates por categoría
  const getTemplateCount = (categoryId: string) => {
    return MOCK_TEMPLATES.filter(t => t.category === categoryId).length;
  };

  const handleCreateWithAI = () => {
    console.log('Crear página con IA');
    // Aquí iría la lógica para crear con IA
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    console.log('Template seleccionado:', templateId);
    // Aquí iría la lógica para usar el template
  };

  return (
    <div className="page-content" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', overflowX: 'hidden' }}>
      <Container fluid style={{ flex: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', overflowX: 'hidden' }}>
        {/* Header - Fijo */}
        <Row className="mb-3" style={{ flexShrink: 0 }}>
          <Col xs={12}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-1">Crear Nueva Página</h4>
                <p className="text-muted mb-0">
                  Selecciona un template o crea una página con IA
                </p>
              </div>
              <Button color="primary" size="lg" onClick={handleCreateWithAI}>
                <i className="mdi mdi-auto-fix me-2"></i>
                Crear con IA
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
                      Categoría
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
                          {category.name} ({getTemplateCount(category.id)})
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
                        {category.name}
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
                    {filteredTemplates.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="mdi mdi-package-variant display-4 text-muted"></i>
                        <p className="text-muted mt-3">
                          No hay templates disponibles en esta categoría
                        </p>
                      </div>
                    ) : (
                      <Row>
                        {filteredTemplates.map(template => (
                          <Col key={template.id} xs={12} sm={6} lg={4} xl={3} className="mb-4">
                            <Card
                              className={`border shadow-sm template-card ${
                                selectedTemplate === template.id ? 'border-primary' : ''
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
                                  backgroundImage: `url(${template.thumbnail})`,
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
                                    Seleccionar
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
                                    title="Vista previa"
                                  >
                                    <i className="mdi mdi-eye me-1"></i>
                                    Preview
                                  </Button>
                                </div>
                              </div>
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

        {/* Footer con botón de continuar - Fijo en la parte inferior */}
        {selectedTemplate && (
          <Row className="mt-3" style={{ flexShrink: 0 }}>
            <Col xs={12}>
              <Card className="border-primary shadow-sm">
                <CardBody className="py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-1">Template seleccionado</h5>
                      <p className="text-muted mb-0">
                        {MOCK_TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                      </p>
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        color="light"
                        onClick={() => setSelectedTemplate(null)}
                      >
                        Cancelar
                      </Button>
                      <Button color="success">
                        <i className="mdi mdi-check me-1"></i>
                        Continuar con este template
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default CreatePage;
