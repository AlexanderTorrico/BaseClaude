import { SaleTransactionModel, SalesFilters } from '../models/MysalesModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

export interface IMysalesService {
  getTransactions(
    companyId: number,
    filters?: SalesFilters,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<SaleTransactionModel[]>>;

  getTransactionById(
    transactionId: number,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<SaleTransactionModel | null>>;
}
