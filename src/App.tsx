import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import { ThemeProviderWrapper, useTheme } from './contexts/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddTask from './pages/AddTask';
import AiSuggestions from './pages/AiSuggestions';
import Calendar from './pages/Calendar';
import Reports from './pages/Reports';
import { AppBar, Toolbar, Typography, Switch, Box } from '@mui/material';

// AppContent now assumes Router is parent—useNavigate works
const AppContent: React.FC = () => {
  const { user, setUser } = useUser();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate(); // Now safe: Inside Router tree

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
    // Immediate navigate to avoid "Loading..."
    navigate('/', { replace: true });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Task Planner
          </Typography>
          {user ? (
            <>
              <Link to="/dashboard" style={{ color: 'white', marginRight: 16 }}>
                Dashboard
              </Link>
              <Link to="/add-task" style={{ color: 'white', marginRight: 16 }}>
                Add Task
              </Link>
              <Link
                to="/ai-suggestions"
                style={{ color: 'white', marginRight: 16 }}
              >
                AI Suggestions
              </Link>
              <Link to="/calendar" style={{ color: 'white', marginRight: 16 }}>
                Calendar
              </Link>
              <Link to="/reports" style={{ color: 'white', marginRight: 16 }}>
                Reports
              </Link>
              <Typography
                onClick={handleLogout}
                sx={{ cursor: 'pointer', marginRight: 16, color: 'white' }}
              >
                Logout
              </Typography>
            </>
          ) : (
            <Link to="/" style={{ color: 'white' }}>
              Login
            </Link>
          )}
          <Switch checked={isDark} onChange={toggleTheme} />
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-task" element={<AddTask />} />
          <Route path="/add-task/:id" element={<AddTask />} />
          <Route path="/ai-suggestions" element={<AiSuggestions />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Box>
    </>
  );
};

// Main App: Router wraps AppContent
const App: React.FC = () => (
  <Router>
    <UserProvider>
      <ThemeProviderWrapper>
        <AppContent />
      </ThemeProviderWrapper>
    </UserProvider>
  </Router>
);

export default App;
