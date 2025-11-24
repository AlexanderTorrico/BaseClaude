import { IVaultService } from './IVaultService';
import { VaultModel } from '../models/VaultModel';
import { ApiResponse } from '@/shared/types';
import { SetStateFn } from '@/shared/types/commonTypes';
import { MOCK_VAULT_DATA } from '../data/mockVaultWithRoles';

export class VaultMockService implements IVaultService {
  private mockVaultData: VaultModel = { ...MOCK_VAULT_DATA };

  async getVaultData(setLoading?: SetStateFn): Promise<ApiResponse<VaultModel>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading?.(false);

    return {
      status: 200,
      message: 'Vault data retrieved successfully (mock)',
      data: this.mockVaultData,
    };
  }
}
