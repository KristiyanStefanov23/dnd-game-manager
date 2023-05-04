// Cache the app shell
const shellCacheName = 'my-app-shell-v1';
const shellUrlsToCache = [
  '/',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(shellCacheName).then((cache) => {
      return cache.addAll(shellUrlsToCache);
    })
  );
});

// Serve cached app shell on fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Update the cache with new app shell when available
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith('my-app-shell-') &&
            cacheName !== shellCacheName;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});
