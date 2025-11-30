import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VaultModel } from '../models/VaultModel';

export interface PendingUpload {
  id: string; // ID temporal único
  fileName: string;
  isVideo: boolean;
  timestamp: number;
}

interface VaultState {
  data: VaultModel | null;
  currentView: string; // '0' = Mis Imágenes, '1' = Vault Categories
  selectedCategory: string | null; // Categoría seleccionada del vault
  pendingUploads: PendingUpload[]; // Uploads en progreso
}

const initialState: VaultState = {
  data: null,
  currentView: '0',
  selectedCategory: null,
  pendingUploads: [],
};

export const vaultSlice = createSlice({
  name: 'vault',
  initialState,
  reducers: {
    setVaultData: (state, action: PayloadAction<VaultModel>) => {
      state.data = action.payload;
    },
    clearVaultData: (state) => {
      state.data = null;
      state.selectedCategory = null;
    },
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    addPendingUpload: (state, action: PayloadAction<PendingUpload>) => {
      state.pendingUploads.push(action.payload);
    },
    removePendingUpload: (state, action: PayloadAction<string>) => {
      state.pendingUploads = state.pendingUploads.filter(
        (upload) => upload.id !== action.payload
      );
    },
    clearPendingUploads: (state) => {
      state.pendingUploads = [];
    },
  },
});

export const {
  setVaultData,
  clearVaultData,
  setCurrentView,
  setSelectedCategory,
  addPendingUpload,
  removePendingUpload,
  clearPendingUploads,
} = vaultSlice.actions;

export default vaultSlice.reducer;
