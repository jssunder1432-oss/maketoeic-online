/* 교재 강의 PART 2: 영상 속 예문(질문·정답) 소리를 새 녹음(ElevenLabs v4) 원음으로 바꿔 들려주기
   - 표 = tbau-data.js → window.MKST_TBAU["c/s2/p2_01_01"] = [[시작초, 끝초, "원음 주소"], ...]
   - 그 구간에 들어가면 영상 소리를 끄고 원음을 처음부터 끝까지 그대로 재생 (2026-11-08)
     · 앞부분을 건너뛰지 않음: 구간 중간에 들어와도 원음은 항상 처음부터
     · 뒷부분을 자르지 않음: 원음이 구간보다 길면 영상을 잠깐 멈췄다가 원음이 끝나면 이어서 재생
       (원음이 재생 안 되거나 오래 걸리면 기다리지 않고 영상은 그냥 진행 — 영상이 멈춰 버리지 않게)
     · 원음 속도를 구간 길이에 맞춰 바꾸지 않음 (선택한 배속만 반영)
   - 영상 파일은 그대로, 앱에서 재생할 때만 바꿔 끼운다 */
(function () {
if (window.MKST_TBAU_ON) return; window.MKST_TBAU_ON = 1;
var HOOKS = [];
function keyOf(src) { var m = String(src || "").match(/\/tb\/(.+)\.mp4/); return m ? m[1] : null; }
function hook(v) {
  if (v.dataset.tbau) return; v.dataset.tbau = "1";
  var A = new Audio(), on = -1, done = true, hold = false, holdT = 0, failed = false, prog = false, unlocked = false, key = null, L = [], userMuted = false;
  A.preload = "auto"; try { A.preservesPitch = true; A.mozPreservesPitch = true; A.webkitPreservesPitch = true; } catch (e) { }
  function active() { return on >= 0 && !done; }
  function unhold() { clearTimeout(holdT); if (hold) { hold = false; var p = v.play(); if (p && p.catch) p.catch(function () { }); } }
  function giveUp() { done = true; try { A.pause(); } catch (e) { } }
  function reset() { clearTimeout(holdT); try { A.pause(); } catch (e) { } if (on >= 0) v.muted = userMuted; on = -1; done = true; hold = false; }
  function load() { var k = keyOf(v.currentSrc || v.src); if (k !== key) { reset(); key = k; L = (window.MKST_TBAU || {})[k] || []; } }
  function start(idx) {
    var s = L[idx]; if (on < 0) userMuted = v.muted;
    on = idx; done = false; failed = false; v.muted = true;
    A.src = s[2];
    var go = function () {
      if (on !== idx || done) return;
      A.playbackRate = v.playbackRate || 1;
      try { A.currentTime = 0; } catch (e) { }
      var p = A.play(); if (p && p.catch) p.catch(function () { failed = true; if (on === idx) { giveUp(); unhold(); } });
    };
    if (A.readyState >= 1) go(); else A.onloadedmetadata = function () { A.onloadedmetadata = null; go(); };
  }
  A.addEventListener("ended", function () { done = true; unhold(); step(); });
  A.addEventListener("error", function () { failed = true; if (active()) { giveUp(); unhold(); } });
  function step() {
    load();
    var SK = (window.MKST_TBSKIP || {})[key];   // 긴 무음은 건너뛴다
    if (SK && !v.paused && !v.seeking) for (var j = 0; j < SK.length; j++) if (v.currentTime >= SK[j][0] && v.currentTime < SK[j][1] - 0.05) { prog = true; v.currentTime = SK[j][1]; break; }
    if (!L.length) return;
    var t = v.currentTime, idx = -1;
    for (var i = 0; i < L.length; i++) if (t >= L[i][0] && t < L[i][1]) { idx = i; break; }
    if (active()) {
      if (idx === on) {
        if (v.paused && !A.paused) A.pause();
        else if (!v.paused && A.paused && A.currentTime > 0) { var p = A.play(); if (p && p.catch) p.catch(function () { failed = true; giveUp(); }); }
        return;
      }
      if (hold) return;
      if (failed || A.error) giveUp();
      else if (!v.paused) {   // 원음이 아직 안 끝났으면 영상을 잠깐 기다리게 함 (최대 남은 길이 + 0.8초, 6초 넘지 않게)
        hold = true; v.pause();
        var left = ((A.duration || 3) - (A.currentTime || 0)) / (A.playbackRate || 1);
        holdT = setTimeout(function () { if (hold) { giveUp(); unhold(); } }, Math.max(400, Math.min(6000, left * 1000 + 800)));
        return;
      } else return;
    }
    if (on >= 0 && idx === on) return;            // 원음은 끝났고 아직 같은 구간 → 소리 끈 채로 지나감
    if (on >= 0) { v.muted = userMuted; on = -1; }  // 구간을 벗어남 → 영상 소리 다시 켬
    if (idx >= 0 && !v.paused) start(idx);
  }
  // 휴대폰은 화면을 누르는 순간에 한 번 소리를 열어 둬야 나중에 원음이 재생됨
  HOOKS.push(function () {
    if (unlocked || active()) return;
    load(); if (!L.length) return; unlocked = true;
    try { A.src = L[0][2]; A.muted = true; var p = A.play(); var f = function () { if (!active()) { try { A.pause(); A.currentTime = 0; } catch (e) { } } A.muted = false; }; if (p && p.then) p.then(f, f); else f(); } catch (e) { A.muted = false; }
  });
  v.addEventListener("seeking", function () { if (prog) { prog = false; return; } reset(); });
  v.addEventListener("pause", function () { if (!hold && active()) A.pause(); });
  v.addEventListener("play", function () { if (hold) { clearTimeout(holdT); hold = false; giveUp(); } step(); });   // 기다리는 중에 재생을 누르면 바로 진행
  v.addEventListener("ratechange", function () { if (active()) A.playbackRate = v.playbackRate || 1; step(); });
  ["timeupdate", "seeked"].forEach(function (e) { v.addEventListener(e, step); });
  v.addEventListener("emptied", reset);
  v.addEventListener("ended", function () { if (!active()) reset(); });
  (function loop() { if (!document.contains(v)) { reset(); return; } if (!v.paused) step(); requestAnimationFrame(loop); })();
}
["touchend", "click"].forEach(function (e) { document.addEventListener(e, function () { HOOKS.forEach(function (f) { try { f(); } catch (x) { } }); }, true); });
var tm = 0; new MutationObserver(function () { clearTimeout(tm); tm = setTimeout(function () { document.querySelectorAll("video").forEach(hook); }, 80); }).observe(document.documentElement, { childList: true, subtree: true });
})();
