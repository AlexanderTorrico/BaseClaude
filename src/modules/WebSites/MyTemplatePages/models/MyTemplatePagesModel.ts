export interface TemplatePalette {
  ac: string;
  bg: string;
  tx: string;
  pr: string | null;
  bg2: string | null;
  tx2: string | null;
}

export type TemplateStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface MyTemplatePagesModel {
  id: number;
  name: string;
  description: string;
  image: string;
  palette: TemplatePalette;
  active: boolean;
  count: number;
  score: number;
  scoreCount: number;
  status: TemplateStatus;
  createdAt: string;
  updatedAt: string;
}
