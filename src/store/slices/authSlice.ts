import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  user: {
    id: string
    email: string
    name: string
  } | null
}

const getInitialState = (): AuthState => {
  const token = localStorage.getItem('token')
  return {
    isAuthenticated: !!token,
    token,
    user: null,
  }
}

const initialState: AuthState = getInitialState()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; user: { id: string; email: string; name: string } }>) => {
      state.isAuthenticated = true
      state.token = action.payload.token
      state.user = action.payload.user
      localStorage.setItem('token', action.payload.token)
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.token = null
      state.user = null
      localStorage.removeItem('token')
    },
    setUser: (state, action: PayloadAction<{ id: string; email: string; name: string }>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
  },
})

export const { login, logout, setUser } = authSlice.actions
export default authSlice.reducer

