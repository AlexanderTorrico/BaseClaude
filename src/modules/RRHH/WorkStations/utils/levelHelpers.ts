import { WorkStationModel } from '../models/WorkStationModel';
import { LEVEL_COLORS, DEFAULT_LEVEL_COLOR, LevelColorConfig } from '../config/levelColors';

/**
 * Obtener configuración de color por nivel
 */
export const getLevelColor = (level: number): LevelColorConfig => {
  return LEVEL_COLORS[level] || DEFAULT_LEVEL_COLOR;
};

/**
 * Obtener nombre descriptivo del nivel
 */
export const getLevelName = (level: number): string => {
  return getLevelColor(level).name;
};

/**
 * Obtener color de fondo del nivel
 */
export const getLevelBgColor = (level: number): string => {
  return getLevelColor(level).bg;
};

/**
 * Obtener color de texto del nivel
 */
export const getLevelTextColor = (level: number): string => {
  return getLevelColor(level).text;
};

/**
 * Obtener gradiente del nivel (para efectos visuales)
 */
export const getLevelGradient = (level: number): string | undefined => {
  return getLevelColor(level).gradient;
};

/**
 * Filtrar puestos por nivel
 */
export const filterByLevel = (
  workStations: WorkStationModel[],
  level: number | null
): WorkStationModel[] => {
  if (level === null) return workStations;
  return workStations.filter(ws => ws.level === level);
};

/**
 * Obtener niveles únicos que existen en los datos
 */
export const getUniqueLevels = (
  workStations: WorkStationModel[]
): number[] => {
  const levels = new Set(workStations.map(ws => ws.level));
  return Array.from(levels).sort((a, b) => a - b);
};

/**
 * Agrupar puestos por nivel
 */
export const groupByLevel = (
  workStations: WorkStationModel[]
): Record<number, WorkStationModel[]> => {
  const grouped: Record<number, WorkStationModel[]> = {};

  workStations.forEach(ws => {
    if (!grouped[ws.level]) {
      grouped[ws.level] = [];
    }
    grouped[ws.level].push(ws);
  });

  return grouped;
};

/**
 * Contar puestos por nivel
 */
export const countByLevel = (
  workStations: WorkStationModel[]
): Record<number, number> => {
  const counts: Record<number, number> = {};

  workStations.forEach(ws => {
    counts[ws.level] = (counts[ws.level] || 0) + 1;
  });

  return counts;
};

/**
 * Enriquecer modelo con información de nivel (color, nombre)
 */
export const enrichWithLevelInfo = (
  workStation: WorkStationModel
): WorkStationModel => {
  const levelConfig = getLevelColor(workStation.level);

  return {
    ...workStation,
    levelName: levelConfig.name,
    levelColor: levelConfig.bg,
    levelBgColor: levelConfig.bg,
    levelTextColor: levelConfig.text
  };
};

/**
 * Enriquecer array de modelos con información de nivel
 */
export const enrichArrayWithLevelInfo = (
  workStations: WorkStationModel[]
): WorkStationModel[] => {
  return workStations.map(enrichWithLevelInfo);
};

/**
 * Obtener estadísticas por nivel
 */
export const getLevelStatistics = (
  workStations: WorkStationModel[]
): Array<{
  level: number;
  levelName: string;
  count: number;
  percentage: number;
  color: string;
}> => {
  const total = workStations.length;
  const grouped = groupByLevel(workStations);

  return Object.entries(grouped).map(([level, stations]) => {
    const levelNum = parseInt(level);
    const config = getLevelColor(levelNum);

    return {
      level: levelNum,
      levelName: config.name,
      count: stations.length,
      percentage: Math.round((stations.length / total) * 100),
      color: config.bg
    };
  }).sort((a, b) => a.level - b.level);
};

/**
 * Verificar si un nivel existe en los datos
 */
export const levelExists = (
  level: number,
  workStations: WorkStationModel[]
): boolean => {
  return workStations.some(ws => ws.level === level);
};

/**
 * Obtener rango de niveles (min y max)
 */
export const getLevelRange = (
  workStations: WorkStationModel[]
): { min: number; max: number } => {
  const levels = workStations.map(ws => ws.level);

  return {
    min: Math.min(...levels),
    max: Math.max(...levels)
  };
};
