/* Cache application assets only. Patient photos and drafts never enter this cache. */
const CACHE='alsahabi-cards-v1.1.0';
const ROOT=new URL('./',self.location.href);
const ASSETS=['./','./index.html','./manifest.webmanifest','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('message',event=>{if(event.data==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('alsahabi-cards-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==ROOT.origin||!url.pathname.startsWith(ROOT.pathname))return;
 if(event.request.mode==='navigate'){event.respondWith(caches.open(CACHE).then(async cache=>{const saved=await cache.match(new URL('index.html',ROOT).href);return saved||fetch(event.request);}));return;}
 if(!ASSETS.some(path=>new URL(path,ROOT).href===url.href))return;
 event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(event.request))||fetch(event.request)));
});
