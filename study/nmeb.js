/* 비회원 30일 수강권 자료도 전자책 구성으로 (2026-11-05)
   - 교재 전자책(#/eb)을 비회원도 열 수 있게: 수강권에 든 영역(LC / RC)만 목차·쪽이 열림
   - LC 실전 모의고사 회차마다 '📖 전자책으로 보기'(#/bk/시즌/회차): 문제·보기·스크립트·해석·해설을 한 화면에,
     단어 누르면 품사·뜻·묶음 표현, 문장 누르면 원본 음원, PART 2 정답 반복, 필기·캡처·단어장 (stfx.js 기능) */
(function () {
function T(f) { var s = f.toString(); return s.slice(s.indexOf("/*") + 2, s.lastIndexOf("*/")); }
var FN = T(function () {/*// 비회원 전자책 — study/nmeb.js
function ebPlanOk(area) { return typeof payPart !== "function" || !payPart() || (area === "LC" ? planLC() : planRC()); }
function viewBook(ser, g) {
  if (allowedSeries().indexOf(ser) < 0) { render(topbar("전자책") + '<div class="empty">이 Season은 수강 기간에 포함되지 않았어요.</div>'); bindCommon(); return; }
  var metas = fullSecs(ser, g);
  if (!metas.length) { render(topbar("전자책") + '<div class="empty">아직 공개되지 않은 회차예요.</div>'); bindCommon(); return; }
  render('<div class="empty">전자책을 펼치는 중…</div>');
  Promise.all(metas.map(function (m) { return load("sec:" + m.id).catch(function () { return null; }); })).then(function (secs) {
    secs = secs.filter(Boolean).sort(function (a, b) { return (a.part || 0) - (b.part || 0) || String(a.title).localeCompare(String(b.title), "ko", { numeric: true }); });
    var list = []; secs.forEach(function (sec) { itemsOf(sec).forEach(function (x) { x.sec = sec; list.push(x); }); });
    var mix = { id: "bk", title: g, area: "LC", part: 0, items: [], sets: [] };
    examReview(mix, list, function () { go("#/full"); });
    var tt = app.querySelector(".top .tt"); if (tt) tt.textContent = "📖 " + g + " 전자책 · " + list.length + "문제";
    var bb = app.querySelector("#rv-back"); if (bb) bb.textContent = "‹ 목록";
    var b2 = app.querySelector("#rv-back2"); if (b2) b2.textContent = "회차 목록으로";
    var top = app.querySelector(".top"); if (top) top.insertAdjacentHTML("afterend", '<div class="card peach" style="font-size:14px">📖 <b>전자책</b> · 단어를 누르면 품사·뜻(묶음 표현은 한꺼번에), 스크립트 문장을 누르면 원본 음원이 나와요. PART 2는 ▶ 질문·보기 골라 듣기, 🔁 정답 반복. 아래 ✏️ 필기 · 📸 캡처 · ☆ 단어장.</div>');
  }).catch(function () { render(topbar("전자책") + '<div class="empty">불러오지 못했어요.</div>'); bindCommon(); });
}
function viewLectures(id) {
*/});
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
["function viewLectures(id) {\n", FN + "\n"],
['var LC_OPEN = ["", "learn", "full", "lcx",', 'var LC_OPEN = ["", "learn", "full", "lcx", "eb", "bk",'],
['  if (h[0] === "lcx" && h[2]) return viewLcx(+h[1], decodeURIComponent(h[2]));\n', '  if (h[0] === "bk" && h[2]) return viewBook(+h[1], decodeURIComponent(h[2]));\n  if (h[0] === "lcx" && h[2]) return viewLcx(+h[1], decodeURIComponent(h[2]));\n'],
["var chs = (m.toc || []).filter(function (c) { return all || c.area === S.area; });", "var chs = (m.toc || []).filter(function (c) { return (all || c.area === S.area) && ebPlanOk(c.area); });"],
["    var ch = (m.toc || []).filter(function (c) { return n >= c.p && n <= c.e; })[0];\n", "    var ch = (m.toc || []).filter(function (c) { return n >= c.p && n <= c.e; })[0];\n    if (ch && !ebPlanOk(ch.area)) { render(topbar(\"교재 전자책\") + '<div class=\"empty\">수강권에 포함되지 않은 쪽이에요.</div>'); bindCommon(); return; }\n"],
['<span class="pill ${p[1] ? "n" : "o"}">${p[1] ? "○ 정답" : "✕ 오답"}</span>', '${S.prog[x.key] ? `<span class="pill ${p[1] ? "n" : "o"}">${p[1] ? "○ 정답" : "✕ 오답"}</span>` : `<span class="pill n">정답 (${L[q.answer]})</span>`}'],
['<div style="display:grid;gap:8px">${sv.ans ?', '<button class="btn navy" data-go="#/bk/${ser}/${encodeURIComponent(g)}" style="width:100%;margin-bottom:8px">📖 전자책으로 보기 · 스크립트·해석·해설 + 단어·음원</button><div style="display:grid;gap:8px">${sv.ans ?']
]);
})();
