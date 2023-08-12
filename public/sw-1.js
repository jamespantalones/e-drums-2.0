const addResourcesToCache = async () => {
  const cache = await caches.open('v1');
  const res = await fetch('./cache.json');
  const audios = await res.json();

  await cache.addAll(audios.map((a) => `/${a}`));
};

const putInCache = async (request, response) => {
  const cache = await caches.open('v1');
  await cache.put(request, response);
};

const cacheFirst = async (request) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  const responseFromNetwork = await fetch(request);
  putInCache(request, responseFromNetwork.clone());
  return responseFromNetwork;
};

self.addEventListener('install', (event) => {
  event.waitUntil(addResourcesToCache());

  console.log('service worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  console.log('service worker activated');
});

self.addEventListener('fetch', (event) => {
  let { request } = event;

  if (request.url.includes('.wav')) {
    event.respondWith(cacheFirst(event.request));
  }

  if (request.headers.has('range')) {
    // 206 responses are not cacheable, so delete
    const newHeaders = new Headers(request.headers);
    newHeaders.delete('range');
    request = new Request(request.url, {
      ...requestInitFromRequest(request),
      headers: newHeaders,
    });
  }
});
