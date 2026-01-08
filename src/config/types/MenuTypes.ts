export type MenuItemType = 'link' | 'dropdown' | 'section' | 'mega-menu';

export interface MenuBadge {
  count: number;
  color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
}

export interface MenuItem {
  id: string;
  type: MenuItemType;
  label: string;
  labelKey: string;
  icon?: string;
  path?: string;
  badge?: MenuBadge | null;
  roles?: string[];
  permissions?: string[];  // Permisos requeridos (ej: ["user.show", "user.create"])
  hidden?: boolean;
  children?: MenuItem[];
  megaMenuColumns?: number;
}

export interface MenuConfig {
  version: string;
  menus: MenuItem[];
}
