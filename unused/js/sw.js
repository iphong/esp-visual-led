importScripts('/cache-polyfill.js');

self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('sdc_led_controller').then(function(cache) {
     return cache.addAll([
       '/',
       '/index.html',
       '/edit.html',
       '/js/ace.js',
       '/js/mode-html.js',
       '/js/api.js',
       '/js/app.js',
       '/js/audio.js',
       '/js/color.js',
       '/css/app.css'
     ]);
   })
 );
});
