import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { PaymentGatewayModel } from '../models/PaymentGatewayModel';

/**
 * Hook para acceder al estado de PaymentGateway (solo lectura + helpers síncronos)
 */
export const usePaymentGateway = () => {
  const paymentgateways = useSelector((state: RootState) => state.paymentgateway.list);
  const currentView = useSelector((state: RootState) => state.paymentgateway.currentView);

  /**
   * Buscar por ID
   */
  const findById = (id: number): PaymentGatewayModel | undefined => {
    return paymentgateways.find(item => item.id === id);
  };

  /**
   * Obtener total de elementos
   */
  const getTotal = (): number => {
    return paymentgateways.length;
  };

  return {
    paymentgateways,
    currentView,
    findById,
    getTotal,
  };
};
