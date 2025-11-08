/**
 * Logger Utility
 *
 * Logs solo se ejecutan en modo desarrollo (DEV).
 * En producción, los logs están deshabilitados para:
 * - Mejor performance
 * - Seguridad (no exponer información sensible)
 * - Menor tamaño de bundle
 */

const isDev = import.meta.env.DEV;

export const logger = {
  /**
   * Log de depuración - Solo en DEV
   */
  debug: (...args: any[]): void => {
    if (isDev) {
      console.log('[DEBUG]', ...args);
    }
  },

  /**
   * Log informativo - Solo en DEV
   */
  info: (...args: any[]): void => {
    if (isDev) {
      console.info('[INFO]', ...args);
    }
  },

  /**
   * Log de advertencia - Solo en DEV
   */
  warn: (...args: any[]): void => {
    if (isDev) {
      console.warn('[WARN]', ...args);
    }
  },

  /**
   * Log de error - Solo en DEV
   * En producción, aquí podrías enviar a un servicio de tracking (Sentry, LogRocket, etc.)
   */
  error: (...args: any[]): void => {
    if (isDev) {
      console.error('[ERROR]', ...args);
    }
    // TODO: En producción, enviar a servicio de error tracking
    // if (!isDev) {
    //   sendToErrorTrackingService(args);
    // }
  },

  /**
   * Log de tabla - Solo en DEV
   */
  table: (data: any): void => {
    if (isDev) {
      console.table(data);
    }
  },

  /**
   * Grupo de logs - Solo en DEV
   */
  group: (label: string): void => {
    if (isDev) {
      console.group(label);
    }
  },

  groupEnd: (): void => {
    if (isDev) {
      console.groupEnd();
    }
  },
};
