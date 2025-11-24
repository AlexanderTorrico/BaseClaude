import {
  VaultModel,
  VaultCategoryModel,
  MultimediaModel,
  UserMediaModel,
} from '../models/VaultModel';

/**
 * Adapta un objeto multimedia del API (snake_case) al modelo UI (camelCase)
 */
export const adaptMultimediaResponseToModel = (apiData: any): MultimediaModel => {
  return {
    url: apiData.url || '',
    order: apiData.order || 0,
  };
};

/**
 * Adapta una categoría del vault del API al modelo UI
 */
export const adaptVaultCategoryResponseToModel = (apiData: any): VaultCategoryModel => {
  return {
    name: apiData.name || '',
    order: apiData.order || 0,
    multimedias: (apiData.multimedias || []).map(adaptMultimediaResponseToModel),
  };
};

/**
 * Adapta un media del usuario (imagen/video) del API al modelo UI
 */
export const adaptUserMediaResponseToModel = (apiData: any): UserMediaModel => {
  return {
    id: apiData.id || 0,
    url: apiData.url || '',
    type: apiData.type || 'vaul',
  };
};

/**
 * Adapta la respuesta completa del vault del API al modelo UI
 */
export const adaptVaultResponseToVaultModel = (apiData: any): VaultModel => {
  return {
    myImages: (apiData.my_images || []).map(adaptUserMediaResponseToModel),
    myVideos: (apiData.my_videos || []).map(adaptUserMediaResponseToModel),
    vaul: (apiData.vaul || []).map(adaptVaultCategoryResponseToModel),
  };
};
