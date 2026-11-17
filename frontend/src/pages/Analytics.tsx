import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, Container } from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Layout } from '../components/common/Layout';

export const Analytics: React.FC = () => {
  const [revenueData, setRevenueData] = useState([
    { month: 'Jan', revenue: 4000, occupancy: 65 },
    { month: 'Feb', revenue: 3000, occupancy: 60 },
    { month: 'Mar', revenue: 2000, occupancy: 55 },
    { month: 'Apr', revenue: 2780, occupancy: 70 },
    { month: 'May', revenue: 1890, occupancy: 75 },
    { month: 'Jun', revenue: 2390, occupancy: 80 },
  ]);

  const [occupancyData] = useState([
    { name: 'Occupied', value: 65, color: '#1976d2' },
    { name: 'Available', value: 35, color: '#90caf9' },
  ]);

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const avgOccupancy = Math.round(revenueData.reduce((sum, d) => sum + d.occupancy, 0) / revenueData.length);

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ padding: 2 }}>
        <Typography variant="h4" sx={{ marginBottom: 3 }}>
          Analytics & Reports 📊
        </Typography>

        {/* KPIs */}
        <Grid container spacing={3} sx={{ marginBottom: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Revenue
                </Typography>
                <Typography variant="h5">${totalRevenue.toLocaleString()}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Last 6 months
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Avg Occupancy
                </Typography>
                <Typography variant="h5">{avgOccupancy}%</Typography>
                <Typography variant="caption" color="textSecondary">
                  Overall rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Avg Daily Rate
                </Typography>
                <Typography variant="h5">${(totalRevenue / 180).toFixed(0)}</Typography>
                <Typography variant="caption" color="textSecondary">
                  ADR
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  RevPAR
                </Typography>
                <Typography variant="h5">${((totalRevenue / 180) * (avgOccupancy / 100)).toFixed(0)}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Revenue per available room
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          {/* Revenue Trend */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Revenue Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#1976d2" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Occupancy Rate */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Current Occupancy
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={occupancyData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={100} dataKey="value">
                    {occupancyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Occupancy Trend */}
          <Grid item xs={12}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Occupancy Rate Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="occupancy" fill="#90caf9" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};
