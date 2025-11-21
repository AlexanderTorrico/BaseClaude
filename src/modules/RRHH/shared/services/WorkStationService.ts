import { IWorkStationService } from '@/modules/RRHH/WorkStations/services/IWorkStationService';
import { WorkStationApiService } from '@/modules/RRHH/WorkStations/services/WorkStationApiService';
import { WorkStationMockService } from '@/modules/RRHH/WorkStations/services/WorkStationMockService';

/**
 * Servicio singleton compartido de WorkStations
 * Instancia única en toda la app para consistencia de datos
 */
class WorkStationServiceSingleton {
  private static instance: IWorkStationService | null = null;

  static getInstance(useMock: boolean = false): IWorkStationService {
    if (!this.instance) {
      this.instance = useMock
        ? new WorkStationMockService()
        : new WorkStationApiService();
    }
    return this.instance;
  }

  static resetInstance(): void {
    this.instance = null;
  }
}

export default WorkStationServiceSingleton;
