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

export const createExam = createAsyncThunk('exams/create', async ({ courseId, title }, { rejectWithValue }) => {
  try {
    const res = await axios.post('/exams', { courseId, title })
    const data = unwrap(res)
    return data.exam
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const fetchQuestions = createAsyncThunk('exams/questions', async (examId, { rejectWithValue }) => {
  try {
    const res = await axios.get(`/exams/${examId}/questions`)
    const data = unwrap(res)
    return { examId, questions: data.questions || [] }
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const addQuestion = createAsyncThunk('exams/addQuestion', async ({ examId, question }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`/exams/${examId}/questions`, question)
    const data = unwrap(res)
    return { examId, question: data.question }
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

const slice = createSlice({
  name: 'exams',
  initialState: { list: [], questions: {}, loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(fetchExams.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchExams.fulfilled, (s, a) => { s.loading = false; s.list = a.payload })
      .addCase(fetchExams.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(createExam.fulfilled, (s, a) => { s.list.push(a.payload) })
      .addCase(fetchQuestions.fulfilled, (s, a) => { s.questions[a.payload.examId] = a.payload.questions })
      .addCase(addQuestion.fulfilled, (s, a) => {
        const { examId, question } = a.payload
        s.questions[examId] = [...(s.questions[examId] || []), question]
      })
  },
})

export default slice.reducer
