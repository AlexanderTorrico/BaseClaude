/**
 * Core Auth Module
 * 
 * Este módulo centraliza toda la lógica de autenticación y autorización.
 * Incluye hooks, componentes y servicios para manejar permisos de usuario.
 */

// Hooks
export { useUserPermissions } from './hooks/useUserPermissions';

// Components
export { default as ProtectedRoute } from './components/ProtectedRoute';

// Constants
export * from './constants/permissions';

// Types
export type { UseUserPermissionsReturn } from './hooks/useUserPermissions';
export type { PermissionName } from './constants/permissions';
