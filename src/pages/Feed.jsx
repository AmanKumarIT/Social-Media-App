import React, { useState, useEffect } from 'react';
import { Container, CircularProgress, Box, Typography } from '@mui/material';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import api from '../services/api';
import { socket } from '../services/socket';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();

    socket.on('postCreated', (newPost) => {
      setPosts((prevPosts) => {
        if(prevPosts.find(p => p._id === newPost._id)) return prevPosts;
        return [newPost, ...prevPosts];
      });
    });

    socket.on('postUpdated', (updatedPost) => {
      setPosts((prevPosts) => prevPosts.map(p => p._id === updatedPost._id ? updatedPost : p));
    });

    socket.on('postDeleted', (deletedPostId) => {
      setPosts((prevPosts) => prevPosts.filter(p => p._id !== deletedPostId));
    });

    return () => {
      socket.off('postCreated');
      socket.off('postUpdated');
      socket.off('postDeleted');
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
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
      <CreatePost onPostCreated={() => {}} />
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : posts.length === 0 ? (
        <Typography textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
          No posts in the feed yet. Create one!
        </Typography>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} onDeletePost={handleDeletePost} />
        ))
      )}
    </Container>
  );
};

export default Feed;
