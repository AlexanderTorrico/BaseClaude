import React from 'react';
import { NavLink } from 'react-router-dom';
import { MenuItem } from '@/config/types/MenuTypes';
import { withTranslation } from 'react-i18next';

interface MenuRendererProps {
  items: MenuItem[];
  t: (key: string) => string;
}

const MenuRenderer: React.FC<MenuRendererProps> = ({ items, t }) => {
  const renderMenuItem = (item: MenuItem): JSX.Element | null => {
    if (item.hidden) return null;

    switch (item.type) {
      case 'section':
        return (
          <li key={item.id} className="menu-title">
            {t(item.labelKey)}
          </li>
        );

      case 'link':
        return (
          <li key={item.id}>
            <NavLink
              to={item.path || '#'}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              {item.icon && <i className={item.icon}></i>}
              {item.badge && (
                <span className={`badge rounded-pill bg-${item.badge.color} float-end`}>
                  {item.badge.count}
                </span>
              )}
              <span>{t(item.labelKey)}</span>
            </NavLink>
          </li>
        );

      case 'dropdown':
        return (
          <li key={item.id}>
            <a
              href="#"
              className="has-arrow"
              onClick={(e) => e.preventDefault()}
            >
              {item.icon && <i className={item.icon}></i>}
              {item.badge && (
                <span className={`badge rounded-pill bg-${item.badge.color} float-end`}>
                  {item.badge.count}
                </span>
              )}
              <span>{t(item.labelKey)}</span>
            </a>
            {item.children && item.children.length > 0 && (
              <ul className="sub-menu" aria-expanded="false">
                {item.children.map(child => renderMenuItem(child))}
              </ul>
            )}
          </li>
        );

      default:
        return null;
    }
  };

  return <>{items.map(item => renderMenuItem(item))}</>;
};

export default withTranslation()(MenuRenderer);
