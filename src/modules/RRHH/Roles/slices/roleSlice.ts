import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RoleModel } from '../models/RoleModel';

// Interface para el estado del slice
// NOTA: Loading y error se manejan en ServiceWrapper, NO en Redux
interface RoleState {
    list: RoleModel[];
    currentView: string; // '0' = table
}

// Pure initial state - no external dependencies
const initialState: RoleState = {
    list: [],
    currentView: '0' // Por defecto vista tabla
};

export const roleSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        setRoles: (state, action: PayloadAction<RoleModel[]>) => {
            state.list = action.payload;
        },
        clearRoles: (state) => {
            state.list = [];
        },
        addRole: (state, action: PayloadAction<RoleModel>) => {
            state.list.push(action.payload);
        },
        updateRole: (state, action: PayloadAction<RoleModel>) => {
            const index = state.list.findIndex(role => role.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = action.payload;
            }
        },
        removeRole: (state, action: PayloadAction<number>) => {
            state.list = state.list.filter(role => role.id !== action.payload);
        },
        setCurrentView: (state, action: PayloadAction<string>) => {
            state.currentView = action.payload;
        }
    }
});

export const {
    setRoles,
    clearRoles,
    addRole,
    updateRole,
    removeRole,
    setCurrentView
} = roleSlice.actions;

export default roleSlice.reducer;
