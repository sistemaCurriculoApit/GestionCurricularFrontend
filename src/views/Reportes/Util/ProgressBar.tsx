import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

export const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Box sx={{ width: '80%', mr: 1 }}>
      <LinearProgress variant="determinate" value={value} />
    </Box>
    <Box sx={{ minWidth: 35 }}>
      <Typography variant="body2" color="text.secondary">{value}%</Typography>
    </Box>
  </Box>
);