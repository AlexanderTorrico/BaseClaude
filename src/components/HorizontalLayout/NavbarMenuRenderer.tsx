import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Collapse } from 'reactstrap';
import classname from 'classnames';
import { MenuItem } from '@/config/types/MenuTypes';
import { withTranslation } from 'react-i18next';

interface NavbarMenuRendererProps {
  items: MenuItem[];
  t: (key: string) => string;
}

const NavbarMenuRenderer: React.FC<NavbarMenuRendererProps> = ({ items, t }) => {
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

  const toggleDropdown = (id: string) => {
    setOpenDropdowns(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const closeDropdown = (id: string) => {
    setOpenDropdowns(prev => ({ ...prev, [id]: false }));
  };

  const renderMenuItem = (item: MenuItem): JSX.Element | null => {
    if (item.hidden || item.type === 'section') return null;

    const isOpen = openDropdowns[item.id] || false;

    switch (item.type) {
      case 'link':
        return (
          <li key={item.id} className="nav-item">
            <Link to={item.path || '#'} className="nav-link">
              {item.icon && <i className={`${item.icon} me-2`}></i>}
              {t(item.labelKey)}
              {item.badge && (
                <span className={`badge rounded-pill bg-${item.badge.color} ms-2`}>
                  {item.badge.count}
                </span>
              )}
            </Link>
          </li>
        );

      case 'dropdown':
        return (
          <li
            key={item.id}
            className="nav-item dropdown"
            onMouseLeave={() => closeDropdown(item.id)}
          >
            <Link
              className="nav-link dropdown-toggle arrow-none"
              to={item.path || '/#'}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                toggleDropdown(item.id);
              }}
            >
              {item.icon && <i className={`${item.icon} me-2`}></i>}
              {t(item.labelKey)}
              {item.badge && (
                <span className={`badge rounded-pill bg-${item.badge.color} float-end`}>
                  {item.badge.count}
                </span>
              )}
              <div className="arrow-down"></div>
            </Link>
            <div className={classname('dropdown-menu', { show: isOpen })}>
              {item.children && item.children.map(child => renderSubMenuItem(child))}
            </div>
          </li>
        );

      default:
        return null;
    }
  };

  const renderSubMenuItem = (item: MenuItem): JSX.Element | null => {
    if (item.hidden) return null;

    const isOpen = openDropdowns[item.id] || false;

    if (item.type === 'dropdown' && item.children) {
      return (
        <div key={item.id} className="dropdown">
          <Link
            to={item.path || '/#'}
            className="dropdown-item dropdown-toggle arrow-none"
            onClick={(e) => {
              e.preventDefault();
              toggleDropdown(item.id);
            }}
          >
            {t(item.labelKey)} <div className="arrow-down"></div>
          </Link>
          <div className={classname('dropdown-menu', { show: isOpen })}>
            {item.children.map(child => renderSubMenuItem(child))}
          </div>
        </div>
      );
    }

    return (
      <Link key={item.id} to={item.path || '#'} className="dropdown-item">
        {t(item.labelKey)}
      </Link>
    );
  };

  return (
    <>
      {items.map(item => renderMenuItem(item))}
    </>
  );
};

export default withTranslation()(NavbarMenuRenderer);
