const CACHE_NAME = 'puncakgo-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/villas.html',
  '/tours.html',
  '/other-services.html',
  '/visa.html',
  '/privacy.html',
  '/style.css',
  '/script.js',
  '/offline.html'
];

// تثبيت Service Worker وتخزين الملفات
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// جلب الملفات (استراتيجية: network first, ثم cache)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // تحديث cache بنسخة جديدة
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // إذا فشل الاتصال، جلب من cache
        return caches.match(event.request)
          .then(response => {
            if (response) return response;
            // إذا كان طلب صفحة HTML، أظهر offline.html
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// تنظيف caches القديمة عند التحديث
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
