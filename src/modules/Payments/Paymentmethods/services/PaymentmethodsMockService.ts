import { IPaymentmethodsService } from './IPaymentmethodsService';
import {
  PaymentMethodModel,
  PaymentAccountModel,
  CreatePaymentAccountDto,
  UpdatePaymentAccountDto
} from '../models/PaymentmethodsModel';
import { PLATFORM_PAYMENT_METHODS, MOCK_PAYMENT_ACCOUNTS } from '../data/mockPaymentmethodsWithRoles';
import { ApiResponse } from '@/shared/types';
import { SetStateFn } from '@/shared/types/commonTypes';

export class PaymentmethodsMockService implements IPaymentmethodsService {
  private methods: PaymentMethodModel[] = [...PLATFORM_PAYMENT_METHODS];
  private accounts: PaymentAccountModel[] = [...MOCK_PAYMENT_ACCOUNTS];

  private async simulateDelay(setLoading?: SetStateFn): Promise<void> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    setLoading?.(false);
  }

  async getPaymentMethods(setLoading?: SetStateFn): Promise<ApiResponse<PaymentMethodModel[]>> {
    await this.simulateDelay(setLoading);

    return {
      status: 200,
      message: 'Success (mock)',
      data: [...this.methods]
    };
  }

  async getPaymentAccounts(setLoading?: SetStateFn): Promise<ApiResponse<PaymentAccountModel[]>> {
    await this.simulateDelay(setLoading);

    return {
      status: 200,
      message: 'Success (mock)',
      data: [...this.accounts]
    };
  }

  async createAccount(dto: CreatePaymentAccountDto, setLoading?: SetStateFn): Promise<ApiResponse<PaymentAccountModel>> {
    await this.simulateDelay(setLoading);

    const newId = this.accounts.length > 0
      ? Math.max(...this.accounts.map(a => a.id)) + 1
      : 1;
    const now = new Date().toISOString();

    const newAccount: PaymentAccountModel = {
      id: newId,
      ...dto,
      createdAt: now,
      updatedAt: now
    };

    if (dto.isDefault) {
      this.accounts.forEach(account => {
        if (account.paymentMethodId === dto.paymentMethodId) {
          account.isDefault = false;
        }
      });
    }

    this.accounts.push(newAccount);

    return {
      status: 200,
      message: 'Cuenta creada exitosamente',
      data: { ...newAccount }
    };
  }

  async updateAccount(dto: UpdatePaymentAccountDto, setLoading?: SetStateFn): Promise<ApiResponse<PaymentAccountModel>> {
    await this.simulateDelay(setLoading);

    const index = this.accounts.findIndex(a => a.id === dto.id);

    if (index === -1) {
      return {
        status: 404,
        message: 'Cuenta no encontrada',
        data: {} as PaymentAccountModel
      };
    }

    if (dto.isDefault) {
      const methodId = this.accounts[index].paymentMethodId;
      this.accounts.forEach(account => {
        if (account.paymentMethodId === methodId && account.id !== dto.id) {
          account.isDefault = false;
        }
      });
    }

    const updatedAccount: PaymentAccountModel = {
      ...this.accounts[index],
      ...dto,
      updatedAt: new Date().toISOString()
    };

    this.accounts[index] = updatedAccount;

    return {
      status: 200,
      message: 'Cuenta actualizada exitosamente',
      data: { ...updatedAccount }
    };
  }

  async deleteAccount(id: number, setLoading?: SetStateFn): Promise<ApiResponse<boolean>> {
    await this.simulateDelay(setLoading);

    const index = this.accounts.findIndex(a => a.id === id);

    if (index === -1) {
      return {
        status: 404,
        message: 'Cuenta no encontrada',
        data: false
      };
    }

    this.accounts.splice(index, 1);

    return {
      status: 200,
      message: 'Cuenta eliminada exitosamente',
      data: true
    };
  }

  async toggleAccountActive(id: number, setLoading?: SetStateFn): Promise<ApiResponse<PaymentAccountModel>> {
    await this.simulateDelay(setLoading);

    const index = this.accounts.findIndex(a => a.id === id);

    if (index === -1) {
      return {
        status: 404,
        message: 'Cuenta no encontrada',
        data: {} as PaymentAccountModel
      };
    }

    this.accounts[index] = {
      ...this.accounts[index],
      isActive: !this.accounts[index].isActive,
      updatedAt: new Date().toISOString()
    };

    return {
      status: 200,
      message: this.accounts[index].isActive ? 'Cuenta activada' : 'Cuenta desactivada',
      data: { ...this.accounts[index] }
    };
  }

  async setAccountAsDefault(accountId: number, methodId: number, setLoading?: SetStateFn): Promise<ApiResponse<PaymentAccountModel>> {
    await this.simulateDelay(setLoading);

    const index = this.accounts.findIndex(a => a.id === accountId);

    if (index === -1) {
      return {
        status: 404,
        message: 'Cuenta no encontrada',
        data: {} as PaymentAccountModel
      };
    }

    this.accounts.forEach(account => {
      if (account.paymentMethodId === methodId) {
        account.isDefault = account.id === accountId;
        account.updatedAt = new Date().toISOString();
      }
    });

    return {
      status: 200,
      message: 'Cuenta establecida como predeterminada',
      data: { ...this.accounts[index] }
    };
  }
}
