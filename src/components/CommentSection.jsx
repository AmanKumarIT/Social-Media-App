import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Avatar, Divider, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import api from '../services/api';

const CommentSection = ({ post }) => {
  const [text, setText] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await api.post(`/posts/${post._id}/comment`, { text });
      setText('');
      // update via socket natively
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
        await api.delete(`/posts/${post._id}/comment/${commentId}`);
    } catch(err) {
        console.error(err);
    }
  };

  return (
    <Box sx={{ mt: 2, pt: 2 }}>
      <Box component="form" onSubmit={handleComment} sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
        <Avatar src={user?.profilePicture} sx={{ width: 36, height: 36, mr: 1, bgcolor: '#FF3366', boxShadow: 1 }}>
            {user?.username?.charAt(0).toUpperCase()}
        </Avatar>
        <TextField
          fullWidth
          size="small"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ mr: 1, backgroundColor: 'white', borderRadius: 4, '& fieldset': { border: 'none' }, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
        />
        <Button type="submit" variant="contained" disableElevation disabled={!text.trim()} sx={{ borderRadius: 20, py: 1 }}>
          Post
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, maxHeight: '350px', overflowY: 'auto', pr: 1 }}>
        {post.comments && [...post.comments].reverse().map((comment, index) => {
          const isCommentOwner = user?._id === comment.userId?._id || user?._id === post.userId?._id;
          return (
            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Avatar src={comment.userId?.profilePicture} sx={{ width: 32, height: 32, mr: 1.5, bgcolor: '#33ccff', boxShadow: 1 }}>
                {comment.userId?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ backgroundColor: 'white', p: 1.5, px: 2, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'inline-block', position: 'relative', width: 'auto', maxWidth: '80%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    {comment.userId?.username}
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-word', mt: 0.5, color: '#444' }}>
                    {comment.text}
                </Typography>
                </Box>
                {isCommentOwner && (
                    <IconButton size="small" color="error" onClick={() => handleDeleteComment(comment._id)} sx={{ ml: 1, opacity: 0.5, '&:hover': { opacity: 1 }, mt: 1 }}>
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default CommentSection;
