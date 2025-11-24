import { useMemo } from 'react';
import { menuConfig } from '../menuConfig';
import { MenuItem } from '../types/MenuTypes';

export const useMenuConfig = (userRoles: string[] = []): MenuItem[] => {

  const filterMenuByRoles = (items: MenuItem[]): MenuItem[] => {
    return items
      .filter(item => {
        if (item.hidden) return false;
        if (!item.roles || item.roles.length === 0) return true;
        return item.roles.some(role => userRoles.includes(role));
      })
      .map(item => {
        if (item.children) {
          return {
            ...item,
            children: filterMenuByRoles(item.children)
          };
        }
        return item;
      });
  };

  const filteredMenus = useMemo(() => {
    return filterMenuByRoles(menuConfig.menus);
  }, [userRoles]);

  return filteredMenus;
};
