import React from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { Container, Button, InputGroup, InputGroupText, Input } from "reactstrap";
import { Row, Col, Card, CardBody } from "reactstrap";
import { H4, P, Badge } from "../../../../components/Atoms";

// Componente genérico HeaderCard optimizado
const HeaderCard = React.memo(({
  title,
  description,
  showBadge = false,
  badgeCount,
  badgeTotal,
  badgeColor = "info",
  badgeText,
  showBottomRow = false,
  contentTopRight,
  bottomLeftSlot,
  bottomRightSlot,
  className = "",
  cardClassName = ""
}) => {
  return (
    <Card className={`border-0 shadow-sm mb-4 ${cardClassName}`}>
      <CardBody className={className}>
        {/* Fila superior: Título/Descripción + Slot derecha */}
        <Row className="align-items-center">
          <Col lg={6} md={12}>
            <H4 className="mb-0">{title}</H4>
            {description && (
              <P className="text-muted mb-md-0 mb-3">
                {description}
                {showBadge && (badgeCount !== undefined || badgeText) && (
                  <span className="ms-2">
                    <Badge color={badgeColor} style={{ fontSize: '0.65rem' }}>
                      {badgeText || (
                        <>
                          {badgeCount}
                          {badgeTotal !== undefined && ` de ${badgeTotal}`}
                          {badgeTotal !== undefined && ' resultados'}
                        </>
                      )}
                    </Badge>
                  </span>
                )}
              </P>
            )}
          </Col>
          <Col lg={6} md={12}>
            <div className="d-flex flex-wrap gap-2 justify-content-lg-end justify-content-center">
              {contentTopRight}
            </div>
          </Col>
        </Row>

        {/* Fila inferior opcional: Slots izquierda + derecha */}
        {showBottomRow && (bottomLeftSlot || bottomRightSlot) && (
          <Row className="mt-3 g-3">
            <Col xs={12} sm={5} md={6} lg={7}>
              {bottomLeftSlot}
            </Col>
            <Col xs={12} sm={7} md={6} lg={5}>
              <div className="d-flex gap-2 align-items-center justify-content-sm-end">
                {bottomRightSlot}
              </div>
            </Col>
          </Row>
        )}
      </CardBody>
    </Card>
  );
});

HeaderCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  showBadge: PropTypes.bool,
  badgeCount: PropTypes.number,
  badgeTotal: PropTypes.number,
  badgeColor: PropTypes.string,
  badgeText: PropTypes.string,
  showBottomRow: PropTypes.bool,
  contentTopRight: PropTypes.node,
  bottomLeftSlot: PropTypes.node,
  bottomRightSlot: PropTypes.node,
  className: PropTypes.string,
  cardClassName: PropTypes.string
};

