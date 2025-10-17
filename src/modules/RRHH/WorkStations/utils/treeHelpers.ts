import { WorkStationModel } from '../models/WorkStationModel';

/**
 * Construir árbol jerárquico vertical a partir de lista plana
 * Algoritmo que crea la estructura de árbol basándose en dependency_id
 */
export const buildWorkStationTree = (
  workStations: WorkStationModel[]
): WorkStationModel[] => {
  // 1. Crear mapa para acceso rápido por ID
  const map = new Map<number, WorkStationModel>();

  workStations.forEach(ws => {
    map.set(ws.id, { ...ws, children: [] });
  });

  // 2. Array para almacenar las raíces del árbol
  const roots: WorkStationModel[] = [];

  // 3. Construir relaciones padre-hijo
  workStations.forEach(ws => {
    const node = map.get(ws.id)!;

    if (ws.dependencyId === 0) {
      // Es raíz (no tiene padre)
      roots.push(node);
    } else {
      // Tiene padre, agregarlo como hijo
      const parent = map.get(ws.dependencyId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(node);
      } else {
        // Si no encuentra padre, lo marca como raíz huérfana
        console.warn(`⚠️ WorkStation ${ws.id} (${ws.name}) tiene dependency_id=${ws.dependencyId} pero no existe el padre. Se agregará como raíz.`);
        roots.push(node);
      }
    }
  });

  return roots;
};

/**
 * Validar si hay dependencia circular
 * Evita que un puesto dependa de sí mismo o de sus descendientes
 */
export const hasCircularDependency = (
  workStationId: number,
  dependencyId: number,
  allWorkStations: WorkStationModel[]
): boolean => {
  // No puede depender de sí mismo
  if (workStationId === dependencyId) return true;

  // Si depende de raíz (0), no hay circularidad
  if (dependencyId === 0) return false;

  const visited = new Set<number>();
  let currentId = dependencyId;

  // Seguir la cadena de dependencias hacia arriba
  while (currentId !== 0) {
    if (visited.has(currentId)) {
      // Ciclo detectado
      return true;
    }

    if (currentId === workStationId) {
      // Intentando depender de un descendiente
      return true;
    }

    visited.add(currentId);

    const parent = allWorkStations.find(ws => ws.id === currentId);
    if (!parent) break;

    currentId = parent.dependencyId;
  }

  return false;
};

/**
 * Calcular nivel automáticamente basado en la dependencia
 */
export const calculateLevel = (
  dependencyId: number,
  allWorkStations: WorkStationModel[]
): number => {
  if (dependencyId === 0) return 0; // Raíz

  const parent = allWorkStations.find(ws => ws.id === dependencyId);
  if (!parent) return 0; // Si no encuentra padre, asume raíz

  return parent.level + 1; // Nivel del padre + 1
};

/**
 * Obtener todos los descendientes (hijos, nietos, etc.) de un puesto
 */
export const getAllDescendants = (
  workStationId: number,
  allWorkStations: WorkStationModel[]
): WorkStationModel[] => {
  const descendants: WorkStationModel[] = [];

  const findChildren = (parentId: number) => {
    const children = allWorkStations.filter(ws => ws.dependencyId === parentId);

    children.forEach(child => {
      descendants.push(child);
      findChildren(child.id); // Recursión para nietos
    });
  };

  findChildren(workStationId);
  return descendants;
};

/**
 * Obtener la ruta desde la raíz hasta un puesto específico
 * Ejemplo: [Director General] → [Gerente General] → [Jefe de Ventas]
 */
export const getWorkStationPath = (
  workStationId: number,
  allWorkStations: WorkStationModel[]
): WorkStationModel[] => {
  const path: WorkStationModel[] = [];
  let currentId = workStationId;

  while (currentId !== 0) {
    const ws = allWorkStations.find(w => w.id === currentId);
    if (!ws) break;

    path.unshift(ws); // Agregar al inicio para mantener orden correcto
    currentId = ws.dependencyId;
  }

  return path;
};

/**
 * Obtener nombre del puesto padre
 */
export const getDependencyName = (
  dependencyId: number,
  allWorkStations: WorkStationModel[]
): string | undefined => {
  if (dependencyId === 0) return undefined; // Raíz no tiene padre

  const parent = allWorkStations.find(ws => ws.id === dependencyId);
  return parent?.name;
};

/**
 * Validar que la estructura del árbol sea válida
 */
export const validateTreeStructure = (
  workStations: WorkStationModel[]
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // 1. Verificar que haya al menos una raíz
  const roots = workStations.filter(ws => ws.dependencyId === 0);
  if (roots.length === 0) {
    errors.push('No hay ningún puesto raíz (dependency_id = 0)');
  }

  // 2. Verificar que no haya dependencias circulares
  workStations.forEach(ws => {
    if (ws.dependencyId !== 0) {
      if (hasCircularDependency(ws.id, ws.dependencyId, workStations)) {
        errors.push(`Dependencia circular detectada en "${ws.name}" (id=${ws.id})`);
      }
    }
  });

  // 3. Verificar que todos los dependency_id existan (excepto 0)
  workStations.forEach(ws => {
    if (ws.dependencyId !== 0) {
      const parentExists = workStations.some(p => p.id === ws.dependencyId);
      if (!parentExists) {
        errors.push(`"${ws.name}" (id=${ws.id}) depende de id=${ws.dependencyId} que no existe`);
      }
    }
  });

  // 4. Verificar que los niveles sean coherentes
  workStations.forEach(ws => {
    if (ws.dependencyId !== 0) {
      const parent = workStations.find(p => p.id === ws.dependencyId);
      if (parent && ws.level !== parent.level + 1) {
        errors.push(`Nivel incoherente en "${ws.name}": nivel ${ws.level} pero padre tiene nivel ${parent.level}`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Aplanar árbol a lista (útil para exportar o procesar)
 */
export const flattenTree = (
  tree: WorkStationModel[]
): WorkStationModel[] => {
  const flattened: WorkStationModel[] = [];

  const traverse = (nodes: WorkStationModel[]) => {
    nodes.forEach(node => {
      // Agregar nodo sin children para evitar duplicados
      const { children, ...nodeWithoutChildren } = node;
      flattened.push(nodeWithoutChildren as WorkStationModel);

      if (children && children.length > 0) {
        traverse(children);
      }
    });
  };

  traverse(tree);
  return flattened;
};

/**
 * Contar total de nodos en el árbol
 */
export const countTreeNodes = (tree: WorkStationModel[]): number => {
  let count = 0;

  const traverse = (nodes: WorkStationModel[]) => {
    nodes.forEach(node => {
      count++;
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    });
  };

  traverse(tree);
  return count;
};

/**
 * Obtener máxima profundidad del árbol
 */
export const getMaxDepth = (tree: WorkStationModel[]): number => {
  const getDepth = (nodes: WorkStationModel[], currentDepth: number = 0): number => {
    if (!nodes || nodes.length === 0) return currentDepth;

    let maxDepth = currentDepth;
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        const childDepth = getDepth(node.children, currentDepth + 1);
        maxDepth = Math.max(maxDepth, childDepth);
      }
    });

    return maxDepth;
  };

  return getDepth(tree);
};
