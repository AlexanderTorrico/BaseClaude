import { useSelector } from 'react-redux';
import { RootState } from '@/store';

/**
 * Hook para acceder al estado de Vault (solo lectura + helpers síncronos)
 */
export const useVault = () => {
  const vaultData = useSelector((state: RootState) => state.vault.data);
  const currentView = useSelector((state: RootState) => state.vault.currentView);
  const selectedCategory = useSelector((state: RootState) => state.vault.selectedCategory);

  /**
   * Obtener total de imágenes del usuario
   */
  const getTotalMyImages = (): number => {
    return vaultData?.myImages.length || 0;
  };

  /**
   * Obtener total de categorías del vault
   */
  const getTotalCategories = (): number => {
    return vaultData?.vaul.length || 0;
  };

  /**
   * Obtener categoría por nombre
   */
  const getCategoryByName = (name: string) => {
    return vaultData?.vaul.find(cat => cat.name === name);
  };

  /**
   * Obtener todas las imágenes de una categoría
   */
  const getImagesByCategory = (categoryName: string) => {
    const category = getCategoryByName(categoryName);
    return category?.multimedias || [];
  };

  const pendingUploads = useSelector((state: RootState) => state.vault.pendingUploads);

  return {
    vaultData,
    currentView,
    selectedCategory,
    pendingUploads,
    getTotalMyImages,
    getTotalCategories,
    getCategoryByName,
    getImagesByCategory,
  };
};
