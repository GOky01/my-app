import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import './Home.css'

export default function Home() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="home">
      <h1>Welcome Home</h1>
      <p>This is the home page.</p>
    </div>
  )
}

