export default (moduleName) => `import { useSelector } from 'react-redux';

/**
 * Hook personalizado para ${moduleName}
 */
export const use${moduleName} = () => {
  const data = useSelector((state: any) => state.${moduleName.toLowerCase()}.data);
  const loading = useSelector((state: any) => state.${moduleName.toLowerCase()}.loading);
  const error = useSelector((state: any) => state.${moduleName.toLowerCase()}.error);

  return {
    data,
    loading,
    error
  };
};
`;
