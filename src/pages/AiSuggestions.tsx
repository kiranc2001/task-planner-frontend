import React, { useEffect, useState } from 'react';
import { taskAPI, aiAPI } from '../services/api';
import { Task, AiSuggestion } from '../types';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';

const AiSuggestions: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [suggestions, setSuggestions] = useState<AiSuggestion | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await taskAPI.list();
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getSuggestions = async () => {
    if (tasks.length === 0) return;
    setLoading(true);
    try {
      const res = await aiAPI.suggestions({ tasks });
      setSuggestions(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Get Smart Schedule
      </Typography>
      <Button
        variant="contained"
        onClick={getSuggestions}
        disabled={loading || tasks.length === 0}
        sx={{ mb: 4 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Get AI Recommendations'}
      </Button>
      {suggestions && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              AI Recommendations:
            </Typography>
            <Typography variant="body1">
              {suggestions.recommendations}
            </Typography>
          </CardContent>
        </Card>
      )}
      {tasks.length === 0 && (
        <Typography>No tasks yet. Add some on Dashboard!</Typography>
      )}
    </Box>
  );
};

export default AiSuggestions;
