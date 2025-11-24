/**
 * Modelo para multimedia individual dentro de una categoría del vault
 */
export interface MultimediaModel {
  url: string;
  order: number;
}

/**
 * Modelo para categoría del vault (ej: "Booking", "Technological", etc.)
 */
export interface VaultCategoryModel {
  name: string;
  order: number;
  multimedias: MultimediaModel[];
}

/**
 * Modelo para imagen/video del usuario
 */
export interface UserMediaModel {
  id: number;
  url: string;
  type: 'vaul' | 'upload' | string;
}

/**
 * Modelo principal del Vault
 */
export interface VaultModel {
  myImages: UserMediaModel[];
  myVideos: UserMediaModel[];
  vaul: VaultCategoryModel[];
}
