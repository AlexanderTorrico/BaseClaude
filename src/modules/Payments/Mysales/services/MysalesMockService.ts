import { IMysalesService } from './IMysalesService';
import { SaleTransactionModel, SalesFilters } from '../models/MysalesModel';
import { MOCK_SALES_TRANSACTIONS } from '../data/mockMysalesWithRoles';
import { ApiResponse } from '@/shared/types';
import { SetStateFn } from '@/shared/types/commonTypes';

export class MysalesMockService implements IMysalesService {
  private mockTransactions: SaleTransactionModel[] = [...MOCK_SALES_TRANSACTIONS];

  async getTransactions(
    _companyId: number,
    filters?: SalesFilters,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<SaleTransactionModel[]>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setLoading?.(false);

    let result = [...this.mockTransactions];

    if (filters) {
      if (filters.status) {
        result = result.filter(t => t.status === filters.status);
      }
      if (filters.paymentMethodId) {
        result = result.filter(t => t.paymentMethod.id === filters.paymentMethodId);
      }
      if (filters.paymentAccountId) {
        result = result.filter(t => t.paymentAccount.id === filters.paymentAccountId);
      }
      if (filters.pageId) {
        result = result.filter(t => t.page.id === filters.pageId);
      }
      if (filters.dateFrom) {
        result = result.filter(t => new Date(t.createdAt) >= new Date(filters.dateFrom!));
      }
      if (filters.dateTo) {
        result = result.filter(t => new Date(t.createdAt) <= new Date(filters.dateTo!));
      }
    }

    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      status: 200,
      message: 'Success (mock)',
      data: result
    };
  }

  async getTransactionById(
    transactionId: number,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<SaleTransactionModel | null>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setLoading?.(false);

    const transaction = this.mockTransactions.find(t => t.id === transactionId) || null;

    return {
      status: transaction ? 200 : 404,
      message: transaction ? 'Success (mock)' : 'Transacción no encontrada',
      data: transaction
    };
  }
}
