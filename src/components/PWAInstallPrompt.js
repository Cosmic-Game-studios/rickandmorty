import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddToHomeScreenIcon from '@mui/icons-material/AddToHomeScreen';
import IosShareIcon from '@mui/icons-material/IosShare';

/**
 * PWAInstallPrompt - Zeigt Benutzern an, wie sie die App installieren können
 * iOS Safari: Zeigt Anweisungen für "Zum Home-Bildschirm"
 * Android/Desktop: Nutzt das beforeinstallprompt Event
 */
const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    // Check if already in standalone mode
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                      window.navigator.standalone === true;
    setIsStandalone(standalone);

    // Check if already dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedDate = dismissed ? new Date(dismissed) : null;
    const daysSinceDismissed = dismissedDate ?
      (new Date() - dismissedDate) / (1000 * 60 * 60 * 24) : 999;

    // Don't show if in standalone mode or dismissed recently (within 7 days)
    if (standalone || daysSinceDismissed < 7) {
      return;
    }

    // For iOS, show prompt after a delay
    if (ios) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000); // Show after 5 seconds
      return () => clearTimeout(timer);
    }

    // For Android/Desktop - listen for beforeinstallprompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setShowPrompt(false);

    if (outcome === 'dismissed') {
      localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(135deg, rgba(26, 42, 108, 0.98) 0%, rgba(10, 14, 39, 0.98) 100%)',
        borderTop: '2px solid #00b8d4',
        zIndex: 1300,
        p: 2,
        animation: 'slideUp 0.3s ease',
        '@keyframes slideUp': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' }
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AddToHomeScreenIcon sx={{ fontSize: 40, color: '#00b8d4' }} />

        <Box sx={{ flex: 1 }}>
          {isIOS ? (
            <>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                Installiere Rick & Morty Adventure
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Tippe auf <IosShareIcon sx={{ fontSize: 16, verticalAlign: 'middle', mx: 0.5 }} /> und dann auf "Zum Home-Bildschirm"
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                App installieren?
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Installiere die App für schnellen Zugriff und bessere Performance
              </Typography>
            </>
          )}
        </Box>

        {!isIOS && deferredPrompt && (
          <Button
            variant="contained"
            onClick={handleInstall}
            sx={{
              background: 'linear-gradient(135deg, #00b8d4 0%, #0088a3 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #62efff 0%, #00b8d4 100%)',
              }
            }}
          >
            Installieren
          </Button>
        )}

        <IconButton
          onClick={handleClose}
          sx={{ color: 'white' }}
          aria-label="Schließen"
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default PWAInstallPrompt;
