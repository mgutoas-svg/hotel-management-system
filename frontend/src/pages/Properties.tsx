import React, { useEffect } from 'react';
import { Box, Button, Grid, Card, CardContent, Typography, Dialog, TextField } from '@mui/material';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMyProperties, create } from '../store/slices/propertySlice';
import { Layout } from '../components/common/Layout';
import AddIcon from '@mui/icons-material/Add';
import { CreatePropertyRequest } from '../types';

export const Properties: React.FC = () => {
  const dispatch = useAppDispatch();
  const myProperties = useAppSelector((state) => state.property.myProperties);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<CreatePropertyRequest>>({});

  useEffect(() => {
    dispatch(fetchMyProperties());
  }, [dispatch]);

  const handleCreate = async () => {
    if (formData.name && formData.address) {
      await dispatch(create(formData as CreatePropertyRequest));
      setOpen(false);
      setFormData({});
      dispatch(fetchMyProperties());
    }
  };

  return (
    <Layout>
      <Box sx={{ padding: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <Typography variant="h4">Properties</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            New Property
          </Button>
        </Box>

        <Grid container spacing={2}>
          {myProperties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{property.name}</Typography>
                  <Typography color="textSecondary">{property.address}</Typography>
                  <Typography variant="body2">{property.city}, {property.state}</Typography>
                  <Box sx={{ marginTop: 2 }}>
                    <Typography variant="caption">
                      {property.totalRooms} rooms • {property.stars}⭐ • {property.propertyType}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
          <Box sx={{ padding: 2 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Create New Property
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Property Name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <TextField
                fullWidth
                label="Address"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <TextField
                fullWidth
                label="City"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <TextField
                fullWidth
                label="Total Rooms"
                type="number"
                value={formData.totalRooms || ''}
                onChange={(e) => setFormData({ ...formData, totalRooms: parseInt(e.target.value) })}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" onClick={handleCreate}>
                  Create
                </Button>
                <Button variant="outlined" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </Dialog>
      </Box>
    </Layout>
  );
};
