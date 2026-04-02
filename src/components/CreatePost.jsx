import React, { useState } from 'react';
import { Paper, TextField, Button, Box, IconButton, CircularProgress, Avatar } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SendIcon from '@mui/icons-material/Send';
import api from '../services/api';

const CreatePost = () => {
  const [text, setText] = useState('');
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text && !imageBase64) return;

    setLoading(true);

    try {
      await api.post('/posts', {
        text,
        image: imageBase64
      });
      setText('');
      setImageBase64(null);
      
      const fileInput = document.getElementById('image-upload');
      if(fileInput) fileInput.value = '';
    } catch (error) {
      console.error(error);
      alert('Failed to create post. ' + (error.response?.data?.error || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 2.5, mb: 4, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Avatar src={user?.profilePicture} sx={{ width: 48, height: 48, mr: 2, bgcolor: '#FF9933', boxShadow: 1 }}>
                {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <TextField
            fullWidth
            multiline
            minRows={2}
            variant="standard"
            placeholder="What's happening?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            InputProps={{ disableUnderline: true, sx: { fontSize: '1.2rem', mt: 1 } }}
            sx={{ mb: 1 }}
            />
        </Box>
        
        {imageBase64 && (
          <Box sx={{ mb: 2, ml: 8, position: 'relative', display: 'inline-block' }}>
            <img src={imageBase64} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Button size="small" variant="contained" color="inherit" sx={{ position: 'absolute', top: 8, right: 8, minWidth: '32px', p: 0, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': {bgcolor:'rgba(0,0,0,0.7)'} }} onClick={() => setImageBase64(null)}>X</Button>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ml: 8, pt: 1 }}>
          <IconButton color="primary" component="label" sx={{ bgcolor: 'rgba(255,51,102,0.1)', '&:hover': { bgcolor: 'rgba(255,51,102,0.2)' } }}>
            <input id="image-upload" hidden accept="image/*" type="file" onChange={handleImageChange} />
            <PhotoCameraIcon />
          </IconButton>
          <Button type="submit" variant="contained" endIcon={<SendIcon />} disableElevation disabled={loading || (!text && !imageBase64)} sx={{ borderRadius: '24px', textTransform: 'none', px: 4, py: 1, background: 'linear-gradient(45deg, #FF3366 30%, #FF9933 90%)', color: 'white' }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Post'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CreatePost;
