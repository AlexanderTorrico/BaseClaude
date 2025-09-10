import React from "react";
import { withTranslation } from "react-i18next";
import { Container, Button, InputGroup, InputGroupText, Input } from "reactstrap";
import { H4 } from "../../../../components/Atoms";
import HeaderCard from "../../../../components/HeaderCard";
import { HeaderCardViews, HeaderCardViewResponsive } from "../../../../components/HeaderCardViews";


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
export default withTranslation()(HeaderViewTypePage);
