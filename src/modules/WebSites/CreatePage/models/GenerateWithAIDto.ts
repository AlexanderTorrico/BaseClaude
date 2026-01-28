/**
 * DTO para generar página con IA
 */
export interface GenerateWithAIDto {
    template_page_id: number;
    name: string;
    prompt: string;
}
