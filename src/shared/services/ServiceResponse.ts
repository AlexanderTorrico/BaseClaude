/**
 * Respuesta estándar de todos los servicios
 * La API siempre retorna este formato, incluso en errores
 */
export interface ServiceResponse<T = any> {
  status: number;
  message: string;
  data: T;
}

/**
 * Helper para transformar datos de la respuesta
 */
export const transformServiceData = <T, R>(
  response: ServiceResponse<T>,
  transform: (data: T) => R
): ServiceResponse<R> => {
  return {
    data: transform(response.data),
    status: response.status,
    message: response.message,
  };
};
