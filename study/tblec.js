/* 교재 LC 강의 (2026-11-03)
   - LC 학습실 → "📘 교재 강의" → 카테고리(PART 2 · PART 3·4 집중훈련 · 실전 모의고사)별 강의 → 부를 골라 재생
   - Season 1 = 교재1, Season 2 = 교재2, Season 3 = 통합 교재 — 지금 보는 Season 것만 보인다
   - 영상 = R2 (MKST_TBL_BASE + "s1/p34m_r1_1.mp4"), 목록 = tblec-data.js (window.MKST_TBL)
   - 구간점프 ▶ / ◀ = 영상 화면 전환 시각(p), 부가 끝나면 다음 부 자동 재생
   - get_app 코드에 문자열 패치로 덧붙임 — 앵커가 하나라도 안 맞으면 원본 그대로 사용(index.html 로더 규칙). */
(function () {
function T(f) { var s = f.toString(); return s.slice(s.indexOf("/*") + 2, s.lastIndexOf("*/")); }
var FN = T(function () {/*// 교재 LC 강의 — study/tblec.js
function tblOf(ser) { return ((window.MKST_TBL || {})[ser]) || []; }
function tblMin(l) { var s = (l.d || []).reduce(function (a, b) { return a + b; }, 0); return Math.round(s / 60); }
function viewTbl() {
  var ser = curSer(), C = tblOf(ser), nm = (window.MKST_TBL_NAME || {})[ser] || "교재";
  render(topbar("교재 강의") + `<div class="card hero"><span class="kicker">SEASON ${ser} · ${esc(nm)} LC</span><h1>📘 교재 강의</h1><p>강의를 고르면 1부부터 차례로 재생돼요. 문제를 풀지 않아도 바로 볼 수 있어요.</p></div>` +
    (C.length ? C.map(function (c, ci) {
      return `<div class="grp">${esc(c.c)}</div>` + c.l.map(function (l, li) {
        var n = (l.f || []).length;
        return `<button class="row" data-go="#/tbl/${ser}/${ci}/${li}"><span class="pill o">${esc(l.t.replace(/ 실전문제$| 유형$| 총정리$/, ""))}</span><span class="t"><b>${esc(c.c.replace(/ 공략법 · 유형별$/, ""))} · ${esc(l.t)}</b><small>${n > 1 ? n + "부 · " : ""}약 ${tblMin(l)}분</small></span>›</button>`;
      }).join("");
    }).join("") : '<div class="empty">이 Season 교재 강의는 준비 중이에요.</div>'));
  bindCommon();
}
function viewTblPlay(ser, ci, li) {
  if (allowedSeries().indexOf(ser) < 0) { render(topbar("교재 강의") + '<div class="empty">이 Season은 수강 기간에 포함되지 않았어요.</div>'); bindCommon(); return; }
  var c = tblOf(ser)[ci], l = c && c.l[li];
  if (!l) { viewTbl(); return; }
  var B = window.MKST_TBL_BASE || "", n = l.f.length, cur = -1;
  render(topbar(c.c + " · " + l.t) +
    `<div style="position:sticky;top:0;z-index:5;border-radius:14px;overflow:hidden;background:#000;margin-bottom:8px"><video id="tb-v" controls playsinline preload="none" style="display:block;width:100%;aspect-ratio:16/9;background:#000"></video><div id="tb-pg" style="display:grid;grid-template-columns:1fr 1.2fr .9fr;gap:6px;padding:6px;background:#14233E"><button id="tb-prev" style="border:0;border-radius:10px;padding:11px 8px;font:inherit;font-size:15px;font-weight:800;background:#fff;color:#172844">◀ 구간점프</button><button id="tb-next" style="border:0;border-radius:10px;padding:11px 8px;font:inherit;font-size:15px;font-weight:800;background:#F26B1D;color:#fff">구간점프 ▶</button></div></div>` +
    `<p id="tb-now" style="margin:0 2px 10px;color:#33404F;font-size:14px">아래에서 부를 고르면 바로 재생돼요.</p>` +
    l.f.map(function (f, i) {
      var d = l.d[i] || 0;
      return `<button class="row" data-tb="${i}"><span class="pill n">${i + 1}부</span><span class="t"><b>${esc(l.t)}${n > 1 ? " · " + (i + 1) + "부 / " + n + "부" : ""}</b><small>${Math.floor(d / 60)}분 ${Math.round(d % 60)}초</small></span>›</button>`;
    }).join("") +
    `<div style="display:grid;gap:8px;margin-top:12px"><button class="btn ghost" data-go="#/tbl">교재 강의 목록으로</button></div>`);
  bindCommon();
  var v = app.querySelector("#tb-v"), now = app.querySelector("#tb-now");
  function mark() { app.querySelectorAll("[data-tb]").forEach(function (b) { var on = +b.dataset.tb === cur; b.style.borderColor = on ? "#F26B1D" : ""; b.style.background = on ? "#FFF4EC" : ""; b.querySelector(".pill").className = "pill " + (on ? "o" : "n"); }); }
  function play() { var pr = v.play(); if (pr && pr.catch) pr.catch(function () { }); }
  function pick(i, go) {
    cur = i; mark();
    now.innerHTML = `${go ? "▶" : "◻"} <b>${esc(l.t)}${n > 1 ? " · " + (i + 1) + "부" : ""}</b> ${go ? "재생 중" : "— ▶를 누르면 재생돼요"}`;
    v.src = B + l.f[i] + ".mp4";
    if (go) play();
  }
  function pg() { var P = (l.p || [])[cur]; if (P && P.length) return P; var o = [], d = v.duration || l.d[cur] || 0; for (var t = 30; t < d - 1; t += 30) o.push(t); return o; }
  app.querySelector("#tb-next").onclick = function () {
    if (cur < 0) { pick(0, true); return; }
    var t = v.currentTime, nx = pg().filter(function (x) { return x > t + 0.4; })[0];
    if (nx != null) { v.currentTime = nx; play(); } else if (cur + 1 < n) pick(cur + 1, true);
  };
  app.querySelector("#tb-prev").onclick = function () {
    if (cur < 0) return;
    var t = v.currentTime, st = [0].concat(pg()).filter(function (x) { return x <= t - 1.5; });
    v.currentTime = st.length ? st[st.length - 1] : 0; play();
  };
  v.addEventListener("ended", function () { if (cur + 1 < n) pick(cur + 1, true); else if (cur >= 0) now.innerHTML = "✓ 이 강의를 다 봤어요."; });
  v.addEventListener("play", function () { if (cur >= 0) now.innerHTML = `▶ <b>${esc(l.t)}${n > 1 ? " · " + (cur + 1) + "부" : ""}</b> 재생 중`; });
  v.addEventListener("error", function () { if (cur >= 0) now.innerHTML = "영상을 불러오지 못했어요. 잠시 뒤 다시 눌러 주세요."; });
  app.querySelectorAll("[data-tb]").forEach(function (b) { b.onclick = function () { pick(+b.dataset.tb, true); window.scrollTo({ top: 0, behavior: "smooth" }); }; });
  pick(0, false);
}
function lecturesOf(sec) {
*/});
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
// 1) 기능 함수
["function lecturesOf(sec) {\n", FN + "\n"],
// 2) LC 학습실 메뉴 박스에 "교재 강의" 줄
["      (reelList().length ? roomRow(\"#/reels\"", "      (tblOf(ser).length ? roomRow(\"#/tbl\", \"교재\", \"📘 교재 강의\", ({ 1: \"교재1\", 2: \"교재2\", 3: \"통합 교재\" })[ser] + \" · PART 2 · PART 3·4 · 강의 \" + tblOf(ser).reduce(function (a, c) { return a + c.l.length; }, 0) + \"개\",\"linear-gradient(125deg,#0E6E5C,#1BA37F)\") : \"\") +\n      (reelList().length ? roomRow(\"#/reels\""],
// 3) 주소 연결
["  if (h[0] === \"pick\") return viewPick();\n", "  if (h[0] === \"pick\") return viewPick();\n  if (h[0] === \"tbl\" && h[3] != null) return viewTblPlay(+h[1], +h[2], +h[3]);\n  if (h[0] === \"tbl\") return viewTbl();\n"]
]);
})();
