import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axiosInstance'
import { unwrap } from '../../api/unwrap'

export const fetchResources = createAsyncThunk('resources/fetch', async (courseId, { rejectWithValue }) => {
  try {
    const res = await axios.get('/resources', { params: { courseId } })
    const data = unwrap(res)
    return data.resources || []
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

const slice = createSlice({
  name: 'resources',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchResources.fulfilled, (s, a) => { s.loading = false; s.list = a.payload })
      .addCase(fetchResources.rejected, (s, a) => { s.loading = false; s.error = a.payload })
  },
})

export default slice.reducer
