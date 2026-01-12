import React, { useEffect, useCallback, useState, useRef } from "react";
import { Button } from "reactstrap";
import AzHeaderCard from "./AzHeaderCard";

interface ViewConfig {
  key?: string | undefined;
  name: string;
  icon: string;
  title?: string | undefined;
  content?: React.ReactNode | null | undefined;
}

type ViewInput = string | ViewConfig | Record<string, any>;

interface BadgeConfig {
  count?: number | undefined;
  total?: number | undefined;
  color?: string | undefined;
  text?: string | undefined;
}

interface AzHeaderCardViewsProps {
  title: string;
  description?: string | undefined;
  badge?: string | BadgeConfig | undefined;
  currentView?: string | undefined;
  onViewChange?: ((viewKey: string) => void) | undefined;
  views?: (string | ViewConfig)[] | undefined;
  contents?: React.ReactNode[] | undefined;
  contentTopRight?: React.ReactNode | undefined;
  contentBottomLeft?: React.ReactNode | undefined;
  contentBottomRight?: React.ReactNode | undefined;
  hideViewButtons?: boolean | undefined;
  mobileBreakpoint?: number | undefined;
  className?: string | undefined;
}

const MOBILE_BREAKPOINT = 768;

const DEFAULT_VIEWS_CONFIG: Record<string, { name: string; icon: string; title: string }> = {
  web: { name: "Web", icon: "mdi-monitor", title: "Vista Web" },
  table: { name: "Tabla", icon: "mdi-table", title: "Vista Tabla" },
  movil: { name: "Móvil", icon: "mdi-cellphone", title: "Vista Móvil" },
  cards: { name: "Cards", icon: "mdi-view-grid", title: "Vista Cards" },
  grid: { name: "Grid", icon: "mdi-view-grid", title: "Vista Grid" },
  list: { name: "Lista", icon: "mdi-view-list", title: "Vista Lista" }
};

const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

const ensureMdiPrefix = (icon: string): string =>
  icon.startsWith('mdi-') ? icon : `mdi-${icon}`;

const normalizeViewConfig = (view: ViewInput, index: number): ViewConfig => {
  if (typeof view === 'object' && view.name && view.icon) {
    return {
      key: view.key || index.toString(),
      name: view.name,
      icon: ensureMdiPrefix(view.icon),
      title: view.title || `Vista ${view.name}`,
      content: view.content || null
    };
  }

  if (typeof view === 'string') {
    if (view.includes(':')) {
      const [name = '', icon = 'eye'] = view.split(':');
      const capitalizedName = capitalize(name.trim());
      return {
        key: index.toString(),
        name: capitalizedName,
        icon: ensureMdiPrefix(icon.trim()),
        title: `Vista ${capitalizedName}`,
        content: null
      };
    }

    const defaultConfig = DEFAULT_VIEWS_CONFIG[view];
    if (defaultConfig) {
      return {
        key: index.toString(),
        ...defaultConfig,
        content: null
      };
    }

    const capitalizedView = capitalize(view);
    return {
      key: index.toString(),
      name: capitalizedView,
      icon: "mdi-eye",
      title: `Vista ${capitalizedView}`,
      content: null
    };
  }

  return {
    key: index.toString(),
    name: `Vista ${index + 1}`,
    icon: "mdi-eye",
    title: `Vista ${index + 1}`,
    content: null
  };
};

