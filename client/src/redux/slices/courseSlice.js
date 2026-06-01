import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchCourses = createAsyncThunk(
  'course/fetchCourses',
  async ({ departmentId, academicYearId }, { rejectWithValue }) => {
    try {
      let url = `${API_URL}/courses`;
      if (departmentId) url += `?departmentId=${departmentId}`;
      if (academicYearId) url += `?academicYearId=${academicYearId}`;
      const response = await axios.get(url);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'course/fetchCourseById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/courses/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  courses: [],
  currentCourse: null,
  isLoading: false,
  error: null,
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCourses.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCourses.fulfilled, (state, action) => {
      state.isLoading = false;
      state.courses = action.payload;
    });
    builder.addCase(fetchCourses.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(fetchCourseById.fulfilled, (state, action) => {
      state.currentCourse = action.payload;
    });
  },
});

export default courseSlice.reducer;
