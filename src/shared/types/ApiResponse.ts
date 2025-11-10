/**
 * Respuesta estándar de la API
 * Todas las respuestas HTTP de servicios siguen este formato
 */
export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data: T;
}

/**
 * Helper para transformar datos de la respuesta
 */
export const transformApiData = <T, R>(
  response: ApiResponse<T>,
  transform: (data: T) => R
): ApiResponse<R> => {
  return {
    status: response.status,
    message: response.message,
    data: transform(response.data),
  };
};
