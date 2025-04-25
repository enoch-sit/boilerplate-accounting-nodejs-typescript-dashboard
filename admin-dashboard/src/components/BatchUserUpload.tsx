import { useState } from 'react'
import { Form, Message, Table, Checkbox, Segment } from 'semantic-ui-react'
import { BatchUserRequest, BatchCreationResponse, BatchUserResponse } from '../types'
import './CustomButtons.css'

const BatchUserUpload = () => {
  const [users, setUsers] = useState<BatchUserRequest[]>([])
  const [csvInput, setCsvInput] = useState<string>('')
  const [skipVerification, setSkipVerification] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<BatchUserResponse[] | null>(null)
  const [summary, setSummary] = useState<{
    total: number;
    successful: number;
    failed: number;
  } | null>(null)

  const handleCsvChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCsvInput(e.target.value)
    
    try {
      // Parse CSV input (username,email,role)
      const lines = e.target.value.trim().split('\n')
      const parsedUsers: BatchUserRequest[] = lines
        .filter(line => line.trim()) // Skip empty lines
        .map(line => {
          const [username, email, role] = line.split(',').map(item => item.trim())
          
          if (!username || !email) {
            throw new Error('Each line must contain at least username and email separated by commas')
          }
          
          return { username, email, role: role || 'enduser' }
        })
      
      setUsers(parsedUsers)
      setError(null)
    } catch (err) {
      setError(`Invalid CSV format: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setUsers([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (users.length === 0) {
      setError('Please add at least one user')
      return
    }
    
    setLoading(true)
    setError(null)
    setResults(null)
    setSummary(null)
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:3000/api/admin/users/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          users,
          skipVerification
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to create users: ${response.statusText}`)
      }
      
      const data: BatchCreationResponse = await response.json()
      setResults(data.results)
      setSummary(data.summary)
      
      // Clear form if all successful
      if (data.summary.failed === 0) {
        setCsvInput('')
        setUsers([])
      }
    } catch (err) {
      setError(`Error creating users: ${err instanceof Error ? err.message : 'Unknown error'}`)
      console.error('Error creating users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClearForm = () => {
    setCsvInput('')
    setUsers([])
    setError(null)
    setResults(null)
    setSummary(null)
  }

  return (
    <div>
      <h2>Batch User Upload</h2>
      <p>
        Enter user details in CSV format, one user per line: <br />
        <code>username,email,role</code> (role is optional, defaults to "enduser")
      </p>
      
      {error && (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
        </Message>
      )}
      
      {summary && (
        <Message positive={summary.failed === 0} warning={summary.failed > 0}>
          <Message.Header>Upload Results</Message.Header>
          <p>
            {summary.successful} of {summary.total} users created successfully.
            {summary.failed > 0 && ` ${summary.failed} failed.`}
          </p>
        </Message>
      )}
      
      <Form onSubmit={handleSubmit} loading={loading}>
        <Form.TextArea
          label="Users CSV"
          placeholder="username1,email1@example.com,enduser&#10;username2,email2@example.com,supervisor"
          value={csvInput}
          onChange={handleCsvChange}
          rows={10}
        />
        
        <Form.Field>
          <Checkbox
            label="Skip email verification"
            checked={skipVerification}
            onChange={() => setSkipVerification(!skipVerification)}
          />
        </Form.Field>
        
        <div className="button-group">
          <button 
            type="submit" 
            className="custom-button primary" 
            disabled={loading || users.length === 0}
          >
            Upload Users
          </button>
          <button 
            type="button" 
            className="custom-button" 
            onClick={handleClearForm} 
            disabled={loading}
          >
            Clear
          </button>
        </div>
      </Form>
      
      {users.length > 0 && (
        <Segment style={{ marginTop: '2rem' }}>
          <h3>Preview ({users.length} users)</h3>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>#</Table.HeaderCell>
                <Table.HeaderCell>Username</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Role</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            
            <Table.Body>
              {users.map((user, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.role || 'enduser'}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Segment>
      )}
      
      {results && (
        <Segment style={{ marginTop: '2rem' }}>
          <h3>Upload Results</h3>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>#</Table.HeaderCell>
                <Table.HeaderCell>Username</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Message</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            
            <Table.Body>
              {results.map((result, index) => (
                <Table.Row key={index} positive={result.success} negative={!result.success}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{result.username}</Table.Cell>
                  <Table.Cell>{result.email}</Table.Cell>
                  <Table.Cell>{result.success ? 'Success' : 'Failed'}</Table.Cell>
                  <Table.Cell>{result.message}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Segment>
      )}
    </div>
  )
}

export default BatchUserUpload