/* ─────────────────────────────────────────────────────────────
   응원가이드 서비스워커 — 오프라인에서도 열리도록 파일을 폰에 저장해 둡니다.

   ★ 가사나 화면을 고쳐서 다시 올릴 때는 아래 CACHE_VERSION 숫자를 꼭 올려 주세요.
     그래야 사람들 폰에 새 내용이 내려갑니다. (v1 → v2 → v3 …)
   ───────────────────────────────────────────────────────────── */
const CACHE_VERSION = "v99";
const CACHE_NAME    = `horo-guide-${CACHE_VERSION}`;

/* 처음 방문할 때 미리 받아 둘 파일들.
   없는 파일이 있어도 설치가 실패하지 않도록 하나씩 따로 담습니다. */
const PRECACHE = [
  "./",
  "./index.html",
  "./design.css",
  "./fonts/PretendardVariable.woff2",
  "./fonts/GmarketSansMedium.woff",
  "./fonts/GmarketSansBold.woff",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png",
  "./images/poster.jpg",
  "./images/poster-guide.jpg",
  "./images/poster-song.jpg",
  "./images/setlist-bg.jpg",

  /* 공지 · 안내 이미지 (images/notice/) — 없는 파일은 그냥 건너뜁니다 */
  "./images/notice/01-venue-map.jpg",
  "./images/notice/02-id-check.jpg",
  "./images/notice/03-camera.jpg",
  "./images/notice/04-md-sales.jpg",
  "./images/notice/05-md-list.jpg",
  "./images/notice/06-md-notice.jpg",
  "./images/notice/07-cd-sales.jpg",
  "./images/notice/08-cd-bonus.jpg",
  "./images/notice/09-vaws-booth.jpg",
  "./images/notice/10-vaws-card.jpg",
  "./images/notice/11-photo-booth.jpg",
  "./images/notice/12-quick-bites.jpg",
  "./images/notice/13-sns-event.jpg"
];

/* 구글 폰트처럼 다른 도메인에 있지만 저장해 두면 좋은 것들 */
const RUNTIME_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(PRECACHE.map(url =>
      cache.add(new Request(url, { cache: "reload" })).catch(() => {
        /* 포스터 이미지가 없는 경우 등 — 그냥 건너뜁니다 */
      })
    ));
    self.skipWaiting();   // 새 버전을 곧바로 대기 상태로
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k.startsWith("horo-guide-") && k !== CACHE_NAME)
          .map(k => caches.delete(k))          // 옛 버전 캐시 정리
    );
    await self.clients.claim();
  })());
});

/* 페이지가 "이 파일들도 오프라인용으로 받아 둬" 하고 보내오면 하나씩 챙겨 둔다.
   짤방 GIF 는 용량이 크므로 한꺼번에 받지 않고 순서대로,
   이미 받아 둔 것은 건너뛴다. 하나가 실패해도 나머지는 계속 받는다. */
async function cacheUrls(urls){
  const cache = await caches.open(CACHE_NAME);
  for (const url of urls){
    try {
      if (await cache.match(url)) continue;          // 이미 있으면 넘어감
      const res = await fetch(url, { cache: "no-cache" });
      if (res && res.ok) await cache.put(url, res.clone());
    } catch (e) { /* 이 파일만 건너뛴다 */ }
  }
}

/* 페이지에서 "지금 새 버전 적용" 을 눌렀을 때 */
self.addEventListener("message", (event) => {
  const d = event.data;
  if (!d) return;
  if (d.type === "SKIP_WAITING") self.skipWaiting();
  if (d.type === "CACHE_URLS" && Array.isArray(d.urls)) event.waitUntil(cacheUrls(d.urls));
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  /* 유튜브 등 그 밖의 외부 요청은 손대지 않습니다 (영상은 캐시 불가) */
  const sameOrigin = url.origin === self.location.origin;
  const isFontHost = RUNTIME_HOSTS.includes(url.hostname);
  if (!sameOrigin && !isFontHost) return;

  /* 페이지 이동(주소 입력·새로고침) — 네트워크 우선, 실패하면 저장해 둔 화면 */
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put("./index.html", fresh.clone());
        return fresh;
      } catch (e) {
        const cache  = await caches.open(CACHE_NAME);
        return (await cache.match("./index.html")) || (await cache.match("./")) || Response.error();
      }
    })());
    return;
  }

  /* 나머지 파일 — 저장해 둔 걸 즉시 보여 주고, 뒤에서 조용히 최신본으로 갱신 */
  event.respondWith((async () => {
    const cache  = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);

    const network = fetch(req).then((res) => {
      if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
      return res;
    }).catch(() => null);

    return cached || (await network) || Response.error();
  })());
});
