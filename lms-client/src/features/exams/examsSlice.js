import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axiosInstance'
import { unwrap } from '../../api/unwrap'

export const fetchExams = createAsyncThunk('exams/fetch', async (courseId, { rejectWithValue }) => {
  try {
    const res = await axios.get('/exams', { params: { courseId } })
    const data = unwrap(res)
    return data.exams || []
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const fetchQuestions = createAsyncThunk('exams/fetchQuestions', async (examId, { rejectWithValue }) => {
  try {
    const res = await axios.get(`/exams/${examId}/questions`)
    const data = unwrap(res)
    return { examId, questions: data.questions || [] }
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const fetchExamAttempt = createAsyncThunk('exams/fetchAttempt', async (examId, { rejectWithValue }) => {
  try {
    const res = await axios.get(`/exams/${examId}/attempt`)
    const data = unwrap(res)
    return { examId, attempt: data.attempt }
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const submitExam = createAsyncThunk(
  'exams/submit',
  async ({ examId, answers }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/exams/${examId}/submit`, { answers })
      const data = unwrap(res)
      return { examId, ...data }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message })
    }
  },
)

const slice = createSlice({
  name: 'exams',
  initialState: {
    list: [],
    questions: {},
    attempts: {},
    submission: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSubmission(state) {
      state.submission = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExams.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchExams.fulfilled, (s, a) => { s.loading = false; s.list = a.payload })
      .addCase(fetchExams.rejected, (s, a) => { s.loading = false; s.error = a.payload })

      .addCase(fetchQuestions.fulfilled, (s, a) => {
        s.questions[a.payload.examId] = a.payload.questions
      })

      .addCase(fetchExamAttempt.fulfilled, (s, a) => {
        s.attempts[a.payload.examId] = a.payload.attempt
      })

      .addCase(submitExam.pending, (s) => { s.loading = true; s.error = null })
      .addCase(submitExam.fulfilled, (s, a) => {
        s.loading = false
        s.submission = a.payload
        s.attempts[a.payload.examId] = a.payload.attempt
      })
      .addCase(submitExam.rejected, (s, a) => { s.loading = false; s.error = a.payload })
  },
})

export const { clearSubmission } = slice.actions
export default slice.reducer
