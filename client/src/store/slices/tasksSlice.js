import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api";

export const fetchTasks = createAsyncThunk("tasks/fetch", async (params) => {
  const { data } = await api.get("/api/tasks", { params });
  return data;
});

export const createTask = createAsyncThunk(
  "tasks/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/tasks", payload);
      return data.item;
    } catch (e) {
      return rejectWithValue(e.response?.data || { message: "Ошибка" });
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/tasks/${id}`, updates);
      return data.item;
    } catch (e) {
      return rejectWithValue(e.response?.data || { message: "Ошибка" });
    }
  }
);

const slice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    pagination: { total: 0, page: 1, pageSize: 3, totalPages: 0 },
    sort: { sortBy: "id", order: "ASC" },
    loading: false,
    error: null,
  },
  reducers: {
    setSort(state, action) {
      state.sort = action.payload;
    },
    setPage(state, action) {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
        state.sort = action.payload.sort;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.loading = false;
        state.error = "Ошибка загрузки";
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        if (state.items.length > state.pagination.pageSize) {
          state.items.pop();
        }

        state.pagination.total = (state.pagination.total || 0) + 1;
        state.pagination.totalPages = Math.ceil(
          state.pagination.total / state.pagination.pageSize
        );
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
      });
  },
});

export const { setSort, setPage } = slice.actions;
export default slice.reducer;
