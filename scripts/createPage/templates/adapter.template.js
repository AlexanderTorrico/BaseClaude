export default (moduleName) => `import { ${moduleName}Model } from '../models/${moduleName}Model';

export const adapt${moduleName}ResponseTo${moduleName}Model = (apiData: any): ${moduleName}Model => {
  return {
    id: apiData.id,
  } as ${moduleName}Model;
};

export const adapt${moduleName}ArrayTo${moduleName}Models = (apiDataArray: any[]): ${moduleName}Model[] => {
  return apiDataArray.map(adapt${moduleName}ResponseTo${moduleName}Model);
};
`;
