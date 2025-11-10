export default (moduleName) => `import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ${moduleName}Model } from '../models/${moduleName}Model';

interface ${moduleName}State {
  list: ${moduleName}Model[];
  currentView: string;
}

const initialState: ${moduleName}State = {
  list: [],
  currentView: '0'
};

export const ${moduleName.toLowerCase()}Slice = createSlice({
  name: '${moduleName.toLowerCase()}',
  initialState,
  reducers: {
    set${moduleName}s: (state, action: PayloadAction<${moduleName}Model[]>) => {
      state.list = action.payload;
    },
    clear${moduleName}s: (state) => {
      state.list = [];
    },
    add${moduleName}: (state, action: PayloadAction<${moduleName}Model>) => {
      state.list.push(action.payload);
    },
    update${moduleName}: (state, action: PayloadAction<${moduleName}Model>) => {
      const index = state.list.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    remove${moduleName}: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(item => item.id !== action.payload);
    },
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    }
  }
});

export const {
  set${moduleName}s,
  clear${moduleName}s,
  add${moduleName},
  update${moduleName},
  remove${moduleName},
  setCurrentView
} = ${moduleName.toLowerCase()}Slice.actions;

export default ${moduleName.toLowerCase()}Slice.reducer;
`;
