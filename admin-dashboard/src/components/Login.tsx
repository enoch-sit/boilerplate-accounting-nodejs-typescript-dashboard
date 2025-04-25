import { useState } from 'react';
import { Form, Message, Container, Header, Segment, Input, Icon } from 'semantic-ui-react';
import AuthService from '../services/authService';
import './CustomButtons.css'; // Using the shared CSS file

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form
      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      // Call login API
      await AuthService.login({
        username,
        password
      });

      // Call success callback
      onLoginSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container text>
      <Segment padded="very">
        <Header as="h2" textAlign="center">
          Login to your Account
        </Header>
        
        {error && (
          <Message negative>
            <Message.Header>Login Failed</Message.Header>
            <p>{error}</p>
          </Message>
        )}
        
        <Form onSubmit={handleSubmit} loading={loading}>
          <Form.Field>
            <label>Username</label>
            <Input
              icon={<Icon name="user" />}
              iconPosition="left"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Field>
          
          <Form.Field>
            <label>Password</label>
            <Input
              icon={<Icon name="lock" />}
              iconPosition="left"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Field>
          
          <div style={{ textAlign: 'center' }}>
            <button 
              className="custom-button primary"
              type="submit" 
              disabled={loading}
            >
              Login
            </button>
          </div>
        </Form>
        
        <Message>
          <Message.Content>
            <p style={{ textAlign: 'center', marginTop: '10px' }}>
              Forgot your password? <a href="#reset-password">Reset it here</a>
            </p>
          </Message.Content>
        </Message>
      </Segment>
    </Container>
  );
};

export default Login;