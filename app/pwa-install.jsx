'use client';

import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

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

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

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
    <div className="fixed bottom-0 left-0 right-0 md:bottom-4 md:left-4 md:right-auto bg-[#13131f] border border-white/10 text-white rounded-t-lg md:rounded-2xl shadow-2xl p-4 z-50 md:max-w-sm animate-in slide-in-from-bottom">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center flex-shrink-0">
            <Download size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Install Cod3Black</h3>
            <p className="text-sm text-slate-400 mt-1">Add to home screen for instant access.</p>
          </div>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-slate-400 hover:text-white flex-shrink-0"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleInstall}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-400 to-cyan-500 text-[#0a0a0f] rounded-lg font-semibold text-sm transition hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]"
        >
          Install
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="flex-1 px-4 py-2.5 border border-white/10 text-slate-300 rounded-lg hover:bg-white/5 font-semibold text-sm transition"
        >
          Later
        </button>
      </div>
    </div>
  );
}
