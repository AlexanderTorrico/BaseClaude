import React, { useEffect } from "react";
import { Collapse } from "reactstrap";
import withRouter from "../Common/withRouter";
import { RootState } from "@/store";

//i18n
import { withTranslation } from "react-i18next";

import { connect } from "react-redux";

// Menu Config
import { useMenuConfig } from "@/config/hooks/useMenuConfig";
import NavbarMenuRenderer from "./NavbarMenuRenderer";
import { useUserPermissions } from "@/core/auth";

interface NavbarProps {
  leftMenu: boolean;
  t: (key: string) => string;
  menuOpen?: any;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const { permissionNames } = useUserPermissions();
  const menuItems = useMenuConfig([], permissionNames);

  useEffect(() => {
    let matchingMenuItem: HTMLAnchorElement | null = null;
    const ul = document.getElementById("navigation");
    if (ul) {
      const items = ul.getElementsByTagName("a");
      removeActivation(items);
      for (let i = 0; i < items.length; ++i) {
        if (window.location.pathname === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    }
  });

  const removeActivation = (items: HTMLCollectionOf<HTMLAnchorElement>) => {
    for (let i = 0; i < items.length; ++i) {
      const item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        if (parent.classList.contains("active")) {
          parent.classList.remove("active");
        }
      }
    }
  };

  function activateParentDropdown(item: HTMLAnchorElement): boolean {
    item.classList.add("active");
    const parent = item.parentElement;
    if (parent) {
      parent.classList.add("active"); // li
      const parent2 = parent.parentElement;
      if (parent2) {
        parent2.classList.add("active"); // li
        const parent3 = parent2.parentElement;
        if (parent3) {
          parent3.classList.add("active"); // li
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add("active"); // li
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("active"); // li
              const parent6 = parent5.parentElement;
              if (parent6) {
                parent6.classList.add("active"); // li
              }
            }
          }
        }
      }
    }
    return false;
  }

  return (
    <React.Fragment>
      <div className="topnav">
        <div className="container-fluid">
          <nav
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
          >
            <Collapse
              isOpen={props.leftMenu}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav">
                <NavbarMenuRenderer items={menuItems} />
              </ul>
            </Collapse>
          </nav>
        </div>
      </div>
    </React.Fragment>
  );
};

const mapStatetoProps = (state: RootState) => {
  const { leftMenu } = state.layout;
  return { leftMenu };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(Navbar))
);
