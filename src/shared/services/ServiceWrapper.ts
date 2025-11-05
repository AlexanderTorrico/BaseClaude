/**
 * ServiceWrapper - Clase genérica para envolver services
 *
 * Responsabilidades:
 * - Manejo automático de loading
 * - Try/Catch automático con logs
 * - Manejo de errores con console.error
 * - Patrón Observer para suscripción a cambios de estado
 *
 * @example
 * const wrapper = new ServiceWrapper(new UserMockService());
 *
 * // En un hook
 * const [loading, setLoading] = useState(wrapper.loading);
 * useEffect(() => {
 *   return wrapper.subscribe(() => setLoading(wrapper.loading));
 * }, []);
 *
 * // Ejecutar método
 * const result = await wrapper.execute('getUsersByCompany', 1);
 */
export class ServiceWrapper<TService> {
  private service: TService;
  private _loading = false;
  private _error: string | null = null;
  private listeners = new Set<() => void>();

  constructor(service: TService) {
    this.service = service;
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
   * Actualiza el estado de loading y notifica a los suscriptores
   */
  private setLoading(value: boolean) {
    this._loading = value;
    this.notifyListeners();
  }

  /**
   * Actualiza el error y notifica a los suscriptores
   */
  private setError(error: string | null) {
    this._error = error;
    this.notifyListeners();
  }

  /**
   * Notifica a todos los suscriptores sobre cambios de estado
   */
  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Suscribirse a cambios de estado (loading, error)
   *
   * @param listener Función que se ejecuta cuando cambia el estado
   * @returns Función para cancelar la suscripción
   *
   * @example
   * useEffect(() => {
   *   const unsubscribe = wrapper.subscribe(() => {
   *     setLoading(wrapper.loading);
   *     setError(wrapper.error);
   *   });
   *   return unsubscribe;
   * }, [wrapper]);
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Ejecuta un método del service con manejo automático de loading y errores
   *
   * @param methodName Nombre del método a ejecutar
   * @param args Argumentos del método
   * @returns Resultado del método o null si hubo error
   *
   * @example
   * const result = await wrapper.execute('getUsersByCompany', 1);
   * if (result) {
   *   console.log('Usuarios:', result.data);
   * }
   */
  async execute<TResult>(
    methodName: keyof TService,
    ...args: any[]
  ): Promise<TResult | null> {
    this.setLoading(true);
    this.setError(null);

    try {
      const method = this.service[methodName] as any;

      if (typeof method !== 'function') {
        throw new Error(`El método ${String(methodName)} no existe en el service`);
      }

      const result = await method.apply(this.service, args);

      console.log(`✅ ${String(methodName)} ejecutado correctamente`);

      return result;
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || 'Error desconocido';

      this.setError(errorMessage);
      console.error(`❌ Error en ${String(methodName)}:`, errorMessage);

      // Lanzar excepción para que el hook pueda manejarla si necesita
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Limpia el estado de error
   */
  clearError() {
    this.setError(null);
  }

  /**
   * Obtiene el service original (útil para casos avanzados)
   */
  getService(): TService {
    return this.service;
  }
}
