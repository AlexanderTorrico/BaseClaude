import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ICompanyService } from '../services/ICompanyService';
import {
  setCompanys,
  addCompany,
  updateCompany,
  removeCompany,
  addBranchToCompany,
  updateBranchInCompany,
  removeBranchFromCompany,
} from '../slices/companySlice';
import { CompanyDto, BranchDto, BranchModel, CompanyModel } from '../models/CompanyModel';
import { toast } from 'react-toastify';
import { store } from '@/store';

/**
 * Hook para operaciones async de Company (fetch, create, update, delete)
 */
export const useCompanyFetch = (service: ICompanyService) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  /**
   * Obtener todas las compañías
   */
  const fetchAll = async (): Promise<void> => {
    const result = await service.getAll(setLoading);

    if (result.status !== 200) {
      console.error(`❌ Error fetching companies: [${result.status}] ${result.message}`);
      toast.error(result.message || 'Error al obtener compañías');
      return;
    }

    dispatch(setCompanys(result.data));
  };

  /**
   * Crear nueva compañía
   */
  const createCompany = async (dto: CompanyDto): Promise<{ success: boolean; message: string }> => {
    const formData = new FormData();
    formData.append('name', dto.name);
    formData.append('detail', dto.detail?.toString() || '');
    formData.append('openingDateCompany', dto.openingDateCompany || '');
    formData.append('phoneCountryCode', dto.phone[0] || '');
    formData.append('phoneNumber', dto.phone[1] || '');
    formData.append('email', dto.email);
    formData.append('timeZone', dto.timeZone);
    formData.append('companySize', dto.companySize);
    formData.append('language', dto.language);

    if (dto.logo) {
      formData.append('logo', dto.logo);
    }

    const result = await service.create(formData, setLoading);

    if (result.status !== 200) {
      toast.error(result.message || 'Error al crear compañía');
      return { success: false, message: result.message };
    }

    if (result.data) {
      dispatch(addCompany(result.data));
      toast.success('Compañía creada exitosamente');
    }

    return { success: true, message: 'Compañía creada exitosamente' };
  };

  /**
   * Actualizar compañía existente
   * Incluye toda la información de la compañía y sus sucursales
   */
  const updateCompanyData = async (
    id: number,
    dto: CompanyDto,
    sucursales: BranchModel[]
  ): Promise<{ success: boolean; message: string }> => {
    const formData = new FormData();

    // ID de la compañía
    formData.append('id', id.toString());

    // Campos básicos
    formData.append('name', dto.name);
    formData.append('opening_date_conpany', dto.openingDateCompany); // Nota: "conpany" con error tipográfico del backend
    formData.append('email', dto.email);
    formData.append('time_zone', dto.timeZone);
    formData.append('company_size', dto.companySize);
    formData.append('language', dto.language);

    // Rubro como array JSON: [6]
    formData.append('modules_id', JSON.stringify([dto.detail]));

    // Teléfono como JSON string: ["591","783648261"]
    formData.append('phone', JSON.stringify(dto.phone));

    // Logo (imagen en binario)
    if (dto.logo) {
      formData.append('image', dto.logo);
    }

    // Sucursales como JSON string (array completo con todos los campos en snake_case)
    const sucursalesFormatted = sucursales.map(branch => {
      const branchData: any = {
        name: branch.name,
        email: branch.email,
        detail: null,
        long: null,
        address: branch.address,
        phone: branch.phone,
        schedules: null,
        lat: branch.lat,
        lng: branch.lng,
        active: branch.active,
        time_zone: null,
        gbl_company_id: branch.gblCompanyId,
        created_at: branch.createdAt || new Date().toISOString(),
        updated_at: branch.updatedAt || new Date().toISOString(),
      };

      // Solo incluir ID si es positivo (sucursal existente del servidor)
      // IDs negativos son sucursales nuevas creadas localmente
      if (branch.id > 0) {
        branchData.id = branch.id;
      }

      return branchData;
    });

    const sucursalesJSON = JSON.stringify(sucursalesFormatted);
    console.log('📤 Sucursales a enviar:', sucursalesJSON);
    formData.append('sucursales', sucursalesJSON);

    const result = await service.update(formData, setLoading);

    if (result.status !== 200) {
      toast.error(result.message || 'Error al actualizar compañía');
      return { success: false, message: result.message };
    }

    if (result.data) {
      dispatch(updateCompany(result.data));
      toast.success('Compañía actualizada exitosamente');
    }

    return { success: true, message: 'Compañía actualizada exitosamente' };
  };

  /**
   * Eliminar compañía
   */
  const deleteCompany = async (id: number): Promise<{ success: boolean; message: string }> => {
    const result = await service.delete(id, setLoading);

    if (result.status !== 200) {
      toast.error(result.message || 'Error al eliminar compañía');
      return { success: false, message: result.message };
    }

    dispatch(removeCompany(id));
    toast.success('Compañía eliminada exitosamente');

    return { success: true, message: 'Compañía eliminada exitosamente' };
  };

  /**
   * Agregar sucursal a compañía (SOLO LOCAL - no hace petición HTTP)
   * Los cambios se guardarán cuando se actualice la compañía completa
   */
  const createBranch = async (
    companyId: number,
    dto: BranchDto
  ): Promise<{ success: boolean; message: string; data?: BranchModel }> => {
    // Crear nueva sucursal con ID temporal NEGATIVO (para diferenciar de las que vienen del servidor)
    // Los IDs negativos indican que es una sucursal nueva que aún no existe en el servidor
    const newBranch: BranchModel = {
      id: -Date.now(), // ID temporal NEGATIVO - no se enviará al backend
      name: dto.name,
      email: dto.email || null,
      phone: dto.phone,
      address: dto.address,
      lat: dto.lat,
      lng: dto.lng,
      active: 1,
      gblCompanyId: companyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Solo actualizar Redux localmente
    dispatch(addBranchToCompany({ companyId, branch: newBranch }));
    toast.success('Sucursal agregada (pendiente de guardar)');

    return { success: true, message: 'Sucursal agregada localmente', data: newBranch };
  };

  /**
   * Actualizar sucursal existente (SOLO LOCAL - no hace petición HTTP)
   * Los cambios se guardarán cuando se actualice la compañía completa
   */
  const updateBranchData = async (
    companyId: number,
    dto: BranchDto
  ): Promise<{ success: boolean; message: string }> => {
    if (!dto.id) {
      return { success: false, message: 'ID de sucursal no proporcionado' };
    }

    // Obtener la sucursal actual del store para preservar createdAt
    const currentState = store.getState() as any;
    const company = currentState.company.list.find((c: CompanyModel) => c.id === companyId);
    const existingBranch = company?.sucursales.find((b: BranchModel) => b.id === dto.id);

    // Crear branch actualizado
    const updatedBranch: BranchModel = {
      id: dto.id,
      name: dto.name,
      email: dto.email || null,
      phone: dto.phone,
      address: dto.address,
      lat: dto.lat,
      lng: dto.lng,
      active: 1,
      gblCompanyId: companyId,
      createdAt: existingBranch?.createdAt || new Date().toISOString(), // Preservar createdAt original
      updatedAt: new Date().toISOString(),
    };

    // Solo actualizar Redux localmente
    dispatch(updateBranchInCompany({ companyId, branch: updatedBranch }));
    toast.success('Sucursal actualizada (pendiente de guardar)');

    return { success: true, message: 'Sucursal actualizada localmente' };
  };

  /**
   * Eliminar sucursal (SOLO LOCAL - no hace petición HTTP)
   * Los cambios se guardarán cuando se actualice la compañía completa
   */
  const deleteBranch = async (
    companyId: number,
    branchId: number
  ): Promise<{ success: boolean; message: string }> => {
    // Solo actualizar Redux localmente
    dispatch(removeBranchFromCompany({ companyId, branchId }));
    toast.success('Sucursal eliminada (pendiente de guardar)');

    return { success: true, message: 'Sucursal eliminada localmente' };
  };

  return {
    loading,
    fetchAll,
    createCompany,
    updateCompanyData,
    deleteCompany,
    createBranch,
    updateBranchData,
    deleteBranch,
  };
};
