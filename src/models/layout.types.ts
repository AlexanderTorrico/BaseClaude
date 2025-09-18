export type LayoutType = 'vertical' | 'horizontal';

export interface LayoutState {
  layoutType: LayoutType;
  leftSideBarTheme: string;
  leftSideBarType: string;
  layoutWidth: string;
  topbarTheme: string;
  showRightSidebar: boolean;
  leftMenu: boolean;
  showSidebar: boolean;
}

export interface LayoutAction {
  type: string;
  payload?: any;
}