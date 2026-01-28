import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { IMyTemplatePagesService } from '../services/IMyTemplatePagesService';
import { setMyTemplatePagess, updateMyTemplatePages } from '../slices/mytemplatepagesSlice';

export const useMyTemplatePagesFetch = (service: IMyTemplatePagesService) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const fetchAll = async (): Promise<void> => {
    const result = await service.getAll(setLoading);
    dispatch(setMyTemplatePagess(result.data));
  };

  const publishTemplate = async (templateId: number): Promise<{ success: boolean; message: string }> => {
    const result = await service.updateStatus(templateId, 'PENDING', setLoading);

    if (result.data) {
      dispatch(updateMyTemplatePages(result.data));
    }

    return {
      success: result.status === 200,
      message: result.message
    };
  };

  return {
    loading,
    fetchAll,
    publishTemplate,
  };
};
