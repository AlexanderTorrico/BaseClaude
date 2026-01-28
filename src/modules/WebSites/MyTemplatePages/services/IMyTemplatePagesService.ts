import { MyTemplatePagesModel, TemplateStatus } from '../models/MyTemplatePagesModel';
import { TemplateVerificationsResponse } from '../models/TemplateVerificationModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

export interface IMyTemplatePagesService {
  getAll(setLoading?: SetStateFn): Promise<ApiResponse<MyTemplatePagesModel[]>>;
  updateStatus(id: number, status: TemplateStatus, setLoading?: SetStateFn): Promise<ApiResponse<MyTemplatePagesModel>>;
  getVerifications(templateId: number, setLoading?: SetStateFn): Promise<ApiResponse<TemplateVerificationsResponse>>;
}
