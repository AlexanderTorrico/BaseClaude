/**
 * Paleta de colores de la página
 */
export interface PagePalette {
  ac: string;    // Color de acento
  bg: string;    // Color de fondo
  tx: string;    // Color de texto
  pr: string | null;
  bg2: string | null;
  tx2: string | null;
}

/**
 * Modelo de página web del usuario
 */
export interface MyPagesModel {
  id: number;
  name: string;
  score: number;
  questionScore: number;
  viewKey: string;
  rutName: string;                      // Dominio (ej: https://osteriadacanneto.com)
  image: string;                        // Screenshot de preview
  font: string;
  palette: PagePalette;
  paletteHistory: string[];
  activeAutoSave: number;
  conf: any[];
  userId: number;
  moduleId: number | null;
  gblCompanyId: number;
  createdAt: string;
  updatedAt: string;
  count: any[];
}
