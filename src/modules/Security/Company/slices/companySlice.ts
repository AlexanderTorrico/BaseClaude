import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CompanyModel, Branch } from '../models/CompanyModel';

interface CompanyState {
  company: CompanyModel | null;
  branches: Branch[];
  currentView: 'info' | 'branches';
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  company: null,
  branches: [],
  currentView: 'info',
  loading: false,
  error: null,
};

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCompany: (state, action: PayloadAction<CompanyModel>) => {
      state.company = action.payload;
      state.branches = action.payload.branches || [];
    },
    updateCompanyData: (state, action: PayloadAction<Partial<CompanyModel>>) => {
      if (state.company) {
        state.company = { ...state.company, ...action.payload };
      }
    },
    setBranches: (state, action: PayloadAction<Branch[]>) => {
      state.branches = action.payload;
    },
    addBranch: (state, action: PayloadAction<Branch>) => {
      state.branches.push(action.payload);
    },
    updateBranch: (state, action: PayloadAction<Branch>) => {
      const index = state.branches.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.branches[index] = action.payload;
      }
    },
    removeBranch: (state, action: PayloadAction<number>) => {
      state.branches = state.branches.filter(b => b.id !== action.payload);
    },
    setCurrentView: (state, action: PayloadAction<'info' | 'branches'>) => {
      state.currentView = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearCompany: (state) => {
      state.company = null;
      state.branches = [];
      state.error = null;
    },
  },
});

export const {
  setCompany,
  updateCompanyData,
  setBranches,
  addBranch,
  updateBranch,
  removeBranch,
  setCurrentView,
  setLoading,
  setError,
  clearCompany,
} = companySlice.actions;

export default companySlice.reducer;
