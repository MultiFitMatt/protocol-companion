const CACHE_NAME = 'protocol-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests (Firebase, analytics, etc.)
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Skip API calls and auth-related requests
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('firebaseapp.com') ||
      event.request.url.includes('googleapis.com')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache successful responses
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(async () => {
        // Try to return cached version
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        // For navigation requests, return the cached index.html (SPA fallback)
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        // Return a simple offline response for other requests
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      })
  );
});

