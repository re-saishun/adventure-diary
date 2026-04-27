const CACHE_NAME = 'adventure-diary-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/manifest.json',
  // Database
  '/database/items.json',
  '/database/monsters.json',
  '/database/skills.json',
  // Logos and Icons
  '/img/logo.png',
  '/img/icons/brand_ico.png',
  '/img/icons/items_ico.png',
  '/img/icons/monsters_ico.png',
  '/img/icons/skills_ico.png',
  '/img/icons/quest_ico.png',
  '/img/icons/book_ico.png',
  '/img/icons/github_ico.png',
  // Pages
  '/item/index.html',
  '/kontribusi/index.html',
  '/monster/index.html',
  '/skill/index.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(response => {
          // Optionally, cache new requests dynamically
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
