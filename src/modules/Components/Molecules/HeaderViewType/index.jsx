import React from "react";
import { withTranslation } from "react-i18next";
import { Container, Button, InputGroup, InputGroupText, Input } from "reactstrap";
import { AzHeaderCard, AzHeaderCardViews, AzHeaderCardViewResponsive } from "../../../../components/aziende/AzHeader";
// Subcomponentes optimizados
import UserDataTable from "./components/UserDataTable";
import UserCardsList from "./components/UserCardsList";
import UserGridGallery from "./components/UserGridGallery";
import AddNewUserCard from "./components/AddNewUserCard";
import Footer from "./footer";


// Componente de demostración que se renderiza en la página
const HeaderViewTypePage = () => {
  //meta title
  document.title = "AzHeaderCard & AzHeaderCardViews | Moléculas - Skote React";

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
          <h4 className="mb-4">AzHeaderCard & AzHeaderCardViews - Moléculas Genéricas</h4>
          
          <h4 className="mb-3 text-primary">AzHeaderCard (Componente Base)</h4>

          {/* Ejemplo 1: Header básico */}
          <AzHeaderCard
            title="Header Básico"
            description="Ejemplo simple con solo título y descripción"
          />

          {/* Ejemplo 2: Header con badge */}
          <AzHeaderCard
            title="Header con Badge"
            description="Ejemplo con contador de resultados"
            showBadge={true}
            badgeCount={45}
            badgeTotal={120}
            badgeColor="success"
          />

          {/* Ejemplo 3: Header con acciones personalizadas */}
          <AzHeaderCard
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

          <h4 className="mb-3 mt-5 text-success">AzHeaderCardViews (Con Cambio de Vista)</h4>

          {/* Ejemplo 4: AzHeaderCardViews con pestañas */}
          <AzHeaderCardViews
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

          {/* Ejemplo 5: AzHeaderCardViews con múltiples pestañas */}
          <AzHeaderCardViews
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

          {/* Ejemplo 6: AzHeaderCardViews completo optimizado */}
          <AzHeaderCardViews
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

          <h4 className="mb-3 mt-5 text-info">AzHeaderCardViews con Iconos Personalizados</h4>

          {/* Ejemplo 6.5: AzHeaderCardViews con objetos personalizados */}
          <AzHeaderCardViews
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

          <h4 className="mb-3 mt-5 text-warning">AzHeaderCardViewResponsive (Integrado con Contenido)</h4>

          {/* Ejemplo 7: AzHeaderCardViewResponsive con nuevo formato */}
          <AzHeaderCardViewResponsive
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
          <Footer />
        </Container>
      </div>
    </React.Fragment>
  );
};

HeaderViewTypePage.propTypes = {};
export default withTranslation()(HeaderViewTypePage);
