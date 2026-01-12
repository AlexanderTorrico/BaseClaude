/**
 * DTO para la creación de nuevos permisos
 */
export interface CreatePermissionDto {
    name: string;
    description?: string;
    gbl_module_id?: number;
}
