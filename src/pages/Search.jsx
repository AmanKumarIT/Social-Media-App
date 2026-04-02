import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim()) {
                setLoading(true);
                try {
                    const res = await api.get(`/users/search?q=${query}`);
                    setResults(res.data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" fontWeight="bold" mb={3}>Search Users</Typography>
            <TextField 
                fullWidth 
                variant="outlined" 
                placeholder="Search by username..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ mb: 4, backgroundColor: 'white', borderRadius: 2 }}
            />

            {loading ? (
                <Box display="flex" justifyContent="center"><CircularProgress /></Box>
            ) : (
                <List sx={{ backgroundColor: 'white', borderRadius: 2, p: 0, overflow: 'hidden' }}>
                    {results.map(user => (
                        <ListItem 
                            button 
                            key={user._id} 
                            onClick={() => navigate(`/profile/${user._id}`)}
                            sx={{ borderBottom: '1px solid #eee', '&:hover': { backgroundColor: '#f9f9f9', cursor: 'pointer' } }}
                        >
                            <ListItemAvatar>
                                <Avatar src={user.profilePicture} sx={{ bgcolor: 'primary.main' }}>
                                    {user.username.charAt(0).toUpperCase()}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                                primary={<Typography fontWeight="bold">{user.username}</Typography>} 
                                secondary={user.bio || `${user.followers?.length || 0} followers`} 
                            />
                        </ListItem>
                    ))}
                    {query.trim() && !loading && results.length === 0 && (
                        <Typography sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>No users found.</Typography>
                    )}
                </List>
            )}
        </Box>
    );
};

export default Search;
