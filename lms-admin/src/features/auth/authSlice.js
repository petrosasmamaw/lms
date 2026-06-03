import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authClient } from '../../lib/authClient'
import axios from '../../api/axiosInstance'
import { unwrap } from '../../api/unwrap'

export const signupAdmin = createAsyncThunk('auth/signup', async (payload, { rejectWithValue }) => {
  try {
    const res = await axios.post('/auth/signup-admin', {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    })
    const data = unwrap(res)
    return data.user
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message })
  }
})

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { error } = await authClient.signIn.email({
      email: payload.email,
      password: payload.password,
    })
    if (error) {
      return rejectWithValue({ message: error.message || 'Login failed' })
    }
    const me = await axios.get('/users/me')
    return me.data.user
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message })
  }
})

export const fetchSession = createAsyncThunk('auth/session', async () => {
  try {
    const { data: session } = await authClient.getSession()
    if (!session?.user) return null
    const me = await axios.get('/users/me')
    return me.data.user
  } catch {
    return null
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  await authClient.signOut()
})

const slice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null, message: null },
  reducers: {
    clearAuthMessage(state) {
      state.message = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupAdmin.pending, (s) => { s.loading = true; s.error = null })
      .addCase(signupAdmin.fulfilled, (s) => { s.loading = false; s.message = 'Account created. Please log in.' })
      .addCase(signupAdmin.rejected, (s, a) => { s.loading = false; s.error = a.payload })

      .addCase(login.pending, (s) => { s.loading = true; s.error = null })
      .addCase(login.fulfilled, (s, a) => { s.loading = false; s.user = a.payload })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload })

      .addCase(fetchSession.pending, (s) => { s.loading = true })
      .addCase(fetchSession.fulfilled, (s, a) => { s.loading = false; s.user = a.payload })
      .addCase(fetchSession.rejected, (s) => { s.loading = false; s.user = null })

      .addCase(logout.fulfilled, (s) => { s.user = null; s.error = null })
  },
})

export const { clearAuthMessage } = slice.actions
export default slice.reducer
