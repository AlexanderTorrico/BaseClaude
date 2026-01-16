import { useState } from 'react';
import { store } from '@/store';
import { IPaymentmethodsService } from '../services/IPaymentmethodsService';
import {
  CreatePaymentAccountDto,
  UpdatePaymentAccountDto,
  TestConnectionResponse,
} from '../models/PaymentmethodsModel';
import {
  setPaymentMethods,
  setPaymentAccounts,
  addPaymentAccount,
  updatePaymentAccount,
  removePaymentAccount,
  toggleAccountActive,
  setAccountAsDefault,
} from '../slices/paymentmethodsSlice';

/** Helper para verificar si el status es exitoso */
const isSuccess = (status: number): boolean => status >= 200 && status < 300;

export const usePaymentmethodsFetch = (service: IPaymentmethodsService) => {
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  const fetchAll = async (): Promise<void> => {
    const [methodsResult, accountsResult] = await Promise.all([
      service.getPaymentMethods(setLoading),
      service.getPaymentAccounts(setLoading),
    ]);

    if (methodsResult.data) {
      store.dispatch(setPaymentMethods(methodsResult.data));
    }
    if (accountsResult.data) {
      store.dispatch(setPaymentAccounts(accountsResult.data));
    }
  };

  const createAccount = async (
    dto: CreatePaymentAccountDto
  ): Promise<{ success: boolean; message: string }> => {
    const result = await service.createAccount(dto, setLoading);
    const success = isSuccess(result.status);

    if (result.data && success) {
      store.dispatch(addPaymentAccount(result.data));
    }

    return { success, message: result.message };
  };

  const updateAccountData = async (
    dto: UpdatePaymentAccountDto
  ): Promise<{ success: boolean; message: string }> => {
    const result = await service.updateAccount(dto, setLoading);
    const success = isSuccess(result.status);

    if (result.data && success) {
      store.dispatch(updatePaymentAccount(result.data));
    }

    return { success, message: result.message };
  };

  const deleteAccount = async (
    uuid: string
  ): Promise<{ success: boolean; message: string }> => {
    const result = await service.deleteAccount(uuid, setLoading);
    const success = isSuccess(result.status);

    if (success) {
      store.dispatch(removePaymentAccount(uuid));
    }

    return { success, message: result.message };
  };

  const toggleActive = async (
    uuid: string
  ): Promise<{ success: boolean; message: string }> => {
    const result = await service.toggleAccountActive(uuid, setLoading);
    const success = isSuccess(result.status);

    if (result.data && success) {
      store.dispatch(toggleAccountActive(uuid));
    }

    return { success, message: result.message };
  };

  const setAsDefault = async (
    accountUuid: string,
    methodId: number
  ): Promise<{ success: boolean; message: string }> => {
    const result = await service.setAccountAsDefault(accountUuid, methodId, setLoading);
    const success = isSuccess(result.status);

    if (result.data && success) {
      store.dispatch(setAccountAsDefault({ accountUuid, methodId }));
    }

    return { success, message: result.message };
  };

  const testConnection = async (
    uuid: string
  ): Promise<{ success: boolean; message: string; data?: TestConnectionResponse }> => {
    if (!service.testConnection) {
      return { success: false, message: 'Test de conexión no disponible' };
    }

    const result = await service.testConnection(uuid, setTestingConnection);
    const success = isSuccess(result.status);

    // Si el test fue exitoso, actualizamos el estado de verificación en la cuenta
    if (success && result.data) {
      // Refetch para obtener el estado actualizado
      await fetchAll();
    }

    return {
      success,
      message: result.data?.message || result.message,
      data: result.data,
    };
  };

  return {
    loading,
    testingConnection,
    fetchAll,
    createAccount,
    updateAccountData,
    deleteAccount,
    toggleActive,
    setAsDefault,
    testConnection,
  };
};
