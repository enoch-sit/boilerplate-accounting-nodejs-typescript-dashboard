import { useState } from 'react'
import { Form, Message, Checkbox } from 'semantic-ui-react'
import { ApiResponse, User } from '../types'
import './CustomButtons.css'

const AddUserForm = () => {
  const [user, setUser] = useState<Partial<User>>({
    username: '',
    email: '',
    password: '',
    role: 'enduser'
  })
  const [skipVerification, setSkipVerification] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const roleOptions = [
    { key: 'enduser', text: 'End User', value: 'enduser' },
    { key: 'supervisor', text: 'Supervisor', value: 'supervisor' },
    { key: 'admin', text: 'Admin', value: 'admin' }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:3000/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          ...user,
          skipVerification
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to create user: ${response.statusText}`)
      }

      const data: ApiResponse = await response.json()
      setSuccess(data.message || 'User created successfully')
      
      // Reset the form
      setUser({
        username: '',
        email: '',
        password: '',
        role: 'enduser'
      })
    } catch (err) {
      setError(`Error creating user: ${err instanceof Error ? err.message : 'Unknown error'}`)
      console.error('Error creating user:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Add New User</h2>
      
      {error && (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
        </Message>
      )}
      
      {success && (
        <Message positive>
          <Message.Header>Success!</Message.Header>
          <p>{success}</p>
        </Message>
      )}
      
      <Form onSubmit={handleSubmit} loading={loading}>
        <Form.Field required>
          <label>Username</label>
          <input
            name="username"
            value={user.username}
            onChange={handleChange}
            placeholder="Enter username"
            required
          />
        </Form.Field>
        
        <Form.Field required>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </Form.Field>
        
        <Form.Field required>
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={user.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </Form.Field>
        
        <Form.Field required>
          <label>Role</label>
          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            className="custom-dropdown"
          >
            {roleOptions.map(option => (
              <option key={option.key} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        </Form.Field>
        
        <Form.Field>
          <Checkbox
            label="Skip email verification"
            checked={skipVerification}
            onChange={() => setSkipVerification(!skipVerification)}
          />
        </Form.Field>
        
        <button type="submit" className="custom-button primary" disabled={loading}>
          Create User
        </button>
      </Form>
    </div>
  )
}

export default AddUserForm