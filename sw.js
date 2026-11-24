// Offline: rete prima (così gli aggiornamenti arrivano), cache se non c'è connessione.
// Nessun dato utente passa di qui: i dati stanno in localStorage.
const V = 'b14';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((r) => { const copy = r.clone(); caches.open(V).then((c) => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true })),
  );
});
