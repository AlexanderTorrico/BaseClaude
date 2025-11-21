import { IWorkStationService } from './IWorkStationService';
import { WorkStationModel } from '@/modules/RRHH/shared/models/WorkStationModel';
import { adaptWorkStationsFromApi } from '../adapters/workStationApiAdapter';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

/**
 * Implementación Mock del servicio de WorkStations
 * Usa datos locales para simular peticiones a la base de datos
 */
export class WorkStationMockService implements IWorkStationService {

  // Mock data en formato API real (snake_case con requirements y responsabilities)
  private mockApiData = [
    {
      id: 1,
      name: "Admin",
      description: "Admin",
      active: 1,
      gbl_company_id: 1,
      requirements: [
        {
          id: 1,
          description: "Requirement Limpeiza local",
          is_hidden: 0,
          is_delete: 0,
          rhh_workstation_id: 1
        },
        {
          id: 2,
          description: "Requirement Limpeiza local",
          is_hidden: 0,
          is_delete: 0,
          rhh_workstation_id: 1
        }
      ],
      responsabilities: [
        {
          id: 1,
          description: "Responsability de pasivos new",
          is_hidden: 0,
          is_delete: 0,
          rhh_workstation_id: 1
        },
        {
          id: 2,
          description: "Responsability de pasivos new",
          is_hidden: 0,
          is_delete: 0,
          rhh_workstation_id: 1
        }
      ]
    },
    {
      id: 2,
      name: "Secreataria",
      description: "Esta es la secretario",
      active: 1,
      gbl_company_id: 1,
      requirements: [],
      responsabilities: []
    },
    {
      id: 3,
      name: "Operario",
      description: "Esta es la operario",
      active: 1,
      gbl_company_id: 1,
      requirements: [],
      responsabilities: []
    }
  ];

  /**
   * Obtener puestos de trabajo por compañía (formato API real)
   */
  async getWorkStationsByCompany(
    companyId: number,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<WorkStationModel[]>> {
    setLoading?.(true);

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    setLoading?.(false);

    // Filtrar por companyId si se necesita
    const filteredData = this.mockApiData.filter(ws => ws.gbl_company_id === companyId);

    // Adaptar usando el nuevo adapter
    const adaptedData = adaptWorkStationsFromApi(filteredData);

    console.log('📊 WorkStations obtenidos de MockService:', adaptedData);

    return {
      status: 200,
      message: 'success',
      data: adaptedData
    };
  }
}
