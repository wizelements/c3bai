/**
 * Service Worker for Cod3Black Agency PWA
 * Provides offline support, caching, and instant loading
 */

const CACHE_VERSION = 'c3bai-v2';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
];

// Install event
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching assets');
        return cache.addAll(ASSETS_TO_CACHE).catch(() => {
          console.log('[SW] Some assets could not be cached');
        });
      }),
    ]).then(() => {
      self.skipWaiting();
    })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheName.startsWith(CACHE_VERSION)) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - smart caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin and non-GET requests
  if (url.origin !== location.origin || request.method !== 'GET') {
    return;
  }

  // Network first for API calls
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const cacheCopy = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, cacheCopy);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Cache first for static assets
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(request).then((response) => {
        // Cache successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const cacheCopy = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, cacheCopy);
        });

        return response;
      }).catch(() => {
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/');
        }
        return null;
      });
    })
  );
});

// Handle background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-inquiry') {
    event.waitUntil(
      new Promise((resolve) => {
        console.log('[SW] Background sync: inquiry');
        resolve();
      })
    );
  }
});
