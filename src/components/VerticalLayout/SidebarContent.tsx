import React, { useEffect, useRef, useCallback, useState } from "react";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { useLocation } from "react-router-dom";
import withRouter from "../Common/withRouter";

//i18n
import { withTranslation } from "react-i18next";

// Menu Config
import { useMenuConfig } from "@/config/hooks/useMenuConfig";
import MenuRenderer from "./MenuRenderer";
import { useUserPermissions } from "@/core/auth";

const SidebarContent: React.FC = () => {
  const ref = useRef<any>();
  const metisMenuRef = useRef<MetisMenu | null>(null);
  const isInitialized = useRef(false);
  const path = useLocation();
  const { permissionNames, loading } = useUserPermissions();
  const menuItems = useMenuConfig([], permissionNames);
  const [menuKey, setMenuKey] = useState(0);

  const activateParentDropdown = useCallback((item: HTMLElement) => {
    item.classList.add("active");
    const parent = item.parentElement;
    if (!parent) return false;

    const parent2El = parent.childNodes[1] as HTMLElement | undefined;
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    parent.classList.add("mm-active");
    const parent2 = parent.parentElement;

    if (parent2) {
      parent2.classList.add("mm-show"); // ul tag

      const parent3 = parent2.parentElement; // li tag

      if (parent3) {
        parent3.classList.add("mm-active"); // li
        const firstChild = parent3.childNodes[0] as HTMLElement | undefined;
        if (firstChild) firstChild.classList.add("mm-active"); //a

        const parent4 = parent3.parentElement; // ul
        if (parent4) {
          parent4.classList.add("mm-show"); // ul
          const parent5 = parent4.parentElement;
          if (parent5) {
            parent5.classList.add("mm-show"); // li
            const p5Child = parent5.childNodes[0] as HTMLElement | undefined;
            if (p5Child) p5Child.classList.add("mm-active"); // a tag
          }
        }
      }
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items: HTMLCollectionOf<HTMLAnchorElement>) => {
    for (let i = 0; i < items.length; ++i) {
      const item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.length && parent.childNodes[1]
            ? parent.childNodes[1] as HTMLElement
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            const p3Child = parent3.childNodes[0] as HTMLElement | undefined;
            if (p3Child) p3Child.classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                const p5Child = parent5.childNodes[0] as HTMLElement | undefined;
                if (p5Child) p5Child.classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const activeMenu = useCallback(() => {
    const pathName = path.pathname;
    let matchingMenuItem: HTMLAnchorElement | null = null;
    const ul = document.getElementById("side-menu");
    if (!ul) return;

    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [path.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current?.recalculate();
  }, []);

  // Inicializar MetisMenu después de que los permisos se carguen y el menú esté renderizado
  useEffect(() => {
    if (loading) return; // Esperar a que los permisos se carguen

    // Usar un pequeño delay para asegurar que el DOM esté listo
    const timer = setTimeout(() => {
      // Limpiar instancia anterior si existe
      if (metisMenuRef.current) {
        try {
          metisMenuRef.current.dispose();
        } catch (e) {
          // Ignorar errores de dispose
        }
      }

      // Crear nueva instancia
      const sideMenu = document.getElementById("side-menu");
      if (sideMenu) {
        metisMenuRef.current = new MetisMenu("#side-menu");
        activeMenu();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [menuKey, loading]); // Reinicializar cuando cambie el menuKey

  // Cuando cambian los permisos, forzar reinicialización del menú
  useEffect(() => {
    if (!loading && permissionNames.length > 0 && !isInitialized.current) {
      isInitialized.current = true;
      setMenuKey(prev => prev + 1);
    }
  }, [permissionNames, loading]);

  // Actualizar el estado activo cuando cambia la ruta
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeMenu();
  }, [path.pathname]);

  function scrollElement(item: HTMLElement) {
    if (item && ref.current) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu" key={menuKey}>
            <MenuRenderer items={menuItems} />
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

export default withTranslation()(withRouter(SidebarContent));
