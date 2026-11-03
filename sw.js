/* 메이크토익 학습실 앱 설치용 서비스워커 — 캐시하지 않고 항상 최신 화면을 받는다 */
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", function () { });
