import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { PaymentMethodModel, PaymentAccountModel, PaymentMethodWithAccounts } from '../models/PaymentmethodsModel';

export const usePaymentmethods = () => {
  const methods = useSelector((state: RootState) => state.paymentmethods.methods);
  const accounts = useSelector((state: RootState) => state.paymentmethods.accounts);
  const currentView = useSelector((state: RootState) => state.paymentmethods.currentView);

  const getMethodsWithAccounts = (): PaymentMethodWithAccounts[] => {
    return methods.map(method => {
      const methodAccounts = accounts.filter(a => a.paymentMethodId === method.id);
      const activeAccounts = methodAccounts.filter(a => a.isActive);

      return {
        ...method,
        accounts: methodAccounts,
        isEnabled: methodAccounts.length > 0,
        activeAccountsCount: activeAccounts.length
      };
    });
  };

  const getAccountsByMethod = (methodId: number): PaymentAccountModel[] => {
    return accounts.filter(a => a.paymentMethodId === methodId);
  };

  const getMethodById = (id: number): PaymentMethodModel | undefined => {
    return methods.find(m => m.id === id);
  };

  const getAccountById = (id: number): PaymentAccountModel | undefined => {
    return accounts.find(a => a.id === id);
  };

  const getTotalMethods = (): number => methods.length;

  const getEnabledMethodsCount = (): number => {
    const methodsWithAccounts = getMethodsWithAccounts();
    return methodsWithAccounts.filter(m => m.isEnabled).length;
  };

  const getTotalAccounts = (): number => accounts.length;

  const getActiveAccountsCount = (): number => {
    return accounts.filter(a => a.isActive).length;
  };

  return {
    methods,
    accounts,
    currentView,
    getMethodsWithAccounts,
    getAccountsByMethod,
    getMethodById,
    getAccountById,
    getTotalMethods,
    getEnabledMethodsCount,
    getTotalAccounts,
    getActiveAccountsCount
  };
};
