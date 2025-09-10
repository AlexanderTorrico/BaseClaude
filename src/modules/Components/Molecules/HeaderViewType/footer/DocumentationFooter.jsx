import React from "react";
import { H4 } from "../../../../../components/Atoms";

/**
 * DocumentationFooter - Documentación completa de la API
 * Componente que muestra toda la documentación y ejemplos de uso
 */
const DocumentationFooter = React.memo(() => {
  // Ejemplos de código como componentes React para evitar strings HTML
  const HeaderCardExample = React.memo(() => (
    <div className="bg-dark text-light p-3 rounded">
      <div className="text-info">{'<HeaderCard'}</div>
      <div className="ms-2">title="Mi Título"</div>
      <div className="ms-2">description="Descripción"</div>
      <div className="ms-2">{'contentTopRight={<Button>Acción</Button>}'}</div>
      <div className="text-info">{'/>'}</div>
    </div>
  ));

  const HeaderCardViewsExample = React.memo(() => (
    <div className="bg-dark text-light p-3 rounded">
      <div className="text-info">{'<HeaderCardViews'}</div>
      <div className="ms-2">title="Mi Sistema"</div>
      <div className="ms-2">badge="Activo"</div>
      <div className="ms-2">currentView="0"</div>
      <div className="ms-2">onViewChange={'{setView}'}</div>
      <div className="ms-2 text-warning">// Sistema de pestañas:</div>
      <div className="ms-2">views={'{['}</div>
      <div className="ms-3">{'{ name: "Users", icon: "mdi-account",'}</div>
      <div className="ms-3">{'  content: <UsersList /> },'}</div>
      <div className="ms-3">{'{ name: "Products", icon: "mdi-package",'}</div>
      <div className="ms-3">{'  content: <ProductsList /> }'}</div>
      <div className="ms-2">{']}'}</div>
      <div className="ms-2">{'contentTopRight={<Button>Nuevo</Button>}'}</div>
      <div className="text-info">{'/>'}</div>
    </div>
  ));

  const HeaderCardViewResponsiveExample = React.memo(() => (
    <div className="bg-dark text-light p-3 rounded">
      <div className="text-info">{'<HeaderCardViewResponsive'}</div>
      <div className="ms-2">title="Dashboard"</div>
      <div className="ms-2">badge={'{count: 25, total: 100}'}</div>
      <div className="ms-2">views={'{[\'web\', \'table\', \'movil\']}'}</div>
      <div className="ms-2 text-muted">// O personalizado: views={'{[\'datos:mdi-database\']}'}</div>
      <div className="ms-2">breakpoints={'{mobile: 768, tablet: 1024}'}</div>
      <div className="ms-2">{'viewWeb={<MiTablaWeb />}'}</div>
      <div className="ms-2">{'viewTable={<MisCardsTablet />}'}</div>
      <div className="ms-2">{'viewMovil={<MiGridMovil />}'}</div>
      <div className="ms-2">{'contentTopRight={<Button>Acción</Button>}'}</div>
      <div className="ms-2">enableTransitions={'{true}'}</div>
      <div className="text-info">{'/>'}</div>
    </div>
  ));

  return (
    <div className="mt-5 p-4 bg-light rounded">
      <H4 className="mb-3">API Simplificada - Fácil de usar:</H4>
      <div className="row">
        <div className="col-lg-4">
          <h6 className="text-primary">HeaderCard (Base)</h6>
          <HeaderCardExample />
        </div>
        <div className="col-lg-4">
          <h6 className="text-success">HeaderCardViews (Optimizado)</h6>
          <HeaderCardViewsExample />
        </div>
        <div className="col-lg-4">
          <h6 className="text-warning">HeaderCardViewResponsive</h6>
          <HeaderCardViewResponsiveExample />
        </div>
      </div>

      <div className="mt-4">
        <h6>✨ Nuevas funcionalidades:</h6>
        <ul className="small">
          <li><strong>Sistema de pestañas:</strong> Cada vista puede tener su propio contenido React</li>
          <li><strong>Badge simplificado:</strong> Solo badgeText, eliminados badgeCount y badgeTotal</li>
          <li><strong>Índices automáticos:</strong> currentView usa posición en array (0, 1, 2...)</li>
          <li><strong>Contenido dinámico:</strong> Objetos views con name, icon y content</li>
          <li><strong>Props estándar:</strong> contentTopRight, contentBottomLeft, contentBottomRight</li>
          <li><strong>Compatibilidad total:</strong> Strings y props legacy siguen funcionando</li>
          <li><strong>Responsivo inteligente:</strong> Hook useResponsiveView con detección automática</li>
          <li><strong>Transiciones suaves:</strong> Animaciones CSS configurables para cambios de vista</li>
          <li><strong>Iconos personalizados:</strong> Formato "nombre:mdi-icon" (ej: "admin:mdi-shield")</li>
        </ul>
        
        <div className="mt-3 p-3 bg-success bg-opacity-10 rounded">
          <h6 className="text-success mb-2">📱 Funcionalidad Responsiva:</h6>
          <ul className="small mb-0">
            <li><strong>Array de vistas:</strong> views con formato [web, table, movil] - automático según breakpoint</li>
            <li><strong>Breakpoints personalizables:</strong> configuración de mobile: 768, tablet: 1024, desktop: 1200</li>
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
            <li><strong>Ejemplos:</strong> admin:mdi-shield, ventas:mdi-cart, reportes:mdi-chart-line</li>
          </ul>
        </div>

        <div className="mt-3 p-3 bg-warning bg-opacity-10 rounded">
          <h6 className="text-warning mb-2">🎯 Estándar Unificado:</h6>
          <ul className="small mb-0">
            <li><strong>Atributo estandarizado:</strong> Todos los componentes usan contentTopRight con nomenclatura consistente</li>
            <li><strong>Posicionamiento consistente:</strong> Mismo comportamiento responsivo en desktop y móvil</li>
            <li><strong>API simplificada:</strong> Una sola prop para el área superior derecha</li>
            <li><strong>JSDoc completo:</strong> Documentación integrada para VSCode IntelliSense</li>
          </ul>
        </div>
      </div>
    </div>
  );
});

DocumentationFooter.displayName = "DocumentationFooter";

export default DocumentationFooter;