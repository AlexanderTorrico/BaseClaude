import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PermisosState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: PermisosState = {
  data: [],
  loading: false,
  error: null
};

export const permisosSlice = createSlice({
  name: 'permisos',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setData: (state, action: PayloadAction<any[]>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { setLoading, setData, setError } = permisosSlice.actions;
export default permisosSlice.reducer;
