import { httpRequestWithAuth } from '@/services/httpService';
import { ApiResponse } from '@/shared/types';
import { RubroModel, SectionsResponse } from '../models';

type SetStateFn = (loading: boolean) => void;

export class AIContentApiService {
    /**
     * Obtiene todos los rubros
     */
    async getRubros(setLoading?: SetStateFn): Promise<ApiResponse<RubroModel[]>> {
        const res = await httpRequestWithAuth.get<ApiResponse<any>>(
            `/api/dsg-ia-rubro`,
            setLoading
        );

        return {
            status: res.status,
            message: res.message,
            data: res.data?.data ?? res.data ?? []
        };
    }

    /**
     * Obtiene un rubro con sus template pages
     */
    async getRubroById(id: number, setLoading?: SetStateFn): Promise<ApiResponse<RubroModel>> {
        const res = await httpRequestWithAuth.get<ApiResponse<any>>(
            `/api/dsg-ia-rubro/${id}`,
            setLoading
        );

        return {
            status: res.status,
            message: res.message,
            data: res.data?.data ?? res.data
        };
    }

    /**
     * Obtiene los template pages de un rubro
     */
    async getTemplatePagesByRubro(rubroId: number, setLoading?: SetStateFn): Promise<ApiResponse<any[]>> {
        const res = await httpRequestWithAuth.get<ApiResponse<any>>(
            `/api/dsg-ia-rubro-template-page?dsg_ia_rubro_id=${rubroId}`,
            setLoading
        );

        return {
            status: res.status,
            message: res.message,
            data: res.data?.data ?? res.data ?? []
        };
    }

    /**
     * Obtiene los template pages con conteo de verificaciones
     */
    async getTemplatesWithVerifications(rubroId?: number, setLoading?: SetStateFn): Promise<ApiResponse<any[]>> {
        const params = rubroId ? `?dsg_ia_rubro_id=${rubroId}` : '';
        const res = await httpRequestWithAuth.get<ApiResponse<any>>(
            `/api/dsg-ia-rubro-template-page/with-verifications${params}`,
            setLoading
        );

        return {
            status: res.status,
            message: res.message,
            data: res.data?.data ?? res.data ?? []
        };
    }

    /**
     * Obtiene secciones con textos e imágenes de un template page
     */
    async getSectionsByTemplatePage(templatePageId: number, setLoading?: SetStateFn): Promise<ApiResponse<SectionsResponse>> {
        const res = await httpRequestWithAuth.get<ApiResponse<any>>(
            `/api/dsg-ia-section/by-template-page/${templatePageId}`,
            setLoading
        );

        return {
            status: res.status,
            message: res.message,
            data: res.data?.data ?? res.data
        };
    }

    /**
     * Actualiza un texto de sección
     */
    async updateSectionText(
        sectionTextId: number,
        data: { lbl: string; value: string; index: number },
        setLoading?: SetStateFn
    ): Promise<ApiResponse<any>> {
        const res = await httpRequestWithAuth.put<ApiResponse<any>>(
            `/api/dsg-ia-section-text/update-single`,
            {
                section_text_id: sectionTextId,
                lbl: data.lbl,
                value: data.value,
                index: data.index
            },
            setLoading
        );

        return res;
    }

    /**
     * Actualiza una imagen de sección
     */
    async updateSectionImage(
        imageId: number,
        data: { url: string; alt?: string },
        setLoading?: SetStateFn
    ): Promise<ApiResponse<any>> {
        const res = await httpRequestWithAuth.put<ApiResponse<any>>(
            `/api/dsg-ia-section-img/${imageId}`,
            { data },
            setLoading
        );

        return res;
    }

    /**
     * Sube una nueva imagen para una sección
     */
    async uploadSectionImage(
        imageId: number,
        file: File,
        lbl: string,
        setLoading?: SetStateFn
    ): Promise<ApiResponse<any>> {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('lbl', lbl);

        const res = await httpRequestWithAuth.post<ApiResponse<any>>(
            `/api/dsg-ia-section-img/${imageId}/upload`,
            formData,
            setLoading,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return res;
    }

    /**
     * Verifica un template (marca como revisado)
     */
    async verifyTemplate(
        templatePageId: number,
        description?: string,
        setLoading?: SetStateFn
    ): Promise<ApiResponse<any>> {
        const res = await httpRequestWithAuth.post<ApiResponse<any>>(
            `/api/dsg-ia-rubro-template-page/${templatePageId}/verify`,
            { description },
            setLoading
        );

        return res;
    }

    /**
     * Obtiene las verificaciones de un template
     */
    async getTemplateVerifications(
        templatePageId: number,
        setLoading?: SetStateFn
    ): Promise<ApiResponse<any[]>> {
        const res = await httpRequestWithAuth.get<ApiResponse<any>>(
            `/api/dsg-ia-rubro-template-page/${templatePageId}/verifications`,
            setLoading
        );

        return {
            status: res.status,
            message: res.message,
            data: res.data?.data ?? res.data ?? []
        };
    }

    /**
     * Convierte un template IA a una página regular
     */
    async convertIaToPage(
        iaRubroTemplatePageId: number,
        pageName: string,
        companyId: number,
        setLoading?: SetStateFn
    ): Promise<ApiResponse<any>> {
        const res = await httpRequestWithAuth.post<ApiResponse<any>>(
            `/api/dsg-page/convert-ia-to-page`,
            {
                ia_rubro_template_page_id: iaRubroTemplatePageId,
                page_name: pageName,
                company_id: companyId
            },
            setLoading
        );

        return {
            status: res.status,
            message: res.message || (res.status === 200 || res.status === 201 ? 'Page created successfully' : 'Error creating page'),
            data: res.data?.data ?? res.data
        };
    }
}
