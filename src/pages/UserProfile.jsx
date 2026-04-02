import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Avatar, Button, CircularProgress } from '@mui/material';
import api from '../services/api';
import { socket } from '../services/socket';
import PostCard from '../components/PostCard';

const UserProfile = () => {
    const { id } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')));
    const isOwner = currentUser?._id === id;
    
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        setIsFollowing(currentUser?.following?.includes(id) || false);
    }, [id, currentUser]);

    useEffect(() => {
        const handleFollowSync = () => {
            setCurrentUser(JSON.parse(localStorage.getItem('user')));
        };
        window.addEventListener('followStateChanged', handleFollowSync);
        return () => window.removeEventListener('followStateChanged', handleFollowSync);
    }, []);

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                const userRes = await api.get(`/users/${id}`);
                setProfileUser(userRes.data);
                const postsRes = await api.get(`/posts/user/${id}`);
                setPosts(postsRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [id]);

    useEffect(() => {
        const handleFollowUpdate = (data) => {
            if (data.userId === id) {
                setProfileUser(prev => prev ? { ...prev, followers: Array.from({ length: data.followersCount }) } : prev);
            }
        };
        socket.on('userFollowUpdated', handleFollowUpdate);
        return () => {
            socket.off('userFollowUpdated', handleFollowUpdate);
        }
    }, [id]);

    const handleFollowToggle = async () => {
        if (isOwner) return;
        try {
            const res = await api.post(`/users/${id}/follow`);
            const updatedCurrentUser = res.data;
            localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
            window.dispatchEvent(new Event('followStateChanged'));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
    if (!profileUser) return <Box mt={4} textAlign="center"><Typography>User not found</Typography></Box>;

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, p: 3, backgroundColor: 'white', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Avatar src={profileUser.profilePicture} sx={{ width: 100, height: 100, mr: 4, bgcolor: 'primary.main', fontSize: '3rem' }}>
                    {profileUser.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" fontWeight="bold">{profileUser.username}</Typography>
                    <Typography variant="subtitle1" color="text.secondary" mb={1}>{profileUser.bio || 'No bio yet'}</Typography>
                    <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                         <Typography variant="body2"><strong>{posts.length}</strong> posts</Typography>
                         <Typography variant="body2"><strong>{profileUser.followers?.length || 0}</strong> followers</Typography>
                         <Typography variant="body2"><strong>{profileUser.following?.length || 0}</strong> following</Typography>
                    </Box>
                    {!isOwner && (
                        <Button 
                            variant={isFollowing ? "outlined" : "contained"} 
                            onClick={handleFollowToggle}
                            sx={{ borderRadius: 20 }}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </Button>
                    )}
                </Box>
            </Box>

            <Typography variant="h6" fontWeight="bold" mb={2}>Posts</Typography>
            {posts.length === 0 ? (
                <Typography color="text.secondary">This user hasn't posted anything yet.</Typography>
            ) : (
                posts.map(post => <PostCard key={post._id} post={post} />)
            )}
        </Box>
    );
};

export default UserProfile;
