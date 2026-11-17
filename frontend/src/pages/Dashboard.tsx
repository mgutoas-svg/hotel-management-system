import React, { useEffect } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMyProperties } from '../store/slices/propertySlice';
import { Layout } from '../components/common/Layout';
import HotelIcon from '@mui/icons-material/Hotel';
import GroupIcon from '@mui/icons-material/Group';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const myProperties = useAppSelector((state) => state.property.myProperties);

  useEffect(() => {
    dispatch(fetchMyProperties());
  }, [dispatch]);

  const stats = [
    { label: 'Total Properties', value: myProperties.length, icon: <HotelIcon sx={{ fontSize: 40 }} /> },
    { label: 'Total Rooms', value: myProperties.reduce((sum, p) => sum + p.totalRooms, 0), icon: <GroupIcon sx={{ fontSize: 40 }} /> },
    { label: 'Active Reservations', value: 24, icon: <EventAvailableIcon sx={{ fontSize: 40 }} /> },
  ];

  return (
    <Layout>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" sx={{ marginBottom: 3 }}>
          Welcome, {user?.firstName}! 👋
        </Typography>

        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {stat.label}
                    </Typography>
                    <Typography variant="h5">{stat.value}</Typography>
                  </Box>
                  <Box sx={{ color: 'primary.main' }}>{stat.icon}</Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ marginTop: 4, padding: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Your Properties
          </Typography>
          {myProperties.length === 0 ? (
            <Typography color="textSecondary">No properties yet. Create one to get started!</Typography>
          ) : (
            <Grid container spacing={2}>
              {myProperties.map((property) => (
                <Grid item xs={12} sm={6} md={4} key={property.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{property.name}</Typography>
                      <Typography color="textSecondary">{property.city}, {property.state}</Typography>
                      <Typography variant="body2" sx={{ marginTop: 1 }}>
                        {property.totalRooms} rooms • {property.stars}⭐
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Box>
    </Layout>
  );
};
