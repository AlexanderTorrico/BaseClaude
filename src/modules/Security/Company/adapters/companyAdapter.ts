import { CompanyModel, BranchModel } from '../models/CompanyModel';

/**
 * Adapta una sucursal de la API (snake_case) al modelo UI (camelCase)
 */
export const adaptBranchResponseToBranchModel = (apiData: any): BranchModel => {
  return {
    id: apiData.id,
    name: apiData.name || '',
    email: apiData.email || null,
    phone: apiData.phone || '',
    address: apiData.address || '',
    lat: apiData.lat !== undefined && apiData.lat !== null ? Number(apiData.lat) : null,
    lng: apiData.lng !== undefined && apiData.lng !== null ? Number(apiData.lng) : null,
    active: apiData.active || 1,
    gblCompanyId: apiData.gbl_company_id,
    createdAt: apiData.created_at || '',
    updatedAt: apiData.updated_at || '',
  };
};

/**
 * Adapta una compañía de la API (snake_case) al modelo UI (camelCase)
 */
export const adaptCompanyResponseToCompanyModel = (apiData: any): CompanyModel => {
  // Extraer el ID del rubro desde modules_id (viene como array: [6])
  let detailId = 6; // Default: Tecnologic
  if (apiData.modules_id) {
    if (Array.isArray(apiData.modules_id) && apiData.modules_id.length > 0) {
      detailId = Number(apiData.modules_id[0]);
    } else if (typeof apiData.modules_id === 'number') {
      detailId = apiData.modules_id;
    }
  } else if (apiData.detail) {
    detailId = Number(apiData.detail);
  }

  // Parsear phone si viene como string JSON
  let phoneArray = ['591', ''];
  if (typeof apiData.phone === 'string') {
    try {
      phoneArray = JSON.parse(apiData.phone);
    } catch (e) {
      console.warn('Error parsing phone:', e);
    }
  } else if (Array.isArray(apiData.phone)) {
    phoneArray = apiData.phone;
  }

  return {
    id: apiData.id,
    name: apiData.name || '',
    detail: detailId,
    openingDateCompany: apiData.opening_date_conpany || apiData.opening_date_company || '', // Note: typo en API "conpany"
    phone: phoneArray,
    email: apiData.email || '',
    logo: apiData.image || apiData.logo || '',
    timeZone: apiData.time_zone || 'America/La_Paz',
    companySize: apiData.company_size || '2-9',
    language: apiData.language || 'es',
    active: apiData.active || 1,
    userId: apiData.user_id || 0,
    createdAt: apiData.created_at || '',
    updatedAt: apiData.updated_at || '',
    // Adaptar sucursales
    sucursales: Array.isArray(apiData.sucursales)
      ? apiData.sucursales.map(adaptBranchResponseToBranchModel)
      : [],
  };
};

/**
 * Adapta un array de compañías
 */
export const adaptCompanyArrayToCompanyModels = (apiDataArray: any[]): CompanyModel[] => {
  return apiDataArray.map(adaptCompanyResponseToCompanyModel);
};
