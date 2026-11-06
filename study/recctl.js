/* 당일 수업 녹화(유튜브) — 배속 · 구간 골라 보기 (2026-11-06)
   - 배속: 0.75~2배 (이 기기에 기억, 해설강의 배속과 같은 값 mkst:speed 공유)
   - 배속 버튼을 누르면 아래로 펼쳐져서 골라요 (2026-11-06 구간 기능은 빼고 재생바 끌기로)
   - ⏪10초 / 10초⏩
   - 빨간 재생바: 영상 바로 아래, 손가락(마우스)으로 끌어서 원하는 곳으로 이동 — 끄는 동안 시간 표시, 내가 정한 구간은 노란색으로 표시
   - ⛶ 전체화면: 영상 상자를 전체화면으로(안 되는 폰은 화면 가득 채우기), 위쪽 막대에 닫기·배속·10초 이동
   - 내가 구간 정하기: 시작·끝을 '지금 위치'로 찍거나 시간 입력 → 그 구간만 재생(반복 가능), 내 구간으로 저장(이 기기) */
(function () {
  var SP = [0.75, 1, 1.25, 1.5, 1.75, 2];
  function cur() { try { var v = +localStorage.getItem("mkst:speed"); return SP.indexOf(v) >= 0 ? v : 1; } catch (e) { return 1; } }
  function save(v) { try { localStorage.setItem("mkst:speed", String(v)); } catch (e) { } }
  function sec(s) { var p = String(s).split(":").map(Number); if (p.some(isNaN)) return null; return p.reduce(function (a, b) { return a * 60 + b; }, 0); }
  function fmt(t) { t = Math.max(0, Math.floor(t)); var h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), s = t % 60; return (h ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s; }
  function parse(txt) {
    var out = [];
    String(txt || "").split(/\r?\n/).forEach(function (l) {
      var m = l.trim().match(/^(\d{1,2}(?::\d{1,2}){1,2})\s*[-–~.)]?\s*(.*)$/); if (!m) return;
      var t = sec(m[1]); if (t != null) out.push({ t: t, n: m[2] || fmt(t) });
    });
    return out.sort(function (a, b) { return a.t - b.t; });
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var CSS = ".rc-box{background:#fff;border:2px solid #172844;border-radius:16px;padding:12px;margin:0 0 10px}.rc-h{font-weight:800;color:#172844;font-size:15px;margin:2px 2px 8px}.rc-row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}.rc-b{border:2px solid #172844;background:#fff;color:#172844;border-radius:10px;padding:8px 11px;font:inherit;font-size:15px;font-weight:800;cursor:pointer}.rc-b.on{background:#172844;color:#fff}.rc-ch{display:grid;gap:6px}.rc-c{display:flex;gap:10px;align-items:center;text-align:left;border:1.5px solid #D5DBE5;background:#fff;border-radius:12px;padding:10px 12px;font:inherit;font-size:15px;color:#172844;cursor:pointer}.rc-c b{min-width:58px;color:#E95721;font-variant-numeric:tabular-nums}.rc-c.on{border-color:#E95721;background:#FFF3EB;font-weight:800}.rc-fs{position:fixed!important;left:0;top:0;width:100vw;height:100vh;height:100dvh;z-index:99999;margin:0!important;border-radius:0!important;background:#000;display:flex;flex-direction:column}.rc-fs iframe{flex:1;aspect-ratio:auto!important;height:auto!important}:fullscreen#rec-wrap,:-webkit-full-screen#rec-wrap{display:flex;flex-direction:column;background:#000;border-radius:0}:fullscreen#rec-wrap iframe{flex:1;aspect-ratio:auto!important}.rc-fbar{position:relative;z-index:5;display:none;gap:6px;padding:6px;background:#0B1424;flex-wrap:wrap}.rc-fs .rc-fbar,:fullscreen .rc-fbar,:-webkit-full-screen .rc-fbar{display:flex}.rc-fbar .rc-b{border-color:#fff;background:#14233E;color:#fff;padding:6px 10px;font-size:14px}.rc-sk{position:relative;z-index:6;background:#0B1424;padding:14px 14px 10px;touch-action:none;user-select:none;-webkit-user-select:none;cursor:pointer}.rc-tr{position:relative;height:6px;border-radius:3px;background:rgba(255,255,255,.3)}.rc-ab{position:absolute;top:0;height:100%;background:#FFC83D;opacity:.85;border-radius:3px}.rc-fl{position:absolute;left:0;top:0;height:100%;background:#FF0033;border-radius:3px}.rc-kn{position:absolute;top:50%;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:#FF0033;box-shadow:0 0 0 3px rgba(255,0,51,.25)}.rc-sk.dg .rc-tr{height:10px;margin-top:-2px}.rc-sk.dg .rc-kn{width:24px;height:24px;margin:-12px 0 0 -12px}.rc-tm{display:flex;justify-content:space-between;color:#fff;font-size:13px;font-weight:700;margin-top:8px;font-variant-numeric:tabular-nums}.rc-tip{position:absolute;bottom:30px;transform:translateX(-50%);background:#fff;color:#0B1424;font-weight:800;font-size:13px;padding:3px 8px;border-radius:8px;display:none;white-space:nowrap}.rc-sk.dg .rc-tip{display:block}.rc-sp{display:grid;gap:4px;margin-top:8px;border:2px solid #172844;border-radius:12px;padding:4px;background:#F4F6FA}.rc-spi{border:0;background:#fff;border-radius:9px;padding:11px 12px;text-align:left;font:inherit;font-size:16px;font-weight:800;color:#172844;cursor:pointer}.rc-spi.on{background:#172844;color:#fff}.rc-fs iframe,:fullscreen#rec-wrap iframe,:-webkit-full-screen#rec-wrap iframe{position:absolute;left:0;top:0;width:100%!important;height:100%!important}.rc-fs .rc-fbar,:fullscreen#rec-wrap .rc-fbar,:-webkit-full-screen#rec-wrap .rc-fbar{position:absolute;left:0;right:0;top:0;z-index:8;background:linear-gradient(#000a,#0000);transition:opacity .25s}.rc-fs .rc-sk,:fullscreen#rec-wrap .rc-sk,:-webkit-full-screen#rec-wrap .rc-sk{position:absolute;left:0;right:0;bottom:0;z-index:8;background:linear-gradient(#0000,#000c);padding-bottom:calc(10px + env(safe-area-inset-bottom));transition:opacity .25s}.rc-hide .rc-fbar,.rc-hide .rc-sk{opacity:0;pointer-events:none}.rc-tap{display:none;position:absolute;left:0;top:0;right:0;bottom:0;z-index:7;-webkit-tap-highlight-color:transparent;touch-action:manipulation}.rc-fs .rc-tap,:fullscreen#rec-wrap .rc-tap,:-webkit-full-screen#rec-wrap .rc-tap{display:block}.rc-fx{position:absolute;top:50%;transform:translate(-50%,-50%);width:110px;height:110px;border-radius:50%;background:#0008;color:#fff;font-weight:800;font-size:17px;display:flex;align-items:center;justify-content:center;pointer-events:none;animation:rcfx .6s ease-out forwards}@keyframes rcfx{0%{opacity:1}100%{opacity:0}}.rc-in{width:64px;border:2px solid #172844;border-radius:10px;padding:8px;font:inherit;font-size:15px;font-weight:800;text-align:center;color:#172844}.rc-now{font-size:13px;color:#33404F;margin:-2px 2px 8px;font-variant-numeric:tabular-nums}";
  function css() { if (document.getElementById("rc-css")) return; var s = document.createElement("style"); s.id = "rc-css"; s.textContent = CSS; document.head.appendChild(s); }
  window.mkRecCtl = function (box, f, chapters, vid) {
    if (!box || !f) return; css();
    var CH = parse(chapters), dur = 0, now = 0, rate = cur(), A = null, B = null, rep = false, on = false, MK = "mkst:recseg:" + (vid || "x");
    function mine() { try { return JSON.parse(localStorage.getItem(MK) || "[]"); } catch (e) { return []; } }
    function keep(L) { try { localStorage.setItem(MK, JSON.stringify(L)); } catch (e) { } }
    function playAB() { if (A == null) return; if (B != null && B <= A) B = null; on = true; now = A; cmd("seekTo", [A, true]); cmd("playVideo"); draw(); }
    function cmd(func, args) { try { f.contentWindow.postMessage(JSON.stringify({ event: "command", func: func, args: args || [] }), "*"); } catch (e) { } }
    var W = f.parentNode, bar = null, drag = false, fbOpen = false;
    var SK = document.createElement("div"); SK.className = "rc-sk";
    SK.innerHTML = '<div class="rc-tr"><div class="rc-ab" style="display:none"></div><div class="rc-fl"></div><div class="rc-kn"></div><div class="rc-tip"></div></div><div class="rc-tm"><span class="rc-c1">0:00</span><span class="rc-c2">0:00</span></div>';
    f.insertAdjacentElement("afterend", SK);
    var TR = SK.querySelector(".rc-tr"), FL = SK.querySelector(".rc-fl"), KN = SK.querySelector(".rc-kn"), TIP = SK.querySelector(".rc-tip"), ABX = SK.querySelector(".rc-ab");
    function fixOv() { var o = W.querySelector(".ytg"); if (!o) return; var top = f.offsetTop, bot = W.clientHeight - top - f.offsetHeight; o.style.top = top + "px"; o.style.bottom = (bot + 54) + "px"; }
    window.addEventListener("resize", fixOv); setTimeout(fixOv, 300); setTimeout(fixOv, 1500);
    function paint(t) {
      fixOv();
      var p = dur ? Math.max(0, Math.min(1, t / dur)) : 0;
      FL.style.width = p * 100 + "%"; KN.style.left = p * 100 + "%"; TIP.style.left = p * 100 + "%"; TIP.textContent = fmt(t);
      SK.querySelector(".rc-c1").textContent = fmt(t); SK.querySelector(".rc-c2").textContent = fmt(dur);
      if (dur && A != null) { var b = B != null ? B : dur; ABX.style.display = ""; ABX.style.left = A / dur * 100 + "%"; ABX.style.width = Math.max(0, (b - A) / dur * 100) + "%"; } else ABX.style.display = "none";
    }
    function at(e) { var r = TR.getBoundingClientRect(), x = (e.touches ? e.touches[0].clientX : e.clientX); return Math.max(0, Math.min(1, (x - r.left) / r.width)) * dur; }
    var dt = 0;
    function dn(e) { if (!dur) return; e.preventDefault(); drag = true; SK.classList.add("dg"); dt = at(e); paint(dt); }
    function mv(e) { if (!drag) return; e.preventDefault(); dt = at(e); paint(dt); }
    function up() { if (!drag) return; drag = false; showCtl(); SK.classList.remove("dg"); now = dt; cmd("seekTo", [dt, true]); cmd("playVideo"); paint(dt); var tt = box.querySelector("#rc-t"); if (tt) tt.textContent = "지금 " + fmt(dt) + (dur ? " / " + fmt(dur) : ""); }
    SK.addEventListener("pointerdown", function (e) { try { SK.setPointerCapture(e.pointerId); } catch (er) { } dn(e); });
    SK.addEventListener("pointermove", mv);
    SK.addEventListener("pointerup", up); SK.addEventListener("pointercancel", up);
    function isFs() { return document.fullscreenElement === W || document.webkitFullscreenElement === W || W.classList.contains("rc-fs"); }
    function mkBar() {
      if (bar) return; bar = document.createElement("div"); bar.className = "rc-fbar";
      W.insertBefore(bar, W.firstChild);
    }
    function drawBar() {
      if (!bar) return;
      bar.innerHTML = '<button class="rc-b" data-x>✕ 닫기</button><button class="rc-b" data-fj="-10">⏪ 10초</button><button class="rc-b" data-fj="10">10초 ⏩</button>';
      bar.querySelector("[data-x]").onclick = fsOff;
      bar.querySelectorAll("[data-fj]").forEach(function (b) { b.onclick = function () { jump(+b.dataset.fj); }; });
    }
    function jump(d) { now = Math.max(0, Math.min(dur || 9e9, now + d)); cmd("seekTo", [now, true]); cmd("playVideo"); paint(now); }
    var TAP = document.createElement("div"); TAP.className = "rc-tap"; W.appendChild(TAP);
    var hideT = null, lastTap = 0, tapT = null, playing = false;
    function isFsNow() { return W.classList.contains("rc-fs") || document.fullscreenElement === W || document.webkitFullscreenElement === W; }
    function showCtl() { W.classList.remove("rc-hide"); clearTimeout(hideT); if (isFsNow()) hideT = setTimeout(function () { if (!drag && isFsNow()) W.classList.add("rc-hide"); }, 5000); }
    function fx(side, txt) { var e = document.createElement("div"); e.className = "rc-fx"; e.style.left = side < 0 ? "22%" : "78%"; e.textContent = txt; W.appendChild(e); setTimeout(function () { e.remove(); }, 650); }
    TAP.addEventListener("click", function (e) {
      var r = W.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, t = Date.now();
      if (t - lastTap < 320) {
        clearTimeout(tapT); lastTap = 0;
        if (x < 0.4) { jump(-10); fx(-1, "⏪ 10초"); } else if (x > 0.6) { jump(10); fx(1, "10초 ⏩"); }
        return;
      }
      lastTap = t;
      tapT = setTimeout(function () {
        if (W.classList.contains("rc-hide")) showCtl();
        else { cmd(playing ? "pauseVideo" : "playVideo"); playing = !playing; showCtl(); }
      }, 330);
    });
    SK.addEventListener("pointerdown", showCtl);
    function fsOn() {
      setTimeout(showCtl, 100);
      mkBar(); drawBar();
      var rq = W.requestFullscreen || W.webkitRequestFullscreen;
      var done = function () { try { screen.orientation && screen.orientation.lock && screen.orientation.lock("landscape").catch(function () { }); } catch (e) { } };
      if (rq) { try { var pr = rq.call(W); if (pr && pr.then) pr.then(done).catch(function () { W.classList.add("rc-fs"); document.body.style.overflow = "hidden"; }); else done(); return; } catch (e) { } }
      W.classList.add("rc-fs"); document.body.style.overflow = "hidden"; setTimeout(fixOv, 50);
    }
    function fsOff() {
      if (document.fullscreenElement || document.webkitFullscreenElement) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); }
      W.classList.remove("rc-fs"); W.classList.remove("rc-hide"); clearTimeout(hideT); document.body.style.overflow = ""; setTimeout(fixOv, 50);
      try { screen.orientation && screen.orientation.unlock && screen.orientation.unlock(); } catch (e) { }
    }
    document.addEventListener("fullscreenchange", function () { setTimeout(fixOv, 50); if (!isFsNow()) { W.classList.remove("rc-hide"); clearTimeout(hideT); } }); document.addEventListener("webkitfullscreenchange", function () { setTimeout(fixOv, 50); });
    // 휴대폰을 가로로 돌리면 자동으로 화면 가득(전체화면), 다시 세우면 원래대로
    var LQ = window.matchMedia && matchMedia("(orientation: landscape) and (pointer: coarse)"), auto = false;
    function onRot() { if (!document.body.contains(W)) return; if (LQ.matches && !isFsNow()) { auto = true; mkBar(); drawBar(); W.classList.add("rc-fs"); document.body.style.overflow = "hidden"; setTimeout(fixOv, 50); showCtl(); } else if (!LQ.matches && auto) { auto = false; fsOff(); } }
    if (LQ) { if (LQ.addEventListener) LQ.addEventListener("change", onRot); else if (LQ.addListener) LQ.addListener(onRot); if (LQ.matches) setTimeout(onRot, 300); }
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && W.classList.contains("rc-fs")) fsOff(); });
    window.addEventListener("hashchange", function () { if (W.classList.contains("rc-fs")) fsOff(); });
    function list() {
      if (CH.length) return CH;
      if (!dur) return [];
      var L = []; for (var t = 0; t < dur; t += 600) L.push({ t: t, n: fmt(t) + " ~ " + fmt(Math.min(dur, t + 600)) }); return L;
    }
    var spOpen = false;
    function draw() {
      box.innerHTML = '<div class="rc-box"><div class="rc-row" style="margin-bottom:0"><button class="rc-b' + (spOpen ? " on" : "") + '" data-spd>⏩ ' + rate + '배 ' + (spOpen ? "▲" : "▼") + '</button><button class="rc-b" data-j="-10">⏪ 10초</button><button class="rc-b" data-j="10">10초 ⏩</button><button class="rc-b" data-fs>⛶ 전체화면</button></div>' +
        (spOpen ? '<div class="rc-sp">' + SP.map(function (r) { return '<button class="rc-spi' + (r === rate ? " on" : "") + '" data-r="' + r + '">' + (r === rate ? "✓ " : "") + r + "배</button>"; }).join("") + "</div>" : "") + "</div>";
      if (!drag) paint(now);
      box.querySelector("[data-spd]").onclick = function () { spOpen = !spOpen; draw(); };
      box.querySelectorAll("[data-r]").forEach(function (b) { b.onclick = function () { rate = +b.dataset.r; save(rate); cmd("setPlaybackRate", [rate]); spOpen = false; draw(); drawBar(); }; });
      box.querySelectorAll("[data-j]").forEach(function (b) { b.onclick = function () { now = Math.max(0, now + +b.dataset.j); cmd("seekTo", [now, true]); cmd("playVideo"); paint(now); }; });
      var fsb = box.querySelector("[data-fs]"); if (fsb) fsb.onclick = fsOn;
    }
    var last = "";
    function onMsg(e) {
      if (e.source !== f.contentWindow) return;
      if (!document.body.contains(f)) { window.removeEventListener("message", onMsg); return; }
      var d; try { d = typeof e.data === "string" ? JSON.parse(e.data) : e.data; } catch (er) { return; }
      var i = d && d.info; if (!i || typeof i !== "object") return;
      if (i.playerState != null) playing = i.playerState === 1;
      if (i.duration) dur = i.duration;
      if (i.currentTime != null) now = i.currentTime;
      if (i.playerState === 1 && i.playbackRate != null && i.playbackRate !== rate) cmd("setPlaybackRate", [rate]);
      if (on && B != null && now >= B) { if (rep) { now = A; cmd("seekTo", [A, true]); } else { on = false; cmd("pauseVideo"); last = ""; } }
      var L = list(), act = -1; L.forEach(function (c, k) { if (now >= c.t - 0.5) act = k; });
      if (!drag) paint(now);
      var tt = box.querySelector("#rc-t"); if (tt) tt.textContent = "지금 " + fmt(now) + (dur ? " / " + fmt(dur) : "");
      var key = String(Math.floor(dur));
      var ae = document.activeElement, typing = ae && ae.classList && ae.classList.contains("rc-in") && box.contains(ae);
      if (key !== last && !typing) { last = key; draw(); }
    }
    window.addEventListener("message", onMsg);
    function hello() { try { f.contentWindow.postMessage(JSON.stringify({ event: "listening", id: "rec" }), "*"); } catch (e) { } }
    f.addEventListener("load", function () { hello(); setTimeout(function () { cmd("setPlaybackRate", [rate]); }, 800); });
    hello(); draw();
  };
})();
