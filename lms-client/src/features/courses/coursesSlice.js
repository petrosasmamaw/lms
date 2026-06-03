import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axiosInstance'
import { unwrap } from '../../api/unwrap'

export const fetchStudentCourses = createAsyncThunk(
  'courses/fetchStudentCourses',
  async ({ departmentId, year }, { rejectWithValue }) => {
    try {
      const res = await axios.get('/courses', {
        params: { departmentId, year },
      })
      const data = unwrap(res)
      return data.courses || []
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  },
)

const slice = createSlice({
  name: 'courses',
  initialState: { list: [], loading: false, error: null },
  reducers: {
    clearCourses(state) {
      state.list = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentCourses.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchStudentCourses.fulfilled, (s, a) => { s.loading = false; s.list = a.payload })
      .addCase(fetchStudentCourses.rejected, (s, a) => { s.loading = false; s.error = a.payload })
  },
})

export const { clearCourses } = slice.actions
export default slice.reducer
