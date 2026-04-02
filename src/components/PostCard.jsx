import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardActions, CardMedia, Avatar, Typography, IconButton, Box, Button, Menu, MenuItem, Collapse } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CommentSection from './CommentSection';
import api from '../services/api';

const PostCard = ({ post, onDeletePost }) => {
  const [showComments, setShowComments] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();
  
  const isOwner = currentUser?._id === post.userId?._id;

  const handleLike = async () => {
    try {
      await api.post(`/posts/${post._id}/like`);
      // UI update via socket
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollow = async () => {
    if (isOwner) return;
    try {
      const res = await api.post(`/users/${post.userId._id}/follow`);
      const updatedUser = res.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('followStateChanged'));
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
     setIsFollowing(currentUser?.following?.includes(post.userId?._id) || false);
  }, [post, currentUser]);

  React.useEffect(() => {
     const handleSync = () => setCurrentUser(JSON.parse(localStorage.getItem('user')));
     window.addEventListener('followStateChanged', handleSync);
     return () => window.removeEventListener('followStateChanged', handleSync);
  }, []);

  const handleDeleteClick = () => {
    setAnchorEl(null);
    if(onDeletePost) onDeletePost(post._id);
  };

  const isLiked = post.likes.includes(currentUser?._id);

  return (
    <Card sx={{ mb: 4, borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.06)', overflow: 'visible', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
      <CardHeader
        avatar={
          <Avatar 
             onClick={() => navigate(`/profile/${post.userId?._id}`)} 
             src={post.userId?.profilePicture} 
             sx={{ bgcolor: '#FF3366', width: 48, height: 48, cursor: 'pointer' }}
          >
            {post.userId?.username?.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {!isOwner && (
                <Button size="small" variant={isFollowing ? "outlined" : "contained"} onClick={handleFollow} sx={{ mr: 1, borderRadius: 20, py: 0.2 }}>
                    {isFollowing ? 'Following' : 'Follow'}
                </Button>
            )}
            {isOwner && (
                <React.Fragment>
                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                        <MoreVertIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main', fontWeight: 'bold' }}>Delete Post</MenuItem>
                    </Menu>
                </React.Fragment>
            )}
          </Box>
        }
        title={<Box component="span" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => navigate(`/profile/${post.userId?._id}`)}>{post.userId?.username}</Box>}
        subheader={new Date(post.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short'})}
        titleTypographyProps={{ fontWeight: 800, fontSize: '1.1rem' }}
      />
      
      {post.text && (
        <CardContent sx={{ pt: 0, pb: 1 }}>
          <Typography variant="body1" color="text.primary" sx={{ whiteSpace: 'pre-wrap', fontSize: '1.05rem', lineHeight: 1.6 }}>
            {post.text}
          </Typography>
        </CardContent>
      )}

      {post.image && (
        <Box sx={{ px: 2, pb: 2 }}>
            <CardMedia
            component="img"
            image={post.image}
            alt="Post image"
            sx={{ maxHeight: 600, objectFit: 'cover', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
        </Box>
      )}

      <CardActions disableSpacing sx={{ px: 3, py: 1.5, borderTop: '1px solid rgba(0,0,0,0.04)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
          <IconButton onClick={handleLike} color={isLiked ? "primary" : "default"} sx={{ ml: -1, p: 1, backgroundColor: isLiked ? 'rgba(255,51,102,0.1)' : 'transparent', '&:hover': { backgroundColor: 'rgba(255,51,102,0.1)' } }}>
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2" sx={{ fontWeight: 800, ml: 0.5, color: isLiked ? 'primary.main' : 'text.secondary' }}>
            {post.likes.length}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', transition: 'opacity 0.2s', '&:hover': { opacity: 0.7 } }} onClick={() => setShowComments(!showComments)}>
          <IconButton color="default" sx={{ p: 1 }} disableRipple>
            <ChatBubbleOutlineIcon />
          </IconButton>
          <Typography variant="body2" sx={{ fontWeight: 800, ml: 0.5, color: 'text.secondary' }}>
            {post.comments.length}
          </Typography>
        </Box>
      </CardActions>

      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <Box sx={{ px: 3, pb: 2, backgroundColor: 'rgba(0,0,0,0.01)', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
          <CommentSection post={post} />
        </Box>
      </Collapse>
    </Card>
  );
};

export default PostCard;
