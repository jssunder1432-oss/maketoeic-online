/* 해설강의 배속 · 다운로드 막기 (2026-11-01)
   - 구간점프 버튼 줄(#lcv-pg / #al-pg)이 있으면 그 옆에 배속 버튼(누를 때마다 1→1.25→1.5→1.75→2→0.8배)
   - 없으면 영상 아래에 배속 줄(0.8~2배)
   - 고른 배속은 이 기기에 기억 → 다음 문제·다른 강의도 그대로
   - 영상 다운로드 메뉴·길게 눌러 저장 막기 */
(function () {
var SP = [0.8, 1, 1.25, 1.5, 1.75, 2];
function cur() { try { var v = +localStorage.getItem("mkst:speed"); return SP.indexOf(v) >= 0 ? v : 1; } catch (e) { return 1; } }
function save(v) { try { localStorage.setItem("mkst:speed", String(v)); } catch (e) { } }
function apply(v, r) { v.defaultPlaybackRate = r; v.playbackRate = r; }
function lab(r) { return (r === 1 ? "1" : String(r)) + "배속"; }
function attach(v) {
  if (v.dataset.spd) return; v.dataset.spd = "1";
  v.setAttribute("controlsList", "nodownload");
  v.setAttribute("disablePictureInPicture", "");
  v.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  var r = cur(); apply(v, r);
  ["loadedmetadata", "play", "loadstart"].forEach(function (ev) { v.addEventListener(ev, function () { var x = cur(); if (v.playbackRate !== x) apply(v, x); }); });
  var box = v.parentElement, row = box && box.querySelector("#lcv-pg, #al-pg");
  if (row) {
    var b = document.createElement("button");
    b.className = "mk-speed";
    b.style.cssText = "border:2px solid #fff;border-radius:10px;padding:9px 6px;font:inherit;font-size:15px;font-weight:800;background:#14233E;color:#fff";
    b.textContent = "⏩ " + lab(r);
    b.onclick = function () { var x = SP[(SP.indexOf(cur()) + 1) % SP.length]; save(x); apply(v, x); b.textContent = "⏩ " + lab(x); };
    row.appendChild(b);
    return;
  }
  var bar = document.createElement("div");
  bar.className = "mk-speed";
  bar.style.cssText = "display:flex;align-items:center;gap:5px;padding:6px;background:#14233E;overflow-x:auto";
  bar.innerHTML = '<span style="color:#fff;font-size:13px;font-weight:800;padding:0 4px;white-space:nowrap">배속</span>' +
    SP.map(function (s) { return '<button data-sp="' + s + '" style="flex:1;min-width:44px;border:0;border-radius:9px;padding:8px 4px;font:inherit;font-size:14px;font-weight:800">' + (s === 1 ? "1배" : s + "배") + "</button>"; }).join("");
  function paint(x) { bar.querySelectorAll("button").forEach(function (b) { var on = +b.dataset.sp === x; b.style.background = on ? "#F26B1D" : "#fff"; b.style.color = on ? "#fff" : "#172844"; }); }
  bar.addEventListener("click", function (e) { var b = e.target.closest("[data-sp]"); if (!b) return; var x = +b.dataset.sp; save(x); apply(v, x); paint(x); });
  paint(r);
  (box && getComputedStyle(box).position === "sticky" ? box : v.parentNode).appendChild(bar);
}
function scan() { document.querySelectorAll(".mkst video[controls], #mk-host video[controls]").forEach(attach); }
new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
})();
