import { useSelector } from 'react-redux';
import { selectUser } from '@/pages/Login/slices';

/**
 * Obtiene el usuario del localStorage como fallback
 */
const getUserFromStorage = (): any => {
    try {
        const userData = localStorage.getItem('authUser');
        if (userData) {
            return JSON.parse(userData);
        }
    } catch (error) {
        console.error('Error parsing authUser from localStorage:', error);
    }
    return null;
};

/**
 * Hook para obtener el ID de la compañía del usuario logueado
 * 
 * @returns El gbl_company_id del usuario o 1 como fallback
 * 
 * @example
 * ```tsx
 * const companyId = useUserCompanyId();
 * fetchUsersByCompany(companyId);
 * ```
 */
export const useUserCompanyId = (): number => {
    const userFromRedux = useSelector(selectUser);
    const user = userFromRedux || getUserFromStorage();

    // Retornar el gbl_company_id del usuario, o 1 como fallback
    return user?.gbl_company_id || 1;
};
