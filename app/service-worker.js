const version = 'v0.0.1::';
const cachedFiles = [];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches
      .open(version + 'globals')
      .then(function(cache) {
        return cache.addAll([
          '/',
          '/web-manifest.json',
          '/login.html',
          '/dashboard.html',
          '/lesson.html',
          '/global.styles.css',
          '/homepage.styles.css',
          '/login.styles.css',
          '/bundle.js',
          '/vendor.js',
          '/assets/images/logo.png',
          '/assets/images/icon.png',
          '/assets/images/avatar.png',
          '/assets/images/loading.gif',
          '/assets/images/google.png',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          'https://fonts.googleapis.com/css?family=Roboto',
          'https://fonts.gstatic.com/s/materialicons/v36/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
          'https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu72xKKTU1Kvnz.woff2',
          'https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu5mxKKTU1Kvnz.woff2',
          'https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7mxKKTU1Kvnz.woff2',
          'https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4WxKKTU1Kvnz.woff2',
          'https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7WxKKTU1Kvnz.woff2',
          'https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7GxKKTU1Kvnz.woff2',
          'https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2'
        ]);
      })
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches
      .match(event.request)
      .then(function(cached) {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (event.request.url.indexOf('sockjs') !== -1) return response;
          var cacheCopy = response.clone();
          caches
            .open(version + 'pages')
            .then(function add(cache) {
              cache.put(event.request, cacheCopy);
            });
          return response;
        });
      })
  );
});

self.addEventListener('activate', function(event) {
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
  );
});

self.addEventListener('push', function(event) {
  let body;
  switch (event.data.text()) {
    case 'video-stopped':
      body = 'Continue your lesson';
      break;
    default: 
      body = 'Google Learn GO';
  }

  const notificationPromise = self.registration.showNotification('Digital Garage', {
    body: body,
    icon: `${APP_URL}/assets/images/icon.png`,
    icon: `${APP_URL}/assets/images/icon.png`
  });
  event.waitUntil(notificationPromise);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(APP_URL)
  );
});
