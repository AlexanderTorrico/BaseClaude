import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import {
  setTransactions,
  addTransaction,
  updateTransaction,
  setCurrentTransaction,
  clearCurrentTransaction,
  setPayPalConfigs,
  setSelectedConfigUuid,
  setStats,
  setCurrentView,
  clearState,
} from '../slices/paymentTestSlice';
import { TestTransactionModel, TransactionStats, TransactionStatus } from '../models/PaymentTestModel';
import { PaymentConfigModel } from '../../Paymentmethods/models/PaymentmethodsModel';

/**
 * Hook para acceder y manipular el estado de pruebas de pago
 */
export const usePaymentTest = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.paymentTest);

  return {
    // Estado
    transactions: state.transactions,
    currentTransaction: state.currentTransaction,
    paypalConfigs: state.paypalConfigs,
    selectedConfigUuid: state.selectedConfigUuid,
    stats: state.stats,
    currentView: state.currentView,

    // Getters computados
    selectedConfig: state.paypalConfigs.find(c => c.uuid === state.selectedConfigUuid) || null,
    hasConfigs: state.paypalConfigs.length > 0,
    transactionCount: state.transactions.length,

    // Filtros de transacciones
    getTransactionsByStatus: (status: TransactionStatus) =>
      state.transactions.filter(t => t.status === status),

    getSuccessfulTransactions: () =>
      state.transactions.filter(t => t.status === 'captured'),

    getPendingTransactions: () =>
      state.transactions.filter(t => ['created', 'approved'].includes(t.status)),

    getFailedTransactions: () =>
      state.transactions.filter(t => t.status === 'failed'),

    findTransactionByUuid: (uuid: string) =>
      state.transactions.find(t => t.uuid === uuid),

    findTransactionByPaypalOrderId: (orderId: string) =>
      state.transactions.find(t => t.paypalOrderId === orderId),

    // Acciones
    setTransactions: (transactions: TestTransactionModel[]) =>
      dispatch(setTransactions(transactions)),

    addTransaction: (transaction: TestTransactionModel) =>
      dispatch(addTransaction(transaction)),

    updateTransaction: (transaction: TestTransactionModel) =>
      dispatch(updateTransaction(transaction)),

    setCurrentTransaction: (transaction: TestTransactionModel | null) =>
      dispatch(setCurrentTransaction(transaction)),

    clearCurrentTransaction: () =>
      dispatch(clearCurrentTransaction()),

    setPayPalConfigs: (configs: PaymentConfigModel[]) =>
      dispatch(setPayPalConfigs(configs)),

    setSelectedConfigUuid: (uuid: string | null) =>
      dispatch(setSelectedConfigUuid(uuid)),

    setStats: (stats: TransactionStats | null) =>
      dispatch(setStats(stats)),

    setCurrentView: (view: 'form' | 'history') =>
      dispatch(setCurrentView(view)),

    clearState: () =>
      dispatch(clearState()),
  };
};
