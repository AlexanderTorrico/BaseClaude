import { useSyncExternalStore } from 'react';
import { ServiceManager } from '../services/ServiceManager';

/**
 * Hook genérico para sincronizar el estado de un ServiceManager con React
 *
 * VENTAJAS:
 * - Usa la API oficial de React 18 (useSyncExternalStore)
 * - No necesitas useState ni useEffect
 * - Sincronización automática con el estado del service
 * - Type-safe
 *
 * @example
 * const userService = new UserMockService();
 * const loading = useServiceLoading(userService);
 * const error = useServiceError(userService);
 */

/**
 * Hook para obtener el estado de loading de un ServiceManager
 * Se re-renderiza automáticamente cuando cambia el loading
 *
 * @param service Instancia de ServiceManager
 * @returns Estado actual de loading
 */
export function useServiceLoading(service: ServiceManager): boolean {
  return useSyncExternalStore(
    // Suscripción
    (callback) => service.subscribe(callback),
    // Snapshot actual
    () => service.loading,
    // Snapshot del servidor (SSR) - opcional
    () => false
  );
}

/**
 * Hook para obtener el estado de error de un ServiceManager
 * Se re-renderiza automáticamente cuando cambia el error
 *
 * @param service Instancia de ServiceManager
 * @returns Error actual (null si no hay error)
 */
export function useServiceError(service: ServiceManager): string | null {
  return useSyncExternalStore(
    // Suscripción
    (callback) => service.subscribe(callback),
    // Snapshot actual
    () => service.error,
    // Snapshot del servidor (SSR) - opcional
    () => null
  );
}

/**
 * Hook para obtener ambos estados (loading y error) de un ServiceManager
 *
 * @param service Instancia de ServiceManager
 * @returns { loading, error }
 */
export function useServiceState(service: ServiceManager): {
  loading: boolean;
  error: string | null;
} {
  const loading = useServiceLoading(service);
  const error = useServiceError(service);

  return { loading, error };
}
