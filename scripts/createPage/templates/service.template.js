/**
 * Template para Services
 * Genera 3 archivos: Interface + Implementación API + Implementación Mock
 */

const generateServiceInterface = (moduleName) => `import { ${moduleName}Model } from '../models/${moduleName}Model';

export interface I${moduleName}Service {
  getAll(setLoading?: (loading: boolean) => void): Promise<{
    status: number;
    message: string;
    data: ${moduleName}Model[];
  }>;
}
`;

const generateApiService = (moduleName) => `import { httpRequestWithAuth } from '@/services/httpService';
import { transformServiceData } from '@/shared/controllers/ServiceWrapper';
import { I${moduleName}Service } from './I${moduleName}Service';
import { ${moduleName}Model } from '../models/${moduleName}Model';
import { adapt${moduleName}ArrayTo${moduleName}Models } from '../adapters/${moduleName.toLowerCase()}Adapter';
import { ApiResponse } from '@/pages/Authentication/models';

type SetStateFn = (loading: boolean) => void;

export class ${moduleName}ApiService implements I${moduleName}Service {
  async getAll(setLoading?: SetStateFn) {
    const res = await httpRequestWithAuth.get<ApiResponse<any>>(
      \`/${moduleName.toLowerCase()}\`,
      setLoading
    );

    return transformServiceData(res, (data) =>
      adapt${moduleName}ArrayTo${moduleName}Models(data.data ?? [])
    );
  }
}
`;

const generateMockService = (moduleName) => `import { I${moduleName}Service } from './I${moduleName}Service';
import { ${moduleName}Model } from '../models/${moduleName}Model';

const MOCK_${moduleName.toUpperCase()}S: ${moduleName}Model[] = [
  { id: 1 },
  { id: 2 },
];

type SetStateFn = (loading: boolean) => void;

export class ${moduleName}MockService implements I${moduleName}Service {
  async getAll(setLoading?: SetStateFn) {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading?.(false);

    return {
      status: 200,
      message: 'Success (mock)',
      data: MOCK_${moduleName.toUpperCase()}S,
    };
  }
}
`;

export { generateServiceInterface, generateApiService, generateMockService };
