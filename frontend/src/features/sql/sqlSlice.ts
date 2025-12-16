import sqlApi from '@/api/sqlApi';
import type { ISqlCodePayload, ISqlData } from '@/types/sql';
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

interface ISqlState {
  sqlData: ISqlData[];
  columns: { name: string; dataType: string }[];
  executeSqlCodeData: {
    data: any[];
    columns: { name: string; dataType: string }[];
    rowsAffected: number;
  };
  filteredData: any[];
  chartConfig: {
    xAxis?: string;
    yAxis?: string;
    value?: string;
    label?: string;
  };
  searchTerm: string;
  loading: boolean;
  error: string | null;
}

const initialState: ISqlState = {
  sqlData: [],
  columns: [],
  executeSqlCodeData: { data: [], columns: [], rowsAffected: 0 },
  chartConfig: {},
  filteredData: [],
  searchTerm: '',
  loading: false,
  error: null,
};

export const getCodeID = createAsyncThunk(
  'sql/get-codeid',
  async (codeId: string, { rejectWithValue }) => {
    try {
      const res = await sqlApi.getCodeID(codeId);
      return res;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const getColumns = createAsyncThunk(
  'sql/get-columns',
  async (payload: ISqlCodePayload, { rejectWithValue }) => {
    try {
      const data = await sqlApi.getColumns(payload);
      return data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const executeSQLCode = createAsyncThunk(
  'sql/execute-sqlcode',
  async (payload: ISqlCodePayload, { rejectWithValue }) => {
    try {
      const data = await sqlApi.executeSQLCode(payload);
      return data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error?.response?.data?.message || 'Created Table failed!'
      );
    }
  }
);

const sqlSlice = createSlice({
  name: 'sql',
  initialState,
  reducers: {
    clearChartConfig: (state) => {
      state.chartConfig = {};
    },
    setChartConfig: (
      state,
      action: PayloadAction<ISqlState['chartConfig']>
    ) => {
      state.chartConfig = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    updateFilteredData: (state, action: PayloadAction<any[]>) => {
      state.filteredData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCodeID.pending, (state) => {
        state.loading = true;
        state.sqlData = [];
        state.error = null;
      })
      .addCase(getCodeID.fulfilled, (state, action) => {
        state.loading = false;
        state.sqlData = action.payload;
      })
      .addCase(getCodeID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(getColumns.pending, (state) => {
        state.loading = true;
        state.columns = [];
        state.error = null;
      })
      .addCase(getColumns.fulfilled, (state, action) => {
        state.loading = false;
        state.columns = action.payload;
      })
      .addCase(getColumns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(executeSQLCode.pending, (state) => {
        state.loading = true;
        state.executeSqlCodeData = { data: [], columns: [], rowsAffected: 0 };
        state.error = null;
      })
      .addCase(executeSQLCode.fulfilled, (state, action) => {
        state.loading = false;
        state.executeSqlCodeData = action.payload;
      })
      .addCase(executeSQLCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearChartConfig,
  setChartConfig,
  setSearchTerm,
  updateFilteredData,
} = sqlSlice.actions;

export default sqlSlice.reducer;
