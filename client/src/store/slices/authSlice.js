import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api";

export const fetchMe = createAsyncThunk("auth/fetchMe", async () => {
  const { data } = await api.get("/api/auth/me");
  return data;
});

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/auth/login", {
        username,
        password,
      });
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data || { message: "Ошибка" });
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  const { data } = await api.post("/api/auth/logout");
  return data;
});

const slice = createSlice({
  name: "auth",
  initialState: { authenticated: false, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.authenticated = !!action.payload?.authenticated;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        state.authenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Ошибка";
      })
      .addCase(logout.fulfilled, (state) => {
        state.authenticated = false;
      });
  },
});

export default slice.reducer;
