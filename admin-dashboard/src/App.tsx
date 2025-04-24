import { useState, useEffect } from 'react'
import { Container, Header, Segment, Menu, Grid } from 'semantic-ui-react'
import './App.css'
import UserList from './components/UserList.tsx'
import AddUserForm from './components/AddUserForm.tsx'
import BatchUserUpload from './components/BatchUserUpload.tsx'

function App() {
  const [activeItem, setActiveItem] = useState<string>('userList')

  const handleItemClick = (name: string) => {
    setActiveItem(name)
  }

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
