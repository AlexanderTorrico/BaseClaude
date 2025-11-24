import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { UserModel } from '@/modules/RRHH/Users/models/UserModel';

/**
 * Modelo de usuario para organigrama
 * Incluye children para estructura de árbol
 */
export interface UserOrgNode extends UserModel {
  children?: UserOrgNode[];
}

export const useSharedUsers = () => {
  const users = useSelector((state: RootState) => state.users.list);

  // Usuarios que tienen workStation asignado
  const usersWithWorkStation = users.filter(
    user => user.workStation && user.workStation.id && user.workStation.name
  );

  // Construir árbol jerárquico de usuarios basado en workStation.dependencyId
  const buildUserOrgTree = (): UserOrgNode[] => {
    const userMap = new Map<number, UserOrgNode>();

    // Crear nodos con children vacíos, usando workStation.id como key
    usersWithWorkStation.forEach(user => {
      if (user.workStation?.id) {
        userMap.set(user.workStation.id, { ...user, children: [] });
      }
    });

    const roots: UserOrgNode[] = [];

    // Construir relaciones padre-hijo
    usersWithWorkStation.forEach(user => {
      if (!user.workStation?.id) return;

      const node = userMap.get(user.workStation.id)!;
      const dependencyId = user.workStation.dependencyId;

      // Si no tiene dependencia o dependencyId es 0/null/undefined -> es raíz
      if (!dependencyId || dependencyId === 0) {
        roots.push(node);
      } else {
        // Buscar el padre por workStation.id
        const parent = userMap.get(dependencyId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
        } else {
          // Si no encuentra padre, agregar como raíz
          roots.push(node);
        }
      }
    });

    return roots;
  };

  return {
    users,
    usersWithWorkStation,
    userOrgTree: buildUserOrgTree(),
  };
};
