import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, Alert } from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await api.post('/auth/register', formData);
        if(response.data) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
            window.location.href = '/'; 
        }
    } catch (err) {
        setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper elevation={0} sx={{ p: 5, borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="900" sx={{ background: 'linear-gradient(45deg, #FF3366 30%, #FF9933 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 4, cursor: 'pointer' }} onClick={() => navigate('/')}>
          TaskPlanetFeed
        </Typography>
        <Typography variant="h6" align="center" sx={{ mb: 3, fontWeight: 'bold', color: 'text.secondary' }}>Create an Account</Typography>
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField required fullWidth label="Username" name="username" autoFocus value={formData.username} onChange={handleChange} InputProps={{ sx: { borderRadius: 3 } }} />
          <TextField required fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} InputProps={{ sx: { borderRadius: 3 } }} />
          <TextField required fullWidth name="password" label="Password" type="password" value={formData.password} onChange={handleChange} InputProps={{ sx: { borderRadius: 3 } }} />
          <Button type="submit" fullWidth variant="contained" disableElevation sx={{ mt: 2, mb: 1, py: 1.5, borderRadius: '24px', background: 'linear-gradient(45deg, #FF3366 30%, #FF9933 90%)', fontWeight: 'bold', fontSize: '1rem', color: 'white' }}>
            Sign Up
          </Button>
          <Button fullWidth variant="text" onClick={() => navigate('/login')} sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            Already have an account? Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Signup;
