import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PermissionModel } from '../models/PermissionModel';

interface PermissionState {
    list: PermissionModel[];
    currentView: string;
}

const initialState: PermissionState = {
    list: [],
    currentView: '0'
};

export const permissionSlice = createSlice({
    name: 'permissions',
    initialState,
    reducers: {
        setPermissions: (state, action: PayloadAction<PermissionModel[]>) => {
            state.list = action.payload;
        },
        clearPermissions: (state) => {
            state.list = [];
        },
        addPermission: (state, action: PayloadAction<PermissionModel>) => {
            state.list.push(action.payload);
        },
        setCurrentView: (state, action: PayloadAction<string>) => {
            state.currentView = action.payload;
        }
    }
});

export const {
    setPermissions,
    clearPermissions,
    addPermission,
    setCurrentView
} = permissionSlice.actions;

export default permissionSlice.reducer;
