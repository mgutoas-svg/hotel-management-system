import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { Layout } from '../components/common/Layout';

export const Reservations: React.FC = () => {
  const reservations = [
    {
      id: '1',
      guestName: 'John Doe',
      propertyName: 'Hotel Paradise',
      checkIn: '2024-12-20',
      checkOut: '2024-12-25',
      status: 'confirmed',
      totalPrice: 1500,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Layout>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" sx={{ marginBottom: 3 }}>
          Reservations
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Guest Name</TableCell>
                <TableCell>Property</TableCell>
                <TableCell>Check-in</TableCell>
                <TableCell>Check-out</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((res) => (
                <TableRow key={res.id}>
                  <TableCell>{res.guestName}</TableCell>
                  <TableCell>{res.propertyName}</TableCell>
                  <TableCell>{res.checkIn}</TableCell>
                  <TableCell>{res.checkOut}</TableCell>
                  <TableCell>
                    <Chip label={res.status} color={getStatusColor(res.status) as any} variant="outlined" />
                  </TableCell>
                  <TableCell>${res.totalPrice.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Layout>
  );
};
