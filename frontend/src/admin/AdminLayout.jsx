import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AdminSidebar drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        {/* Admin pages will be rendered here */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;