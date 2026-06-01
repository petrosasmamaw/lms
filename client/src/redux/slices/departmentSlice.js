import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchDepartments = createAsyncThunk(
  'department/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/departments`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchDepartmentById = createAsyncThunk(
  'department/fetchDepartmentById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/departments/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createDepartment = createAsyncThunk(
  'department/createDepartment',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/departments`, data, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  departments: [],
  currentDepartment: null,
  isLoading: false,
  error: null,
};

const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDepartments.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchDepartments.fulfilled, (state, action) => {
      state.isLoading = false;
      state.departments = action.payload;
    });
    builder.addCase(fetchDepartments.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(fetchDepartmentById.fulfilled, (state, action) => {
      state.currentDepartment = action.payload;
    });

    builder.addCase(createDepartment.fulfilled, (state, action) => {
      state.departments.push(action.payload);
    });
  },
});

export const { clearError } = departmentSlice.actions;
export default departmentSlice.reducer;
