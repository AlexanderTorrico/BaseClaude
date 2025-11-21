import { MyPagesModel, PagePalette } from '../models/MyPagesModel';

/**
 * Convierte la paleta de colores del API (JSON string) a objeto tipado
 */
const parsePalette = (paletteJson: string): PagePalette => {
  try {
    return JSON.parse(paletteJson);
  } catch {
    return { ac: '', bg: '', tx: '', pr: null, bg2: null, tx2: null };
  }
};

/**
 * Convierte el historial de paletas del API (JSON string) a array
 */
const parsePaletteHistory = (historyJson: string): string[] => {
  try {
    return JSON.parse(historyJson);
  } catch {
    return [];
  }
};

/**
 * Adapter: Convierte respuesta del API (snake_case) a modelo UI (camelCase)
 */
export const adaptMyPagesResponseToMyPagesModel = (apiData: any): MyPagesModel => {
  return {
    id: apiData.id,
    name: apiData.name,
    score: apiData.score,
    questionScore: apiData.question_score,
    viewKey: apiData.view_key,
    rutName: apiData.rut_name,
    image: apiData.image,
    font: apiData.font,
    palette: parsePalette(apiData.palette),
    paletteHistory: parsePaletteHistory(apiData.palette_history),
    activeAutoSave: apiData.active_auto_save,
    conf: apiData.conf || [],
    userId: apiData.user_id,
    moduleId: apiData.module_id,
    gblCompanyId: apiData.gbl_company_id,
    createdAt: apiData.created_at,
    updatedAt: apiData.updated_at,
    count: apiData.count || []
  };
};

export const adaptMyPagesArrayToMyPagesModels = (apiDataArray: any): MyPagesModel[] => {
  // Validar que sea un array
  if (!Array.isArray(apiDataArray)) {
    console.warn('⚠️ adaptMyPagesArrayToMyPagesModels: data no es un array', apiDataArray);
    return [];
  }

  return apiDataArray.map(adaptMyPagesResponseToMyPagesModel);
};
