const CACHE='fm26-scout-v3-6-color-stars';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(CACHE)
      .then(c=>c.addAll(ASSETS))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;

  // HTML은 네트워크 우선: GitHub/Vercel에 새 버전을 올렸을 때
  // 예전 서비스워커 캐시가 계속 보이는 문제를 줄인다.
  if(e.request.mode==='navigate'){
    e.respondWith(
      fetch(e.request)
        .then(r=>{
          const copy=r.clone();
          caches.open(CACHE).then(c=>c.put('./index.html',copy)).catch(()=>{});
          return r;
        })
        .catch(()=>caches.match('./index.html'))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached=>{
      const network=fetch(e.request).then(r=>{
        const copy=r.clone();
        caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});
        return r;
      });
      return cached||network;
    })
  );
});
