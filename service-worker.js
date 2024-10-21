const CACHE_NAME = 'shopping-list-cache-v1';
const urlsToCache = [
    '/todo/',
    '/todo/index.html',
    '/todo/manifest.json',
    '/todo/script.js',
    '/todo/icon-192x192.png',
    '/todo/icon-512x512.png'
];

// Instalacja service workera
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache otwarty');
                return cache.addAll(urlsToCache);
            })
    );
});

// Obsługa fetch - zwracamy z cache, jeśli dostępny, inaczej pobieramy z sieci
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response; // Zwracamy dane z cache
                }
                return fetch(event.request); // Pobieramy dane z sieci, jeśli nie ma w cache
            })
    );
});

// Aktualizacja service workera - usuwanie starego cache
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName); // Usuwamy stare cache, które nie są w białej liście
                    }
                })
            );
        })
    );
});
