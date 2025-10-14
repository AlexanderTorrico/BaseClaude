import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TestearState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: TestearState = {
  data: [],
  loading: false,
  error: null
};

export const testearSlice = createSlice({
  name: 'testear',
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

export const { setLoading, setData, setError } = testearSlice.actions;
export default testearSlice.reducer;
