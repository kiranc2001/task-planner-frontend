import React from 'react';
import { useNavigate } from 'react-router-dom';
import { taskAPI } from '../services/api';
import { Task } from '../types';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (task.id && window.confirm('Delete task?')) {
      try {
        await taskAPI.delete(task.id);
        onUpdate();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{task.title}</Typography>
        {task.description && (
          <Typography variant="body2" color="text.secondary">
            {task.description}
          </Typography>
        )}
        <Chip
          label={task.priority}
          color="primary"
          size="small"
          sx={{ mt: 1 }}
        />
        <Chip
          label={task.status}
          color={task.status === 'COMPLETED' ? 'success' : 'warning'}
          size="small"
          sx={{ mt: 1, ml: 1 }}
        />
        {task.dueDate && (
          <Typography variant="caption">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </Typography>
        )}
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <IconButton onClick={() => navigate(`/add-task/${task.id}`)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
