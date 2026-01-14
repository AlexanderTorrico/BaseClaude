import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { SaleTransactionModel, SalesKPIs, TransactionStatus } from '../models/MysalesModel';

export const useMysales = () => {
  const transactions = useSelector((state: RootState) => state.mysales.list);
  const currentView = useSelector((state: RootState) => state.mysales.currentView);

  const findById = (id: number): SaleTransactionModel | undefined => {
    return transactions.find(item => item.id === id);
  };

  const getTotal = (): number => {
    return transactions.length;
  };

  const getByStatus = (status: TransactionStatus): SaleTransactionModel[] => {
    return transactions.filter(t => t.status === status);
  };

  const getKPIs = (): SalesKPIs => {
    const completed = transactions.filter(t => t.status === 'completed');
    const pending = transactions.filter(t => t.status === 'pending');
    const failed = transactions.filter(t => t.status === 'failed');
    const refunded = transactions.filter(t => t.status === 'refunded');

    return {
      totalGross: completed.reduce((sum, t) => sum + t.amounts.gross, 0),
      totalNet: completed.reduce((sum, t) => sum + t.amounts.net, 0),
      totalCommissions: completed.reduce((sum, t) => sum + t.amounts.commission, 0),
      transactionCount: transactions.length,
      completedCount: completed.length,
      pendingCount: pending.length,
      failedCount: failed.length,
      refundedCount: refunded.length,
      currency: transactions[0]?.amounts.currency || 'EUR'
    };
  };

  const getUniquePages = () => {
    const pagesMap = new Map<number, { id: number; name: string; domain: string }>();
    transactions.forEach(t => {
      if (!pagesMap.has(t.page.id)) {
        pagesMap.set(t.page.id, { id: t.page.id, name: t.page.name, domain: t.page.domain });
      }
    });
    return Array.from(pagesMap.values());
  };

  const getUniquePaymentMethods = () => {
    const methodsMap = new Map<number, { id: number; name: string; icon: string; color: string }>();
    transactions.forEach(t => {
      if (!methodsMap.has(t.paymentMethod.id)) {
        methodsMap.set(t.paymentMethod.id, {
          id: t.paymentMethod.id,
          name: t.paymentMethod.name,
          icon: t.paymentMethod.icon,
          color: t.paymentMethod.color
        });
      }
    });
    return Array.from(methodsMap.values());
  };

  return {
    transactions,
    currentView,
    findById,
    getTotal,
    getByStatus,
    getKPIs,
    getUniquePages,
    getUniquePaymentMethods
  };
};
