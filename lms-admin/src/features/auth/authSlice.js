import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axiosInstance'

export const signupAdmin = createAsyncThunk('auth/signup', async (payload, { rejectWithValue }) => {
  try {
    const res = await axios.post('/auth/signup-admin', payload)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const res = await axios.post('/auth/signin', payload)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const fetchSession = createAsyncThunk('auth/session', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/auth/session')
    return res.data
  } catch (err) {
    return rejectWithValue(null)
  }
})

const slice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null },
  reducers: {
    logoutLocal(state) {
      state.user = null
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupAdmin.pending, (s) => { s.loading = true; s.error = null })
      .addCase(signupAdmin.fulfilled, (s) => { s.loading = false })
      .addCase(signupAdmin.rejected, (s, a) => { s.loading = false; s.error = a.payload })

      .addCase(login.pending, (s) => { s.loading = true; s.error = null })
      .addCase(login.fulfilled, (s, a) => { s.loading = false; s.user = a.payload })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload })

      .addCase(fetchSession.fulfilled, (s, a) => { s.user = a.payload })
  }
})

export const { logoutLocal } = slice.actions
export default slice.reducer
