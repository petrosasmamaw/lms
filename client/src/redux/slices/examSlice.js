import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchExams = createAsyncThunk(
  'exam/fetchExams',
  async ({ courseId }, { rejectWithValue }) => {
    try {
      let url = `${API_URL}/exams`;
      if (courseId) url += `?courseId=${courseId}`;
      const response = await axios.get(url);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchExamWithQuestions = createAsyncThunk(
  'exam/fetchExamWithQuestions',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/exams/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const submitExam = createAsyncThunk(
  'exam/submitExam',
  async ({ examId, answers }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/results/submit`, {
        examId,
        answers,
      }, { withCredentials: true });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  exams: [],
  currentExam: null,
  isLoading: false,
  error: null,
};

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchExams.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchExams.fulfilled, (state, action) => {
      state.isLoading = false;
      state.exams = action.payload;
    });
    builder.addCase(fetchExams.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(fetchExamWithQuestions.fulfilled, (state, action) => {
      state.currentExam = action.payload;
    });

    builder.addCase(submitExam.fulfilled, (state) => {
      state.currentExam = null;
    });
  },
});

export default examSlice.reducer;
