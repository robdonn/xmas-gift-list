'use client';

import React, { useState } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/Button';
import { X, Download, Wifi, WifiOff } from 'lucide-react';

export const PWAPrompt: React.FC = () => {
  const { isInstallable, installApp } = usePWA();
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    setIsInstalling(true);
    const installed = await installApp();
    setIsInstalling(false);

    if (installed) {
      setShowInstallPrompt(false);
    }
  };

  if (!isInstallable || !showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-christmas-green" />
            <h3 className="font-medium text-gray-900">Install App</h3>
          </div>
          <button
            onClick={() => setShowInstallPrompt(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Install Christmas Gift List for quick access and offline use!
        </p>

        <div className="flex space-x-2">
          <Button
            onClick={handleInstall}
            loading={isInstalling}
            size="sm"
            className="flex-1"
          >
            Install
          </Button>
          <Button
            onClick={() => setShowInstallPrompt(false)}
            variant="outline"
            size="sm"
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </div>
  );
};

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = usePWA();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-yellow-500 text-white px-4 py-2 text-center text-sm font-medium">
        <div className="flex items-center justify-center space-x-2">
          <WifiOff className="w-4 h-4" />
          <span>You&apos;re offline. Some features may be limited.</span>
        </div>
      </div>
    </div>
  );
};

export const ConnectionStatus: React.FC = () => {
  const { isOnline } = usePWA();

  return (
    <div className="flex items-center space-x-1 text-sm text-gray-600">
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4 text-green-500" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-red-500" />
          <span>Offline</span>
        </>
      )}
    </div>
  );
};
