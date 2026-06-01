import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axiosInstance'

export const fetchResources = createAsyncThunk('resources/fetch', async (courseId, { rejectWithValue }) => {
  try {
    const res = await axios.get(`/resources?courseId=${courseId}`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const uploadResource = createAsyncThunk('resources/upload', async ({ courseId, formData, onUploadProgress }, { rejectWithValue }) => {
  try {
    const res = await axios.post('/resources', formData, { headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

const slice = createSlice({
  name: 'resources',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(fetchResources.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchResources.fulfilled, (s, a) => { s.loading = false; s.list = a.payload })
      .addCase(fetchResources.rejected, (s, a) => { s.loading = false; s.error = a.payload })

      .addCase(uploadResource.pending, (s) => { s.loading = true })
      .addCase(uploadResource.fulfilled, (s, a) => { s.loading = false; s.list.push(a.payload) })
      .addCase(uploadResource.rejected, (s, a) => { s.loading = false; s.error = a.payload })
  }
})

export default slice.reducer
