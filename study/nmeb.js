/* 비회원 30일 수강권 자료도 전자책 구성으로 (2026-11-05)
   - 비회원은 시즌 교재(전자책·PDF)를 주지 않고, 대신 첫 화면에 이번 달 LC 실전 모의고사 회차별 '전자책 · 문제 PDF'
   - LC 실전 모의고사 회차마다 '📖 전자책으로 보기'(#/bk/시즌/회차): 문제·보기·스크립트·해석·해설을 한 화면에,
     단어 누르면 품사·뜻·묶음 표현, 문장 누르면 원본 음원, PART 2 정답 반복, 필기·캡처·단어장 (stfx.js 기능) */
(function () {
function T(f) { var s = f.toString(); return s.slice(s.indexOf("/*") + 2, s.lastIndexOf("*/")); }
var FN = T(function () {/*// 비회원 전자책 — study/nmeb.js
function ebPlanOk(area) { return typeof payPart !== "function" || !payPart() || (area === "LC" ? planLC() : planRC()); }
// 비회원 첫 화면: 시즌 교재 대신 이번 달 LC 실전 모의고사 회차별 문제 — 전자책 · 문제 PDF
function nmBookBox() {
  if (!planLC()) return "";
  var ser = curSer(), gs = typeof fullGroups === "function" ? fullGroups(ser) : []; if (!gs.length) return "";
  return '<div style="border:2px solid #5B2A86;border-radius:18px;padding:12px 12px 4px;margin:0 0 14px;background:#fff"><div style="margin:2px 4px 10px"><b style="font-size:17px;color:#172844">📖 LC 실전 모의고사 전자책</b><small style="display:block;color:#33404F;font-size:13px">Season ' + ser + ' · 회차별 문제를 전자책으로 — 단어 누르면 품사·뜻, 문장 누르면 원본 음원, 필기·캡처·단어장</small></div>' +
    gs.map(function (g) { return '<div style="display:flex;gap:6px;margin-bottom:8px"><button class="row" data-go="#/bk/' + ser + '/' + encodeURIComponent(g) + '" style="flex:2;margin:0;background:linear-gradient(125deg,#5B2A86,#8E4FD1);color:#fff;border:0"><span class="pill" style="background:#fff;color:#5B2A86">' + fullRound(g) + '회</span><span class="t"><b style="color:#fff">📖 ' + esc(g) + '</b><small style="color:#fff">전자책으로 보기</small></span>›</button><button class="btn sm" data-lcxpdf="' + ser + '|' + esc(g) + '" style="flex:1;background:#172844;font-size:13.5px;padding:8px 4px">📄 문제 PDF</button></div>'; }).join("") + "</div>";
}
function nmInject(html) {
  if (typeof payPart !== "function" || !payPart() || S.area !== "LC" || app.querySelector("[data-nmbk]")) return;
  var b0 = [].filter.call(app.querySelectorAll("b"), function (x) { return /LC 문제 · 해설강의/.test(x.textContent); })[0]; if (!b0) return; var g = b0.parentNode.parentNode;
  var h = nmBookBox(); if (!h) return; g.insertAdjacentHTML("beforebegin", '<div data-nmbk="1">' + (typeof myBox === "function" ? myBox() : "") + h + "</div>"); if (typeof myBind === "function") myBind();
  app.querySelectorAll("[data-nmbk] [data-go]").forEach(function (b) { b.onclick = function () { go(b.dataset.go); }; });
}
var BK_CSS = ".mkst.bk-q .ex,.mkst.bk-q section.mr,.mkst.bk-q .card.script,.mkst.bk-q .qb>.pill,.mkst.bk-q details.nc,.mkst.bk-q .fxp2 [data-rep],.mkst.bk-q .fxp2+.fxtip,.mkst.bk-q [data-lec]{display:none!important}.mkst.bk-q .opt.right,.mkst.bk-q .opt.wrong{background:#fff!important;border-color:var(--line)!important;color:inherit!important}.mkst.bk-q .opt.right .k,.mkst.bk-q .opt.wrong .k{background:#EEF1F5!important;color:#172844!important}";
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
    var top = app.querySelector(".top"); if (top) top.insertAdjacentHTML("afterend", '<div class="card peach" style="font-size:14px">📖 <b>전자책</b> · 단어를 누르면 품사·뜻(묶음 표현은 한꺼번에), ▶ 버튼으로 질문·보기 원본 음원. 아래 ✏️ 필기 · 📸 캡처 · ☆ 단어장.<div style="display:flex;gap:6px;margin-top:10px"><button class="btn sm" id="bk-q" style="flex:1">📝 문제만 보기</button><button class="btn ghost sm" id="bk-a" style="flex:1">✅ 정답 · 스크립트 · 해설</button><button class="btn ghost sm" data-lcxpdf="' + ser + '|' + esc(g) + '" style="flex:1">📄 문제 PDF</button></div></div>');
    if (!document.getElementById("bk-css")) { var cs = document.createElement("style"); cs.id = "bk-css"; cs.textContent = BK_CSS; document.head.appendChild(cs); }
    var host = document.querySelector(".mkst"), bq = document.getElementById("bk-q"), ba = document.getElementById("bk-a");
    function mode(q) { host.classList.toggle("bk-q", q); bq.className = "btn sm" + (q ? "" : " ghost"); ba.className = "btn sm" + (q ? " ghost" : ""); }
    // 지문(대화·담화) 세트마다 ▶ 원본 음원 듣기
    var SETS = []; list.forEach(function (x) { if (x.set && SETS.indexOf(x.set) < 0) SETS.push(x.set); });
    var heads = [].filter.call(app.querySelectorAll(".card > div"), function (d) { return /번 지문$/.test(d.textContent.trim()) && d.style.fontWeight; });
    heads.forEach(function (h, i) { var st = SETS[i]; if (!st || !st.audio) return; var bt = document.createElement("button"); bt.className = "btn sm"; bt.style.cssText = "margin:0 0 10px;width:100%"; bt.textContent = "▶ " + (st.range || "") + "번 원본 음원 듣기"; bt.onclick = function () { stopPlay(); var on = bt.dataset.on; if (on) { delete bt.dataset.on; bt.textContent = "▶ " + (st.range || "") + "번 원본 음원 듣기"; return; } bt.dataset.on = 1; bt.textContent = "■ 멈춤"; playOne(st.audio, null, PL.run).then(function () { delete bt.dataset.on; bt.textContent = "▶ " + (st.range || "") + "번 원본 음원 듣기"; }); }; h.insertAdjacentElement("afterend", bt); });
    bq.onclick = function () { mode(true); }; ba.onclick = function () { mode(false); }; mode(true);
    window.addEventListener("hashchange", function h() { host.classList.remove("bk-q"); window.removeEventListener("hashchange", h); });
  }).catch(function () { render(topbar("전자책") + '<div class="empty">불러오지 못했어요.</div>'); bindCommon(); });
}
function viewLectures(id) {
*/});
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
["function viewLectures(id) {\n", FN + "\n"],
["function render(html) { app.innerHTML = html; otInject(html); dgInject(html); }", "function render(html) { app.innerHTML = html; otInject(html); dgInject(html); nmInject(html); }"],
["function ebFreePdf() {\n", "function ebFreePdf() {\n  if (typeof payPart === \"function\" && payPart()) return nmBookBox();\n"],
["function ebRoomBox() {\n", "function ebRoomBox() {\n  if (typeof payPart === \"function\" && payPart()) return \"\";\n"],
['var LC_OPEN = ["", "learn", "full", "lcx",', 'var LC_OPEN = ["", "learn", "full", "lcx", "bk",'],
["function catOpen(h) {\n  var r = h[0] || \"\";\n", "function catOpen(h) {\n  var r = h[0] || \"\";\n  if (r === \"eb\" && (h[1] === \"voc\" || h[1] === \"note\")) return true;\n"],
['  if (h[0] === "lcx" && h[2]) return viewLcx(+h[1], decodeURIComponent(h[2]));\n', '  if (h[0] === "bk" && h[2]) return viewBook(+h[1], decodeURIComponent(h[2]));\n  if (h[0] === "lcx" && h[2]) return viewLcx(+h[1], decodeURIComponent(h[2]));\n'],
["var chs = (m.toc || []).filter(function (c) { return all || c.area === S.area; });", "var chs = (m.toc || []).filter(function (c) { return (all || c.area === S.area) && ebPlanOk(c.area); });"],
["    var ch = (m.toc || []).filter(function (c) { return n >= c.p && n <= c.e; })[0];\n", "    var ch = (m.toc || []).filter(function (c) { return n >= c.p && n <= c.e; })[0];\n    if (ch && !ebPlanOk(ch.area)) { render(topbar(\"교재 전자책\") + '<div class=\"empty\">수강권에 포함되지 않은 쪽이에요.</div>'); bindCommon(); return; }\n"],
['<span class="pill ${p[1] ? "n" : "o"}">${p[1] ? "○ 정답" : "✕ 오답"}</span>', '${S.prog[x.key] ? `<span class="pill ${p[1] ? "n" : "o"}">${p[1] ? "○ 정답" : "✕ 오답"}</span>` : `<span class="pill n">정답 (${L[q.answer]})</span>`}'],
['<div style="display:grid;gap:8px">${sv.ans ?', '<button class="btn navy" data-go="#/bk/${ser}/${encodeURIComponent(g)}" style="width:100%;margin-bottom:8px">📖 전자책으로 보기 · 스크립트·해석·해설 + 단어·음원</button><div style="display:grid;gap:8px">${sv.ans ?']
]);
})();
