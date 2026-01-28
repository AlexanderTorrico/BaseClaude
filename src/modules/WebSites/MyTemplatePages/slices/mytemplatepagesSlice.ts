import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MyTemplatePagesModel } from '../models/MyTemplatePagesModel';

interface MyTemplatePagesState {
  list: MyTemplatePagesModel[];
  currentView: string;
}

const initialState: MyTemplatePagesState = {
  list: [],
  currentView: '0'
};

export const mytemplatepagesSlice = createSlice({
  name: 'mytemplatepages',
  initialState,
  reducers: {
    setMyTemplatePagess: (state, action: PayloadAction<MyTemplatePagesModel[]>) => {
      state.list = action.payload;
    },
    clearMyTemplatePagess: (state) => {
      state.list = [];
    },
    addMyTemplatePages: (state, action: PayloadAction<MyTemplatePagesModel>) => {
      state.list.push(action.payload);
    },
    updateMyTemplatePages: (state, action: PayloadAction<MyTemplatePagesModel>) => {
      const index = state.list.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeMyTemplatePages: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(item => item.id !== action.payload);
    },
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    }
  }
});

export const {
  setMyTemplatePagess,
  clearMyTemplatePagess,
  addMyTemplatePages,
  updateMyTemplatePages,
  removeMyTemplatePages,
  setCurrentView
} = mytemplatepagesSlice.actions;

export default mytemplatepagesSlice.reducer;
