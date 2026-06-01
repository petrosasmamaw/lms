import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axiosInstance'

export const fetchCourses = createAsyncThunk('courses/fetch', async (query = '', { rejectWithValue }) => {
  try {
    const res = await axios.get(`/courses${query}`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const createCourse = createAsyncThunk('courses/create', async (payload, { rejectWithValue }) => {
  try {
    const res = await axios.post('/courses', payload)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

const slice = createSlice({
  name: 'courses',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(fetchCourses.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchCourses.fulfilled, (s, a) => { s.loading = false; s.list = a.payload })
      .addCase(fetchCourses.rejected, (s, a) => { s.loading = false; s.error = a.payload })

      .addCase(createCourse.pending, (s) => { s.loading = true })
      .addCase(createCourse.fulfilled, (s, a) => { s.loading = false; s.list.push(a.payload) })
      .addCase(createCourse.rejected, (s, a) => { s.loading = false; s.error = a.payload })
  }
})

export default slice.reducer
