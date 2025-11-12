export interface PagePalette {
  tx: string;
  tx2: string;
  ac: string;
  pr: string;
  bg: string;
  bg2: string;
}

export interface PageModel {
  id: number;
  name: string;
  score: number;
  question_score: number;
  view_key: string;
  rut_name: string;
  image: string;
  font: string;
  palette: string | PagePalette;
  palette_history: string;
  active_auto_save: number;
  conf: any[];
  user_id: number;
  module_id: number | null;
  gbl_company_id: number;
  created_at: string;
  updated_at: string;
  count: any[];
  ecommerce_enabled?: boolean;
  payment_gateway_id?: number | null;
}

export interface PagesResponse {
  status: number;
  message: string;
  data: PageModel[];
}
