import { useState } from 'react';
import { IMysalesService } from '../services/IMysalesService';
import { setTransactions } from '../slices/mysalesSlice';
import { SalesFilters } from '../models/MysalesModel';
import store from '@/store';

export const useMysalesFetch = (service: IMysalesService) => {
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async (companyId: number = 1, filters?: SalesFilters): Promise<void> => {
    const result = await service.getTransactions(companyId, filters, setLoading);
    store.dispatch(setTransactions(result.data));
  };

  return {
    loading,
    fetchTransactions
  };
};
