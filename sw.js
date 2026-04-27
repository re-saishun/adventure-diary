const CACHE_NAME = 'adventure-diary-cache-v1';
const urlsToCache = [
  '/',
  '/adventure-diary/',
  '/adventure-diary/index.html',
  '/adventure-diary/styles.css',
  '/adventure-diary/script.js',
  '/adventure-diary/manifest.json',
  '/adventure-diary/img/logo.png',
  '/adventure-diary/img/icons/brand_ico.png',
  '/adventure-diary/img/icons/items_ico.png',
  '/adventure-diary/img/icons/monsters_ico.png',
  '/adventure-diary/img/icons/skills_ico.png',
  '/adventure-diary/img/icons/quest_ico.png',
  '/adventure-diary/item/',
  '/adventure-diary/item/index.html',
  '/adventure-diary/monster/',
  '/adventure-diary/monster/index.html',
  '/adventure-diary/skill/',
  '/adventure-diary/skill/index.html',
  '/adventure-diary/kontribusi/',
  '/adventure-diary/kontribusi/index.html',
  '/adventure-diary/kontribusi/admin.html',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache.map(url => new Request(url, {cache: 'reload'})));
      })
      .catch(error => {
          console.error('Failed to open cache: ', error);
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
        return fetch(event.request);
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
