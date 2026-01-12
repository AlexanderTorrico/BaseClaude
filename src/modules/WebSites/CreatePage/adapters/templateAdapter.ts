import { TemplateModel, parseTemplatePalette } from '../models/TemplateModel';

/**
 * Adapta un template del API al modelo del frontend
 */
export const adaptTemplateResponse = (apiTemplate: any): TemplateModel => {
    return {
        id: apiTemplate.id,
        name: apiTemplate.name || '',
        description: apiTemplate.description || '',
        active: apiTemplate.active ?? 1,
        count: apiTemplate.count || 0,
        score: apiTemplate.score || 0,
        scoreCount: apiTemplate.score_count || 0,
        url: apiTemplate.url || '',
        image: apiTemplate.image || null,
        palette: typeof apiTemplate.palette === 'string'
            ? parseTemplatePalette(apiTemplate.palette)
            : apiTemplate.palette
    };
};

/**
 * Adapta un array de templates del API
 */
export const adaptTemplateArrayToModels = (data: any[]): TemplateModel[] => {
    if (!Array.isArray(data)) return [];
    return data.map(adaptTemplateResponse);
};
