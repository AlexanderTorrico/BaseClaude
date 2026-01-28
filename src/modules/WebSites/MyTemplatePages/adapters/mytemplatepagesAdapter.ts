import { MyTemplatePagesModel, TemplatePalette } from '../models/MyTemplatePagesModel';
import { TemplateVerificationsResponse, TemplateVerification, VerificationStats, VerificationByUser } from '../models/TemplateVerificationModel';

export const adaptMyTemplatePagesResponseToMyTemplatePagesModel = (apiData: any): MyTemplatePagesModel => {
  const palette: TemplatePalette = apiData.palette || {
    ac: '#ffbc1f',
    bg: '#1D1F21',
    tx: '#FFFFFF',
    pr: null,
    bg2: null,
    tx2: null
  };

  return {
    id: apiData.id,
    name: apiData.name || '',
    description: apiData.description || '',
    image: apiData.image || '',
    palette,
    active: apiData.active ?? true,
    count: apiData.count || 0,
    score: apiData.score || 0,
    scoreCount: apiData.score_count || 0,
    status: apiData.status || 'DRAFT',
    createdAt: apiData.created_at || '',
    updatedAt: apiData.updated_at || '',
  };
};

export const adaptMyTemplatePagesArrayToMyTemplatePagesModels = (apiDataArray: any[]): MyTemplatePagesModel[] => {
  if (!Array.isArray(apiDataArray)) return [];
  return apiDataArray.map(adaptMyTemplatePagesResponseToMyTemplatePagesModel);
};

export const adaptVerificationsResponse = (apiData: any): TemplateVerificationsResponse => {
  const verifications: TemplateVerification[] = (apiData.verifications || []).map((v: any) => ({
    id: v.id,
    user: {
      id: v.user?.id || 0,
      name: v.user?.name || '',
      email: v.user?.email || ''
    },
    description: v.description || '',
    createdAt: v.created_at || '',
    updatedAt: v.updated_at || ''
  }));

  const verificationsByUser: VerificationByUser[] = (apiData.stats?.verifications_by_user || []).map((v: any) => ({
    user: {
      id: v.user?.id || 0,
      name: v.user?.name || '',
      email: v.user?.email || ''
    },
    verificationCount: v.verification_count || 0,
    lastVerification: v.last_verification || ''
  }));

  const stats: VerificationStats = {
    totalVerifications: apiData.stats?.total_verifications || 0,
    uniqueUsers: apiData.stats?.unique_users || 0,
    verificationsByUser
  };

  return { verifications, stats };
};
