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

export const uploadResource = createAsyncThunk('resources/upload', async ({ courseId, title, type, file }, { rejectWithValue }) => {
  try {
    const form = new FormData()
    form.append('courseId', courseId)
    form.append('title', title)
    form.append('type', type)
    form.append('file', file)
    const res = await axios.post('/resources', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    const data = unwrap(res)
    return data.resource
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

const slice = createSlice({
  name: 'resources',
  initialState: { list: [], loading: false, error: null, message: null },
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(fetchResources.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchResources.fulfilled, (s, a) => { s.loading = false; s.list = a.payload })
      .addCase(fetchResources.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(uploadResource.fulfilled, (s, a) => { s.list.unshift(a.payload); s.message = 'Resource uploaded' })
  },
})

export default slice.reducer
