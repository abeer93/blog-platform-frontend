import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography } from '@mui/material';
import { StyledContainer, StyledForm } from '../shared/styledComponents';
import { userRegister } from '../../services/api';

interface RegisterProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Register: React.FC<RegisterProps> = ({ setIsLoggedIn }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await userRegister({ name, email, password });

      if (response && response.status === 201) {
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
        }, 43200000); // expire after 12 hour

        navigate('/');
      } else {
        console.error('Registration failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <StyledContainer>
      <Typography variant="h4" component="h1" gutterBottom>
        Register
      </Typography>
      <StyledForm
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
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
          Register
        </Button>
      </StyledForm>
    </StyledContainer>
  );
};

export default Register;
