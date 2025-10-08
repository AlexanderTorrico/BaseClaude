export default (moduleName) => `import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ${moduleName}State {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ${moduleName}State = {
  data: [],
  loading: false,
  error: null
};

export const ${moduleName.toLowerCase()}Slice = createSlice({
  name: '${moduleName.toLowerCase()}',
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

export const { setLoading, setData, setError } = ${moduleName.toLowerCase()}Slice.actions;
export default ${moduleName.toLowerCase()}Slice.reducer;
`;
