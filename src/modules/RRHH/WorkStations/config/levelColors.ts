/**
 * Configuración de colores por nivel jer

árquico
 * Cada nivel tiene un color distintivo para visualización en el organigrama
 */

export interface LevelColorConfig {
  bg: string;         // Color de fondo del badge
  text: string;       // Color del texto
  name: string;       // Nombre descriptivo del nivel
  gradient?: string;  // Gradiente opcional para efectos visuales
}

export const LEVEL_COLORS: Record<number, LevelColorConfig> = {
  0: {
    bg: '#667eea',
    text: '#ffffff',
    name: 'Directivo',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  1: {
    bg: '#f093fb',
    text: '#ffffff',
    name: 'Gerencial',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  2: {
    bg: '#4facfe',
    text: '#ffffff',
    name: 'Jefatura',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  3: {
    bg: '#43e97b',
    text: '#ffffff',
    name: 'Coordinación',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  4: {
    bg: '#feca57',
    text: '#2c3e50',
    name: 'Operativo',
    gradient: 'linear-gradient(135deg, #feca57 0%, #fe9c3f 100%)'
  },
  5: {
    bg: '#ff6b9d',
    text: '#ffffff',
    name: 'Asistente',
    gradient: 'linear-gradient(135deg, #ff6b9d 0%, #c86dd7 100%)'
  }
};

export const DEFAULT_LEVEL_COLOR: LevelColorConfig = {
  bg: '#95a5a6',
  text: '#ffffff',
  name: 'Sin nivel'
};

/**
 * Obtener configuración de color por nivel
 */
export const getLevelColor = (level: number): LevelColorConfig => {
  return LEVEL_COLORS[level] || DEFAULT_LEVEL_COLOR;
};
