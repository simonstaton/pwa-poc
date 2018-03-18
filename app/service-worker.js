const version = 'v0.0.1::';
const cachedFiles = [];
if (!IS_DEV) {
  cachedFiles.concat([
    '/',
    // '/login.html',
    // '/dashboard.html',
    // '/lesson.html',
    '/global.styles.css',
    '/bundle.js',
    '/vendor.js',
    '/web-manifest.json',
    '/assets/images/logo.png',
    '/assets/images/icon.png',
    // '/assets/images/avatar.png'
  ])
}

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches
      .open(version + 'globals')
      .then(function(cache) {
        return cache.addAll(cachedFiles);
      })
      .then(function() {
        console.log('WORKER: install completed, globals cached');
      })
  );
});

self.addEventListener("fetch", function(event) {
  if (event.request.method !== 'GET') {
    console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
    return;
  }
  event.respondWith(
    caches
      .match(event.request)
      .then(function(cached) {
        var networked = fetch(event.request)
          .then(fetchedFromNetwork, unableToResolve)
          .catch(unableToResolve);

        // return cached copy
        return cached || networked;

        // No cached copies
        function fetchedFromNetwork(response) {
          var cacheCopy = response.clone();
          caches
            .open(version + 'pages')
            .then(function add(cache) {
              cache.put(event.request, cacheCopy);
            })
            .then(function() {
              console.log('WORKER: fetch response stored in cache.', event.request.url);
            });

          return response;
        }

        // Can't request or return cached
        function unableToResolve () {
          return new Response('<h1>Service Unavailable</h1>', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/html'
            })
          });
        }

      })
  );
});

self.addEventListener("activate", function(event) {
  // Cleanup older versions
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return !key.startsWith(version);
            })
            .map(function (key) {
              return caches.delete(key);
            })
        );
      })
      .then(function() {
        console.log('WORKER: activate completed.');
      })
  );
});

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event}"`);

  const title = 'Push Codelab';
  const options = {
    body: 'Yay it works.',
    icon: 'images/icon.png',
    badge: 'images/badge.png'
  };

  const notificationPromise = self.registration.showNotification(title, options);
  event.waitUntil(notificationPromise);
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://foobar.com/')
  );
});
