/* 교재 강의 PART 2: 영상 속 예문(질문·정답) 소리를 새 녹음(ElevenLabs v4) 원음으로 바꿔 들려주기
   - 표 = tbau-data.js → window.MKST_TBAU["c/s2/p2_01_01"] = [[시작초, 끝초, "원음 주소"], ...]
   - 그 구간에 들어가면 영상 소리를 끄고 원음을 처음부터 끝까지 그대로 재생 (2026-11-08)
     · 앞부분을 건너뛰지 않음 / 뒷부분을 자르지 않음(원음이 더 길면 영상이 잠깐 기다림, 최대 6초)
     · 원음 속도는 그대로
   - 휴대폰(안드로이드 크롬·아이폰)은 <audio>를 하나 더 틀면 영상이 멈춰 버려서,
     원음은 Web Audio(AudioContext)로 재생한다 (au4, 2026-11-08)
   - 원음을 못 틀면(소리 장치가 안 열림·파일 오류) 영상 원래 소리로 그냥 진행 — 영상이 멈추지 않게
   - 영상 파일은 그대로, 앱에서 재생할 때만 바꿔 끼운다 */
(function () {
if (window.MKST_TBAU_ON) return; window.MKST_TBAU_ON = 1;
var AC = window.AudioContext || window.webkitAudioContext, ctx = null, BUF = {};
function ctxOk() { return ctx && ctx.state === "running"; }
function openCtx() {   // 화면을 누를 때마다 소리 장치를 열어 둔다(휴대폰 규칙)
  if (!AC) return;
  try {
    if (!ctx) ctx = new AC();
    if (ctx.state !== "running" && ctx.resume) ctx.resume();
    var b = ctx.createBuffer(1, 1, 22050), s = ctx.createBufferSource(); s.buffer = b; s.connect(ctx.destination); s.start(0);
  } catch (e) { }
}
["touchstart", "touchend", "pointerdown", "click", "keydown"].forEach(function (e) { document.addEventListener(e, openCtx, true); });
function getBuf(url) {
  if (BUF[url]) return BUF[url];
  BUF[url] = fetch(url).then(function (r) { if (!r.ok) throw 0; return r.arrayBuffer(); }).then(function (ab) {
    return new Promise(function (ok, no) { var p = ctx.decodeAudioData(ab, ok, no); if (p && p.then) p.then(ok, no); });
  });
  BUF[url].catch(function () { delete BUF[url]; });
  return BUF[url];
}
function keyOf(src) { var m = String(src || "").match(/\/tb\/(.+)\.mp4/); return m ? m[1] : null; }
function hook(v) {
  if (v.dataset.tbau) return; v.dataset.tbau = "1";
  var on = -1, done = true, hold = false, holdT = 0, prog = false, key = null, L = [], userMuted = false;
  var src = null, buf = null, t0 = 0, off = 0, playing = false, gen = 0;
  function active() { return on >= 0 && !done; }
  function stopSrc() { if (src) { try { src.onended = null; src.stop(); } catch (e) { } src = null; } if (playing) { off += ctx.currentTime - t0; playing = false; } }
  function playSrc() {
    if (!buf || playing || !ctxOk()) return;
    src = ctx.createBufferSource(); src.buffer = buf; src.connect(ctx.destination);
    var my = gen; src.onended = function () { if (my !== gen) return; playing = false; src = null; done = true; unhold(); step(); };
    t0 = ctx.currentTime; playing = true; src.start(0, Math.min(off, buf.duration));
  }
  function unhold() { clearTimeout(holdT); if (hold) { hold = false; var p = v.play(); if (p && p.catch) p.catch(function () { }); } }
  function giveUp() { gen++; stopSrc(); done = true; }
  function reset() { clearTimeout(holdT); gen++; stopSrc(); if (on >= 0) v.muted = userMuted; on = -1; done = true; hold = false; }
  function load() {
    var k = keyOf(v.currentSrc || v.src);
    if (k !== key) { reset(); key = k; L = (window.MKST_TBAU || {})[k] || []; if (ctx) L.forEach(function (s) { getBuf(s[2]); }); }
  }
  function start(idx) {
    if (!ctxOk()) { openCtx(); if (!ctxOk()) return; }   // 원음을 못 틀면 영상 소리 그대로
    var s = L[idx]; if (on < 0) userMuted = v.muted;
    gen++; stopSrc(); on = idx; done = false; buf = null; off = 0; v.muted = true;
    var my = gen;
    getBuf(s[2]).then(function (b) { if (my !== gen) return; buf = b; if (!v.paused || hold) playSrc(); },
      function () { if (my !== gen) return; giveUp(); v.muted = userMuted; unhold(); });
  }
  function step() {
    load();
    var SK = (window.MKST_TBSKIP || {})[key];   // 긴 무음은 건너뛴다
    if (SK && !v.paused && !v.seeking) for (var j = 0; j < SK.length; j++) if (v.currentTime >= SK[j][0] && v.currentTime < SK[j][1] - 0.05) { prog = true; v.currentTime = SK[j][1]; break; }
    if (!L.length) return;
    var t = v.currentTime, idx = -1;
    for (var i = 0; i < L.length; i++) if (t >= L[i][0] && t < L[i][1]) { idx = i; break; }
    if (active()) {
      if (idx === on || hold) return;
      if (!v.paused) {   // 원음이 아직 안 끝났으면 영상을 잠깐 기다리게 함 (남은 길이 + 0.8초, 최대 6초)
        hold = true; v.pause();
        var left = buf ? buf.duration - (off + (playing ? ctx.currentTime - t0 : 0)) : 3;
        holdT = setTimeout(function () { if (hold) { giveUp(); unhold(); } }, Math.max(400, Math.min(6000, left * 1000 + 800)));
      }
      return;
    }
    if (on >= 0 && idx === on) return;            // 원음은 끝났고 아직 같은 구간 → 소리 끈 채로 지나감
    if (on >= 0) { v.muted = userMuted; on = -1; }  // 구간을 벗어남 → 영상 소리 다시 켬
    if (idx >= 0 && !v.paused) start(idx);
  }
  v.addEventListener("seeking", function () { if (prog) { prog = false; return; } reset(); });
  v.addEventListener("pause", function () { if (!hold && active()) stopSrc(); });          // 멈추면 원음도 멈춤(이어서 재생)
  v.addEventListener("play", function () {
    openCtx();
    if (hold) { clearTimeout(holdT); hold = false; giveUp(); }                           // 기다리는 중에 재생을 누르면 바로 진행
    else if (active() && buf) playSrc();
    step();
  });
  ["timeupdate", "seeked", "ratechange"].forEach(function (e) { v.addEventListener(e, step); });
  v.addEventListener("emptied", reset);
  v.addEventListener("ended", function () { if (!active()) reset(); });
  (function loop() { if (!document.contains(v)) { reset(); return; } if (!v.paused) step(); requestAnimationFrame(loop); })();
}
var tm = 0; new MutationObserver(function () { clearTimeout(tm); tm = setTimeout(function () { document.querySelectorAll("video").forEach(hook); }, 80); }).observe(document.documentElement, { childList: true, subtree: true });
})();
