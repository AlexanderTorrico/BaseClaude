import React from "react";

const Footer = () => {

    return (
        <div className="mt-5 p-4 bg-light rounded">
            <h4 className="mb-3">API Simplificada - Fácil de usar:</h4>
            <div className="row">
              <div className="col-lg-4">
                <h6 className="text-primary">AzHeaderCard (Base)</h6>
                <pre className="small"><code>{`<AzHeaderCard
  title="Mi Título"
  description="Descripción"
  contentTopRight={<Button>Acción</Button>}
/>`}</code></pre>
              </div>
              <div className="col-lg-4">
                <h6 className="text-success">AzAzHeaderCardViews (Sistema de Pestañas)</h6>
                <pre className="small"><code>{`<AzAzHeaderCardViews
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
                <h6 className="text-warning">AzAzHeaderCardViewResponsive</h6>
                <pre className="small"><code>{`<AzAzHeaderCardViewResponsive
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
                  <li><strong>Nomenclatura consistente:</strong> API unificada en AzHeaderCard, AzAzHeaderCardViews y AzAzHeaderCardViewResponsive</li>
                  <li><strong>PropTypes completos:</strong> Validación total con soporte para ambos formatos</li>
                  <li><strong>JSDoc completo:</strong> Documentación integrada para VSCode IntelliSense</li>
                  <li><strong>Performance optimizada:</strong> React.memo, useCallback, useMemo en todos los componentes</li>
                </ul>
              </div>
            </div>
          </div>
    );
}


export default Footer;