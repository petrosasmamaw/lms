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

export const deleteResource = createAsyncThunk('resources/delete', async (resourceId, { rejectWithValue }) => {
  try {
    await axios.delete(`/resources/${resourceId}`)
    return resourceId
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

const slice = createSlice({
  name: 'resources',
  initialState: { list: [], loading: false, error: null, message: null },
  reducers: {
    clearMessage: (s) => { s.message = null },
    clearError: (s) => { s.error = null },
  },
  extraReducers: (b) => {
    b
      .addCase(fetchResources.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchResources.fulfilled, (s, a) => { s.loading = false; s.list = a.payload })
      .addCase(fetchResources.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(uploadResource.pending, (s) => { s.loading = true; s.error = null; s.message = null })
      .addCase(uploadResource.fulfilled, (s, a) => { s.loading = false; s.list.unshift(a.payload); s.message = 'Resource uploaded successfully'; s.error = null })
      .addCase(uploadResource.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || a.payload || 'Upload failed'; s.message = null })
      .addCase(deleteResource.pending, (s) => { s.loading = true; s.error = null })
      .addCase(deleteResource.fulfilled, (s, a) => { s.loading = false; s.list = s.list.filter(r => r.id !== a.payload); s.message = 'Resource deleted successfully' })
      .addCase(deleteResource.rejected, (s, a) => { s.loading = false; s.error = a.payload })
  },
})

export const { clearMessage, clearError } = slice.actions

export default slice.reducer
