'use client';

import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('Service worker registered:', reg);
        })
        .catch((error) => {
          console.log('Service worker registration failed:', error);
        });
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    // Hide prompt if already installed
    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Auto-hide prompt after 10 seconds if not interacted
    const timeout = setTimeout(() => {
      setShowPrompt(false);
    }, 10000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timeout);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  if (!showPrompt || !deferredPrompt || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 md:bottom-4 md:left-4 md:right-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg md:rounded-lg shadow-2xl p-4 z-50 md:max-w-sm animate-in slide-in-from-bottom md:slide-in-from-bottom">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Download size={20} className="text-white mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-base">Install Cod3Black</h3>
            <p className="text-sm text-blue-100 mt-1">
              Add to home screen for instant access to our services
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-blue-100 hover:text-white flex-shrink-0"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleInstall}
          className="flex-1 px-4 py-2.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold text-sm transition"
        >
          Install
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="flex-1 px-4 py-2.5 border border-white text-white rounded-lg hover:bg-blue-500 font-semibold text-sm transition"
        >
          Later
        </button>
      </div>
    </div>
  );
}
