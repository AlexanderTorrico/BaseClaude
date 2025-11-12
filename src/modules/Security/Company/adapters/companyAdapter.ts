import { CompanyModel, Branch, SocialNetwork, Website } from '../models/CompanyModel';

/**
 * Adapter para convertir datos de la API (snake_case) a modelo interno (camelCase)
 */

interface ApiSocialNetwork {
  id: number;
  platform: string;
  url: string;
  active: number;
}

interface ApiWebsite {
  id: number;
  url: string;
  description: string;
  active: number;
}

interface ApiBranch {
  id: number;
  name: string;
  email: string | null;
  detail: string | null;
  address: string;
  phone: string;
  schedules: string | null;
  lat: number | null;
  lng: number | null;
  active: number;
  time_zone: string | null;
  gbl_company_id: number;
  created_at: string;
  updated_at: string;
}

interface ApiCompany {
  id: number;
  name: string;
  detail: string;
  what_do_we_do: string;
  how_do_we_help_our_customers: string;
  opening_date_conpany: string;
  phone: string[];
  email: string;
  activation: number;
  logo: string;
  latitude: number | null;
  longitude: number | null;
  time_zone: string;
  color_text_one: string;
  color_text_two: string;
  color_button_one: string;
  color_button_two: string;
  color_fondo_one: string;
  color_fondo_two: string;
  company_size: string;
  language: string;
  active: number;
  user_id: number;
  gbl_company_branch_id: number | null;
  created_at: string;
  updated_at: string;
  modules_id: number[];
  references: any[];
  sucursales: ApiBranch[];
  social_networks: ApiSocialNetwork[];
  web_sites: ApiWebsite[];
}

export const adaptBranch = (apiBranch: ApiBranch): Branch => {
  return {
    id: apiBranch.id,
    name: apiBranch.name,
    email: apiBranch.email,
    detail: apiBranch.detail,
    address: apiBranch.address,
    phone: apiBranch.phone,
    schedules: apiBranch.schedules,
    lat: apiBranch.lat,
    lng: apiBranch.lng,
    active: apiBranch.active === 1,
    timeZone: apiBranch.time_zone,
    companyId: apiBranch.gbl_company_id,
    createdAt: apiBranch.created_at,
    updatedAt: apiBranch.updated_at,
  };
};

export const adaptSocialNetwork = (apiSocialNetwork: ApiSocialNetwork): SocialNetwork => {
  return {
    id: apiSocialNetwork.id,
    platform: apiSocialNetwork.platform,
    url: apiSocialNetwork.url,
    active: apiSocialNetwork.active === 1,
  };
};

export const adaptWebsite = (apiWebsite: ApiWebsite): Website => {
  return {
    id: apiWebsite.id,
    url: apiWebsite.url,
    description: apiWebsite.description,
    active: apiWebsite.active === 1,
  };
};

export const adaptCompany = (apiCompany: ApiCompany): CompanyModel => {
  return {
    id: apiCompany.id,
    name: apiCompany.name,
    detail: apiCompany.detail,
    whatDoWeDo: apiCompany.what_do_we_do,
    howDoWeHelpOurCustomers: apiCompany.how_do_we_help_our_customers,
    openingDateCompany: apiCompany.opening_date_conpany,
    phone: apiCompany.phone,
    email: apiCompany.email,
    activation: apiCompany.activation,
    logo: apiCompany.logo,
    latitude: apiCompany.latitude,
    longitude: apiCompany.longitude,
    timeZone: apiCompany.time_zone,
    colorTextOne: apiCompany.color_text_one,
    colorTextTwo: apiCompany.color_text_two,
    colorButtonOne: apiCompany.color_button_one,
    colorButtonTwo: apiCompany.color_button_two,
    colorFondoOne: apiCompany.color_fondo_one,
    colorFondoTwo: apiCompany.color_fondo_two,
    companySize: apiCompany.company_size,
    language: apiCompany.language,
    active: apiCompany.active === 1,
    userId: apiCompany.user_id,
    companyBranchId: apiCompany.gbl_company_branch_id,
    createdAt: apiCompany.created_at,
    updatedAt: apiCompany.updated_at,
    modulesId: apiCompany.modules_id,
    references: apiCompany.references,
    branches: apiCompany.sucursales.map(adaptBranch),
    socialNetworks: apiCompany.social_networks.map(adaptSocialNetwork),
    websites: apiCompany.web_sites.map(adaptWebsite),
  };
};

// Mantener compatibilidad con nombres anteriores
export const adaptCompanyResponseToCompanyModel = adaptCompany;
export const adaptCompanyArrayToCompanyModels = (apiDataArray: any[]): CompanyModel[] => {
  return apiDataArray.map(adaptCompany);
};
