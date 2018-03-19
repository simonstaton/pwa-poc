import icon from 'images/notification/icon-512x512.png';
import badge from 'images/notification/badge-128x128.png';
import image from 'images/notification/image-1000x754.jpg';
import action1 from 'images/notification/action-1-128x128.png';
import action2 from 'images/notification/action-2-128x128.png';

const version = 'v0.0.1::';

if (!IS_DEV) { // Don't cache for dev env
  self.addEventListener('install', function(event) {
    event.waitUntil(
      caches
        .open(version + 'globals')
        .then(function(cache) {
          return cache.addAll([
            '/',
            icon,
            badge,
            image,
            action1,
            action2,
            '/web-manifest.json',
            '/login.html',
            '/dashboard.html',
            '/lesson.html',
            '/global.styles.css',
            '/homepage.styles.css',
            '/login.styles.css',
            '/lesson.styles.css',
            '/bundle.js',
            '/vendor.js',
            '/assets/images/logo.png',
            '/assets/images/icon.png',
            '/assets/images/avatar.png',
            '/assets/images/loading.gif',
            '/assets/images/google.png',
            '/assets/images/play-store.png',
            '/assets/images/app-store.png',
            '/assets/images/logo-dark.png',
            '/assets/images/social-facebook.png',
            '/assets/images/social-google.png',
            '/assets/images/social-linkedin.png',
            '/assets/images/social-twitter.png',
            '/assets/fonts/google-sans.ttf',
            '/assets/fonts/google-sans-display.ttf',
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
}

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
  const type = event.data.text();
  const notificationPromise = self.registration.showNotification('Google Learn GO', {
    body: 'We haven\'t seen you in a while and it looks like you have an outstanding lesson, we have other topics you can view',
    actions: [
      {
        action: 'resume-lesson',
        title: 'Resume lesson',
        icon: action1
      },
      {
        action: 'more-topics',
        title: 'More topics',
        icon: action2
      }
    ],
    icon: icon,
    badge: badge,
    image: image,
    tag: 'video-push-notification',
    requireInteraction: true,
    vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500],
    data: {
      url: `${APP_URL}/lesson.html`
    }
  });
  event.waitUntil(notificationPromise);
});

self.addEventListener('notificationclick', function(event) {
  if (event.action == 'resume-lesson') {
    // etc
  } else if (event.action == 'more-topics') {
    // etc
  }
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || `${APP_URL}/lesson.html`)
  );
});
