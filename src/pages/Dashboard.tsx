import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { taskAPI } from '../services/api';
import { Task } from '../types';
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import TaskCard from '../components/TaskCard';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterDate, setFilterDate] = useState('ALL');
  const { user } = useUser();
  const navigate = useNavigate();

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

  const filteredTasks = tasks.filter((task) => {
    const priorityMatch =
      filterPriority === 'ALL' || task.priority === filterPriority;
    // Simple date filter (implement full logic as needed)
    const dateMatch =
      filterDate === 'ALL' ||
      (task.dueDate && new Date(task.dueDate) < new Date());
    return priorityMatch && dateMatch;
  });

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.name}!
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" onClick={() => navigate('/add-task')}>
          Add Task
        </Button>
        <FormControl>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filterPriority}
            label="Priority"
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="LOW">Low</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Due Date</InputLabel>
          <Select
            value={filterDate}
            label="Due Date"
            onChange={(e) => setFilterDate(e.target.value)}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 2,
        }}
      >
        {filteredTasks.length ? (
          filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onUpdate={fetchTasks} />
          ))
        ) : (
          <Typography>No tasks match the filter.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
