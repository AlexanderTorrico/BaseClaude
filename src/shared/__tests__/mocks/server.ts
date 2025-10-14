import { setupServer } from 'msw/node';
import { usersHandlers } from './handlers/usersHandlers';

/**
 * Servidor MSW para Node.js (usado en tests)
 * Intercepta las peticiones HTTP durante los tests
 */

// Combinar todos los handlers
const handlers = [
  ...usersHandlers,
  // Agregar más handlers de otros módulos aquí
];

// Crear y exportar el servidor
export const server = setupServer(...handlers);