// Componente de demostración que se renderiza en la página
const HeaderViewTypePage = () => {
  //meta title
  document.title = "HeaderCard & HeaderCardViews | Moléculas - Skote React";

  // Estados para ejemplos funcionales
  const [view1, setView1] = React.useState('table');
  const [view2, setView2] = React.useState('cards');
  const [view3, setView3] = React.useState('table');

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <H4 className="mb-4">HeaderCard & HeaderCardViews - Moléculas Genéricas</H4>
          
          <H4 className="mb-3 text-primary">HeaderCard (Componente Base)</H4>
          
          {/* Ejemplo 1: Header básico */}
          <HeaderCard
            title="Header Básico"
            description="Ejemplo simple con solo título y descripción"
          />

          {/* Ejemplo 2: Header con badge */}
          <HeaderCard
            title="Header con Badge"
            description="Ejemplo con contador de resultados"
            showBadge={true}
            badgeCount={45}
            badgeTotal={120}
            badgeColor="success"
          />

          {/* Ejemplo 3: Header con acciones personalizadas */}
          <HeaderCard
            title="Header con Acciones Personalizadas"
            description="Ejemplo con botones personalizados en la parte superior derecha"
            showBadge={true}
            badgeText="🔥 Activo"
            badgeColor="warning"
            contentTopRight={
              <div className="d-flex flex-wrap gap-2">
                <Button color="primary" size="sm">
                  <i className="mdi mdi-plus me-1"></i>
                  Nuevo
                </Button>
                <Button color="success" outline size="sm">
                  <i className="mdi mdi-export me-1"></i>
                  Exportar
                </Button>
              </div>
            }
          />

          <H4 className="mb-3 mt-5 text-success">HeaderCardViews (Con Cambio de Vista)</H4>

          {/* Ejemplo 4: HeaderCardViews básico optimizado */}
          <HeaderCardViews
            title="Gestión de Usuarios"
            description={`Sistema de usuarios - Vista: ${view1}`}
            badge={{ count: 156, total: 500 }}
            currentView={view1}
            onViewChange={setView1}
            contentTopRight={
              <Button color="primary" size="sm">
                <i className="mdi mdi-plus me-1"></i>
                Nuevo Usuario
              </Button>
            }
          />

          {/* Ejemplo 5: HeaderCardViews con 3 vistas */}
          <HeaderCardViews
            title="Catálogo de Productos"
            description={`Gestión de inventario - Vista: ${view2}`}
            badge="🛒 En línea"
            currentView={view2}
            onViewChange={setView2}
            views={['web', 'table', 'movil']}
            contentTopRight={
              <>
                <Button color="primary" size="sm">
                  <i className="mdi mdi-plus me-1"></i>
                  Agregar
                </Button>
                <Button color="secondary" outline size="sm">
                  <i className="mdi mdi-cog"></i>
                </Button>
              </>
            }
          />

          {/* Ejemplo 6: HeaderCardViews completo optimizado */}
          <HeaderCardViews
            title="Panel de Control Avanzado"
            description={`Dashboard completo - Vista: ${view3}`}
            badge={{ count: 89, total: 200 }}
            currentView={view3}
            onViewChange={setView3}
            contentTopRight={
              <>
                <Button color="primary" size="sm">
                  <i className="mdi mdi-refresh me-1"></i>
                  Actualizar
                </Button>
                <Button color="info" outline size="sm">
                  <i className="mdi mdi-download"></i>
                </Button>
              </>
            }
            contentBottomLeft={
              <InputGroup size="sm">
                <InputGroupText>
                  <i className="mdi mdi-magnify"></i>
                </InputGroupText>
                <Input
                  type="text"
                  placeholder="Buscar elementos..."
                />
              </InputGroup>
            }
            contentBottomRight={
              <>
                <Button color="light" outline size="sm">
                  <i className="mdi mdi-filter"></i>
                  Filtros
                </Button>
                <Button color="secondary" outline size="sm">
                  <i className="mdi mdi-sort"></i>
                  Ordenar
                </Button>
              </>
            }
          />

          <H4 className="mb-3 mt-5 text-info">HeaderCardViews con Iconos Personalizados</H4>

          {/* Ejemplo 6.5: HeaderCardViews con iconos personalizados */}
          <HeaderCardViews
            title="Sistema con Vistas Personalizadas"
            description={`Ejemplo con iconos personalizados - Vista: ${view3}`}
            badge={{ count: 15, total: 30, color: "info" }}
            currentView={view3}
            onViewChange={setView3}
            views={['admin:mdi-shield-account', 'reportes:mdi-chart-line', 'config:mdi-cog']} // Formato: nombre:icono
            contentTopRight={
              <Button color="info" size="sm">
                <i className="mdi mdi-settings me-1"></i>
                Configurar
              </Button>
            }
          />

          <H4 className="mb-3 mt-5 text-warning">HeaderCardViewResponsive (Integrado con Contenido)</H4>

          {/* Ejemplo 7: HeaderCardViewResponsive con configuración responsiva */}
          <HeaderCardViewResponsive
            title="Sistema Responsivo Completo"
            description="Header con contenido que cambia automáticamente según el tamaño de pantalla"
            badge={{ count: 25, total: 100 }}
            views={['web', 'table', 'movil']} // [desktop, tablet, mobile]
            breakpoints={{ mobile: 768, tablet: 1024, desktop: 1200 }}
            enableTransitions={true}
            contentTopRight={
              <Button color="primary" size="sm">
                <i className="mdi mdi-plus me-1"></i>
                Nuevo
              </Button>
            }
            contentBottomLeft={
              <InputGroup size="sm">
                <InputGroupText>
                  <i className="mdi mdi-magnify"></i>
                </InputGroupText>
                <Input
                  type="text"
                  placeholder="Buscar registros..."
                />
              </InputGroup>
            }
            contentBottomRight={
              <Button color="primary" outline size="sm">
                <i className="mdi mdi-filter"></i>
                Filtrar
              </Button>
            }
            viewWeb={
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Email</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>001</td>
                          <td>Juan Pérez</td>
                          <td>juan@example.com</td>
                          <td><span className="badge bg-success">Activo</span></td>
                          <td>
                            <Button color="primary" size="sm" className="me-1">
                              <i className="mdi mdi-pencil"></i>
                            </Button>
                            <Button color="danger" size="sm">
                              <i className="mdi mdi-delete"></i>
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td>002</td>
                          <td>María González</td>
                          <td>maria@example.com</td>
                          <td><span className="badge bg-warning">Pendiente</span></td>
                          <td>
                            <Button color="primary" size="sm" className="me-1">
                              <i className="mdi mdi-pencil"></i>
                            </Button>
                            <Button color="danger" size="sm">
                              <i className="mdi mdi-delete"></i>
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td>003</td>
                          <td>Carlos López</td>
                          <td>carlos@example.com</td>
                          <td><span className="badge bg-success">Activo</span></td>
                          <td>
                            <Button color="primary" size="sm" className="me-1">
                              <i className="mdi mdi-pencil"></i>
                            </Button>
                            <Button color="danger" size="sm">
                              <i className="mdi mdi-delete"></i>
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            }
            viewTable={
              <div className="row">
                <div className="col-xl-4 col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 me-3">
                          <div className="avatar-sm rounded-circle bg-primary d-flex align-items-center justify-content-center">
                            <span className="text-white">JP</span>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">Juan Pérez</h6>
                          <p className="text-muted mb-2">juan@example.com</p>
                          <span className="badge bg-success">Activo</span>
                        </div>
                        <div className="flex-shrink-0">
                          <Button color="primary" size="sm" className="me-1">
                            <i className="mdi mdi-pencil"></i>
                          </Button>
                          <Button color="danger" size="sm">
                            <i className="mdi mdi-delete"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 me-3">
                          <div className="avatar-sm rounded-circle bg-success d-flex align-items-center justify-content-center">
                            <span className="text-white">MG</span>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">María González</h6>
                          <p className="text-muted mb-2">maria@example.com</p>
                          <span className="badge bg-warning">Pendiente</span>
                        </div>
                        <div className="flex-shrink-0">
                          <Button color="primary" size="sm" className="me-1">
                            <i className="mdi mdi-pencil"></i>
                          </Button>
                          <Button color="danger" size="sm">
                            <i className="mdi mdi-delete"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 me-3">
                          <div className="avatar-sm rounded-circle bg-info d-flex align-items-center justify-content-center">
                            <span className="text-white">CL</span>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">Carlos López</h6>
                          <p className="text-muted mb-2">carlos@example.com</p>
                          <span className="badge bg-success">Activo</span>
                        </div>
                        <div className="flex-shrink-0">
                          <Button color="primary" size="sm" className="me-1">
                            <i className="mdi mdi-pencil"></i>
                          </Button>
                          <Button color="danger" size="sm">
                            <i className="mdi mdi-delete"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            viewMovil={
              <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="card text-center">
                    <div className="card-body">
                      <div className="avatar-lg mx-auto mb-3">
                        <div className="avatar-lg rounded bg-primary d-flex align-items-center justify-content-center">
                          <span className="text-white fs-4">JP</span>
                        </div>
                      </div>
                      <h6>Juan Pérez</h6>
                      <p className="text-muted">juan@example.com</p>
                      <span className="badge bg-success mb-3">Activo</span>
                      <div className="d-flex justify-content-center gap-1">
                        <Button color="primary" size="sm">
                          <i className="mdi mdi-pencil"></i>
                        </Button>
                        <Button color="danger" size="sm">
                          <i className="mdi mdi-delete"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="card text-center">
                    <div className="card-body">
                      <div className="avatar-lg mx-auto mb-3">
                        <div className="avatar-lg rounded bg-success d-flex align-items-center justify-content-center">
                          <span className="text-white fs-4">MG</span>
                        </div>
                      </div>
                      <h6>María González</h6>
                      <p className="text-muted">maria@example.com</p>
                      <span className="badge bg-warning mb-3">Pendiente</span>
                      <div className="d-flex justify-content-center gap-1">
                        <Button color="primary" size="sm">
                          <i className="mdi mdi-pencil"></i>
                        </Button>
                        <Button color="danger" size="sm">
                          <i className="mdi mdi-delete"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="card text-center">
                    <div className="card-body">
                      <div className="avatar-lg mx-auto mb-3">
                        <div className="avatar-lg rounded bg-info d-flex align-items-center justify-content-center">
                          <span className="text-white fs-4">CL</span>
                        </div>
                      </div>
                      <h6>Carlos López</h6>
                      <p className="text-muted">carlos@example.com</p>
                      <span className="badge bg-success mb-3">Activo</span>
                      <div className="d-flex justify-content-center gap-1">
                        <Button color="primary" size="sm">
                          <i className="mdi mdi-pencil"></i>
                        </Button>
                        <Button color="danger" size="sm">
                          <i className="mdi mdi-delete"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="card text-center">
                    <div className="card-body">
                      <div className="text-center p-4">
                        <div className="avatar-lg mx-auto mb-3 border border-dashed rounded d-flex align-items-center justify-content-center">
                          <i className="mdi mdi-plus text-muted fs-2"></i>
                        </div>
                        <p className="text-muted">Agregar nuevo registro</p>
                        <Button color="primary" outline size="sm">
                          <i className="mdi mdi-plus me-1"></i>
                          Agregar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          />

          {/* API simplificada - Información de uso */}
          <div className="mt-5 p-4 bg-light rounded">
            <H4 className="mb-3">API Simplificada - Fácil de usar:</H4>
            <div className="row">
              <div className="col-lg-4">
                <h6 className="text-primary">HeaderCard (Base)</h6>
                <pre className="small"><code>{`<HeaderCard
  title="Mi Título"
  description="Descripción"
  contentTopRight={<Button>Acción</Button>}
/>`}</code></pre>
              </div>
              <div className="col-lg-4">
                <h6 className="text-success">HeaderCardViews (Optimizado)</h6>
                <pre className="small"><code>{`<HeaderCardViews
  title="Mi Sistema"
  badge="Activo"
  currentView={view}
  onViewChange={setView}
  views={['web', 'table', 'movil']}
  // O con iconos personalizados:
  // views={['admin:mdi-shield', 'ventas:mdi-cart']}
  contentTopRight={<Button>Nuevo</Button>}
  contentBottomLeft={<Input />}
  contentBottomRight={<Button>Filtros</Button>}
/>`}</code></pre>
              </div>
              <div className="col-lg-4">
                <h6 className="text-warning">HeaderCardViewResponsive</h6>
                <pre className="small"><code>{`<HeaderCardViewResponsive
  title="Dashboard"
  badge={{count: 25, total: 100}}
  views={['web', 'table', 'movil']}
  // O personalizado: views={['datos:mdi-database']}
  breakpoints={{mobile: 768, tablet: 1024}}
  viewWeb={<MiTablaWeb />}
  viewTable={<MisCardsTablet />}
  viewMovil={<MiGridMovil />}
  contentTopRight={<Button>Acción</Button>}
  enableTransitions={true}
/>`}</code></pre>
              </div>
            </div>

            <div className="mt-4">
              <h6>✨ Mejoras implementadas:</h6>
              <ul className="small">
                <li><strong>Badge simplificado:</strong> String directo o objeto {`{count, total, color}`}</li>
                <li><strong>Props reducidas:</strong> Eliminadas props redundantes y complejas</li>
                <li><strong>Nomenclatura estandarizada:</strong> `contentTopRight` para área superior derecha en todos los componentes</li>
                <li><strong>Posicionamiento estandarizado:</strong> Mismo contenedor flex con `d-flex flex-wrap gap-2 justify-content-lg-end justify-content-center`</li>
                <li><strong>Responsivo inteligente:</strong> Hook `useResponsiveView` con detección automática de breakpoints</li>
                <li><strong>Transiciones suaves:</strong> Animaciones CSS configurables para cambios de vista</li>
                <li><strong>Iconos personalizados:</strong> Soporte para vistas con formato "nombre:mdi-icon" (ej: "admin:mdi-shield")</li>
                <li><strong>Vistas predefinidas:</strong> web, table, movil, cards, grid, list con iconos automáticos</li>
              </ul>
              
              <div className="mt-3 p-3 bg-success bg-opacity-10 rounded">
                <h6 className="text-success mb-2">📱 Funcionalidad Responsiva:</h6>
                <ul className="small mb-0">
                  <li><strong>Array de vistas:</strong> `views={['web', 'table', 'movil']}` - automático según breakpoint</li>
                  <li><strong>Breakpoints personalizables:</strong> `{`{mobile: 768, tablet: 1024, desktop: 1200}`}`</li>
                  <li><strong>Prioridad responsiva:</strong> El tamaño de pantalla siempre define la vista activa</li>
                  <li><strong>Botones ocultos en móvil:</strong> UI limpia en dispositivos pequeños</li>
                  <li><strong>Fallback inteligente:</strong> Si no hay vista definida para tablet/mobile → usa desktop</li>
                  <li><strong>Indicadores visuales:</strong> Los botones muestran qué vista está activa automáticamente</li>
                </ul>
              </div>
              
              <div className="mt-3 p-3 bg-info bg-opacity-10 rounded">
                <h6 className="text-info mb-2">🎨 Sistema de Iconos Personalizados:</h6>
                <ul className="small mb-0">
                  <li><strong>Vistas predefinidas:</strong> web, table, movil, cards, grid, list (iconos automáticos)</li>
                  <li><strong>Iconos personalizados:</strong> Formato "nombre:mdi-icon" → "admin:mdi-shield-account"</li>
                  <li><strong>Fallback inteligente:</strong> Vistas sin formato específico usan icono genérico "mdi-eye"</li>
                  <li><strong>Ejemplos:</strong> ['admin:mdi-shield', 'ventas:mdi-cart', 'reportes:mdi-chart-line']</li>
                </ul>
              </div>

              <div className="mt-3 p-3 bg-warning bg-opacity-10 rounded">
                <h6 className="text-warning mb-2">🎯 Estándar Unificado:</h6>
                <ul className="small mb-0">
                  <li><strong>Atributo estandarizado:</strong> Todos los componentes usan `contentTopRight` con nomenclatura consistente</li>
                  <li><strong>Posicionamiento consistente:</strong> Mismo comportamiento responsivo en desktop y móvil</li>
                  <li><strong>API simplificada:</strong> Una sola prop para el área superior derecha</li>
                  <li><strong>JSDoc completo:</strong> Documentación integrada para VSCode IntelliSense</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

HeaderViewTypePage.propTypes = {};

/**
 * HeaderCardViews optimizado con soporte responsivo
 * Componente de header con cambio de vistas y botones de navegación
 * 
 * @param {string} title - Título principal del header
 * @param {string} [description] - Descripción opcional del header  
 * @param {string|Object} [badge] - Badge simple (string) o complejo {count, total, color, text}
 * @param {string} [currentView="table"] - Vista actualmente seleccionada
 * @param {function} [onViewChange] - Función callback para cambio de vista
 * @param {string[]} [views=["table", "cards"]] - Array de vistas disponibles (soporta: web, table, movil, cards, grid, list, o formato personalizado "nombre:mdi-icon")
 * @param {React.ReactNode} [contentTopRight] - Contenido del área superior derecha (botones de acción)
 * @param {React.ReactNode} [contentBottomLeft] - Contenido del área inferior izquierda (filtros, inputs)
 * @param {React.ReactNode} [contentBottomRight] - Contenido del área inferior derecha (controles, ordenamiento)
 * @param {string} [className] - Clases CSS adicionales
 * @param {boolean} [hideViewButtons=false] - Oculta los botones de cambio de vista
 * @param {boolean} [responsiveMode=false] - Indica si está en modo responsivo (solo lectura)
 */
// Configuración estática de vistas (fuera del componente para evitar re-creación)
const VIEWS_CONFIG = {
  // Vistas predeterminadas con iconos automáticos
  web: { icon: "mdi-monitor", label: "Web", title: "Vista Web" },
  table: { icon: "mdi-table", label: "Tabla", title: "Vista Tabla" },
  movil: { icon: "mdi-cellphone", label: "Móvil", title: "Vista Móvil" },
  cards: { icon: "mdi-card-multiple", label: "Cards", title: "Vista Cards" },
  grid: { icon: "mdi-view-grid", label: "Grid", title: "Vista Grid" },
  list: { icon: "mdi-view-list", label: "Lista", title: "Vista Lista" },
  // Función helper para obtener configuración de vista (permite iconos personalizados)
  getViewConfig: (viewName) => {
    // Si es una configuración predeterminada, devolverla
    if (VIEWS_CONFIG[viewName]) {
      return VIEWS_CONFIG[viewName];
    }
    
    // Si contiene un icono personalizado (formato: "nombre:mdi-icon-name")
    if (typeof viewName === 'string' && viewName.includes(':')) {
      const [name, icon] = viewName.split(':');
      return {
        icon: icon.startsWith('mdi-') ? icon : `mdi-${icon}`,
        label: name.charAt(0).toUpperCase() + name.slice(1),
        title: `Vista ${name.charAt(0).toUpperCase() + name.slice(1)}`
      };
    }
    
    // Vista personalizada sin icono específico (usar icono genérico)
    return {
      icon: "mdi-eye",
      label: typeof viewName === 'string' ? viewName.charAt(0).toUpperCase() + viewName.slice(1) : "Vista",
      title: `Vista ${typeof viewName === 'string' ? viewName.charAt(0).toUpperCase() + viewName.slice(1) : "Personalizada"}`
    };
  }
};

const HeaderCardViews = React.memo(({
  title,
  description,
  // Badge simplificado
  badge,
  // Vista actual y cambio
  currentView = "table",
  onViewChange,
  views = ["table", "cards"],
  // Slots con nomenclatura consistente
  contentTopRight,    // Área superior derecha: botones de acción, controles principales
  contentBottomLeft,  // Área inferior izquierda: inputs, selects, filtros, etc.
  contentBottomRight, // Área inferior derecha: botones, controles, ordenamiento, etc.
  // Configuración responsiva
  hideViewButtons = false,
  responsiveMode = false,
  isManualOverride = false,
  responsiveView,
  // Estilos opcionales
  className
}) => {

  const renderViewButtons = () => {
    // Ocultar botones si está configurado o si hay menos de 2 vistas
    if (hideViewButtons || views.length < 2) return null;
    
    return (
      <div className="btn-group d-none d-md-flex me-2" role="group">
        {views.map((view, index) => {
          const config = VIEWS_CONFIG.getViewConfig(view);
          
          const isActive = currentView === view;
          const isResponsiveMatch = responsiveView === view;
          
          return (
            <Button 
              key={`${view}-${index}`}
              color={isActive ? 'primary' : 'light'}
              onClick={() => onViewChange && onViewChange(view)}
              size="sm"
              title={responsiveMode ? 
                `${config.title} ${isResponsiveMatch ? '(Vista responsiva)' : '(Override manual)'}` : 
                config.title
              }
              style={{
                position: 'relative'
              }}
            >
              <i className={`mdi ${config.icon}`}></i>
              <span className="d-none d-lg-inline ms-1">{config.label}</span>
            </Button>
          );
        })}
      </div>
    );
  };

  // Determinar badge props (memoizado para rendimiento)
  const badgeProps = React.useMemo(() => {
    if (!badge) return {};
    return {
      showBadge: true,
      ...(typeof badge === 'string' ? { badgeText: badge } : badge)
    };
  }, [badge]);

  return (
    <HeaderCard
      title={title}
      description={description}
      {...badgeProps}
      showBottomRow={!!(contentBottomLeft || contentBottomRight)}
      contentTopRight={
        <div className="d-flex flex-wrap gap-2 justify-content-lg-end justify-content-center">
          {renderViewButtons()}
          {contentTopRight}
        </div>
      }
      bottomLeftSlot={contentBottomLeft}
      bottomRightSlot={contentBottomRight}
      className={className}
    />
  );
});

HeaderCardViews.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  badge: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      text: PropTypes.string,
      count: PropTypes.number,
      total: PropTypes.number,
      color: PropTypes.string
    })
  ]),
  currentView: PropTypes.string,
  onViewChange: PropTypes.func,
  views: PropTypes.arrayOf(PropTypes.string), // Acepta cualquier string para permitir vistas personalizadas
  contentTopRight: PropTypes.node,    // Área superior derecha
  contentBottomLeft: PropTypes.node,  // Área inferior izquierda
  contentBottomRight: PropTypes.node, // Área inferior derecha
  hideViewButtons: PropTypes.bool,    // Oculta botones de vista
  responsiveMode: PropTypes.bool,     // Modo responsivo automático
  isManualOverride: PropTypes.bool,   // Indica si está en override manual
  responsiveView: PropTypes.string, // Vista que correspondería por responsivo
  className: PropTypes.string
};

