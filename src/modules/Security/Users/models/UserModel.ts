/**
 * Modelo de Usuario para la UI (mapeado desde la API)
 */
export interface UserModel {
  id: number;
  fullName: string;
  firstName: string;
  lastName: string;
  lastNameMother: string;
  email: string;
  privilege: string;
  phone: string | null;
  logo: string | null;
  language: string;
  isActive: boolean;
}
