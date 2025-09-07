import React from 'react';
import Typography from './Typography';

/**
 * Componentes de escritura rápida para Typography
 * 
 * Estos son shortcuts del componente Typography base para uso común.
 * Para casos complejos, usar el componente Typography directamente.
 * 
 * @example
 * // Escritura rápida
 * <H1>Título</H1>
 * <H2 color="primary">Subtítulo</H2>
 * <P>Párrafo normal</P>
 * 
 * // Para casos complejos, usar Typography
 * <Typography variant="h1" size="2xl" weight="bold" truncate>
 *   Texto con múltiples props
 * </Typography>
 */

// Encabezados
export const H1 = (props) => <Typography variant="h1" {...props} />;
export const H2 = (props) => <Typography variant="h2" {...props} />;
export const H3 = (props) => <Typography variant="h3" {...props} />;
export const H4 = (props) => <Typography variant="h4" {...props} />;
export const H5 = (props) => <Typography variant="h5" {...props} />;
export const H6 = (props) => <Typography variant="h6" {...props} />;

// Texto común
export const P = (props) => <Typography variant="p" {...props} />;
export const Span = (props) => <Typography variant="span" {...props} />;
export const Small = (props) => <Typography variant="small" {...props} />;

// Texto especial
export const Strong = (props) => <Typography variant="strong" {...props} />;
export const Em = (props) => <Typography variant="em" {...props} />;
export const Code = (props) => <Typography variant="code" {...props} />;

// Shortcuts con estilos predefinidos
export const Title = (props) => <Typography variant="h1" weight="bold" {...props} />;
export const Subtitle = (props) => <Typography variant="h2" weight="medium" color="muted" {...props} />;
export const Lead = (props) => <Typography variant="p" size="lg" {...props} />;
export const Caption = (props) => <Typography variant="small" color="muted" {...props} />;
export const Label = (props) => <Typography variant="span" weight="medium" size="sm" {...props} />;

// Shortcuts de colores comunes
export const TextPrimary = (props) => <Typography variant="p" color="primary" {...props} />;
export const TextSuccess = (props) => <Typography variant="p" color="success" {...props} />;
export const TextDanger = (props) => <Typography variant="p" color="danger" {...props} />;
export const TextMuted = (props) => <Typography variant="p" color="muted" {...props} />;

// Shortcuts de tamaños
export const TextLarge = (props) => <Typography variant="p" size="lg" {...props} />;
export const TextSmall = (props) => <Typography variant="p" size="sm" {...props} />;