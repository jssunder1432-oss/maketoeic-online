/* LC 실전 모의고사 음성 배속 (2026-11-25)
   - 실전 모드 · 회차 전체 풀기: 남은 시간(⏱) 옆 '⏩ 1배속' 버튼 → 누르면 아래로 펼쳐 배속 선택
   - LC 문제 풀기(문제별 풀기) '음성 듣기' 줄에도 같은 배속 버튼
   - 남은 시간은 배속에 맞춰 계산(음성 길이 ÷ 배속 + 답 고르는 시간), 듣는 중에 바꿔도 바로 맞춰짐
   - 고른 배속은 이 기기에 기억 → 다음 문제·다른 회차도 그대로 (해설강의 영상 배속과는 따로)
   - 목소리 높낮이는 그대로(빠르게 해도 목소리가 변하지 않음) */
(function () {
if (window.MKST_LCRATE) return; window.MKST_LCRATE = 1;
var SP = [0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.5, 2];
function cur() { try { var v = +localStorage.getItem("mkst:lcrate"); return SP.indexOf(v) >= 0 ? v : 1; } catch (e) { return 1; } }
function save(v) { try { localStorage.setItem("mkst:lcrate", String(v)); } catch (e) { } }
window.MKST_LCR = cur;
function lab(r) { return (r === 1 ? "1" : String(r)) + "배속"; }
function isLC() { try { return localStorage.getItem("mkst:area") !== "RC"; } catch (e) { return true; } }

// 어떤 음성에 배속을 걸지: 실전 화면의 음성 · 배속 버튼이 붙은 '음성 듣기' 줄의 음성
function want(a) {
  if (window.MKST_PL && a === window.MKST_PL.audio && document.getElementById("lc-time")) return true;
  var w = a.closest && a.closest(".audio");
  return !!(w && w.querySelector(".mk-lcr"));
}
function setRate(a, r) {
  try { a.preservesPitch = true; a.webkitPreservesPitch = true; a.mozPreservesPitch = true; } catch (e) { }
  a.defaultPlaybackRate = r; a.playbackRate = r;
}
function fix(a) {
  if (!a || !a.tagName) return;
  if (want(a)) { var r = cur(); if (a.playbackRate !== r || a.defaultPlaybackRate !== r) setRate(a, r); a._mkr = 1; }
  else if (a._mkr) { setRate(a, 1); a._mkr = 0; }
  if (!a._mkl) { a._mkl = 1; a.addEventListener("playing", function () { fix(a); }); a.addEventListener("loadedmetadata", function () { if (a._mkr) fix(a); }); }
}
var P = HTMLMediaElement.prototype, op = P.play;
P.play = function () { try { if (this.tagName === "AUDIO") fix(this); } catch (e) { } return op.apply(this, arguments); };

function applyAll() {
  if (window.MKST_PL && window.MKST_PL.audio) fix(window.MKST_PL.audio);
  document.querySelectorAll(".audio audio").forEach(fix);
}

// 배속 버튼 + 아래로 펼치는 선택 칸
function control(holder, small) {
  var b = document.createElement("button");
  b.type = "button"; b.className = "mk-lcr";
  b.style.cssText = small
    ? "border:1.5px solid #172844;border-radius:999px;padding:6px 12px;font:inherit;font-size:14px;font-weight:800;background:#fff;color:#172844;cursor:pointer;white-space:nowrap"
    : "margin-left:8px;border:0;border-radius:999px;padding:8px 14px;font:inherit;font-size:17px;font-weight:900;background:#F26B1D;color:#fff;cursor:pointer;white-space:nowrap";
  var m = document.createElement("div");
  m.className = "mk-lcr-m";
  m.style.cssText = "display:none;flex-basis:100%;width:100%;margin-top:8px;padding:8px;box-sizing:border-box;background:#14233E;border-radius:12px;gap:6px;flex-wrap:wrap;justify-content:center";
  m.innerHTML = SP.map(function (s) { return '<button type="button" data-r="' + s + '" style="min-width:54px;border:0;border-radius:9px;padding:9px 6px;font:inherit;font-size:15px;font-weight:800;cursor:pointer">' + (s === 1 ? "1배" : s + "배") + "</button>"; }).join("");
  function paint() {
    var r = cur(); b.textContent = "⏩ " + lab(r);
    m.querySelectorAll("[data-r]").forEach(function (x) { var on = +x.dataset.r === r; x.style.background = on ? "#F26B1D" : "#fff"; x.style.color = on ? "#fff" : "#172844"; });
  }
  b.onclick = function (e) { e.stopPropagation(); m.style.display = m.style.display === "none" ? "flex" : "none"; };
  m.onclick = function (e) {
    e.stopPropagation();
    var x = e.target.closest("[data-r]"); if (!x) return;
    save(+x.dataset.r); m.style.display = "none";
    document.querySelectorAll(".mk-lcr").forEach(function (o) { if (o._paint) o._paint(); });
    applyAll();
  };
  b._paint = paint; paint();
  return [b, m];
}

function scan() {
  // 1) 실전 모드 · 회차 전체 풀기: 남은 시간 옆
  var tm = document.getElementById("lc-time");
  if (tm && !tm.parentNode.querySelector(".mk-lcr")) {
    var row = tm.parentNode; row.style.flexWrap = "wrap"; row.style.alignItems = "center";
    var c = control(row, false); tm.after(c[0]); row.appendChild(c[1]);
    if (window.MKST_PL && window.MKST_PL.audio) fix(window.MKST_PL.audio);
  }
  // 2) LC 문제 풀기 '음성 듣기' 줄 (RC 지문 읽어주기는 제외)
  if (!isLC()) return;
  document.querySelectorAll(".mkst .audio, #mk-host .audio").forEach(function (box) {
    var au = box.querySelector(":scope > audio");
    if (!au || box.querySelector(".mk-lcr") || /지문 읽어주기/.test(box.textContent || "")) return;
    var c = control(box, true), rep = box.querySelector(":scope > .rep");
    if (rep) box.insertBefore(c[0], rep); else box.appendChild(c[0]);
    var mk = box.querySelector(":scope > .mkw");
    if (mk) box.insertBefore(c[1], mk); else box.appendChild(c[1]);
    if (rep) rep.style.marginLeft = "6px";
    fix(au);
  });
}
var q = 0;
new MutationObserver(function () { if (q) return; q = 1; requestAnimationFrame(function () { q = 0; try { scan(); } catch (e) { } }); })
  .observe(document.documentElement, { childList: true, subtree: true });
document.addEventListener("click", function (e) { if (e.target.closest && e.target.closest(".mk-lcr, .mk-lcr-m")) return; document.querySelectorAll(".mk-lcr-m").forEach(function (m) { m.style.display = "none"; }); });

// 남은 시간 계산을 배속에 맞춤 (실전 모드 lcPage) — 앵커가 하나라도 안 맞으면 로더가 원본 그대로 씀
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
 ["a.onloadedmetadata = function () { if (total == null) { total = Math.ceil(a.duration || 10) + LC_ANSWER_SEC; t0 = Date.now(); } };",
  "a.onloadedmetadata = function () { if (total == null) { total = Math.ceil((a.duration || 10) / (window.MKST_LCR ? MKST_LCR() : 1)) + LC_ANSWER_SEC; t0 = Date.now(); } };"],
 ["a.play().then(function () { if (total == null && a.duration) { total = Math.ceil(a.duration) + LC_ANSWER_SEC; t0 = Date.now(); } })",
  "a.play().then(function () { if (total == null && a.duration) { total = Math.ceil(a.duration / (window.MKST_LCR ? MKST_LCR() : 1)) + LC_ANSWER_SEC; t0 = Date.now(); } })"],
 ["    if (total == null || paused) return;\n    var left = Math.max(0, Math.ceil(total - (Date.now() - t0) / 1000));",
  "    if (total == null || paused) return;\n    var _ra = PL.audio, _nr = window.MKST_LCR ? MKST_LCR() : 1; if (secEl._r == null) secEl._r = _nr;\n    if (_nr !== secEl._r) { if (q.audio && _ra && _ra.duration && !_ra.ended) { total = total - Math.ceil(_ra.duration / secEl._r) + Math.ceil(_ra.duration / _nr); t0 = Date.now() - _ra.currentTime / _nr * 1000; } secEl._r = _nr; }\n    var left = Math.max(0, Math.ceil(total - (Date.now() - t0) / 1000));"]
]);
})();
