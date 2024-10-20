const CACHE_NAME = 'shopping-list-cache-v1';
const urlsToCache = [
    '/todo/',
    '/todo/index.html',
    '/todo/styles.css',
    '/todo/script.js',
    '/todo/icon-192x192.png',
    '/todo/icon-512x512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
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