const AzHeaderCardViews: React.FC<AzHeaderCardViewsProps> = React.memo(({
  title,
  description,
  badge,
  currentView = "0",
  onViewChange,
  views = ["table", "cards"],
  contents = [],
  contentTopRight,
  contentBottomLeft,
  contentBottomRight,
  hideViewButtons = false,
  mobileBreakpoint = MOBILE_BREAKPOINT,
  className
}) => {
  const normalizedViews = React.useMemo(() =>
    views.map((view, index) => normalizeViewConfig(view, index)),
    [views]
  );

  // Vista móvil es siempre la segunda (índice 1)
  const mobileViewKey = normalizedViews.length > 1 ? (normalizedViews[1].key ?? '1') : '0';

  // Estado para detectar si estamos en móvil
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < mobileBreakpoint : false
  );

  // Ref para evitar llamadas innecesarias a onViewChange
  const prevIsMobileRef = useRef(isMobile);

  // Detectar cambios en el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < mobileBreakpoint;
      setIsMobile(mobile);

      // Solo forzar cambio a cards cuando CAMBIA a móvil (no en cada render)
      if (mobile && !prevIsMobileRef.current) {
        onViewChange?.(mobileViewKey);
      }
      prevIsMobileRef.current = mobile;
    };

    // Ejecutar inmediatamente al montar
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileBreakpoint, mobileViewKey, onViewChange]);

  // En móvil siempre mostrar cards, en desktop respetar la selección del usuario
  const effectiveView = isMobile ? mobileViewKey : currentView;

  // Manejar cambio de vista manual por el usuario
  const handleViewChange = useCallback((viewKey: string) => {
    onViewChange?.(viewKey);
  }, [onViewChange]);

  const viewButtons = React.useMemo(() => {
    if (hideViewButtons || normalizedViews.length < 2) return null;

    return (
      <div className="btn-group d-none d-md-flex me-2" role="group">
        {normalizedViews.map((viewConfig, index) => {
          const viewKey = viewConfig.key ?? index.toString();
          const isActive = effectiveView === viewKey;
          const viewTitle = viewConfig.title ?? `Vista ${viewConfig.name}`;

          return (
            <Button
              key={`${viewKey}-${index}`}
              color={isActive ? 'primary' : 'light'}
              onClick={() => handleViewChange(viewKey)}
              size="sm"
              title={viewTitle}
              style={{ position: 'relative' }}
            >
              <i className={`mdi ${viewConfig.icon}`}></i>
              <span className="d-none d-lg-inline ms-1">{viewConfig.name}</span>
            </Button>
          );
        })}
      </div>
    );
  }, [normalizedViews, effectiveView, hideViewButtons, handleViewChange]);

  const badgeProps = React.useMemo(() => {
    if (!badge) return {};

    if (typeof badge === 'string') {
      return { showBadge: true, badgeText: badge };
    }

    return {
      showBadge: true,
      badgeText: badge.text,
      badgeCount: badge.count,
      badgeTotal: badge.total,
      badgeColor: badge.color || "info"
    };
  }, [badge]);

  const activeViewContent = React.useMemo(() => {
    const activeView = normalizedViews.find(view => view.key === effectiveView);
    return activeView?.content ? <div className="mt-3">{activeView.content}</div> : null;
  }, [normalizedViews, effectiveView]);

  const combinedContentTopRight = React.useMemo(() => {
    const elements = [];

    if (viewButtons) elements.push(viewButtons);
    if (contentTopRight) elements.push(contentTopRight);
    if (contents[0]) elements.push(contents[0]);

    return elements.length > 0 ? (
      <div className="d-flex flex-wrap gap-2 justify-content-lg-end justify-content-center">
        {elements.map((element, index) => (
          <React.Fragment key={index}>{element}</React.Fragment>
        ))}
      </div>
    ) : null;
  }, [viewButtons, contentTopRight, contents]);

  const combinedContentBottomLeft = React.useMemo(() => {
    if (contentBottomLeft && contents[1]) {
      return (
        <div className="d-flex flex-wrap gap-2 align-items-center">
          {contentBottomLeft}
          {contents[1]}
        </div>
      );
    }
    return contentBottomLeft || contents[1] || null;
  }, [contentBottomLeft, contents]);

  const combinedContentBottomRight = React.useMemo(() => {
    if (contentBottomRight && contents[2]) {
      return (
        <div className="d-flex flex-wrap gap-2 align-items-center">
          {contentBottomRight}
          {contents[2]}
        </div>
      );
    }
    return contentBottomRight || contents[2] || null;
  }, [contentBottomRight, contents]);

  return (
    <>
      <AzHeaderCard
        title={title}
        description={description}
        {...badgeProps}
        showBottomRow={!!(combinedContentBottomLeft || combinedContentBottomRight)}
        contentTopRight={combinedContentTopRight}
        bottomLeftSlot={combinedContentBottomLeft}
        bottomRightSlot={combinedContentBottomRight}
        className={className}
      />
      {activeViewContent}
    </>
  );
});

AzHeaderCardViews.displayName = "AzHeaderCardViews";

export default AzHeaderCardViews;

