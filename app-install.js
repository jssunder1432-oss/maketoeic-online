/* 메이크토익 앱 설치: 화면 오른쪽 아래 '앱 설치' 버튼(항상) + 처음 들어왔을 때 안내창 */
(function () {
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(function () { });
  var ua = navigator.userAgent || "";
  if (window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true) { var h = document.createElement("style"); h.textContent = "#mk-dl{display:none!important}"; document.head.appendChild(h); return; }
  var ios = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var android = /Android/i.test(ua), mobile = ios || android;
  var inapp = /KAKAOTALK|NAVER\(|NAVER|Instagram|FBAN|FBAV|Line\/|DaumApps/i.test(ua);
  var samsung = /SamsungBrowser/i.test(ua);
  var deferred = null;
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }
  var css = document.createElement("style");
  css.textContent = '#mk-inst{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:10000;max-width:520px;margin:0 auto;background:#1D2C4D;color:#fff;border-radius:18px;box-shadow:0 12px 36px rgba(0,0,0,.35);padding:14px 34px 14px 12px;font-family:"Pretendard Variable",Pretendard,-apple-system,"Apple SD Gothic Neo",sans-serif;display:flex;flex-wrap:wrap;gap:10px 12px;align-items:center;box-sizing:border-box;animation:mkup .25s ease-out}'
    + '@keyframes mkup{from{transform:translateY(30px);opacity:0}to{transform:none;opacity:1}}'
    + '#mk-inst img{width:52px;height:52px;border-radius:12px;flex:none}'
    + '#mk-inst .t{flex:1 1 0;min-width:0;font-size:13.5px;line-height:1.5;color:#D7E0EE}#mk-inst .t b{display:block;color:#fff;font-size:15.5px;margin-bottom:2px}'
    + '#mk-inst .t i{font-style:normal;display:inline-block;background:rgba(255,255,255,.16);border-radius:6px;padding:0 6px;color:#fff;font-weight:700}'
    + '#mk-inst .go{flex:1 1 100%;border:0;background:#FF581F;color:#fff;font:inherit;font-weight:800;font-size:14px;border-radius:12px;padding:10px 14px}'
    + '#mk-inst .x{position:absolute;top:6px;right:8px;border:0;background:none;color:#9FB0CC;font-size:20px;line-height:1;padding:4px}'
    + '#mk-fab{position:fixed;right:14px;bottom:calc(84px + env(safe-area-inset-bottom));z-index:9999;display:flex;align-items:center;gap:6px;border:0;background:#1D2C4D;color:#fff;font-family:"Pretendard Variable",Pretendard,-apple-system,"Apple SD Gothic Neo",sans-serif;font-weight:800;font-size:13.5px;border-radius:999px;padding:7px 14px 7px 7px;box-shadow:0 8px 22px rgba(0,0,0,.28)}'
    + '#mk-fab img{width:26px;height:26px;border-radius:7px}';
  document.head.appendChild(css);
  function close() { var d = document.getElementById("mk-inst"); if (d) d.remove(); var f = document.getElementById("mk-fab"); if (f) f.style.display = ""; }
  function show(html, btn, onBtn) {
    close();
    var d = document.createElement("div"); d.id = "mk-inst";
    d.innerHTML = '<img src="/app/icon-192.png" alt=""><div class="t">' + html + '</div>' + (btn ? '<button class="go">' + btn + '</button>' : "") + '<button class="x" aria-label="닫기">×</button>';
    document.body.appendChild(d); var f = document.getElementById("mk-fab"); if (f) f.style.display = "none";
    d.querySelector(".x").onclick = function () { set("mk:installSeen", "1"); close(); };
    if (btn) d.querySelector(".go").onclick = onBtn;
  }
  var SHARE = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" style="vertical-align:-2px"><path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 12v8h14v-8"/></svg>';
  function guide() {
    if (deferred) return show("<b>메이크토익 앱 다운로드</b>홈 화면에 아이콘이 생기고 앱처럼 바로 열려요.", "설치", function () { close(); deferred.prompt(); deferred.userChoice.then(function () { deferred = null; }); });
    if (inapp && android) return show("<b>앱으로 설치하려면</b>지금은 네이버·카톡 앱 안이라 설치가 안 돼요. 아래 버튼으로 인터넷 브라우저에서 열어 주세요. <br><small style=\"opacity:.8\">※ 크롬(아이폰은 사파리)에서 홈페이지 접속 시 다운로드 가능</small>", "브라우저로 열기", openOut);
    if (inapp) return show("<b>앱으로 설치하려면</b>지금은 앱 안 화면이라 설치가 안 돼요. 아래쪽 <i>≡</i> 또는 <i>⋯</i> 메뉴 → <i>Safari로 열기</i>(<i>기본 브라우저로 열기</i>) 후 다시 눌러 주세요. <br><small style=\"opacity:.8\">※ 크롬(아이폰은 사파리)에서 홈페이지 접속 시 다운로드 가능</small>");
    if (ios) return show("<b>메이크토익 앱 다운로드</b>사파리 아래쪽 <i>" + SHARE + " 공유</i> 버튼 → 아래로 내려서 <i>홈 화면에 추가</i> → <i>추가</i>");
    if (android) return show("<b>메이크토익 앱 다운로드</b>" + (samsung ? "아래쪽 <i>≡</i> 메뉴 → <i>현재 페이지 추가</i> → <i>홈 화면</i>" : "오른쪽 위 <i>⋮</i> 메뉴 → <i>홈 화면에 추가</i> 또는 <i>앱 설치</i>"));
    show("<b>휴대폰에서 설치할 수 있어요</b>휴대폰 크롬(아이폰은 사파리)으로 <i>maketoeic.kr</i>에 들어가 <i>앱 다운로드</i>를 누르면 설치돼요.");
  }
  function openOut() {
    var u = location.href.replace(/^https?:\/\//, "");
    if (/KAKAOTALK/i.test(ua)) { location.href = "kakaotalk://web/openExternal?url=" + encodeURIComponent(location.href); return; }
    var pkg = samsung || /SM-|Samsung/i.test(ua) ? "com.sec.android.app.sbrowser" : "com.android.chrome";
    location.href = "intent://" + u + "#Intent;scheme=https;package=" + pkg + ";S.browser_fallback_url=" + encodeURIComponent(location.href) + ";end";
  }
  window.MK_INSTALL = guide;
  function fab() {
    if (document.getElementById("mk-dl")) return;
    if (document.getElementById("mk-fab")) return;
    var b = document.createElement("button"); b.id = "mk-fab"; b.type = "button";
    b.innerHTML = '<img src="/app/icon-192.png" alt="">앱 설치';
    b.onclick = guide; document.body.appendChild(b);
  }
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferred = e; });
  window.addEventListener("appinstalled", function () { close(); var f = document.getElementById("mk-fab"); if (f) f.remove(); });
  function start() { fab(); if (/[?&]dl=1/.test(location.search)) return setTimeout(guide, 600); if (mobile && !get("mk:installSeen")) setTimeout(guide, 3000); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
