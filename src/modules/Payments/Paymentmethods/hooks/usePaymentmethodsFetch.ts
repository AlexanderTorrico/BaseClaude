import { useState } from 'react';
import { store } from '@/store';
import { IPaymentmethodsService } from '../services/IPaymentmethodsService';
import { CreatePaymentAccountDto, UpdatePaymentAccountDto } from '../models/PaymentmethodsModel';
import {
  setPaymentMethods,
  setPaymentAccounts,
  addPaymentAccount,
  updatePaymentAccount,
  removePaymentAccount,
  toggleAccountActive,
  setAccountAsDefault
} from '../slices/paymentmethodsSlice';

export const usePaymentmethodsFetch = (service: IPaymentmethodsService) => {
  const [loading, setLoading] = useState(false);

  const fetchAll = async (): Promise<void> => {
    const [methodsResult, accountsResult] = await Promise.all([
      service.getPaymentMethods(setLoading),
      service.getPaymentAccounts(setLoading)
    ]);

    store.dispatch(setPaymentMethods(methodsResult.data));
    store.dispatch(setPaymentAccounts(accountsResult.data));
  };

  const createAccount = async (dto: CreatePaymentAccountDto): Promise<{ success: boolean; message: string }> => {
    const result = await service.createAccount(dto, setLoading);

    if (result.data && result.status === 200) {
      store.dispatch(addPaymentAccount(result.data));
    }

    return { success: result.status === 200, message: result.message };
  };

  const updateAccountData = async (dto: UpdatePaymentAccountDto): Promise<{ success: boolean; message: string }> => {
    const result = await service.updateAccount(dto, setLoading);

    if (result.data && result.status === 200) {
      store.dispatch(updatePaymentAccount(result.data));
    }

    return { success: result.status === 200, message: result.message };
  };

  const deleteAccount = async (id: number): Promise<{ success: boolean; message: string }> => {
    const result = await service.deleteAccount(id, setLoading);

    if (result.data && result.status === 200) {
      store.dispatch(removePaymentAccount(id));
    }

    return { success: result.status === 200, message: result.message };
  };

  const toggleActive = async (id: number): Promise<{ success: boolean; message: string }> => {
    const result = await service.toggleAccountActive(id, setLoading);

    if (result.data && result.status === 200) {
      store.dispatch(toggleAccountActive(id));
    }

    return { success: result.status === 200, message: result.message };
  };

  const setAsDefault = async (accountId: number, methodId: number): Promise<{ success: boolean; message: string }> => {
    const result = await service.setAccountAsDefault(accountId, methodId, setLoading);

    if (result.data && result.status === 200) {
      store.dispatch(setAccountAsDefault({ accountId, methodId }));
    }

    return { success: result.status === 200, message: result.message };
  };

  return {
    loading,
    fetchAll,
    createAccount,
    updateAccountData,
    deleteAccount,
    toggleActive,
    setAsDefault
  };
};
