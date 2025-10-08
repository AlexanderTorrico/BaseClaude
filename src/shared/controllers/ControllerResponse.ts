/**
 * Respuesta estándar de los Controllers
 * @template T - Tipo de dato que devuelve el controller
 */
export interface ControllerResponse<T> {
  loading: boolean;
  data?: T;
  error?: string;
  success: boolean;
}

/**
 * Helper para crear respuesta exitosa
 */
export const createSuccessResponse = <T>(data: T): ControllerResponse<T> => ({
  loading: false,
  data,
  success: true
});

/**
 * Helper para crear respuesta de error
 */
export const createErrorResponse = <T>(error: string): ControllerResponse<T> => ({
  loading: false,
  error,
  success: false
});

/**
 * Helper para crear respuesta en loading
 */
export const createLoadingResponse = <T>(): ControllerResponse<T> => ({
  loading: true,
  success: false
});
