import React from 'react';
import { Box, Typography } from '@mui/material';

const AdminPanel = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to the Admin Panel
      </Typography>
      <Typography variant="body1">
        This is the main dashboard for managing the Gram Panchayat portal.
      </Typography>
    </Box>
  );
};

export default AdminPanel;