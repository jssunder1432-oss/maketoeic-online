/* 해설강의 배속 (2026-11-01)
   - 학습실 안의 모든 강의 영상(<video>) 아래에 배속 버튼(0.8 · 1 · 1.25 · 1.5 · 1.75 · 2배)을 붙인다.
   - 고른 배속은 이 기기에 기억 → 다음 문제·다른 강의로 넘어가도 그대로 유지. */
(function () {
var SP = [0.8, 1, 1.25, 1.5, 1.75, 2];
function cur() { try { var v = +localStorage.getItem("mkst:speed"); return SP.indexOf(v) >= 0 ? v : 1; } catch (e) { return 1; } }
function save(v) { try { localStorage.setItem("mkst:speed", String(v)); } catch (e) { } }
function apply(v, r) { v.defaultPlaybackRate = r; v.playbackRate = r; }
function paint(bar, r) { bar.querySelectorAll("button").forEach(function (b) { var on = +b.dataset.sp === r; b.style.background = on ? "#F26B1D" : "#fff"; b.style.color = on ? "#fff" : "#172844"; }); }
function attach(v) {
  if (v.dataset.spd) return; v.dataset.spd = "1";
  var r = cur(); apply(v, r);
  ["loadedmetadata", "play", "loadstart"].forEach(function (ev) { v.addEventListener(ev, function () { var x = cur(); if (v.playbackRate !== x) apply(v, x); }); });
  var bar = document.createElement("div");
  bar.className = "mk-speed";
  bar.style.cssText = "display:flex;align-items:center;gap:5px;padding:6px;background:#14233E;overflow-x:auto";
  bar.innerHTML = '<span style="color:#fff;font-size:13px;font-weight:800;padding:0 4px;white-space:nowrap">배속</span>' +
    SP.map(function (s) { return '<button data-sp="' + s + '" style="flex:1;min-width:44px;border:0;border-radius:9px;padding:8px 4px;font:inherit;font-size:14px;font-weight:800">' + (s === 1 ? "1배" : s + "배") + "</button>"; }).join("");
  bar.addEventListener("click", function (e) {
    var b = e.target.closest("[data-sp]"); if (!b) return;
    var x = +b.dataset.sp; save(x); apply(v, x); paint(bar, x);
  });
  paint(bar, r);
  var box = v.parentElement; (box && getComputedStyle(box).position === "sticky" ? box : v.parentNode).appendChild(bar);
}
function scan() { document.querySelectorAll("#mk-host video[controls]").forEach(attach); }
new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
})();
