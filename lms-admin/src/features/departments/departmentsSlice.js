import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axiosInstance'

export const fetchDepartments = createAsyncThunk('departments/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/departments')
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const createDepartment = createAsyncThunk('departments/create', async (payload, { rejectWithValue }) => {
  try {
    const res = await axios.post('/departments', payload)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

const slice = createSlice({
  name: 'departments',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(fetchDepartments.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchDepartments.fulfilled, (s, a) => { s.loading = false; s.list = a.payload })
      .addCase(fetchDepartments.rejected, (s, a) => { s.loading = false; s.error = a.payload })

      .addCase(createDepartment.pending, (s) => { s.loading = true })
      .addCase(createDepartment.fulfilled, (s, a) => { s.loading = false; s.list.push(a.payload) })
      .addCase(createDepartment.rejected, (s, a) => { s.loading = false; s.error = a.payload })
  }
})

export default slice.reducer
