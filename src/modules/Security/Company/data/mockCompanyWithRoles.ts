import { CompanyModel } from '../models/CompanyModel';

/**
 * Mock data de compañías con sus sucursales
 * Basado en la respuesta real de la API
 */
export const MOCK_COMPANIES: CompanyModel[] = [
  {
    id: 1,
    name: 'Aziende Technologies',
    detail: 6, // Tecnologic
    openingDateCompany: '2020-01-15',
    phone: ['591', '72345678'],
    email: 'contacto@aziende.com',
    logo: '',
    timeZone: 'America/La_Paz',
    companySize: '10-49',
    language: 'es',
    active: 1,
    userId: 1,
    createdAt: '2025-01-01T00:00:00.000000Z',
    updatedAt: '2025-11-18T10:00:00.000000Z',
    sucursales: [
      {
        id: 1,
        name: 'Oficina Central',
        email: 'central@aziende.com',
        phone: '72345678',
        address: '4to Anillo, Av. Banzer #123',
        lat: -17.783327,
        lng: -63.182140,
        active: 1,
        gblCompanyId: 1,
        createdAt: '2025-01-01T00:00:00.000000Z',
        updatedAt: '2025-11-18T10:00:00.000000Z',
      },
      {
        id: 2,
        name: 'Sucursal Norte',
        email: 'norte@aziende.com',
        phone: '72345679',
        address: 'Av. Cristo Redentor #456',
        lat: -17.753327,
        lng: -63.152140,
        active: 1,
        gblCompanyId: 1,
        createdAt: '2025-01-15T00:00:00.000000Z',
        updatedAt: '2025-11-18T10:00:00.000000Z',
      },
    ],
  },
  {
    id: 2,
    name: 'Tech Solutions SRL',
    detail: 10, // Consultant
    openingDateCompany: '2019-06-10',
    phone: ['591', '78912345'],
    email: 'info@techsolutions.com',
    logo: '',
    timeZone: 'America/La_Paz',
    companySize: '2-9',
    language: 'es',
    active: 1,
    userId: 2,
    createdAt: '2025-02-01T00:00:00.000000Z',
    updatedAt: '2025-11-18T10:00:00.000000Z',
    sucursales: [
      {
        id: 3,
        name: 'Sede Principal',
        email: 'sede@techsolutions.com',
        phone: '78912345',
        address: 'Equipetrol, Calle Los Pitones #789',
        lat: -17.773327,
        lng: -63.172140,
        active: 1,
        gblCompanyId: 2,
        createdAt: '2025-02-01T00:00:00.000000Z',
        updatedAt: '2025-11-18T10:00:00.000000Z',
      },
    ],
  },
];
