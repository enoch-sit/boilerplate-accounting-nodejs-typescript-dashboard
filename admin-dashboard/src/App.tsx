import { useState, useEffect } from 'react'
import { Container, Header, Segment, Menu, Grid, Message } from 'semantic-ui-react'
import './App.css'
import UserList from './components/UserList.tsx'
import AddUserForm from './components/AddUserForm.tsx'
import BatchUserUpload from './components/BatchUserUpload.tsx'
import Login from './components/Login.tsx'
import AuthService from './services/authService.ts'

function App() {
  const [activeItem, setActiveItem] = useState<string>('userList')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuthStatus = () => {
      const authenticated = AuthService.isAuthenticated()
      setIsAuthenticated(authenticated)
      setIsLoading(false)
    }
    
    checkAuthStatus()
  }, [])

  const handleItemClick = (name: string) => {
    setActiveItem(name)
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    AuthService.logout()
      .then(() => {
        setIsAuthenticated(false)
      })
      .catch(error => {
        console.error('Logout failed:', error)
        // Still clear local state even if API call fails
        setIsAuthenticated(false)
      })
  }

  if (isLoading) {
    return (
      <Container style={{ marginTop: '2rem' }}>
        <Message info>
          <Message.Header>Loading application...</Message.Header>
        </Message>
      </Container>
    )
  }

  // Render login page if user is not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  // Render dashboard if user is authenticated
  return (
    <Container style={{ marginTop: '2rem' }}>
      <Header as='h1' dividing>
        Admin Dashboard
      </Header>
      
      <Menu pointing secondary>
        <Menu.Item
          name='User List'
          active={activeItem === 'userList'}
          onClick={() => handleItemClick('userList')}
        />
        <Menu.Item
          name='Add User'
          active={activeItem === 'addUser'}
          onClick={() => handleItemClick('addUser')}
        />
        <Menu.Item
          name='Batch Upload'
          active={activeItem === 'batchUpload'}
          onClick={() => handleItemClick('batchUpload')}
        />
        <Menu.Menu position='right'>
          <Menu.Item
            name='Logout'
            onClick={handleLogout}
          />
        </Menu.Menu>
      </Menu>

      <Segment>
        {activeItem === 'userList' && <UserList />}
        {activeItem === 'addUser' && <AddUserForm />}
        {activeItem === 'batchUpload' && <BatchUserUpload />}
      </Segment>
    </Container>
  )
}

export default App
