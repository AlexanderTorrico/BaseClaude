/**
 * Modelo de Work Station para la UI (camelCase)
 * Incluye campos calculados y metadata adicional
 */

export interface WorkStationModel {
  id: number;
  name: string;
  level: number;
  dependencyId: number;  // camelCase para UI

  // Campos calculados/extendidos
  dependencyName?: string;        // Nombre del puesto padre
  employeeCount?: number;         // Cantidad de empleados asignados
  requirementCount?: number;      // Cantidad de requisitos definidos
  children?: WorkStationModel[];  // Puestos dependientes (para árbol)

  // Metadata de nivel
  levelName?: string;             // "Directivo", "Gerencial", etc.
  levelColor?: string;            // Color hexadecimal del nivel
  levelBgColor?: string;          // Color de fondo del badge
  levelTextColor?: string;        // Color de texto del badge
}
