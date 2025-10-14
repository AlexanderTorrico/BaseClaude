import { http, HttpResponse } from 'msw';

/**
 * Handlers de MSW para el módulo de Users
 * Mockean las respuestas del API
 */

// URL base del API (ajustar según tu configuración)
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000/api';

// Mock data de usuarios
const mockApiUsers = [
  {
    id: 1,
    name: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@empresa.com',
    phone: '+1 555-0101',
    avatar: null,
    workStation: {
      id: 1,
      name: 'Developer',
      level: 2,
      dependency_id: 10,
    },
  },
  {
    id: 2,
    name: 'María',
    lastName: 'García',
    email: 'maria.garcia@empresa.com',
    phone: '+1 555-0102',
    avatar: null,
    workStation: {
      id: 2,
      name: 'Designer',
      level: 2,
      dependency_id: 11,
    },
  },
];

/**
 * Handlers para endpoints de Users
 */
export const usersHandlers = [
  // GET /rrhh/by_company_id/:id - Obtener usuarios por compañía
  http.get(`${API_BASE_URL}/rrhh/by_company_id/:companyId`, ({ params }) => {
    const { companyId } = params;

    return HttpResponse.json({
      success: true,
      data: mockApiUsers,
      message: `Users for company ${companyId}`,
    });
  }),

  // GET /rrhh/by_company_id/:id - Error 401 (para tests de autenticación)
  http.get(`${API_BASE_URL}/rrhh/by_company_id/401`, () => {
    return new HttpResponse(null, {
      status: 401,
      statusText: 'Unauthorized',
    });
  }),

  // GET /rrhh/by_company_id/:id - Error 500 (para tests de errores)
  http.get(`${API_BASE_URL}/rrhh/by_company_id/500`, () => {
    return new HttpResponse(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }),

  // POST /rrhh - Crear usuario
  http.post(`${API_BASE_URL}/rrhh`, async ({ request }) => {
    const newUser = await request.json();

    return HttpResponse.json({
      success: true,
      data: {
        id: 999,
        ...newUser,
      },
      message: 'User created successfully',
    });
  }),

  // PUT /rrhh/:id - Actualizar usuario
  http.put(`${API_BASE_URL}/rrhh/:id`, async ({ params, request }) => {
    const { id } = params;
    const updatedData = await request.json();

    return HttpResponse.json({
      success: true,
      data: {
        id: Number(id),
        ...updatedData,
      },
      message: 'User updated successfully',
    });
  }),

  // DELETE /rrhh/:id - Eliminar usuario
  http.delete(`${API_BASE_URL}/rrhh/:id`, ({ params }) => {
    const { id } = params;

    return HttpResponse.json({
      success: true,
      data: null,
      message: `User ${id} deleted successfully`,
    });
  }),
];
