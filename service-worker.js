const CACHE_NAME = 'cache-v1';
const ASSETS = [
    '/todo/',
    '/todo/index.html',
    '/todo/styles.css',
    '/todo/script.js',
    'https://cdn.jsdelivr.net/npm/daisyui@3.9.4/dist/full.css',
    'https://unpkg.com/lucide@latest'
];

// Instalacja Service Workera
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Obsługa zapytań sieciowych
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Aktualizacja Service Workera
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            );
        })
    );
});
