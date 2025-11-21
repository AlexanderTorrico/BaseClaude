import { useSelector } from 'react-redux';
import { RootState } from '@/store';

/**
 * Tipo simplificado para pickers/dropdowns
 * Solo campos esenciales para UI de selección
 */
export interface WorkStationPickerModel {
  id: number;
  name: string;
  description?: string;
  level?: number;
}

export const useSharedWorkStations = () => {
  const workStations = useSelector((state: RootState) => state.rrhh_workStation.list);

  const workStationsForPicker: WorkStationPickerModel[] = workStations.map(ws => ({
    id: ws.id,
    name: ws.name,
    description: ws.description,
    level: ws.level,
  }));

  return {
    workStationsForPicker,
  };
};
