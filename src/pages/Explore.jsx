import React, { useState, useEffect } from 'react';
import { Container, CircularProgress, Box, Typography } from '@mui/material';
import PostCard from '../components/PostCard';
import api from '../services/api';
import { socket } from '../services/socket';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExplorePosts();

    socket.on('postUpdated', (updatedPost) => {
      setPosts((prevPosts) => prevPosts.map(p => p._id === updatedPost._id ? updatedPost : p));
    });

    socket.on('postDeleted', (deletedPostId) => {
      setPosts((prevPosts) => prevPosts.filter(p => p._id !== deletedPostId));
    });

    return () => {
      socket.off('postUpdated');
      socket.off('postDeleted');
    };
  }, []);

  const fetchExplorePosts = async () => {
    try {
      const res = await api.get('/posts/explore');
      setPosts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
     try {
       await api.delete(`/posts/${postId}`);
     } catch (err) {
       console.error(err);
     }
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, background: 'linear-gradient(45deg, #FF3366 30%, #FF9933 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Explore Trending
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : posts.length === 0 ? (
        <Typography textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
          No trending posts right now.
        </Typography>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} onDeletePost={handleDeletePost} />
        ))
      )}
    </Container>
  );
};

export default Explore;
