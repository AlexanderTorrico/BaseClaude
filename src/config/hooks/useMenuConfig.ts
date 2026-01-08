import { useMemo } from 'react';
import { menuConfig } from '../menuConfig';
import { MenuItem } from '../types/MenuTypes';

/**
 * Hook para filtrar el menú según permisos del usuario
 * MODO WHITELIST: Solo muestra items que tienen permisos definidos Y el usuario los tiene
 * Items sin permisos definidos se OCULTAN (excepto secciones)
 */
export const useMenuConfig = (userRoles: string[] = [], userPermissions: string[] = []): MenuItem[] => {

  console.log('📋 useMenuConfig - userPermissions:', userPermissions);

  const filterMenuByAccess = (items: MenuItem[]): MenuItem[] => {
    return items
      .filter(item => {
        // Si está oculto, no mostrar
        if (item.hidden) return false;

        // Las secciones (títulos) se muestran siempre
        if (item.type === 'section') return true;

        // Verificar roles si están definidos
        if (item.roles && item.roles.length > 0) {
          const hasRole = item.roles.some(role => userRoles.includes(role));
          if (!hasRole) return false;
        }

        // MODO WHITELIST: Si el item NO tiene permisos definidos, OCULTAR
        // (solo se muestran los items que tienen permisos y el usuario los tiene)
        if (!item.permissions || item.permissions.length === 0) {
          // Si es un dropdown, verificar si tiene hijos visibles
          if (item.type === 'dropdown' && item.children) {
            const visibleChildren = filterMenuByAccess(item.children);
            return visibleChildren.length > 0;
          }
          return false;
        }

        // Verificar permisos: el usuario debe tener al menos uno de los permisos requeridos
        const hasPermission = item.permissions.some(perm => userPermissions.includes(perm));
        console.log(`📁 Menu item "${item.label}" requires:`, item.permissions, '| User has:', userPermissions, '| Result:', hasPermission);

        return hasPermission;
      })
      .map(item => {
        if (item.children) {
          const filteredChildren = filterMenuByAccess(item.children);
          // Si es un dropdown y no tiene hijos después del filtro, no mostrarlo
          if (item.type === 'dropdown' && filteredChildren.length === 0) {
            console.log(`🚫 Dropdown "${item.label}" hidden - no visible children`);
            return null;
          }
          return {
            ...item,
            children: filteredChildren
          };
        }
        return item;
      })
      .filter((item): item is MenuItem => item !== null);  // Eliminar items nulos
  };

  const filteredMenus = useMemo(() => {
    const result = filterMenuByAccess(menuConfig.menus);
    console.log('✅ Filtered menu items:', result.map(m => m.label));
    return result;
  }, [userRoles, userPermissions]);

  return filteredMenus;
};
