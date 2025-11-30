import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ReservationsModel } from '../models/ReservationsModel';

/**
 * Hook para acceder al estado de Reservations (solo lectura + helpers síncronos)
 */
export const useReservations = () => {
  const reservationss = useSelector((state: RootState) => state.reservations.list);
  const currentView = useSelector((state: RootState) => state.reservations.currentView);

  /**
   * Buscar por ID
   */
  const findById = (id: number): ReservationsModel | undefined => {
    return reservationss.find(item => item.id === id);
  };

  /**
   * Obtener total de elementos
   */
  const getTotal = (): number => {
    return reservationss.length;
  };

  return {
    reservationss,
    currentView,
    findById,
    getTotal,
  };
};
