/* LC 문제 풀기: 듣기 음원 음파 보기 + 구간 골라 듣기 (2026-11-06)
   - 음성 듣기 줄(.audio) 빈 공간 아래에 음파를 그린다
   - 실전 모드(자동 넘김) · 실전 모의고사 회차 전체 풀기도 남은 시간 아래에 음파를 그린다
   - 음파를 드래그 → 그 구간만 재생(반복 켜면 계속), 짧게 누르면 그 위치부터 재생 */
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
  ["var PL = { audio: null, run: 0, playing: false };", "var PL = { audio: null, run: 0, playing: false }; window.MKST_PL = PL;"]
]);
(function () {
if (window.MKST_WAVE) return; window.MKST_WAVE = 1;
var PK = {}, SEL = {}, AC = null, H = 64;
var css = ".mkw{flex:0 0 100%;width:100%;margin-top:10px}.mkw.tm{margin:0 0 12px;background:#fff;border-radius:14px;padding:12px;box-sizing:border-box}.mkw canvas{display:block;width:100%;height:" + H + "px;border-radius:10px;background:#F1F4F9;touch-action:none;cursor:crosshair}" +
  ".mkw .r{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:8px}.mkw .r b{font-size:13px;color:#172844}.mkw .r small{font-size:12px;color:#5B6573}" +
  ".mkw button{font:700 13px inherit;border:1px solid #D5DBE5;background:#fff;color:#172844;border-radius:999px;padding:6px 12px;cursor:pointer}.mkw button.on{background:#FF581F;border-color:#FF581F;color:#fff}.mkw button:disabled{opacity:.4}";
var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

function peaks(src) {
  if (PK[src]) return PK[src];
  PK[src] = fetch(src, { mode: "cors" }).then(function (r) { if (!r.ok) throw 0; return r.arrayBuffer(); }).then(function (buf) {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    return new Promise(function (ok, no) { AC.decodeAudioData(buf, ok, no); });
  }).then(function (ab) {
    var d = ab.getChannelData(0), N = 700, step = Math.max(1, Math.floor(d.length / N)), P = [], mx = 0;
    for (var i = 0; i < N; i++) { var m = 0, s = i * step, e = Math.min(d.length, s + step); for (var j = s; j < e; j += 4) { var v = Math.abs(d[j]); if (v > m) m = v; } P.push(m); if (m > mx) mx = m; }
    return { p: P.map(function (v) { return mx ? v / mx : 0; }), dur: ab.duration };
  });
  PK[src].catch(function () { delete PK[src]; });
  return PK[src];
}
function fmt(t) { return (Math.round(t * 10) / 10).toFixed(1) + "초"; }

// host 안에 음파를 붙인다. getA() = 지금 재생에 쓰는 audio, plBtn() = 그 화면의 재생 버튼(없으면 null)
function build(host, getA, plBtn, cls) {
  var w = document.createElement("div"); w.className = "mkw" + (cls ? " " + cls : "");
  w.innerHTML = '<canvas></canvas><div class="r"><b class="lab">음파를 드래그해서 듣고 싶은 부분을 고르세요</b><small class="tip">짧게 누르면 그 위치부터 재생</small></div>' +
    '<div class="r"><button class="pr" disabled>▶ 구간 듣기</button><button class="lp">🔁 구간 반복</button><button class="cl" disabled>✕ 선택 해제</button></div>';
  host.appendChild(w);
  var cv = w.querySelector("canvas"), g = cv.getContext("2d"), lab = w.querySelector(".lab"), tip = w.querySelector(".tip");
  var bPr = w.querySelector(".pr"), bLp = w.querySelector(".lp"), bCl = w.querySelector(".cl");
  var src = "", S = { a: null, b: null, loop: false }, data = null, drag = null, range = false, wait = 0;
  function au() { return getA(); }
  function dur() { var x = au(); return data ? data.dur : (x && x.duration) || 0; }
  function load() {
    var x = au(), s = x && x.src; if (!s || s === src) return;
    src = s; w.dataset.src = s; data = null; S = SEL[s] = SEL[s] || { a: null, b: null, loop: false }; range = false; ui();
    peaks(s).then(function (r) { if (src === s) { data = r; draw(); } }).catch(function () { if (src === s) lab.textContent = "음파를 불러오지 못했어요 · 음성 듣기는 그대로 돼요"; });
  }
  function draw() {
    var dpr = window.devicePixelRatio || 1, W = cv.clientWidth || 300; if (cv.width !== W * dpr) { cv.width = W * dpr; cv.height = H * dpr; }
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    var D = dur(), x = au(), ct = x && x.src === src ? x.currentTime : 0;
    if (S.a != null && D) { g.fillStyle = "rgba(255,88,31,.16)"; g.fillRect(S.a / D * W, 0, (S.b - S.a) / D * W, H); }
    if (data) {
      var P = data.p, n = P.length, bw = W / n;
      for (var i = 0; i < n; i++) {
        var t = (i + .5) / n * D, inS = S.a != null && t >= S.a && t <= S.b, played = ct && t <= ct;
        g.fillStyle = inS ? "#FF581F" : played ? "#3C5A86" : "#AAB6C8";
        var h = Math.max(1.5, P[i] * (H - 10)); g.fillRect(i * bw, (H - h) / 2, Math.max(1, bw - .4), h);
      }
    } else { g.fillStyle = "#5B6573"; g.font = "13px sans-serif"; g.fillText(src ? "음파 불러오는 중…" : "음성이 시작되면 음파가 보여요", 12, H / 2 + 4); }
    if (D && ct) { g.fillStyle = "#172844"; g.fillRect(ct / D * W - 1, 0, 2, H); }
  }
  function ui() {
    var has = S.a != null;
    bPr.disabled = !has; bCl.disabled = !has; bLp.className = "lp" + (S.loop ? " on" : ""); bLp.textContent = S.loop ? "🔁 구간 반복 켜짐" : "🔁 구간 반복";
    lab.textContent = has ? "선택 구간 " + fmt(S.a) + " ~ " + fmt(S.b) + " (" + fmt(S.b - S.a) + ")" : "음파를 드래그해서 듣고 싶은 부분을 고르세요";
    tip.textContent = has ? "" : "짧게 누르면 그 위치부터 재생";
    draw();
  }
  (function loop() {
    if (!document.contains(cv)) return;
    load();
    var x = au();
    if (range && x && S.a != null && !x.paused && x.currentTime >= S.b) {
      x.pause(); setPl("▶");
      if (S.loop) { clearTimeout(wait); wait = setTimeout(function () { if (range && document.contains(cv)) { x.currentTime = S.a; x.play().then(function () { setPl("❚❚"); }).catch(function () { }); } }, 600); }
      else { range = false; x.currentTime = S.a; }
    }
    draw();
    requestAnimationFrame(loop);
  })();
  function setPl(t) { var p = plBtn && plBtn(); if (p) p.textContent = t; }
  function playFrom(t, asRange) {
    var x = au(); if (!x) return; range = !!asRange; clearTimeout(wait);
    if (cls === "eb") { x.ontimeupdate = null; x.onended = null; x.onseeked = null; }
    try { x.currentTime = t; } catch (e) { }
    x.play().then(function () { setPl("❚❚"); }).catch(function () { });
  }
  function tAt(ev) { var r = cv.getBoundingClientRect(); return Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * dur(); }
  cv.addEventListener("pointerdown", function (ev) { if (!dur()) return; try { cv.setPointerCapture(ev.pointerId); } catch (e) { } drag = { x: ev.clientX, t: tAt(ev) }; ev.preventDefault(); });
  cv.addEventListener("pointermove", function (ev) {
    if (!drag || Math.abs(ev.clientX - drag.x) < 6) return;
    var t = tAt(ev); S.a = Math.min(drag.t, t); S.b = Math.max(drag.t, t); drag.moved = true; ui();
  });
  cv.addEventListener("pointerup", function () {
    if (!drag) return; var d = drag; drag = null;
    if (!d.moved) { S.a = S.b = null; ui(); playFrom(d.t, false); return; }
    if (S.b - S.a < 0.15) S.b = Math.min(dur(), S.a + 0.15);
    ui(); playFrom(S.a, true);
  });
  cv.addEventListener("pointercancel", function () { drag = null; });
  bPr.onclick = function () { if (S.a != null) playFrom(S.a, true); };
  bLp.onclick = function () { S.loop = !S.loop; ui(); var x = au(); if (S.loop && S.a != null && x && x.paused) playFrom(S.a, true); };
  bCl.onclick = function () { S.a = S.b = null; range = false; ui(); };
  var pl = plBtn && plBtn(); if (pl) pl.addEventListener("click", function () { range = false; clearTimeout(wait); }, true);
  ui();
  return w;
}

function scan() {
  // 1) 일반 문제 풀기 · 채점 후 보기: 음성 듣기 줄 아래 (RC '지문 읽어주기'는 제외)
  document.querySelectorAll(".mkst .audio").forEach(function (box) {
    if (!box.querySelector("audio") || box.querySelector(".mkw") || /지문 읽어주기/.test(box.textContent || "")) return;
    try { build(box, function () { return box.querySelector("audio"); }, function () { return box.querySelector(".play"); }); } catch (e) { }
  });
  // 2) 실전 모드 · 회차 전체 풀기: 남은 시간 아래
  var tm = document.getElementById("lc-time");
  if (tm && window.MKST_PL) {
    var row = tm.parentNode;
    if (!row.nextElementSibling || !row.nextElementSibling.classList.contains("mkw")) {
      var host = document.createElement("div"); row.parentNode.insertBefore(host, row.nextSibling);
      try { var w = build(host, function () { return window.MKST_PL.audio; }, null, "tm"); host.replaceWith(w); } catch (e) { host.remove(); }
    }
  }
}
// 3) 교재(전자책) 예문 음원: 화면 아래에 음파 (예문을 누르면 그 음원이 보여요)
function ebScan() {
  var au = document.getElementById("eb-au"), root = au && au.closest(".mkst");
  var old = document.getElementById("mkw-eb");
  if (!au) { if (old) old.remove(); return; }
  if (old && old.dataset.for === "1" && document.contains(old)) return;
  var box = document.createElement("div"); box.id = "mkw-eb"; box.dataset.for = "1";
  box.style.cssText = "position:fixed;left:50%;transform:translateX(-50%);bottom:calc(8px + env(safe-area-inset-bottom));width:min(760px,calc(100% - 16px));z-index:60;background:#fff;border:1px solid #E7EAF0;border-radius:14px;box-shadow:0 6px 24px rgba(23,40,68,.18);padding:8px 10px;box-sizing:border-box;display:none";
  box.innerHTML = '<div style="display:flex;align-items:center;gap:8px"><b style="font-size:13px;color:#172844;flex:1">🎧 예문 음파</b><button class="mkw-x" style="border:0;background:none;font-size:16px;cursor:pointer">✕</button></div>';
  (root || document.body).appendChild(box);
  var w = build(box, function () { return document.getElementById("eb-au"); }, null, "eb"); w.style.marginTop = "4px";
  var hid = "", last = "";
  box.querySelector(".mkw-x").onclick = function () { hid = (document.getElementById("eb-au") || {}).src || ""; box.style.display = "none"; };
  (function vis() {
    if (!document.contains(box)) return;
    var a = document.getElementById("eb-au"), s = a && a.src;
    if (!a || !document.contains(a)) { box.remove(); document.querySelectorAll(".eb-camf,.eb-audf,.eb-inkf").forEach(function (b) { b.style.bottom = ""; }); return; }
    box.style.display = s && s !== hid ? "" : "none";
    // 캡처·음원·필기 떠 있는 버튼이 음파에 가리지 않게: 음파가 보이면 버튼을 음파 위로 올림
    var up = box.style.display === "" ? Math.ceil(box.getBoundingClientRect().height) + 20 : 0;
    document.querySelectorAll(".eb-camf,.eb-audf,.eb-inkf").forEach(function (b) {
      var v = up ? "calc(" + up + "px + env(safe-area-inset-bottom))" : "";
      if (b.style.bottom !== v) { b.style.bottom = v; b.style.transition = "bottom .2s"; }
    });
    setTimeout(vis, 300);
  })();
}
var tmo = 0; new MutationObserver(function () { clearTimeout(tmo); tmo = setTimeout(function () { scan(); try { ebScan(); } catch (e) { } }, 60); }).observe(document.documentElement, { childList: true, subtree: true });
})();
