import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Feed from './pages/Feed';
import Explore from './pages/Explore';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Search from './pages/Search';
import UserProfile from './pages/UserProfile';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { socket } from './services/socket';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF3366', 
    },
    secondary: {
      main: '#FF9933'
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    action: {
      active: '#555',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    }
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          padding: '8px 24px',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
          borderRadius: 20,
        }
      }
    }
  }
});

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        socket.connect();
    }
    return () => {
        socket.disconnect();
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute><Feed /></PrivateRoute>} />
          <Route path="/explore" element={<PrivateRoute><Explore /></PrivateRoute>} />
          <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
          <Route path="/profile/:id" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
