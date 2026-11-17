import React, { useState } from 'react';
import { Box, Card, CardContent, Button, Tab, Tabs, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import { Layout } from '../components/common/Layout';

export const Payment: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Stripe state
  const [stripeAmount, setStripeAmount] = useState('');
  const [reservationId, setReservationId] = useState('');

  // PayPal state
  const [paypalAmount, setPaypalAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleStripePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/payments/stripe/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          amount: parseFloat(stripeAmount),
          currency: 'USD',
          reservationId,
        }),
      });

      const data = await response.json();
      setMessage(`Payment intent created: ${data.clientSecret}`);
      // Aqui integraria com Stripe Elements para confirmar pagamento
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const handlePayPalPayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/payments/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          amount: parseFloat(paypalAmount),
          currency: 'USD',
          reservationId,
          description,
        }),
      });

      const data = await response.json();
      // Redirecionar para PayPal
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <Box sx={{ padding: 2, maxWidth: 600, margin: '0 auto' }}>
        <Typography variant="h4" sx={{ marginBottom: 3 }}>
          💳 Payment
        </Typography>

        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
          <Tab label="Stripe" />
          <Tab label="PayPal" />
        </Tabs>

        <Box sx={{ marginTop: 3 }}>
          {tab === 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                  Pay with Stripe
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Reservation ID"
                    value={reservationId}
                    onChange={(e) => setReservationId(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={stripeAmount}
                    onChange={(e) => setStripeAmount(e.target.value)}
                    InputProps={{ startAdornment: '$' }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleStripePayment}
                    disabled={loading || !stripeAmount || !reservationId}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Pay with Stripe'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {tab === 1 && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                  Pay with PayPal
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Reservation ID"
                    value={reservationId}
                    onChange={(e) => setReservationId(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={paypalAmount}
                    onChange={(e) => setPaypalAmount(e.target.value)}
                    InputProps={{ startAdornment: '$' }}
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    onClick={handlePayPalPayment}
                    disabled={loading || !paypalAmount || !reservationId}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Pay with PayPal'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {message && (
            <Alert severity="info" sx={{ marginTop: 2 }}>
              {message}
            </Alert>
          )}
        </Box>
      </Box>
    </Layout>
  );
};
