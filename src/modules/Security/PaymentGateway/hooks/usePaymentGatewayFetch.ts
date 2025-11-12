import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { IPaymentGatewayService } from '../services/IPaymentGatewayService';
import { setPaymentGateways } from '../slices/paymentgatewaySlice';

/**
 * Hook para operaciones async de PaymentGateway (fetch, create, update, delete)
 */
export const usePaymentGatewayFetch = (service: IPaymentGatewayService) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  /**
   * Obtener todos los elementos
   */
  const fetchAll = async (): Promise<void> => {
    const result = await service.getAll(setLoading);

    if (result.status !== 200) {
      console.error(`❌ Error fetching paymentgateway: [${result.status}] ${result.message}`);
      return;
    }

    dispatch(setPaymentGateways(result.data));
  };

  // TODO: Agregar más funciones (create, update, delete)

  return {
    loading,
    fetchAll,
  };
};
