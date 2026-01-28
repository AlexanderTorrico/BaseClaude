import { MyTemplatePagesModel, TemplatePalette } from '../models/MyTemplatePagesModel';

export const adaptMyTemplatePagesResponseToMyTemplatePagesModel = (apiData: any): MyTemplatePagesModel => {
  const palette: TemplatePalette = apiData.palette || {
    ac: '#ffbc1f',
    bg: '#1D1F21',
    tx: '#FFFFFF',
    pr: null,
    bg2: null,
    tx2: null
  };

  return {
    id: apiData.id,
    name: apiData.name || '',
    description: apiData.description || '',
    image: apiData.image || '',
    palette,
    active: apiData.active ?? true,
    count: apiData.count || 0,
    score: apiData.score || 0,
    scoreCount: apiData.score_count || 0,
    status: apiData.status || 'DRAFT',
    createdAt: apiData.created_at || '',
    updatedAt: apiData.updated_at || '',
  };
};

export const adaptMyTemplatePagesArrayToMyTemplatePagesModels = (apiDataArray: any[]): MyTemplatePagesModel[] => {
  if (!Array.isArray(apiDataArray)) return [];
  return apiDataArray.map(adaptMyTemplatePagesResponseToMyTemplatePagesModel);
};
