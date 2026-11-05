/* 학습실 영상 우클릭 금지 (2026-11-05)
   - 학습실 안 유튜브 영상(해설강의 등)에 투명 막을 덮어 우클릭 메뉴(영상 주소 복사 등)를 막는다.
   - 막을 누르면 재생/일시정지 (YouTube IFrame API postMessage). 아래 조작 막대(재생바·소리·전체화면)는 그대로 쓸 수 있게 비워 둔다.
   - 영상 둘레(상자)에서도 우클릭 금지. */
(function () {
  var CSS = ".ytg-w{position:relative}.ytg{position:absolute;left:0;top:0;right:0;bottom:54px;z-index:3;background:transparent;cursor:pointer;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}";
  function css() { if (document.getElementById("ytg-css")) return; var s = document.createElement("style"); s.id = "ytg-css"; s.textContent = CSS; document.head.appendChild(s); }
  function send(f, func) { try { f.contentWindow.postMessage(JSON.stringify({ event: "command", func: func, args: [] }), "*"); } catch (e) { } }
  function guard(f) {
    if (f.dataset.ytg) return; f.dataset.ytg = "1"; css();
    var src = f.getAttribute("src") || "";
    if (!/enablejsapi=1/.test(src)) f.setAttribute("src", src + (src.indexOf("?") >= 0 ? "&" : "?") + "enablejsapi=1&disablekb=0");
    var w = f.parentNode; if (!w) return;
    if (getComputedStyle(w).position === "static") w.classList.add("ytg-w");
    var o = document.createElement("div"); o.className = "ytg"; o.setAttribute("aria-hidden", "true");
    f.insertAdjacentElement("afterend", o);
    f.ytState = -1;
    f.addEventListener("load", function () { try { f.contentWindow.postMessage(JSON.stringify({ event: "listening", id: 1 }), "*"); } catch (e) { } });
    o.addEventListener("click", function (e) { e.preventDefault(); send(f, f.ytState === 1 ? "pauseVideo" : "playVideo"); f.ytState = f.ytState === 1 ? 2 : 1; });
    w.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  }
  // 영상이 알려 주는 재생 상태로 막 누르기(재생/정지)를 맞춘다
  window.addEventListener("message", function (e) {
    if (!/youtube(-nocookie)?\.com$/.test(String(e.origin).replace(/^https?:\/\/(www\.)?/, ""))) return;
    var d; try { d = typeof e.data === "string" ? JSON.parse(e.data) : e.data; } catch (er) { return; }
    var st = d && d.info && d.info.playerState; if (st == null && d && d.event === "onStateChange") st = d.info;
    if (st == null) return;
    document.querySelectorAll("iframe[data-ytg]").forEach(function (f) { if (f.contentWindow === e.source) f.ytState = st; });
  });
  function scan(root) { (root.querySelectorAll ? root : document).querySelectorAll('iframe[src*="youtube"]').forEach(guard); }
  function start() {
    scan(document);
    new MutationObserver(function (M) { M.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType !== 1) return; if (n.tagName === "IFRAME" && /youtube/.test(n.src)) guard(n); else if (n.querySelector) scan(n); }); }); }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
