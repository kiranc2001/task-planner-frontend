import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { taskAPI } from '../services/api';
import { Task } from '../types';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const AddTask: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const navigate = useNavigate();
  const [task, setTask] = useState<Omit<Task, 'id' | 'createdAt'>>({
    userId: user?.id || 0,
    title: '',
    priority: 'MEDIUM',
    status: 'PENDING',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && user) {
      taskAPI.get(parseInt(id)).then((res) => setTask(res.data));
    }
  }, [id, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await taskAPI.update(parseInt(id), task);
      } else {
        await taskAPI.create(task);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit Task' : 'Add Task'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Description"
          value={task.description || ''}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={task.priority}
            label="Priority"
            onChange={(e) =>
              setTask({ ...task, priority: e.target.value as Task['priority'] })
            }
          >
            <MenuItem value="LOW">Low</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={task.status}
            label="Status"
            onChange={(e) =>
              setTask({ ...task, status: e.target.value as Task['status'] })
            }
          >
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Due Date"
          type="datetime-local"
          value={task.dueDate || ''}
          onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <Button type="submit" variant="contained" disabled={loading} fullWidth>
          {loading ? 'Saving...' : id ? 'Update' : 'Add'}
        </Button>
      </form>
    </Box>
  );
};

export default AddTask;
