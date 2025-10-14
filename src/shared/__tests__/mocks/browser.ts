import { setupWorker } from 'msw/browser';
import { usersHandlers } from './handlers/usersHandlers';

/**
 * Worker MSW para el navegador (opcional)
 * Útil para desarrollo con mocks del API en el browser
 *
 * Para usarlo en desarrollo:
 * 1. Importar en main.tsx
 * 2. Ejecutar: worker.start()
 */

// Combinar todos los handlers
const handlers = [
  ...usersHandlers,
  // Agregar más handlers de otros módulos aquí
];

// Crear y exportar el worker
export const worker = setupWorker(...handlers);
