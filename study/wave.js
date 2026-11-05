/* PART 2 문제 풀기: 듣기 음원 음파 보기 + 구간 골라 듣기 (2026-11-06)
   - 음성 듣기 줄(.audio) 빈 공간 아래에 음파를 그린다
   - 음파를 드래그 → 그 구간만 재생(반복 켜면 계속), 짧게 누르면 그 위치부터 재생
   - LC 문제 풀기 전체(PART 1~4 · 실전 모의고사 PART별 풀기 · 채점 후 다시 보기)에 붙는다. 자동 넘김 실전 모드는 시간 재는 중이라 제외 */
(function () {
if (window.MKST_WAVE) return; window.MKST_WAVE = 1;
var PK = {}, SEL = {}, AC = null, H = 64;
var css = ".mkw{flex:0 0 100%;width:100%;margin-top:10px}.mkw canvas{display:block;width:100%;height:" + H + "px;border-radius:10px;background:#F1F4F9;touch-action:none;cursor:crosshair}" +
  ".mkw .r{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:8px}.mkw .r b{font-size:13px;color:#172844}.mkw .r small{font-size:12px;color:#5B6573}" +
  ".mkw button{font:700 13px inherit;border:1px solid #D5DBE5;background:#fff;color:#172844;border-radius:999px;padding:6px 12px;cursor:pointer}.mkw button.on{background:#FF581F;border-color:#FF581F;color:#fff}.mkw button:disabled{opacity:.4}";
var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

function isP2(box) {
  // LC 음원(PART 1~4 · 실전 모의고사 포함). RC '지문 읽어주기'는 제외
  return !/지문 읽어주기/.test(box.textContent || "");
}
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

function attach(box) {
  var a = box.querySelector("audio"); if (!a) return;
  var w = box.querySelector(".mkw");
  if (w && w.dataset.src === a.src) return;
  if (w) w.remove();
  if (!isP2(box)) return;
  var src = a.src;
  w = document.createElement("div"); w.className = "mkw"; w.dataset.src = src;
  w.innerHTML = '<canvas></canvas><div class="r"><b class="lab">음파를 드래그해서 듣고 싶은 부분을 고르세요</b><small class="tip">짧게 누르면 그 위치부터 재생</small></div>' +
    '<div class="r"><button class="pr" disabled>▶ 구간 듣기</button><button class="lp">🔁 구간 반복</button><button class="cl" disabled>✕ 선택 해제</button></div>';
  box.appendChild(w);
  var cv = w.querySelector("canvas"), g = cv.getContext("2d"), lab = w.querySelector(".lab"), tip = w.querySelector(".tip");
  var bPr = w.querySelector(".pr"), bLp = w.querySelector(".lp"), bCl = w.querySelector(".cl");
  var S = SEL[src] = SEL[src] || { a: null, b: null, loop: false }, data = null, drag = null, range = false, raf = 0;
  function au() { var x = box.querySelector("audio"); return x || a; }
  function dur() { var x = au(); return data ? data.dur : (x.duration || 0); }
  function draw() {
    var dpr = window.devicePixelRatio || 1, W = cv.clientWidth || 300; cv.width = W * dpr; cv.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    var D = dur(), x = au();
    if (S.a != null && D) { g.fillStyle = "rgba(255,88,31,.16)"; g.fillRect(S.a / D * W, 0, (S.b - S.a) / D * W, H); }
    if (data) {
      var P = data.p, n = P.length, bw = W / n;
      for (var i = 0; i < n; i++) {
        var t = (i + .5) / n * D, inS = S.a != null && t >= S.a && t <= S.b, played = x.currentTime && t <= x.currentTime;
        g.fillStyle = inS ? "#FF581F" : played ? "#3C5A86" : "#AAB6C8";
        var h = Math.max(1.5, P[i] * (H - 10)); g.fillRect(i * bw, (H - h) / 2, Math.max(1, bw - .4), h);
      }
    } else { g.fillStyle = "#5B6573"; g.font = "13px sans-serif"; g.fillText("음파 불러오는 중…", 12, H / 2 + 4); }
    if (D && x.currentTime) { g.fillStyle = "#172844"; g.fillRect(x.currentTime / D * W - 1, 0, 2, H); }
  }
  function ui() {
    var has = S.a != null;
    bPr.disabled = !has; bCl.disabled = !has; bLp.className = "lp" + (S.loop ? " on" : ""); bLp.textContent = S.loop ? "🔁 구간 반복 켜짐" : "🔁 구간 반복";
    lab.textContent = has ? "선택 구간 " + fmt(S.a) + " ~ " + fmt(S.b) + " (" + fmt(S.b - S.a) + ")" : "음파를 드래그해서 듣고 싶은 부분을 고르세요";
    tip.textContent = has ? "" : "짧게 누르면 그 위치부터 재생";
    draw();
  }
  function tick() {
    cancelAnimationFrame(raf);
    (function f() {
      if (!document.contains(cv)) return;
      var x = au();
      if (range && S.a != null && !x.paused && x.currentTime >= S.b) {
        if (S.loop) { x.pause(); setTimeout(function () { if (range && document.contains(cv)) { x.currentTime = S.a; x.play().catch(function () { }); } }, 600); }
        else { x.pause(); range = false; x.currentTime = S.a; setPl("▶"); }
      }
      draw();
      if (!x.paused || range) raf = requestAnimationFrame(f);
    })();
  }
  function setPl(t) { var p = box.querySelector(".play"); if (p) p.textContent = t; }
  function playFrom(t, asRange) {
    var x = au(); range = !!asRange;
    try { x.currentTime = t; } catch (e) { }
    x.play().then(function () { setPl("❚❚"); }).catch(function () { });
    tick();
  }
  function tAt(ev) { var r = cv.getBoundingClientRect(); return Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * dur(); }
  cv.addEventListener("pointerdown", function (ev) { if (!dur()) return; cv.setPointerCapture(ev.pointerId); drag = { x: ev.clientX, t: tAt(ev) }; ev.preventDefault(); });
  cv.addEventListener("pointermove", function (ev) {
    if (!drag) return; if (Math.abs(ev.clientX - drag.x) < 6) return;
    var t = tAt(ev); S.a = Math.min(drag.t, t); S.b = Math.max(drag.t, t); drag.moved = true; ui();
  });
  function up(ev) {
    if (!drag) return; var d = drag; drag = null;
    if (!d.moved) { S.a = S.b = null; ui(); playFrom(d.t, false); return; }
    if (S.b - S.a < 0.15) { S.b = Math.min(dur(), S.a + 0.15); }
    ui(); playFrom(S.a, true);
  }
  cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", function () { drag = null; });
  bPr.onclick = function () { if (S.a != null) playFrom(S.a, true); };
  bLp.onclick = function () { S.loop = !S.loop; ui(); if (S.loop && S.a != null && au().paused) playFrom(S.a, true); };
  bCl.onclick = function () { S.a = S.b = null; range = false; ui(); };
  var pl = box.querySelector(".play"); if (pl) pl.addEventListener("click", function () { range = false; setTimeout(tick, 50); }, true);
  ["play", "seeked", "pause", "ended"].forEach(function (e) { a.addEventListener(e, function () { if (e === "ended") range = false; tick(); }); });
  window.addEventListener("resize", draw);
  ui();
  peaks(src).then(function (r) { data = r; draw(); }).catch(function () { lab.textContent = "음파를 불러오지 못했어요 · 음성 듣기는 그대로 돼요"; });
}
function scan() { document.querySelectorAll(".mkst .audio").forEach(function (b) { if (b.querySelector("audio")) try { attach(b); } catch (e) { } }); }
var tm = 0; new MutationObserver(function () { clearTimeout(tm); tm = setTimeout(scan, 60); }).observe(document.documentElement, { childList: true, subtree: true });
})();
