import { useAppSelector } from '../store/hooks'
import './Profile.css'

export default function Profile() {
  const { user } = useAppSelector((state) => state.auth)

  return (
    <div className="profile">
      <h1>Profile</h1>
      {user && (
        <div className="profile-info">
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
        </div>
      )}
    </div>
  )
}

