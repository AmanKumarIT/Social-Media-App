import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Avatar, Paper, CircularProgress, IconButton } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import api from '../services/api';

const Settings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ username: '', bio: '' });
  const [imageBase64, setImageBase64] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      setProfile(res.data);
      setFormData({ username: res.data.username || '', bio: res.data.bio || '' });
      setImageBase64(res.data.profilePicture || '');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/users/profile', {
        ...formData,
        profilePicture: imageBase64
      });
      setProfile(res.data);
      const currentUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...currentUser, ...res.data }));
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
       <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, background: 'linear-gradient(45deg, #33ccff 30%, #3366ff 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Profile Settings
      </Typography>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #eee' }}>
        <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar src={imageBase64} sx={{ width: 100, height: 100, boxShadow: 2, mr: 3 }}>
                {profile?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <IconButton color="primary" component="label" sx={{ position: 'absolute', bottom: -10, right: 10, bgcolor: 'white', boxShadow: 1, '&:hover': { bgcolor: '#f0f0f0' } }}>
                <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                <PhotoCameraIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box>
                <Typography variant="h6" fontWeight="bold">{profile?.username}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {profile?.followers?.length || 0} Followers &nbsp;&bull;&nbsp; {profile?.following?.length || 0} Following
                </Typography>
            </Box>
          </Box>

          <TextField 
            label="Username" 
            variant="outlined" 
            fullWidth 
            value={formData.username} 
            onChange={(e) => setFormData({...formData, username: e.target.value})} 
            InputProps={{ sx: { borderRadius: 3 } }}
          />
          
          <TextField 
            label="Bio" 
            variant="outlined" 
            multiline 
            rows={4} 
            fullWidth 
            value={formData.bio} 
            onChange={(e) => setFormData({...formData, bio: e.target.value})} 
            InputProps={{ sx: { borderRadius: 3 } }}
          />

          <Button type="submit" variant="contained" disabled={saving} disableElevation sx={{ py: 1.5, mt: 2 }}>
            {saving ? <CircularProgress size={24} /> : 'Save Profile'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings;
