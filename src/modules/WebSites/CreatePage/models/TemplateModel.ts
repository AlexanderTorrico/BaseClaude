/**
 * Modelo de Template de página
 * Respuesta del endpoint /api/dsg-t-page
 */
export interface TemplateModel {
    id: number;
    name: string;
    description: string;
    active: number;
    count: number;
    score: number;
    scoreCount: number;
    url: string;  // Ruta de la imagen: storage/templatesImages/template_01.png
    image: string | null;
    palette: TemplatePalette;
}

export interface TemplatePalette {
    tx: string;   // Color de texto
    tx2: string;  // Color de texto secundario
    ac: string;   // Color de acento
    pr: string;   // Color primario
    bg: string;   // Color de fondo
    bg2: string;  // Color de fondo secundario
}

/**
 * Parsea el JSON de palette del API
 */
export const parseTemplatePalette = (paletteJson: string): TemplatePalette => {
    try {
        return JSON.parse(paletteJson);
    } catch {
        return {
            tx: '#FFFFFF',
            tx2: '#a2a2a2',
            ac: '#ffbc1f',
            pr: '#ffbc1f',
            bg: '#1D1F21',
            bg2: '#2c2e30'
        };
    }
};
