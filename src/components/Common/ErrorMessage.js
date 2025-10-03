import React from 'react';
import { Alert, Box } from '@mui/material';

const ErrorMessage = ({ message, severity = 'error', onClose }) => {
  if (!message) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity={severity} onClose={onClose}>
        {message}
      </Alert>
    </Box>
  );
};

export default ErrorMessage;