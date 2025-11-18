/**
 * Modelo de Sucursal (Branch)
 */
export interface BranchModel {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  address: string;
  lat: number | null;
  lng: number | null;
  active: number;
  gblCompanyId: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Modelo de Compañía
 */
export interface CompanyModel {
  id: number;
  name: string;
  detail: number; // ID del rubro/industria
  openingDateCompany: string; // Fecha de apertura
  phone: string[]; // [código país, número]
  email: string;
  logo: string;
  timeZone: string;
  companySize: string; // "2-9", "10-49", etc.
  language: string; // "es", "en", etc.
  active: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  // Relaciones
  sucursales: BranchModel[];
}

/**
 * DTO para crear/actualizar Compañía
 */
export interface CompanyDto {
  name: string;
  detail?: number; // ID del rubro/industria
  openingDateCompany: string;
  phone: string[]; // [código país, número]
  email: string;
  logo?: File | null;
  timeZone: string;
  companySize: string;
  language: string;
}

/**
 * DTO para crear/actualizar Sucursal
 */
export interface BranchDto {
  id?: number; // Opcional para creación
  name: string;
  email?: string;
  phone: string;
  address: string;
  lat: number | null;
  lng: number | null;
  gblCompanyId: number;
}
