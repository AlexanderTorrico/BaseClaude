import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CompanyModel, BranchModel } from '../models/CompanyModel';

interface CompanyState {
  list: CompanyModel[];
  currentView: string; // '0' = tabla, '1' = cards (para sucursales)
  selectedCompanyId: number | null; // Compañía seleccionada para edición
}

const initialState: CompanyState = {
  list: [],
  currentView: '0',
  selectedCompanyId: null,
};

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCompanys: (state, action: PayloadAction<CompanyModel[]>) => {
      state.list = action.payload;
    },
    clearCompanys: (state) => {
      state.list = [];
    },
    addCompany: (state, action: PayloadAction<CompanyModel>) => {
      state.list.push(action.payload);
    },
    updateCompany: (state, action: PayloadAction<CompanyModel>) => {
      const index = state.list.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeCompany: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(item => item.id !== action.payload);
    },
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    },
    setSelectedCompanyId: (state, action: PayloadAction<number | null>) => {
      state.selectedCompanyId = action.payload;
    },
    // Acciones para Sucursales
    addBranchToCompany: (state, action: PayloadAction<{ companyId: number; branch: BranchModel }>) => {
      const company = state.list.find(c => c.id === action.payload.companyId);
      if (company) {
        company.sucursales.push(action.payload.branch);
      }
    },
    updateBranchInCompany: (state, action: PayloadAction<{ companyId: number; branch: BranchModel }>) => {
      const company = state.list.find(c => c.id === action.payload.companyId);
      if (company) {
        const branchIndex = company.sucursales.findIndex(b => b.id === action.payload.branch.id);
        if (branchIndex !== -1) {
          company.sucursales[branchIndex] = action.payload.branch;
        }
      }
    },
    removeBranchFromCompany: (state, action: PayloadAction<{ companyId: number; branchId: number }>) => {
      const company = state.list.find(c => c.id === action.payload.companyId);
      if (company) {
        company.sucursales = company.sucursales.filter(b => b.id !== action.payload.branchId);
      }
    },
  }
});

export const {
  setCompanys,
  clearCompanys,
  addCompany,
  updateCompany,
  removeCompany,
  setCurrentView,
  setSelectedCompanyId,
  addBranchToCompany,
  updateBranchInCompany,
  removeBranchFromCompany,
} = companySlice.actions;

export default companySlice.reducer;
