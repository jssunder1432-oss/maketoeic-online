/* 교재 강의 PART 2: 영상 속 예문(질문·정답) 소리를 새 녹음(ElevenLabs v4)으로 바꿔 들려주기 (2026-11-06)
   - 표 = tbau-data.js → window.MKST_TBAU["c/s2/p2_01_01"] = [[시작초, 끝초, "새 음원 주소"], ...]
   - 그 구간에서는 영상 소리를 끄고 새 음원을 재생(구간 길이에 맞춰 속도 살짝 조절, 배속 반영)
   - 영상 파일은 그대로, 앱에서 재생할 때만 바꿔 끼운다 */
(function () {
if (window.MKST_TBAU_ON) return; window.MKST_TBAU_ON = 1;
function keyOf(src) { var m = String(src || "").match(/\/tb\/(.+)\.mp4/); return m ? m[1] : null; }
function hook(v) {
  if (v.dataset.tbau) return; v.dataset.tbau = "1";
  var A = new Audio(), on = -1, key = null, L = [], userMuted = false;
  A.preload = "auto"; try { A.preservesPitch = true; A.mozPreservesPitch = true; A.webkitPreservesPitch = true; } catch (e) { }
  function stop() { if (on >= 0) { A.pause(); v.muted = userMuted; on = -1; } }
  function load() { var k = keyOf(v.currentSrc || v.src); if (k !== key) { stop(); key = k; L = (window.MKST_TBAU || {})[k] || []; } }
  function step() {
    load(); if (!L.length) return;
    var t = v.currentTime, idx = -1;
    for (var i = 0; i < L.length; i++) if (t >= L[i][0] && t < L[i][1]) { idx = i; break; }
    if (idx !== on) {
      stop();
      if (idx >= 0 && !v.paused) {
        var s = L[idx]; userMuted = v.muted; on = idx; v.muted = true;
        A.src = s[2];
        var go = function () {
          if (on !== idx) return;
          var dur = A.duration || (s[1] - s[0]), slot = s[1] - s[0], r = Math.max(0.85, Math.min(1.25, dur / slot));
          A.playbackRate = r * (v.playbackRate || 1);
          var off = Math.max(0, (v.currentTime - s[0]) * r); try { if (off > 0.15) A.currentTime = off; } catch (e) { }
          A.play().catch(function () { });
        };
        if (A.readyState >= 1) go(); else A.onloadedmetadata = function () { A.onloadedmetadata = null; go(); };
      }
    } else if (on >= 0 && v.paused && !A.paused) A.pause();
    else if (on >= 0 && !v.paused && A.paused && A.currentTime < (A.duration || 9)) A.play().catch(function () { });
  }
  ["timeupdate", "seeking", "play", "pause", "ratechange"].forEach(function (e) { v.addEventListener(e, step); });
  v.addEventListener("pause", function () { if (on >= 0) A.pause(); });
  v.addEventListener("emptied", stop); v.addEventListener("ended", stop);
  (function loop() { if (!document.contains(v)) { stop(); return; } if (!v.paused) step(); requestAnimationFrame(loop); })();
}
var tm = 0; new MutationObserver(function () { clearTimeout(tm); tm = setTimeout(function () { document.querySelectorAll("video").forEach(hook); }, 80); }).observe(document.documentElement, { childList: true, subtree: true });
})();
