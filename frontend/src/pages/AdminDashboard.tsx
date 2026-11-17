import React, { useState } from 'react';
import { Box, Typography, Tab, Tabs, Card, CardContent, Grid, Button, Dialog, TextField, List, ListItem, ListItemText } from '@mui/material';
import { Layout } from '../components/common/Layout';
import AddIcon from '@mui/icons-material/Add';

export const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');

  const webhooks = [
    { event: 'reservation.created', url: 'https://example.com/webhooks/created', deliveries: 125 },
    { event: 'reservation.updated', url: 'https://example.com/webhooks/updated', deliveries: 87 },
    { event: 'reservation.cancelled', url: 'https://example.com/webhooks/cancelled', deliveries: 12 },
  ];

  const channelStats = [
    { channel: 'Booking.com', synced: 342, lastSync: '2 hours ago', status: 'active' },
    { channel: 'Airbnb', synced: 218, lastSync: '1 hour ago', status: 'active' },
    { channel: 'Direct', synced: 95, lastSync: '30 min ago', status: 'active' },
  ];

  return (
    <Layout>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" sx={{ marginBottom: 3 }}>
          Admin Dashboard 🔧
        </Typography>

        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
          <Tab label="Channels" />
          <Tab label="Webhooks" />
          <Tab label="Users" />
        </Tabs>

        <Box sx={{ marginTop: 2 }}>
          {tab === 0 && (
            <Box>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Channel Synchronization
              </Typography>
              {channelStats.map((channel) => (
                <Card key={channel.channel} sx={{ marginBottom: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h6">{channel.channel}</Typography>
                        <Typography color="textSecondary">Synced: {channel.synced} reservations</Typography>
                        <Typography color="textSecondary">Last sync: {channel.lastSync}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography sx={{ color: 'green', fontWeight: 'bold' }}>● {channel.status}</Typography>
                          <Button variant="contained" size="small">
                            Sync Now
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {tab === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography variant="h6">Webhooks</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
                  Add Webhook
                </Button>
              </Box>

              {webhooks.map((webhook) => (
                <Card key={webhook.event} sx={{ marginBottom: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{webhook.event}</Typography>
                    <Typography color="textSecondary" sx={{ fontSize: 12 }}>
                      {webhook.url}
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: 1 }}>
                      Deliveries: {webhook.deliveries}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {tab === 2 && (
            <Box>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                System Users
              </Typography>
              <Card>
                <List>
                  <ListItem>
                    <ListItemText primary="admin@example.com" secondary="Admin - 50 properties" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="manager@example.com" secondary="Manager - 10 properties" />
                  </ListItem>
                </List>
              </Card>
            </Box>
          )}
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <Box sx={{ padding: 3, minWidth: 400 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Add Webhook
          </Typography>
          <TextField fullWidth label="Webhook URL" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} sx={{ marginBottom: 2 }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={() => setOpenDialog(false)}>
              Add
            </Button>
            <Button variant="outlined" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Layout>
  );
};
