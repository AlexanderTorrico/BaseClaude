import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { RoleModel } from '../models/RoleModel';

export const useRoles = () => {
    const roles = useSelector((state: RootState) => state.roles.list);
    const currentView = useSelector((state: RootState) => state.roles.currentView);

    const findRoleByName = (name: string): RoleModel | undefined => {
        return roles.find(role => role.name.toLowerCase() === name.toLowerCase());
    };

    const getTotalRoles = (): number => {
        return roles.length;
    };

    const findRoleById = (roleId: number): RoleModel | undefined => {
        return roles.find(role => role.id === roleId);
    };

    return {
        roles,
        currentView,
        findRoleByName,
        findRoleById,
        getTotalRoles,
    };
};
