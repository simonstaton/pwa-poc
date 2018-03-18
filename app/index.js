import registerServiceWorker, { ServiceWorkerNoSupportError } from 'service-worker-loader!./service-worker.js';

// Parse vapid public key
const vapidPublicKey = ((key) => {
  const padding = '='.repeat((4 - key.length % 4) % 4);
  const base64 = (key + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
})(VAPID_PUB_KEY);

// Service Worker
registerServiceWorker({ scope: '/' });
navigator.serviceWorker.ready.then(worker => {
  worker.pushManager.getSubscription().then(subscription => {
    if (subscription === null) {
      const prompt = worker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      }).then(subscription => {
        window.pushNotificationSubscription = subscription;
      })
    } else {
      window.pushNotificationSubscription = subscription;
    }
  });
});

// Video notification
(() => {
  const $playVideo = document.querySelector('.jsPlayVideo');
  if (!$playVideo) return;
  $playVideo.addEventListener('click', playVideo);

  function playVideo() {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', `${PUSH_SERVICE_URL}/send-notification`);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify({
      subscription: window.pushNotificationSubscription,
      data: {
        type: 'video-stopped',
        timer: 1 * 10 * 1000 // Send notification in 1 minute
      }
    }));
  }
})();

// Login buttons
(() => {
  const $login = Array.from(document.querySelectorAll('.jsLogin'));
  if (!$login[1]) return; // fast exit
  const $loader = document.querySelector('.jsLoginLoader');

  $login.forEach(el => el.addEventListener('click', login));

  let loginTimer;
  function login(e) {
    e.preventDefault();
    if (loginTimer) clearTimeout(loginTimer);
    loginTimer = setTimeout(() => {
      $login.forEach(el => el.style.visibility = 'hidden');
      $loader.classList.add('login__loader--visible');
      if (loginTimer) clearTimeout(loginTimer);
      loginTimer = setTimeout(() => {
        document.location = e.target.href;
      }, 500);
    }, 250);
  }
})();

// Mobile nav
(() => {
  const $openNav = document.querySelector('.jsOpenNav');
  if (!$openNav) return; // fast exit
  const $closeNav = document.querySelector('.jsCloseNav');
  const $nav = document.querySelector('.nav');
  const $shadow = document.querySelector('.nav__shadow');

  $openNav.addEventListener('click', event => toggleNav(true, event));
  $shadow.addEventListener('click', event => toggleNav(false, event));
  $closeNav.addEventListener('click', event => toggleNav(false, event));

  function toggleNav(shouldShow, event) {
    if (event) event.preventDefault();
    $nav.classList[shouldShow ? 'add' : 'remove']('nav--open');
  };
})();

// Ripple animation effect
(() => {
  function getOffset(evt) {
    var el = evt.target,
      x = 0,
      y = 0;

    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    x += el.offsetLeft - el.scrollLeft;
    y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
    }

    x = evt.clientX - x;
    y = evt.clientY - y;

    return { x: x, y: y };
  }

  function createStyles(css) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet){
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
    return style;
  }

  window.ripple = function(event) {
    var target = event.target.onclick ? event.target : event.target.parentNode;
    var offset = getOffset(event);
    setTimeout(() => {
      var stylesheet = createStyles('.animate--ripple:after { top: ' + offset.y + 'px; left: ' + offset.x + 'px; }');
      target.classList.add('animate--ripple');
      target.classList.add('animate--ripple-active');
      setTimeout(() => {
        target.classList.remove('animate--ripple-active');
      }, 250);
      setTimeout(() => { // cleanup
        target.classList.remove('animate--ripple');
        stylesheet.parentNode.removeChild(stylesheet);
      }, 750);
    }, 0);
  }
})();
