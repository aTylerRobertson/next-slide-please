// Thanks to @PaulKinlan's PWA project here: https://glitch.com/~pwa
// This is just to force HTTPS (can't do it statically on glitch)
if(location.protocol == 'http:') location.protocol = 'https:';
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('Service Worker registered', reg))
    .catch(err => console.error('Service Worker **not** registered', err));
}
else {
  console.warn('Service Worker not supported in this browser');
}