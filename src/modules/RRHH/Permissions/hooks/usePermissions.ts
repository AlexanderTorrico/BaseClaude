import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { PermissionModel } from '../models/PermissionModel';

export const usePermissions = () => {
    const permissions = useSelector((state: RootState) => state.permissions.list);
    const currentView = useSelector((state: RootState) => state.permissions.currentView);

    const findPermissionByName = (name: string): PermissionModel | undefined => {
        return permissions.find((p: PermissionModel) => p.name.toLowerCase() === name.toLowerCase());
    };

    const getTotalPermissions = (): number => {
        return permissions.length;
    };

    const findPermissionById = (id: number): PermissionModel | undefined => {
        return permissions.find((p: PermissionModel) => p.id === id);
    };

    return {
        permissions,
        currentView,
        findPermissionByName,
        findPermissionById,
        getTotalPermissions,
    };
};
