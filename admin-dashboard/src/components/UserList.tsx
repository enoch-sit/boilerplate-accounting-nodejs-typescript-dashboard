import { useState, useEffect } from 'react'
import { Icon, Message, Loader } from 'semantic-ui-react'
import { User } from '../types'
import './CustomButtons.css'

const UserList = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:3000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`)
      }
      
      const data = await response.json()
      setUsers(data.users || [])
      setError(null)
    } catch (err) {
      setError(`Error fetching users: ${err instanceof Error ? err.message : 'Unknown error'}`)
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      // Replace with your actual API endpoint
      const response = await fetch(`http://localhost:3000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`)
      }

      // Remove the deleted user from the list
      setUsers(users.filter(user => user._id !== userId))
    } catch (err) {
      setError(`Error deleting user: ${err instanceof Error ? err.message : 'Unknown error'}`)
      console.error('Error deleting user:', err)
    }
  }

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`http://localhost:3000/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ role: newRole })
      })

      if (!response.ok) {
        throw new Error(`Failed to update role: ${response.statusText}`)
      }

      const updatedUser = await response.json()
      
      // Update the user in the list
      setUsers(users.map(user => 
        user._id === userId ? { ...user, ...updatedUser.user } : user
      ))
    } catch (err) {
      setError(`Error updating role: ${err instanceof Error ? err.message : 'Unknown error'}`)
      console.error('Error updating role:', err)
    }
  }

  if (loading) {
    return (
      <div className="custom-loader-container">
        <div className="custom-loader"></div>
        <p>Loading Users...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="custom-message negative">
        <div className="custom-message-header">Error</div>
        <p>{error}</p>
        <button className="custom-button primary" onClick={fetchUsers}>Try Again</button>
      </div>
    )
  }

  return (
    <div>
      <h2>User Management</h2>
      <button className="custom-button primary" onClick={fetchUsers}>
        <Icon name="refresh" className="button-icon" />
        Refresh
      </button>

      {users.length === 0 ? (
        <div className="custom-message info">
          <div className="custom-message-header">No Users Found</div>
          <p>There are no users to display.</p>
        </div>
      ) : (
        <table className="custom-table celled striped">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Verified</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <select 
                    className="custom-select"
                    value={user.role || 'enduser'} 
                    onChange={(e) => user._id && handleUpdateRole(user._id, e.target.value)}
                  >
                    <option value="enduser">End User</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  {user.isVerified ? (
                    <Icon name="check" className="icon-green" />
                  ) : (
                    <Icon name="close" className="icon-red" />
                  )}
                </td>
                <td>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td>
                  <button 
                    className="custom-button red small icon-only-button"
                    onClick={() => user._id && handleDeleteUser(user._id)}
                  >
                    <Icon name="trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default UserList