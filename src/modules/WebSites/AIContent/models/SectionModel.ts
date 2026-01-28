/**
 * Modelo para Sección generada por IA
 */
export interface SectionModel {
    id: number;
    dsg_ia_rubro_template_page_id: number;
    code: string;
    created_at: string;
    updated_at: string;
    texts: SectionTextModel[];
    images: SectionImageModel[];
}

/**
 * Modelo para texto de sección
 */
export interface SectionTextModel {
    id: number;
    dsg_ia_section_id: number;
    section_text_id: number;  // ID real del registro
    index: number;            // Posición dentro del array
    lbl: string;
    value: string;
}

/**
 * Modelo para imagen de sección
 */
export interface SectionImageModel {
    id: number;
    dsg_ia_section_id: number;
    section_img_id?: number;  // ID real del registro
    index?: number;           // Posición dentro del array
    lbl?: string;             // Label de la imagen
    data: string | ImageData; // Puede ser URL string o objeto
}

/**
 * Datos de imagen estructurados
 */
export interface ImageData {
    url: string;
    alt?: string;
}

/**
 * Respuesta del endpoint de secciones
 */
export interface SectionsResponse {
    rubro_template_page: {
        id: number;
        dsg_ia_rubro_id: number;
        template_page_id: number;
        language: string;
        checkout: number;
        version: number;
        verification_count?: number;
        verifications_count?: number;
        verified_by_current_user?: boolean;
    };
    rubro: {
        id: number;
        name: string;
    };
    sections: SectionModel[];
}
