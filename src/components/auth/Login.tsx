import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography } from '@mui/material';
import { StyledContainer, StyledForm } from '../shared/styledComponents';
import { userLogin } from '../../services/api';

interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await userLogin({ email, password });

      if (response && response.status === 200) {
        const result = response.data.data;
        
        setIsLoggedIn(true);
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.userId);
        localStorage.setItem('isAdmin', result.isAdmin);

        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.setItem('isAdmin', result.isAdmin);
          setIsLoggedIn(false);
          navigate('/login');
        }, 3600000);

        navigate('/');
      } else {
        console.error('Login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <StyledContainer>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <StyledForm
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
        <Typography variant="body1" component="p" style={{ marginTop: '1rem', textAlign: 'center' }}>
          Don't have an account? <Link to="/register">Register</Link>
        </Typography>
      </StyledForm>
    </StyledContainer>
  );
};

export default Login;
