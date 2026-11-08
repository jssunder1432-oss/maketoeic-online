/* 학습실 모든 수업영상 공통 재생 도구 (2026-11-06)
   - 빨간 재생바(손으로 끌어 이동) · 배속(누르면 아래로 펼쳐 선택, 기기에 기억) · ⏪10초/10초⏩ · ⛶ 전체화면
   - 화면 가득(전체화면·가로로 돌리면 자동): 위 막대(✕ 닫기·10초) + 아래 빨간 재생바, 5초 뒤 숨김 → 화면 한 번 누르면 다시
     빠르게 두 번 누르면 왼쪽 10초 뒤로 / 오른쪽 10초 앞으로, 막대 보일 때 한 번 누르면 재생·정지
   - 영상 종류: 학습실 mp4 강의(<video>) + 당일 수업 녹화(유튜브)
   window.mkPlayer(W, P, ctl) — W: 영상 상자, P: {el, t(), d(), playing(), seek(s), play(), pause(), rate(r), on(fn)}, ctl: 조작 버튼 줄을 그릴 곳 */
(function () {
  if (window.mkPlayer) return;
  var SP = [0.75, 1, 1.25, 1.5, 1.75, 2];
  function cur() { try { var v = +localStorage.getItem("mkst:speed"); return SP.indexOf(v) >= 0 ? v : (v === 0.8 ? 0.75 : 1); } catch (e) { return 1; } }
  function save(v) { try { localStorage.setItem("mkst:speed", String(v)); } catch (e) { } }
  function fmt(t) { t = Math.max(0, Math.floor(t || 0)); var h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), s = t % 60; return (h ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s; }
  var CSS = [
    ".mkp-row{display:flex;flex-wrap:wrap;gap:6px}.mkp-ctl{background:#fff;border:2px solid #172844;border-radius:16px;padding:10px;margin:0 0 10px}",
    ".mkp-in .mkp-ctl{border:0;border-radius:0;margin:0;background:#0B1424;padding:8px}.mkp-in .mkp-b{border-color:#fff;background:#14233E;color:#fff}.mkp-in .mkp-b.on{background:#fff;color:#0B1424}",
    ".mkp-b{border:2px solid #172844;background:#fff;color:#172844;border-radius:10px;padding:8px 11px;font:inherit;font-size:15px;font-weight:800;cursor:pointer}.mkp-b.on{background:#172844;color:#fff}",
    ".mkp-sp{display:grid;gap:4px;margin-top:8px;border:2px solid #172844;border-radius:12px;padding:4px;background:#F4F6FA}.mkp-spi{border:0;background:#fff;border-radius:9px;padding:11px 12px;text-align:left;font:inherit;font-size:16px;font-weight:800;color:#172844;cursor:pointer}.mkp-spi.on{background:#172844;color:#fff}",
    ".mkp-sk{position:relative;z-index:6;background:#0B1424;padding:14px 14px 10px;touch-action:none;user-select:none;-webkit-user-select:none;cursor:pointer}",
    ".mkp-tr{position:relative;height:6px;border-radius:3px;background:rgba(255,255,255,.3)}.mkp-fl{position:absolute;left:0;top:0;height:100%;background:#FF0033;border-radius:3px}",
    ".mkp-kn{position:absolute;top:50%;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:#FF0033;box-shadow:0 0 0 3px rgba(255,0,51,.25)}",
    ".mkp-sk.dg .mkp-tr{height:10px;margin-top:-2px}.mkp-sk.dg .mkp-kn{width:24px;height:24px;margin:-12px 0 0 -12px}",
    ".mkp-tm{display:flex;justify-content:space-between;color:#fff;font-size:13px;font-weight:700;margin-top:8px;font-variant-numeric:tabular-nums}",
    ".mkp-tip{position:absolute;bottom:30px;transform:translateX(-50%);background:#fff;color:#0B1424;font-weight:800;font-size:13px;padding:3px 8px;border-radius:8px;display:none;white-space:nowrap}.mkp-sk.dg .mkp-tip{display:block}",
    ".mkp-top{display:none;position:absolute;left:0;right:0;top:0;z-index:9;gap:6px;padding:8px;padding-top:calc(8px + env(safe-area-inset-top));background:linear-gradient(#000b,#0000);transition:opacity .25s}",
    ".mkp-top .mkp-b{border-color:#fff;background:#14233Ecc;color:#fff;padding:6px 10px;font-size:14px}",
    ".mkp-tap{position:absolute;left:0;top:0;right:0;z-index:7;-webkit-tap-highlight-color:transparent;touch-action:manipulation}",
    ".mkp-big{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:76px;height:76px;border-radius:50%;background:#000a;color:#fff;font-size:34px;display:none;align-items:center;justify-content:center;pointer-events:none;z-index:8}.mkp-paused .mkp-big{display:flex}",
    ".mkp-fx{position:absolute;top:50%;transform:translate(-50%,-50%);width:110px;height:110px;border-radius:50%;background:#0008;color:#fff;font-weight:800;font-size:17px;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:9;animation:mkpfx .6s ease-out forwards}@keyframes mkpfx{0%{opacity:1}100%{opacity:0}}",
    ".mkp-fs{position:fixed!important;left:0!important;top:0!important;right:0;bottom:0;width:100vw!important;height:100vh!important;height:100dvh!important;z-index:99999!important;margin:0!important;border-radius:0!important;background:#000!important;overflow:hidden}",
    ".mkp-fs>*:not(.mkp-keep){display:none!important}.mkp-fs .mkp-media{position:absolute!important;left:0;top:0;width:100%!important;height:100%!important;aspect-ratio:auto!important;object-fit:contain;max-height:none!important}",
    ".mkp-fs .mkp-tap{top:0!important;height:100%!important}.mkp-fs .mkp-top{display:flex}.mkp-fs .mkp-sk{position:absolute;left:0;right:0;bottom:0;z-index:9;background:linear-gradient(#0000,#000c);padding-bottom:calc(10px + env(safe-area-inset-bottom));transition:opacity .25s}",
    ".mkp-hide .mkp-top,.mkp-hide .mkp-sk{opacity:0;pointer-events:none}"
  ].join("");
  function css() { if (document.getElementById("mkp-css")) return; var s = document.createElement("style"); s.id = "mkp-css"; s.textContent = CSS; document.head.appendChild(s); }
  var LQ = window.matchMedia ? matchMedia("(orientation: landscape) and (pointer: coarse)") : null;
  var ALL = [];
  function onRot() { ALL = ALL.filter(function (x) { return document.body.contains(x.W); }); var x = ALL[ALL.length - 1]; if (x) x.rot(); }
  if (LQ) { if (LQ.addEventListener) LQ.addEventListener("change", onRot); else if (LQ.addListener) LQ.addListener(onRot); }
  window.mkPlayer = function (W, P, ctl) {
    if (!W || !P || W.dataset.mkp) return; W.dataset.mkp = "1"; css();
    var rate = cur(), spOpen = false, drag = false, dt = 0, hideT = null, lastTap = 0, tapT = null, auto = false;
    P.el.classList.add("mkp-keep", "mkp-media");
    if (getComputedStyle(W).position === "static") W.style.position = "relative";
    // 빨간 재생바
    var SK = document.createElement("div"); SK.className = "mkp-sk mkp-keep";
    SK.innerHTML = '<div class="mkp-tr"><div class="mkp-fl"></div><div class="mkp-kn"></div><div class="mkp-tip"></div></div><div class="mkp-tm"><span>0:00</span><span>0:00</span></div>';
    P.el.insertAdjacentElement("afterend", SK);
    var TR = SK.querySelector(".mkp-tr"), FL = SK.querySelector(".mkp-fl"), KN = SK.querySelector(".mkp-kn"), TIP = SK.querySelector(".mkp-tip"), T1 = SK.querySelectorAll(".mkp-tm span")[0], T2 = SK.querySelectorAll(".mkp-tm span")[1];
    function paint(t) {
      var d = P.d(), p = d ? Math.max(0, Math.min(1, t / d)) : 0;
      FL.style.width = KN.style.left = TIP.style.left = p * 100 + "%"; TIP.textContent = fmt(t); T1.textContent = fmt(t); T2.textContent = fmt(d);
      W.classList.toggle("mkp-paused", !P.playing()); fit();
    }
    function at(e) { var r = TR.getBoundingClientRect(); return Math.max(0, Math.min(1, ((e.touches ? e.touches[0].clientX : e.clientX) - r.left) / r.width)) * P.d(); }
    SK.addEventListener("pointerdown", function (e) { if (!P.d()) return; e.preventDefault(); try { SK.setPointerCapture(e.pointerId); } catch (er) { } drag = true; SK.classList.add("dg"); dt = at(e); paint(dt); showCtl(); });
    SK.addEventListener("pointermove", function (e) { if (!drag) return; e.preventDefault(); dt = at(e); paint(dt); });
    function up() { if (!drag) return; drag = false; SK.classList.remove("dg"); P.seek(dt); paint(dt); showCtl(); }
    SK.addEventListener("pointerup", up); SK.addEventListener("pointercancel", up);
    // 화면 가득일 때 위 막대 · 터치 판
    var TOP = document.createElement("div"); TOP.className = "mkp-top mkp-row mkp-keep";
    TOP.innerHTML = '<button class="mkp-b" data-x>✕ 닫기</button><button class="mkp-b" data-j="-10">⏪ 10초</button><button class="mkp-b" data-j="10">10초 ⏩</button>';
    W.appendChild(TOP);
    var TAP = document.createElement("div"); TAP.className = "mkp-tap mkp-keep"; W.appendChild(TAP);
    var BIG = document.createElement("div"); BIG.className = "mkp-big mkp-keep"; BIG.textContent = "▶"; W.appendChild(BIG);
    TOP.querySelector("[data-x]").onclick = fsOff;
    TOP.querySelectorAll("[data-j]").forEach(function (b) { b.onclick = function () { jump(+b.dataset.j); showCtl(); }; });
    function fit() { if (isFs()) { TAP.style.top = ""; TAP.style.height = ""; BIG.style.top = ""; return; } var top = P.el.offsetTop, h = P.el.offsetHeight - (P.bot || 0); TAP.style.top = top + "px"; TAP.style.height = Math.max(0, h) + "px"; BIG.style.top = (top + h / 2) + "px"; }
    window.addEventListener("resize", fit); setTimeout(fit, 100); setTimeout(fit, 1200);
    function isFs() { return W.classList.contains("mkp-fs"); }
    function showCtl() { W.classList.remove("mkp-hide"); clearTimeout(hideT); if (isFs()) hideT = setTimeout(function () { if (!drag && isFs() && P.playing()) W.classList.add("mkp-hide"); }, 5000); }
    function jump(d) { var t = Math.max(0, Math.min(P.d() || 9e9, P.t() + d)); P.seek(t); paint(t); }
    function fx(side, txt) { var e = document.createElement("div"); e.className = "mkp-fx mkp-keep"; e.style.left = side < 0 ? "22%" : "78%"; e.textContent = txt; W.appendChild(e); setTimeout(function () { e.remove(); }, 650); }
    function toggle() { if (P.playing()) P.pause(); else P.play(); setTimeout(function () { paint(P.t()); }, 120); }
    TAP.addEventListener("click", function (e) {
      var r = W.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, t = Date.now();
      if (isFs() && t - lastTap < 320) {
        clearTimeout(tapT); lastTap = 0;
        if (x < 0.4) { jump(-10); fx(-1, "⏪ 10초"); } else if (x > 0.6) { jump(10); fx(1, "10초 ⏩"); } else toggle();
        showCtl(); return;
      }
      lastTap = t;
      if (!isFs()) { toggle(); return; }
      tapT = setTimeout(function () { if (W.classList.contains("mkp-hide")) showCtl(); else { toggle(); showCtl(); } }, 330);
    });
    W.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    // 전체화면 (휴대폰은 화면 가득 방식 — 아이폰도 됨)
    function fsOn() {
      W.classList.add("mkp-fs"); document.documentElement.style.overflow = "hidden"; document.body.style.overflow = "hidden";
      try { var rq = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen; if (rq && !document.fullscreenElement) { var pr = rq.call(document.documentElement); if (pr && pr.then) pr.then(function () { try { screen.orientation.lock("landscape").catch(function () { }); } catch (e) { } }).catch(function () { }); } } catch (e) { }
      showCtl(); paint(P.t());
    }
    function fsOff() {
      auto = false; W.classList.remove("mkp-fs", "mkp-hide", "mkp-paused"); clearTimeout(hideT); document.documentElement.style.overflow = ""; document.body.style.overflow = "";
      try { if (document.fullscreenElement || document.webkitFullscreenElement) (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) { }
      try { screen.orientation && screen.orientation.unlock && screen.orientation.unlock(); } catch (e) { }
    }
    document.addEventListener("fullscreenchange", function () { if (!document.fullscreenElement && isFs() && !(LQ && LQ.matches)) fsOff(); });
    window.addEventListener("hashchange", function () { if (isFs()) fsOff(); });
    var me = { W: W, rot: function () { if (!document.body.contains(W)) return; if (LQ.matches && !isFs()) { auto = true; fsOn(); } else if (!LQ.matches && auto) fsOff(); } };
    ALL.push(me); if (LQ && LQ.matches) setTimeout(me.rot, 300);
    // 조작 버튼 줄 (배속 · 10초 · 전체화면)
    var box = ctl;
    if (!box) { box = document.createElement("div"); box.className = "mkp-keep-not"; W.parentNode.insertBefore(box, W.nextSibling); }
    function draw() {
      box.innerHTML = '<div class="mkp-ctl"><div class="mkp-row"><button class="mkp-b' + (spOpen ? " on" : "") + '" data-mkspd>⏩ ' + rate + "배 " + (spOpen ? "▲" : "▼") + '</button><button class="mkp-b" data-j="-10">⏪ 10초</button><button class="mkp-b" data-j="10">10초 ⏩</button><button class="mkp-b" data-fs>⛶ 전체화면</button></div>' +
        (spOpen ? '<div class="mkp-sp">' + SP.map(function (r) { return '<button class="mkp-spi' + (r === rate ? " on" : "") + '" data-r="' + r + '">' + (r === rate ? "✓ " : "") + r + "배</button>"; }).join("") + "</div>" : "") + "</div>";
      box.querySelector("[data-mkspd]").onclick = function () { spOpen = !spOpen; draw(); };
      box.querySelectorAll("[data-r]").forEach(function (b) { b.onclick = function () { rate = +b.dataset.r; save(rate); P.rate(rate); spOpen = false; draw(); }; });
      box.querySelectorAll("[data-j]").forEach(function (b) { b.onclick = function () { jump(+b.dataset.j); }; });
      box.querySelector("[data-fs]").onclick = fsOn;
    }
    draw();
    P.rate(rate);
    function gate() { TAP.style.pointerEvents = (!P.gate || P.gate()) ? "" : "none"; }
    gate();
    var useOnce = false;
    P.on(function () { if (!useOnce && P.playing()) { useOnce = true; try { window.mkUseLog && window.mkUseLog("vid"); } catch (e) { } } gate(); if (!drag) paint(P.t()); if (isFs() && !P.playing()) { W.classList.remove("mkp-hide"); clearTimeout(hideT); } });
    paint(0);
    return { draw: draw, setRate: function (r) { rate = r; draw(); } };
  };
  // ---------- <video> 강의 자동 연결 ----------
  function vidAdapter(v) {
    var fns = [];
    ["timeupdate", "durationchange", "loadedmetadata", "play", "pause", "seeked", "emptied"].forEach(function (e) { v.addEventListener(e, function () { fns.forEach(function (f) { f(); }); }); });
    v.addEventListener("loadedmetadata", function () { var r = cur(); if (v.playbackRate !== r) { v.defaultPlaybackRate = r; v.playbackRate = r; } });
    return {
      el: v, t: function () { return v.currentTime || 0; }, d: function () { return isFinite(v.duration) ? v.duration : 0; }, playing: function () { return !v.paused && !v.ended; },
      seek: function (s) { try { v.currentTime = s; } catch (e) { } }, play: function () { var p = v.play(); if (p && p.catch) p.catch(function () { }); }, pause: function () { v.pause(); },
      rate: function (r) { v.defaultPlaybackRate = r; v.playbackRate = r; }, on: function (f) { fns.push(f); }
    };
  }
  window.mkVidCtl = function (v) {
    if (v.dataset.mkpv) return; v.dataset.mkpv = "1";
    v.removeAttribute("controls"); v.controls = false; v.setAttribute("playsinline", ""); v.setAttribute("controlsList", "nodownload");
    var W = v.parentNode; if (!W) return;
    v.dataset.spd = "1"; W.querySelectorAll(".mk-speed").forEach(function (b) { b.remove(); });
    var ctl = document.createElement("div"); ctl.className = "mkp-in mkp-keep-not";
    W.appendChild(ctl);
    window.mkPlayer(W, vidAdapter(v), ctl);
  };
  function scan() { document.querySelectorAll("#lcv-v, #al-v, #tb-v, .mkst video, #mk-host video").forEach(function (v) { if (v.closest("[data-nomkp]")) return; window.mkVidCtl(v); }); }
  var tm = 0; function later() { clearTimeout(tm); tm = setTimeout(scan, 60); }
  if (document.body) { new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); scan(); }
  else document.addEventListener("DOMContentLoaded", function () { new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); scan(); });
})();
