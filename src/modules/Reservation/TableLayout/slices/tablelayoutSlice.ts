import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ZoneModel, TableModel } from '../models/TableLayoutModel';

interface TableLayoutState {
  zones: ZoneModel[];
  selectedZoneId: number | null;
  selectedTableId: number | null;
}

const initialState: TableLayoutState = {
  zones: [],
  selectedZoneId: null,
  selectedTableId: null,
};

export const tablelayoutSlice = createSlice({
  name: 'reservation_tableLayout',
  initialState,
  reducers: {
    setZones: (state, action: PayloadAction<ZoneModel[]>) => {
      state.zones = action.payload;
    },
    addZone: (state, action: PayloadAction<ZoneModel>) => {
      state.zones.push(action.payload);
    },
    addTable: (state, action: PayloadAction<TableModel>) => {
      const zoneIndex = state.zones.findIndex(z => z.id === action.payload.booZoneId);
      if (zoneIndex !== -1) {
        state.zones[zoneIndex] = {
          ...state.zones[zoneIndex],
          booTables: [...state.zones[zoneIndex].booTables, action.payload]
        };
      }
    },
    updateTable: (state, action: PayloadAction<TableModel>) => {
      for (const zone of state.zones) {
        const tableIndex = zone.booTables.findIndex(t => t.id === action.payload.id);
        if (tableIndex !== -1) {
          zone.booTables[tableIndex] = action.payload;
          break;
        }
      }
    },
    setSelectedZone: (state, action: PayloadAction<number | null>) => {
      state.selectedZoneId = action.payload;
    },
    setSelectedTable: (state, action: PayloadAction<number | null>) => {
      state.selectedTableId = action.payload;
    },
    clearTableLayout: (state) => {
      state.zones = [];
      state.selectedZoneId = null;
      state.selectedTableId = null;
    },
  },
});

export const {
  setZones,
  addZone,
  addTable,
  updateTable,
  setSelectedZone,
  setSelectedTable,
  clearTableLayout,
} = tablelayoutSlice.actions;

export default tablelayoutSlice.reducer;
