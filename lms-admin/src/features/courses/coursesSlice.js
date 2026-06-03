import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axiosInstance'
import { unwrap } from '../../api/unwrap'

export const fetchCourses = createAsyncThunk('courses/fetch', async (params = {}, { rejectWithValue }) => {
  try {
    const query = {}
    if (params.departmentId) query.departmentId = params.departmentId
    if (params.year) query.year = params.year
    const res = await axios.get('/courses', { params: Object.keys(query).length ? query : undefined })
    const data = unwrap(res)
    return data.courses || []
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const createCourse = createAsyncThunk('courses/create', async (payload, { rejectWithValue }) => {
  try {
    const res = await axios.post('/courses', payload)
    const data = unwrap(res)
    return data.course
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
      .addCase(createCourse.fulfilled, (s, a) => { s.list.push(a.payload) })
  },
})

export default slice.reducer
