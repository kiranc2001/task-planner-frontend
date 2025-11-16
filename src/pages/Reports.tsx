import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../services/api';
import { Analytics } from '../types';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Reports: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await analyticsAPI.tasks();
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const data = analytics
    ? {
        labels: ['Completed', 'Pending'],
        datasets: [
          {
            data: [analytics.completedTasks, analytics.pendingTasks],
            backgroundColor: ['#4caf50', '#ff9800'],
          },
        ],
      }
    : null;

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Task Reports
      </Typography>
      {analytics && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Completion Overview
            </Typography>

            {data && <Pie data={data} options={{ responsive: true }} />}

            <Typography sx={{ mt: 2 }}>
              Total Tasks: {analytics.totalTasks} | Completion:{' '}
              {analytics.completionPercentage.toFixed(1)}%
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Reports;
