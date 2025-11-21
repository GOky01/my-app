import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { setUser, logout } from './store/slices/authSlice'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Items from './pages/Items'
import Profile from './pages/Profile'
import './App.css'

function App() {
  const dispatch = useAppDispatch()
  const { token } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (token) {
      fetchUser().catch(() => {
        dispatch(logout())
      })
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const user = await response.json()
        dispatch(setUser(user))
      }
    } catch (err) {
      console.error('Failed to fetch user:', err)
    }
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/items"
            element={
              <ProtectedRoute>
                <Items />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
