/**
 * ServiceManager - Clase base para todos los services
 *
 * Responsabilidades (AUTOMÁTICAS con Proxy):
 * - Manejo de loading interno
 * - Try/Catch automático para todos los métodos
 * - Logs automáticos (✅ éxito, ❌ error)
 * - Patrón Observer para suscripción a cambios
 *
 * IMPORTANTE:
 * - Todos los services deben heredar de esta clase
 * - NO necesitas envolver métodos manualmente
 * - El Proxy intercepta TODAS las llamadas automáticamente
 *
 * @example
 * export class UserApiService extends ServiceManager implements IUserService {
 *   async getUsersByCompany(companyId: number): Promise<ServiceData<UserModel[]>> {
 *     // Método normal - el Proxy lo envuelve automáticamente
 *     const response = await api.get(`/users?companyId=${companyId}`);
 *     return createServiceData(response.data);
 *   }
 * }
 *
 * // Hook
 * const userService = new UserApiService();
 * const [loading, setLoading] = useState(userService.loading);
 *
 * useEffect(() => {
 *   return userService.subscribe(() => setLoading(userService.loading));
 * }, []);
 *
 * // Llamada directa
 * const result = await userService.getUsersByCompany(1);
 */
export abstract class ServiceManager {
  private _loading = false;
  private _error: string | null = null;
  private listeners = new Set<() => void>();

  constructor() {
    // Proxy que intercepta TODAS las llamadas a métodos automáticamente
    return new Proxy(this, {
      get(target: any, prop: string | symbol) {
        // Convertir symbol a string si es necesario
        const propString = typeof prop === 'symbol' ? prop.toString() : prop;
        const originalValue = target[prop];

        // Si es una propiedad privada (_loading, _error, etc.), retornar tal cual
        if (propString.startsWith('_')) {
          return originalValue;
        }

        // Si es un getter/propiedad, retornar tal cual
        if (typeof originalValue !== 'function') {
          return originalValue;
        }

        // Si es un método del ServiceManager (loading, subscribe, etc.), retornar tal cual
        if (['subscribe', 'clearError', 'notifyListeners'].includes(propString)) {
          return originalValue.bind(target);
        }

        // Wrapper automático para todos los métodos del service
        return async function (this: any, ...args: any[]) {
          target._loading = true;
          target._error = null;
          target.notifyListeners();

          try {
            // Ejecutar el método original
            const result = await originalValue.apply(target, args);
            console.log(`✅ ${propString} ejecutado correctamente`);

            return result;
          } catch (error: any) {
            const errorMessage = error?.message || error?.toString() || 'Error desconocido';
            target._error = errorMessage;
            console.error(`❌ Error en ${propString}:`, errorMessage);

            // Lanzar excepción para que el hook pueda manejarla si necesita
            throw error;
          } finally {
            target._loading = false;
            target.notifyListeners();
          }
        };
      }
    }) as any;
  }

  /**
   * Estado actual de loading
   */
  get loading(): boolean {
    return this._loading;
  }

  /**
   * Último error ocurrido (null si no hay error)
   */
  get error(): string | null {
    return this._error;
  }

  /**
   * Suscribirse a cambios de estado (loading, error)
   *
   * @param listener Función que se ejecuta cuando cambia el estado
   * @returns Función para cancelar la suscripción
   *
   * @example
   * useEffect(() => {
   *   const unsubscribe = service.subscribe(() => {
   *     setLoading(service.loading);
   *     setError(service.error);
   *   });
   *   return unsubscribe;
   * }, [service]);
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notifica a todos los suscriptores sobre cambios de estado
   */
  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Limpia el estado de error
   */
  clearError() {
    this._error = null;
    this.notifyListeners();
  }
}
