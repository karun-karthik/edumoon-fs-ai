import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Title, TextInput, PasswordInput, Button, Text, Anchor, Stack, Alert } from '@mantine/core';
import api from './api';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { username, password });
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('username', res.data.data.username);
        navigate('/');
      } else {
        await api.post('/auth/register', { username, password });
        alert('Registered successfully! Please log in.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900}>
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </Title>
      
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        {isLogin ? "Don't have an account yet? " : "Already have an account? "}
        <Anchor size="sm" component="button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Register' : 'Login'}
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {error && (
          <Alert color="red" mb="md" variant="light">
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Username"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button fullWidth mt="xl" type="submit">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default Auth;
