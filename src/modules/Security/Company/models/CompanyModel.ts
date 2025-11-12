export interface SocialNetwork {
  id: number;
  platform: string;
  url: string;
  active: boolean;
}

export interface Website {
  id: number;
  url: string;
  description: string;
  active: boolean;
}

export interface Branch {
  id: number;
  name: string;
  email: string | null;
  detail: string | null;
  address: string;
  phone: string;
  schedules: string | null;
  lat: number | null;
  lng: number | null;
  active: boolean;
  timeZone: string | null;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyModel {
  id: number;
  name: string;
  detail: string;
  whatDoWeDo: string;
  howDoWeHelpOurCustomers: string;
  openingDateCompany: string;
  phone: string[];
  email: string;
  activation: number;
  logo: string;
  latitude: number | null;
  longitude: number | null;
  timeZone: string;
  colorTextOne: string;
  colorTextTwo: string;
  colorButtonOne: string;
  colorButtonTwo: string;
  colorFondoOne: string;
  colorFondoTwo: string;
  companySize: string;
  language: string;
  active: boolean;
  userId: number;
  companyBranchId: number | null;
  createdAt: string;
  updatedAt: string;
  modulesId: number[];
  references: any[];
  branches: Branch[];
  socialNetworks: SocialNetwork[];
  websites: Website[];
}
