export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Checkbox } from './Checkbox';
export { default as Badge } from './Badge';
export { default as Avatar } from './Avatar';
export { default as Typography } from './Typography';
export { default as Icon } from './Icon';

// Exportar shortcuts de Typography para escritura rápida
export {
  H1, H2, H3, H4, H5, H6,           // Encabezados
  P, Span, Small, Strong, Em, Code,  // Texto básico
  Title, Subtitle, Lead, Caption, Label, // Shortcuts con estilos
  TextPrimary, TextSuccess, TextDanger, TextMuted, // Colores comunes
  TextLarge, TextSmall               // Tamaños comunes
} from './TypographyShortcuts';

// Exportar utilities y componentes adicionales
export { getSimplifiedName, TextIcon } from './IconExample';