import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ReservationModel } from '../models/ReservationModel';

/**
 * Hook para acceder al estado de Reservation (solo lectura + helpers síncronos)
 */
export const useReservation = () => {
  const reservations = useSelector((state: RootState) => state.reservation.list);
  const currentView = useSelector((state: RootState) => state.reservation.currentView);

  /**
   * Buscar por ID
   */
  const findById = (id: number): ReservationModel | undefined => {
    return reservations.find(item => item.id === id);
  };

  /**
   * Obtener total de elementos
   */
  const getTotal = (): number => {
    return reservations.length;
  };

  return {
    reservations,
    currentView,
    findById,
    getTotal,
  };
};
