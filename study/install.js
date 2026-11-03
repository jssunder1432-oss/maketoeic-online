/* 학습실 앱 설치 안내: 안드로이드는 설치 버튼, 아이폰은 '홈 화면에 추가' 방법 안내 */
(function () {
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js", { scope: "./" }).catch(function () { });
  var ua = navigator.userAgent || "", standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  if (standalone) return;
  var mobile = /Android|iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (!mobile) return;
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }
  var until = +get("mk:installHide") || 0; if (Date.now() < until) return;
  var ios = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var inapp = /KAKAOTALK|NAVER|Instagram|FBAN|FBAV|Line\//i.test(ua);
  var deferred = null;
  var css = document.createElement("style");
  css.textContent = '#mk-inst{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:9999;max-width:520px;margin:0 auto;background:#1D2C4D;color:#fff;border-radius:18px;box-shadow:0 12px 36px rgba(0,0,0,.35);padding:14px 14px 14px 12px;font-family:"Pretendard Variable",Pretendard,-apple-system,"Apple SD Gothic Neo",sans-serif;display:flex;gap:12px;align-items:center;animation:mkup .25s ease-out}'
    + '@keyframes mkup{from{transform:translateY(30px);opacity:0}to{transform:none;opacity:1}}'
    + '#mk-inst img{width:52px;height:52px;border-radius:12px;flex:none}'
    + '#mk-inst .t{flex:1;min-width:0;font-size:13.5px;line-height:1.45;color:#D7E0EE}#mk-inst .t b{display:block;color:#fff;font-size:15.5px;margin-bottom:2px}'
    + '#mk-inst .t i{font-style:normal;display:inline-block;background:rgba(255,255,255,.14);border-radius:6px;padding:0 6px;color:#fff;font-weight:700}'
    + '#mk-inst .go{flex:none;border:0;background:#FF581F;color:#fff;font:inherit;font-weight:800;font-size:14px;border-radius:12px;padding:10px 14px}'
    + '#mk-inst .x{position:absolute;top:6px;right:8px;border:0;background:none;color:#9FB0CC;font-size:18px;line-height:1;padding:4px}';
  document.head.appendChild(css);
  function show(html, btn, onBtn) {
    var old = document.getElementById("mk-inst"); if (old) old.remove();
    var d = document.createElement("div"); d.id = "mk-inst";
    d.innerHTML = '<img src="app/icon-192.png" alt=""><div class="t">' + html + '</div>' + (btn ? '<button class="go">' + btn + '</button>' : "") + '<button class="x" aria-label="닫기">×</button>';
    document.body.appendChild(d);
    d.querySelector(".x").onclick = function () { set("mk:installHide", String(Date.now() + 7 * 864e5)); d.remove(); };
    if (btn) d.querySelector(".go").onclick = onBtn;
  }
  var SHARE = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" style="vertical-align:-2px"><path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 12v8h14v-8"/></svg>';
  function iosGuide() { show("<b>메이크토익 앱으로 설치하기</b>아래 " + "<i>" + SHARE + " 공유</i> 버튼 → <i>홈 화면에 추가</i>를 누르면 앱처럼 쓸 수 있어요.", "", null); }
  setTimeout(function () {
    if (inapp) return show("<b>앱으로 설치하려면</b>" + (ios ? "오른쪽 아래 <i>⋯</i> → <i>Safari로 열기</i>" : "오른쪽 위 <i>⋮</i> → <i>다른 브라우저로 열기</i>") + " 후 설치할 수 있어요.", "", null);
    if (ios) return iosGuide();
    if (!deferred) show("<b>메이크토익 앱으로 설치하기</b>오른쪽 위 <i>⋮</i> 메뉴 → <i>홈 화면에 추가</i>(또는 <i>앱 설치</i>)를 누르면 앱처럼 쓸 수 있어요.", "", null);
  }, 4000);
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); deferred = e;
    show("<b>메이크토익 앱으로 설치하기</b>홈 화면에 아이콘이 생기고 앱처럼 바로 열려요.", "설치", function () {
      var d = document.getElementById("mk-inst"); if (d) d.remove();
      deferred.prompt(); deferred.userChoice.then(function () { deferred = null; });
    });
  });
  window.addEventListener("appinstalled", function () { var d = document.getElementById("mk-inst"); if (d) d.remove(); });
})();
