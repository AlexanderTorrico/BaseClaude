/**
 * Modelo para Rubro (categoría de negocio generada por IA)
 */
export interface RubroModel {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    template_pages?: RubroTemplatePageModel[];
    template_pages_count?: number;
}

/**
 * Modelo para la relación Rubro-TemplatePage
 */
export interface RubroTemplatePageModel {
    id: number;
    dsg_ia_rubro_id: number;
    template_page_id: number;
    language: string;
    checkout: number;
    version: number;
    created_at: string;
    updated_at: string;
    // Campos de verificación
    verification_count?: number;
    verified_by_current_user?: boolean;
}

/**
 * Modelo para verificación de template
 */
export interface TemplateVerificationModel {
    id: number;
    rubro_template_page_id: number;
    user_id: number;
    description?: string;
    created_at: string;
    user?: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    };
}
