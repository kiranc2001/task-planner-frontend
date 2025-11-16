import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { taskAPI } from '../services/api';
import { Task } from '../types';
import { Box, Typography } from '@mui/material';

const Calendar: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

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

  const events = tasks
    .filter((task) => task.dueDate)
    .map((task) => ({
      id: task.id?.toString() || '',
      title: task.title,
      start: task.dueDate,
      backgroundColor:
        task.priority === 'HIGH'
          ? '#f44336'
          : task.priority === 'MEDIUM'
            ? '#ff9800'
            : '#4caf50',
      borderColor: task.status === 'COMPLETED' ? '#4caf50' : '#ff9800',
    }));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Task Calendar
      </Typography>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        editable={false}
        selectable={false}
        selectMirror={true}
        dayMaxEvents={true}
        height="600px"
        eventClick={(info) => alert(`Task: ${info.event.title}`)}
      />
    </Box>
  );
};

export default Calendar;
