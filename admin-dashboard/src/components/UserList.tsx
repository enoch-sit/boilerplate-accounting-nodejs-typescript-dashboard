import { useState, useEffect } from 'react'
import { Table, Button, Icon, Loader, Message } from 'semantic-ui-react'
import { User } from '../types'

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
    return <Loader active inline="centered">Loading Users...</Loader>
  }

  if (error) {
    return <Message negative>
      <Message.Header>Error</Message.Header>
      <p>{error}</p>
      <Button onClick={fetchUsers}>Try Again</Button>
    </Message>
  }

  return (
    <div>
      <h2>User Management</h2>
      <Button primary icon labelPosition="left" onClick={fetchUsers}>
        <Icon name="refresh" />
        Refresh
      </Button>

      {users.length === 0 ? (
        <Message info>
          <Message.Header>No Users Found</Message.Header>
          <p>There are no users to display.</p>
        </Message>
      ) : (
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Username</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Role</Table.HeaderCell>
              <Table.HeaderCell>Verified</Table.HeaderCell>
              <Table.HeaderCell>Created At</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {users.map(user => (
              <Table.Row key={user._id}>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  <select 
                    value={user.role || 'enduser'} 
                    onChange={(e) => user._id && handleUpdateRole(user._id, e.target.value)}
                  >
                    <option value="enduser">End User</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="admin">Admin</option>
                  </select>
                </Table.Cell>
                <Table.Cell>
                  {user.isVerified ? (
                    <Icon name="check" color="green" />
                  ) : (
                    <Icon name="close" color="red" />
                  )}
                </Table.Cell>
                <Table.Cell>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </Table.Cell>
                <Table.Cell>
                  <Button 
                    icon 
                    color="red" 
                    size="tiny"
                    onClick={() => user._id && handleDeleteUser(user._id)}
                  >
                    <Icon name="trash" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  )
}

export default UserList