/**
 * Hook personalizado para manejo responsivo automático de vistas
 * @param {string[]} views - Array de vistas [desktop, tablet, mobile]
 * @param {Object} breakpoints - Puntos de quiebre {mobile: 768, tablet: 1024, desktop: 1200}
 * @returns {Object} {currentView, isMobile, currentBreakpoint}
 */
const useResponsiveView = (views = ["web", "table", "movil"], breakpoints = { mobile: 768, tablet: 1024, desktop: 1200 }) => {
  const [windowWidth, setWindowWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [manualView, setManualView] = React.useState(null); // Vista seleccionada manualmente
  const [lastBreakpoint, setLastBreakpoint] = React.useState(null);
  
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const getCurrentBreakpoint = React.useCallback(() => {
    if (windowWidth <= breakpoints.mobile) return 'mobile';
    if (windowWidth <= breakpoints.tablet) return 'tablet';
    return 'desktop';
  }, [windowWidth, breakpoints]);
  
  const currentBreakpoint = getCurrentBreakpoint();
  
  // Reset manual selection when breakpoint changes (responsive priority)
  React.useEffect(() => {
    if (lastBreakpoint && lastBreakpoint !== currentBreakpoint) {
      setManualView(null); // Reset override when breakpoint changes
    }
    setLastBreakpoint(currentBreakpoint);
  }, [currentBreakpoint, lastBreakpoint]);
  
  const getResponsiveView = React.useCallback(() => {
    const breakpointIndex = {
      desktop: 0,
      tablet: 1, 
      mobile: 2
    };
    
    const viewIndex = breakpointIndex[currentBreakpoint];
    // Fallback a desktop (índice 0) si no hay vista definida para tablet/mobile
    return views[viewIndex] || views[0] || 'web';
  }, [views, currentBreakpoint]);
  
  const currentView = manualView || getResponsiveView();
  
  return {
    currentView,
    responsiveView: getResponsiveView(),
    isMobile: currentBreakpoint === 'mobile',
    isManualOverride: !!manualView,
    setManualView
  };
};

/**
 * HeaderCardViewResponsive con configuración responsiva inteligente
 * Componente completo que incluye header y contenido que cambia automáticamente según el tamaño de pantalla
 * 
 * @param {string} title - Título principal del header
 * @param {string} [description] - Descripción opcional del header
 * @param {string|Object} [badge] - Badge simple (string) o complejo {count, total, color, text}
 * @param {string[]} [views=['web', 'table', 'movil']] - Vistas responsivas [desktop, tablet, mobile]. Soporta: web, table, movil, cards, grid, list, o formato personalizado "nombre:mdi-icon"
 * @param {Object} [breakpoints] - Puntos de quiebre personalizados {mobile: 768, tablet: 1024, desktop: 1200}
 * @param {React.ReactNode} [viewWeb] - Contenido para vista web (desktop). Fallback por defecto para todas las vistas
 * @param {React.ReactNode} [viewTable] - Contenido para vista tablet (fallback a viewWeb si no se proporciona)
 * @param {React.ReactNode} [viewMovil] - Contenido para vista móvil (fallback a viewTable → viewWeb si no se proporciona)
 * @param {React.ReactNode} [contentTopRight] - Contenido del área superior derecha (botones de acción)
 * @param {React.ReactNode} [contentBottomLeft] - Contenido del área inferior izquierda (filtros, inputs)
 * @param {React.ReactNode} [contentBottomRight] - Contenido del área inferior derecha (controles, ordenamiento)
 * @param {string} [className] - Clases CSS adicionales para el header
 * @param {string} [contentClassName] - Clases CSS adicionales para el área de contenido
 * @param {boolean} [enableTransitions=true] - Habilita transiciones suaves entre vistas
 */
const HeaderCardViewResponsive = React.memo(({
  title,
  description,
  badge,
  // Vista y contenido con configuración responsiva
  views = ["web", "table", "movil"], // [desktop, tablet, mobile]
  breakpoints = { mobile: 768, tablet: 1024, desktop: 1200 },
  viewWeb,
  viewTable,
  viewMovil,
  // Slots con nomenclatura consistente
  contentTopRight,    // Área superior derecha: botones de acción, controles principales
  contentBottomLeft,  // Área inferior izquierda: inputs, selects, filtros, etc.
  contentBottomRight, // Área inferior derecha: botones, controles, ordenamiento, etc.
  // Estilos
  className,
  contentClassName,
  enableTransitions = true
}) => {
  const { currentView, responsiveView, isMobile, isManualOverride, setManualView } = useResponsiveView(views, breakpoints);

  const handleViewChange = React.useCallback((view) => {
    // Si view es null, resetear a modo responsivo automático
    setManualView(view);
  }, [setManualView]);

  const renderContent = React.useCallback(() => {
    // Lógica de fallback inteligente según los requisitos
    const getViewContent = (viewType) => {
      switch (viewType) {
        case 'web':
          return viewWeb; // Siempre mostrar viewWeb si está disponible
        
        case 'table':
          // Si no hay viewTable, usar viewWeb como fallback
          return viewTable || viewWeb;
        
        case 'movil':
          // Si no hay viewMovil, usar viewTable (si existe) o viewWeb
          return viewMovil || viewTable || viewWeb;
        
        case 'cards':
          // Compatibilidad: cards = table con misma lógica de fallback
          return viewTable || viewWeb;
        
        case 'grid':
          // Compatibilidad: grid = movil con misma lógica de fallback
          return viewMovil || viewTable || viewWeb;
        
        default:
          // Para vistas personalizadas, usar viewWeb por defecto
          return viewWeb;
      }
    };

    const selectedContent = getViewContent(currentView);
    
    if (!selectedContent) {
      return (
        <div className="card">
          <div className="card-body text-center text-muted p-5">
            <i className="mdi mdi-eye-off fs-1 mb-3 d-block"></i>
            <h6>Vista {currentView} no configurada</h6>
            <p className="mb-0">Proporciona el contenido para esta vista</p>
          </div>
        </div>
      );
    }

    return selectedContent;
  }, [currentView, viewWeb, viewTable, viewMovil]);

  return (
    <React.Fragment>
      <HeaderCardViews
        title={title}
        description={description}
        badge={badge}
        currentView={currentView}
        onViewChange={handleViewChange} // Permitir cambio manual
        views={views}
        contentTopRight={contentTopRight}
        contentBottomLeft={contentBottomLeft}
        contentBottomRight={contentBottomRight}
        className={className}
        hideViewButtons={isMobile} // Nueva prop para ocultar botones en móvil
        responsiveMode={true} // Indica que está en modo responsivo
        isManualOverride={isManualOverride} // Indica si está en override manual
        responsiveView={responsiveView} // Vista que correspondería por responsivo
      />
      
      <div 
        className={`view-content ${contentClassName || ''}`}
        style={enableTransitions ? {
          transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
          opacity: 1,
          transform: 'translateX(0)'
        } : {}}
      >
        {renderContent()}
      </div>
    </React.Fragment>
  );
});

HeaderCardViewResponsive.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  badge: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      text: PropTypes.string,
      count: PropTypes.number,
      total: PropTypes.number,
      color: PropTypes.string
    })
  ]),
  views: PropTypes.arrayOf(PropTypes.string), // Acepta cualquier string para permitir vistas personalizadas
  breakpoints: PropTypes.shape({
    mobile: PropTypes.number,
    tablet: PropTypes.number,
    desktop: PropTypes.number
  }),
  viewWeb: PropTypes.node,
  viewTable: PropTypes.node,
  viewMovil: PropTypes.node,
  contentTopRight: PropTypes.node,    // Área superior derecha
  contentBottomLeft: PropTypes.node,  // Área inferior izquierda  
  contentBottomRight: PropTypes.node, // Área inferior derecha
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  enableTransitions: PropTypes.bool
};

// Exportar todos los componentes
export { HeaderCard, HeaderCardViews, HeaderCardViewResponsive };
export default withTranslation()(HeaderViewTypePage);
