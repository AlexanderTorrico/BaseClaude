import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ICompanyService } from '../services/ICompanyService';
import {
  setCompany,
  updateCompanyData,
  setBranches,
  addBranch,
  updateBranch,
  removeBranch,
  setError,
} from '../slices/companySlice';
import { CompanyModel, Branch } from '../models/CompanyModel';
import { toast } from 'react-toastify';

/**
 * Hook para operaciones async de Company (fetch, create, update, delete)
 */
export const useCompanyFetch = (service: ICompanyService) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  /**
   * Obtener información de la compañía
   */
  const fetchCompany = async (): Promise<void> => {
    const result = await service.getCompany(setLoading);

    if (result.status !== 200) {
      const errorMsg = `Error al obtener la compañía: ${result.message}`;
      console.error(`❌ ${errorMsg}`);
      dispatch(setError(errorMsg));
      toast.error(errorMsg);
      return;
    }

    dispatch(setCompany(result.data));
  };

  /**
   * Actualizar información de la compañía
   */
  const updateCompany = async (data: Partial<CompanyModel>): Promise<boolean> => {
    const result = await service.updateCompany(data, setLoading);

    if (result.status !== 200) {
      const errorMsg = `Error al actualizar la compañía: ${result.message}`;
      console.error(`❌ ${errorMsg}`);
      toast.error(errorMsg);
      return false;
    }

    dispatch(updateCompanyData(result.data));
    toast.success('Compañía actualizada exitosamente');
    return true;
  };

  /**
   * Obtener sucursales
   */
  const fetchBranches = async (): Promise<void> => {
    const result = await service.getBranches(setLoading);

    if (result.status !== 200) {
      const errorMsg = `Error al obtener sucursales: ${result.message}`;
      console.error(`❌ ${errorMsg}`);
      toast.error(errorMsg);
      return;
    }

    dispatch(setBranches(result.data));
  };

  /**
   * Crear nueva sucursal
   */
  const createBranch = async (
    data: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<boolean> => {
    const result = await service.createBranch(data, setLoading);

    if (result.status !== 200) {
      const errorMsg = `Error al crear sucursal: ${result.message}`;
      console.error(`❌ ${errorMsg}`);
      toast.error(errorMsg);
      return false;
    }

    dispatch(addBranch(result.data));
    toast.success('Sucursal creada exitosamente');
    return true;
  };

  /**
   * Actualizar sucursal existente
   */
  const updateBranchData = async (id: number, data: Partial<Branch>): Promise<boolean> => {
    const result = await service.updateBranch(id, data, setLoading);

    if (result.status !== 200) {
      const errorMsg = `Error al actualizar sucursal: ${result.message}`;
      console.error(`❌ ${errorMsg}`);
      toast.error(errorMsg);
      return false;
    }

    dispatch(updateBranch(result.data));
    toast.success('Sucursal actualizada exitosamente');
    return true;
  };

  /**
   * Eliminar sucursal
   */
  const deleteBranch = async (id: number): Promise<boolean> => {
    const result = await service.deleteBranch(id, setLoading);

    if (result.status !== 200) {
      const errorMsg = `Error al eliminar sucursal: ${result.message}`;
      console.error(`❌ ${errorMsg}`);
      toast.error(errorMsg);
      return false;
    }

    dispatch(removeBranch(id));
    toast.success('Sucursal eliminada exitosamente');
    return true;
  };

  return {
    loading,
    fetchCompany,
    updateCompany,
    fetchBranches,
    createBranch,
    updateBranchData,
    deleteBranch,
  };
};
