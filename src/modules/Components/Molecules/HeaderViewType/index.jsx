import React from "react";
import { withTranslation } from "react-i18next";
import { Container, Button, InputGroup, InputGroupText, Input } from "reactstrap";
import { H4 } from "../../../../components/Atoms";
import HeaderCard from "../../../../components/HeaderCard";
import { HeaderCardViews, HeaderCardViewResponsive } from "../../../../components/HeaderCardViews";
// Subcomponentes optimizados
import UserDataTable from "./components/UserDataTable";
import UserCardsList from "./components/UserCardsList";
import UserGridGallery from "./components/UserGridGallery";
import AddNewUserCard from "./components/AddNewUserCard";


// Componente de demostración que se renderiza en la página
const HeaderViewTypePage = () => {
  //meta title
  document.title = "HeaderCard & HeaderCardViews | Moléculas - Skote React";

  // Estados para ejemplos funcionales
  const [view1, setView1] = React.useState('0');
  const [view2, setView2] = React.useState('0');
  const [view3, setView3] = React.useState('0');

  // Handlers optimizados para subcomponentes (memoizados)
  const handleUserEdit = React.useCallback((user) => {
    console.log('Editando usuario:', user);
    // Aquí iría la lógica real de edición
  }, []);

  const handleUserDelete = React.useCallback((user) => {
    console.log('Eliminando usuario:', user);
    // Aquí iría la lógica real de eliminación
  }, []);

  const handleAddUser = React.useCallback(() => {
    console.log('Agregando nuevo usuario');
    // Aquí iría la lógica real de agregar usuario
  }, []);

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

          {/* Ejemplo 4: HeaderCardViews con pestañas */}
          <HeaderCardViews
            title="Sistema de Gestión"
            description="Sistema con pestañas y contenido dinámico"
            badge="🟢 Activo"
            currentView={view1}
            onViewChange={setView1}
            views={[
              { 
                name: "Usuarios", 
                icon: "mdi-account-group", 
                content: <div className="p-3 bg-primary bg-opacity-10 rounded">Gestión de usuarios del sistema</div>
              },
              { 
                name: "Productos", 
                icon: "mdi-package", 
                content: <div className="p-3 bg-success bg-opacity-10 rounded">Catálogo de productos disponibles</div>
              }
            ]}
            contentTopRight={
              <Button color="primary" size="sm">
                <i className="mdi mdi-plus me-1"></i>
                Nuevo
              </Button>
            }
          />

          <br /><br />

          {/* Ejemplo 5: HeaderCardViews con múltiples pestañas */}
          <HeaderCardViews
            title="Dashboard Empresarial"
            description="Panel de control con varias secciones"
            badge="🛒 En línea"
            currentView={view2}
            onViewChange={setView2}
            views={[
              { 
                name: "Ventas", 
                icon: "mdi-chart-line", 
                content: <div className="p-3 bg-warning bg-opacity-10 rounded">
                  <h6>Módulo de Ventas</h6>
                  <p className="mb-0">Reportes y estadísticas de ventas</p>
                </div>
              },
              { 
                name: "Inventario", 
                icon: "mdi-package-variant", 
                content: <div className="p-3 bg-info bg-opacity-10 rounded">
                  <h6>Control de Inventario</h6>
                  <p className="mb-0">Stock y gestión de productos</p>
                </div>
              },
              { 
                name: "Clientes", 
                icon: "mdi-account-multiple", 
                content: <div className="p-3 bg-secondary bg-opacity-10 rounded">
                  <h6>Base de Clientes</h6>
                  <p className="mb-0">Gestión de clientes y contactos</p>
                </div>
              }
            ]}
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

          <br /><br />

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

          {/* Ejemplo 6.5: HeaderCardViews con objetos personalizados */}
          <HeaderCardViews
            title="Sistema con Objetos Personalizados"
            description={`Ejemplo con objetos - Vista: ${view3}`}
            badge={{ count: 15, total: 30, color: "info" }}
            currentView={view3}
            onViewChange={setView3}
            views={[
              { name: "Admin", icon: "mdi-shield-account", key: "admin" },
              { name: "Reportes", icon: "mdi-chart-line", key: "reportes" },
              { name: "Config", icon: "mdi-cog", key: "config" }
            ]}
            contents={[
              <Button color="info" size="sm">
                <i className="mdi mdi-settings me-1"></i>
                Configurar
              </Button>
            ]}
          />

          <H4 className="mb-3 mt-5 text-warning">HeaderCardViewResponsive (Integrado con Contenido)</H4>

          {/* Ejemplo 7: HeaderCardViewResponsive con nuevo formato */}
          <HeaderCardViewResponsive
            title="Sistema Responsivo Completo"
            description="Header con contenido que cambia automáticamente según el tamaño de pantalla"
            badge={{ count: 25, total: 100 }}
            views={[
              { name: "Web", icon: "mdi-monitor", key: "web" },
              { name: "Tabla", icon: "mdi-table", key: "table" },
              { name: "Móvil", icon: "mdi-cellphone", key: "movil" }
            ]} // Usando objetos
            breakpoints={{ mobile: 768, tablet: 1024, desktop: 1200 }}
            enableTransitions={true}
            contents={[
              // [0] contentTopRight
              <Button color="primary" size="sm">
                <i className="mdi mdi-plus me-1"></i>
                Nuevo
              </Button>,
              // [1] contentBottomLeft
              <InputGroup size="sm">
                <InputGroupText>
                  <i className="mdi mdi-magnify"></i>
                </InputGroupText>
                <Input
                  type="text"
                  placeholder="Buscar registros..."
                />
              </InputGroup>,
              // [2] contentBottomRight
              <Button color="primary" outline size="sm">
                <i className="mdi mdi-filter"></i>
                Filtrar
              </Button>
            ]}
            viewWeb={
              <UserDataTable 
                onEdit={handleUserEdit}
                onDelete={handleUserDelete}
              />
            }
            viewTable={
              <UserCardsList 
                onEdit={handleUserEdit}
                onDelete={handleUserDelete}
              />
            }
            viewMovil={
              <div className="row">
                <UserGridGallery 
                  onEdit={handleUserEdit}
                  onDelete={handleUserDelete}
                />
                <AddNewUserCard 
                  onAdd={handleAddUser}
                />
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
                <h6 className="text-success">HeaderCardViews (Sistema de Pestañas)</h6>
                <pre className="small"><code>{`<HeaderCardViews
  title="Mi Sistema"
  badge="Activo"
  currentView="0" // Índice de vista activa
  onViewChange={setView}
  // Pestañas con contenido:
  views={[
    { 
      name: "Usuarios", 
      icon: "mdi-account", 
      content: <MiComponenteUsuarios />
    },
    { 
      name: "Productos", 
      icon: "mdi-package", 
      content: <MiComponenteProductos />
    }
  ]}
  // O strings (compatibilidad):
  // views={['web', 'table']}
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
  // Objetos o strings:
  views={[
    { name: "Web", icon: "mdi-monitor", key: "web" },
    { name: "Móvil", icon: "mdi-cellphone", key: "movil" }
  ]}
  breakpoints={{mobile: 768, tablet: 1024}}
  viewWeb={<MiTablaWeb />}
  viewTable={<MisCardsTablet />}
  viewMovil={<MiGridMovil />}
  // Props estándar:
  contentTopRight={<Button>Acción</Button>}
  contentBottomLeft={<Input />}
  contentBottomRight={<Button>Filtros</Button>}
  enableTransitions={true}
/>`}</code></pre>
              </div>
            </div>

            <div className="mt-4">
              <h6>✨ Nuevas funcionalidades implementadas:</h6>
              <ul className="small">
                <li><strong>Sistema de pestañas:</strong> Cada vista puede tener su propio contenido React</li>
                <li><strong>Índices automáticos:</strong> Las vistas usan su posición como key (0, 1, 2...)</li>
                <li><strong>Badge simplificado:</strong> Solo badgeText, eliminados badgeCount y badgeTotal</li>
                <li><strong>Contenido dinámico:</strong> {`{name, icon, content}`} en objetos views</li>
                <li><strong>Props legacy:</strong> contentTopRight, contentBottomLeft, contentBottomRight</li>
                <li><strong>Compatibilidad total:</strong> Mantiene soporte para strings en views</li>
                <li><strong>Responsivo inteligente:</strong> Hook `useResponsiveView` con detección automática</li>
                <li><strong>Transiciones suaves:</strong> Animaciones CSS configurables para cambios de vista</li>
                <li><strong>Iconos flexibles:</strong> MDI automático + formato personalizado "nombre:mdi-icon"</li>
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
                <h6 className="text-warning mb-2">🏷️ Sistema de Pestañas Integrado:</h6>
                <ul className="small mb-0">
                  <li><strong>Objetos views:</strong> {`{name: "Dashboard", icon: "mdi-view-dashboard", content: <MiComponente />}`}</li>
                  <li><strong>Contenido dinámico:</strong> Cada pestaña muestra su propio componente React</li>
                  <li><strong>Índices automáticos:</strong> currentView="0", "1", "2" según posición en array</li>
                  <li><strong>Cambio automático:</strong> Al hacer clic en pestaña, se muestra su content</li>
                  <li><strong>Backward compatibility:</strong> Strings siguen funcionando sin content</li>
                </ul>
              </div>
              
              <div className="mt-3 p-3 bg-secondary bg-opacity-10 rounded">
                <h6 className="text-secondary mb-2">📝 API Unificada:</h6>
                <ul className="small mb-0">
                  <li><strong>Nomenclatura consistente:</strong> API unificada en HeaderCard, HeaderCardViews y HeaderCardViewResponsive</li>
                  <li><strong>PropTypes completos:</strong> Validación total con soporte para ambos formatos</li>
                  <li><strong>JSDoc completo:</strong> Documentación integrada para VSCode IntelliSense</li>
                  <li><strong>Performance optimizada:</strong> React.memo, useCallback, useMemo en todos los componentes</li>
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
