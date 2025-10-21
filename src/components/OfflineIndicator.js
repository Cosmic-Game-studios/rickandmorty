import React, { useState, useEffect } from 'react';
import { Box, Typography, Slide } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';

/**
 * OfflineIndicator - Zeigt dem Benutzer an, wenn keine Internetverbindung besteht
 */
const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      // Hide the "reconnected" message after 3 seconds
      setTimeout(() => {
        setShowReconnected(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't show anything if online and not showing reconnected message
  if (isOnline && !showReconnected) return null;

  return (
    <Slide direction="down" in={!isOnline || showReconnected}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: isOnline ? '#4caf50' : '#f44336',
          color: 'white',
          py: 1,
          px: 2,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        {isOnline ? (
          <>
            <WifiIcon sx={{ fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              Verbindung wiederhergestellt
            </Typography>
          </>
        ) : (
          <>
            <WifiOffIcon sx={{ fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              Keine Internetverbindung - Offline-Modus aktiv
            </Typography>
          </>
        )}
      </Box>
    </Slide>
  );
};

export default OfflineIndicator;
