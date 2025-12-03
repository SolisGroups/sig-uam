// Service Worker pour SIG Web UAM
// Version du cache - à incrémenter lors des mises à jour
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `sigweb-uam-${CACHE_VERSION}`;

// Fichiers à mettre en cache pour le fonctionnement hors ligne
const urlsToCache = [
  '/sigweb-uam/',
  '/sigweb-uam/index.html',
  '/sigweb-uam/css/styles.css',
  '/sigweb-uam/js/app.js',
  '/sigweb-uam/js/leaflet.browser.print.min.js',
  '/sigweb-uam/img/uam.jpg',
  '/sigweb-uam/manifest.json',
  // Icônes
  '/sigweb-uam/img/icons/icon-192x192.png',
  '/sigweb-uam/img/icons/icon-512x512.png'
];

// Fichiers CDN à mettre en cache
const cdnUrlsToCache = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js',
  'https://cdn.jsdelivr.net/npm/@turf/turf@6.5.0/turf.min.js'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installation en cours...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Mise en cache des fichiers');
        // Cache les fichiers locaux
        return cache.addAll(urlsToCache)
          .then(() => {
            // Cache les fichiers CDN (peut échouer sans bloquer l'installation)
            return Promise.allSettled(
              cdnUrlsToCache.map(url =>
                cache.add(url).catch(err => {
                  console.warn(`[Service Worker] Impossible de mettre en cache: ${url}`, err);
                })
              )
            );
          });
      })
      .then(() => {
        console.log('[Service Worker] Installation réussie');
        return self.skipWaiting(); // Active immédiatement le nouveau SW
      })
      .catch((error) => {
        console.error('[Service Worker] Erreur lors de l\'installation:', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activation en cours...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Supprime les anciens caches
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Activation réussie');
      return self.clients.claim(); // Prend le contrôle de toutes les pages immédiatement
    })
  );
});

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Stratégie différente pour les données GeoJSON
  if (url.pathname.includes('/data/')) {
    // Network First pour les données (toujours récupérer les dernières données)
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone la réponse car elle ne peut être utilisée qu'une fois
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Si le réseau échoue, utilise le cache
          return caches.match(request);
        })
    );
  }
  // Stratégie Cache First pour les autres ressources
  else {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Retourne la ressource en cache
            return cachedResponse;
          }

          // Si pas en cache, récupère depuis le réseau
          return fetch(request)
            .then((response) => {
              // Ne met en cache que les réponses valides
              if (!response || response.status !== 200 || response.type === 'error') {
                return response;
              }

              // Clone la réponse
              const responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then((cache) => {
                  // Ne met pas en cache les requêtes POST, PUT, DELETE, etc.
                  if (request.method === 'GET') {
                    cache.put(request, responseToCache);
                  }
                });

              return response;
            })
            .catch((error) => {
              console.error('[Service Worker] Erreur de récupération:', error);

              // Page hors ligne personnalisée (optionnel)
              if (request.destination === 'document') {
                return caches.match('/sigweb-uam/index.html');
              }
            });
        })
    );
  }
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

// Notification de mise à jour disponible
self.addEventListener('controllerchange', () => {
  console.log('[Service Worker] Nouvelle version disponible');
});
