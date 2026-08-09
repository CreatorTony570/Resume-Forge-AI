/* ============================================================
   ResumeForge AI — Service Worker
   Provides offline caching & resilience.
   Uses a "stale-while-revalidate" strategy for app shell,
   "cache-first" for static assets.
   ============================================================ */

const CACHE_NAME = 'resumeforge-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app.html',
  '/css/design.css',
  '/css/components.css',
  '/css/pages.css',
  '/js/config.js',
  '/js/state.js',
  '/js/ui.js',
  '/js/ai.js',
  '/js/router.js',
  '/js/pages.js',
  '/js/models.js',
  '/js/assistant.js',
  '/js/security.js',
  '/js/app.js',
  '/js/three-bg.js',
  '/manifest.json'
];

const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap'
];

// Install — pre-cache all static assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return Promise.allSettled(
        STATIC_ASSETS.concat(CDN_ASSETS).map(function(url) {
          return cache.add(url).catch(function(err) {
            console.warn('[SW] Failed to cache:', url, err.message);
          });
        })
      );
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// Activate — clean old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch — stale-while-revalidate for HTML, cache-first for static
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip API calls (let them go to the network)
  if (url.pathname.startsWith('/api/') ||
      url.hostname.includes('api.openai.com') ||
      url.hostname.includes('api.anthropic.com') ||
      url.hostname.includes('generativelanguage.googleapis.com') ||
      url.hostname.includes('openrouter.ai') ||
      url.hostname.includes('api.groq.com')) {
    return;
  }

  // For HTML: network-first with cache fallback
  if (event.request.headers.get('Accept') &&
      event.request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
          return response;
        })
        .catch(function() {
          return caches.match(event.request);
        })
    );
    return;
  }

  // For static assets: cache-first
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      var fetchPromise = fetch(event.request).then(function(response) {
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      });
      return cached || fetchPromise;
    })
  );
});
