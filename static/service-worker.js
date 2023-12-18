/*
 * ServiceWorker to make site function as a PWA (Progressive Web App)
 *
 * Based on https://glitch.com/~pwa by https://glitch.com/@PaulKinlan
 */

// Specify what we want added to the cache for offline use
self.addEventListener("install", e => {
  e.waitUntil(
    // Give the cache a name
    caches.open("next-slide-please-pwa").then(cache => {
      // Cache the homepage and stylesheets - add any assets you want to cache!
      return cache.addAll([
        "/",
        "/css/style.css",
        "/js/presenter.js",
        "/js/viewer.js",
        "https://cdn.glitch.global/82cc4f44-8805-4d75-ab26-18cc35cb7eb6/nsp_192.png?v=1685469722049",
        "https://cdn.glitch.global/82cc4f44-8805-4d75-ab26-18cc35cb7eb6/NextSlidePleaseDemo1.mp4?v=1685541879107"
      ]);
    })
  );
});

// Network falling back to cache approach
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
