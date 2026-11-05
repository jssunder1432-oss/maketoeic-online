/* LC 문제 풀기 메뉴 정리 (2026-11-06)
   - 문제 풀기 안의 '실전 모의고사 N회'(PART별 단원) → '실전 모의고사 회차 전체 풀기' 폴더로 옮김
   - 회차마다 세 가지: 전체 풀기 · PART별 풀기 · 문제별 풀기(#/fq)
   - LC 기본 유형 연습 → '교재 파트2 추가 유형 연습문제' */
(function () {
function T(f) { var s = f.toString(); return s.slice(s.indexOf("/*") + 2, s.lastIndexOf("*/")); }
var FQ = T(function () {/*// 실전 모의고사 회차: PART별 풀기 · 문제별 풀기 — study/lcmenu.js
function fullRowExtra(ser, g, secs) {
  var open = ls("fpo:" + ser + ":" + g) === "1";
  secs = secs.slice().sort(function (a, b) { return (a.part || 0) - (b.part || 0) || String(a.title).localeCompare(String(b.title), "ko", { numeric: true }); });
  return `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin:-4px 0 6px">
      <button class="btn sm navy" data-go="#/full/${ser}/${encodeURIComponent(g)}">🎯 전체 풀기</button>
      <button class="btn sm ${open ? "" : "ghost"}" data-fpo="${esc(ser + ":" + g)}">📂 PART별 풀기</button>
      <button class="btn sm ghost" data-go="#/fq/${ser}/${encodeURIComponent(g)}">🔢 문제별 풀기</button></div>` +
    (open ? `<div style="margin:0 0 12px 14px;border-left:3px solid #F6D3BC;padding-left:10px">` + secs.map(function (s) {
      var t = secStats(s);
      return `<button class="row" data-sec="${esc(s.id)}"><span class="pill n">PART ${s.part}</span><span class="t"><b>${esc(s.title)}</b><small>${t.total}문항 · ${t.done}개 풀이 · 정답 ${t.ok}</small></span><span class="pbar"><i style="width:${pct(t.done, t.total)}%"></i></span></button>`;
    }).join("") + `</div>` : "");
}
function bindFullRows() {
  app.querySelectorAll("[data-fpo]").forEach(function (b) { b.onclick = function () { var k = "fpo:" + b.dataset.fpo; ls(k, ls(k) === "1" ? "0" : "1"); viewFullList(); }; });
}
function viewFullQ(ser, g) {
  if (allowedSeries().indexOf(ser) < 0) { render(topbar("실전 모의고사") + '<div class="empty">이 Series는 수강 기간에 포함되지 않았어요.</div>'); bindCommon(); return; }
  var metas = fullSecs(ser, g);
  if (!metas.length) { render(topbar("실전 모의고사") + '<div class="empty">아직 공개되지 않은 회차예요.</div>'); bindCommon(); return; }
  render('<div class="empty">문제를 준비하는 중…</div>');
  Promise.all(metas.map(function (m) { return load("sec:" + m.id).catch(function () { return null; }); })).then(function (secs) {
    secs = secs.filter(Boolean).sort(function (a, b) { return (a.part || 0) - (b.part || 0) || String(a.title).localeCompare(String(b.title), "ko", { numeric: true }); });
    var all = [], byPart = {}, order = [];
    secs.forEach(function (sec) { itemsOf(sec).forEach(function (x) { x.sec = sec; all.push(x); var p = sec.part || 0; if (!byPart[p]) { byPart[p] = []; order.push(p); } byPart[p].push(x); }); });
    render(topbar(g + " · 문제별 풀기") + `<div class="card hero"><span class="kicker">SERIES ${ser} · 실전 모의고사</span><h1>🔢 ${esc(g)} 문제별 풀기</h1><p>풀고 싶은 문제 번호를 누르세요. PART 3·4는 같은 지문 문제(3문항)가 함께 나와요.</p></div>` +
      order.map(function (p) {
        return `<div class="grp">PART ${p}</div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(52px,1fr));gap:6px">` + byPart[p].map(function (x, i) {
          var pr = S.prog[x.key], bg = pr ? (pr[1] ? "#E5F3EE" : "#FDECEA") : "#fff", fg = pr ? (pr[1] ? "#165846" : "#A13A2C") : "#172844";
          return `<button class="btn sm ghost" data-fq="${all.indexOf(x)}" style="background:${bg};color:${fg};padding:10px 0">${esc(x.q.no != null ? x.q.no : i + 1)}</button>`;
        }).join("") + `</div>`;
      }).join("") + `<p style="color:#5B6573;font-size:13px;margin-top:12px">초록 = 맞힘 · 빨강 = 틀림 · 흰색 = 아직 안 품</p>`);
    bindCommon();
    app.querySelectorAll("[data-fq]").forEach(function (b) {
      b.onclick = function () {
        var x = all[+b.dataset.fq], sec = x.sec, list = x.set ? itemsOf(sec).filter(function (y) { return y.set === x.set; }) : [x];
        list.forEach(function (y) { y.sec = sec; });
        quiz(sec, list, Math.max(0, list.indexOf(x)), g + " · " + (x.q.no != null ? x.q.no + "번" : sec.title), "#/fq/" + ser + "/" + encodeURIComponent(g));
      };
    });
  }).catch(function () { });
}
*/});
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
  // 문제 풀기: Series 안의 실전 모의고사 폴더는 빼고 회차 전체 풀기 폴더로 가는 줄 하나
  ["      var sg = gs.filter(function (g) { return seasonOf(groups[g]) === n; });\n",
   "      var sg = gs.filter(function (g) { return seasonOf(groups[g]) === n; });\n      var hasMock = S.area === \"LC\" && sg.some(function (g) { return /LC 실전 모의고사/.test(g); });\n      if (S.area === \"LC\") sg = sg.filter(function (g) { return !/LC 실전 모의고사/.test(g); });\n      if (hasMock) out += `<div class=\"sea\"><b>SERIES ${n}</b>실전 모의고사</div><button class=\"row\" data-go=\"#/full\" style=\"background:linear-gradient(125deg,#E95721,#FF8A3D);color:#fff;border:0\"><span class=\"pill\" style=\"background:#fff;color:#E95721\">모의고사</span><span class=\"t\"><b style=\"color:#fff\">🎯 실전 모의고사 회차 전체 풀기 폴더</b><small style=\"color:#FFF1E6\">전체 풀기 · PART별 풀기 · 문제별 풀기 · 실제 시험처럼 한 번에 듣기</small></span>›</button>`;\n"],
  ["${S.area === \"LC\" ? \"기본 유형 연습\" : \"기본 문제 연습\"}", "${S.area === \"LC\" ? \"교재 파트2 추가 유형 연습문제\" : \"기본 문제 연습\"}"],
  ["function viewFullList() {", FQ + "\nfunction viewFullList() {"],
  ["var LC_OPEN = [\"\", \"learn\", \"full\",", "var LC_OPEN = [\"\", \"learn\", \"full\", \"fq\","],
  ["  if (h[0] === \"full\" && h[2]) return viewFull(+h[1], decodeURIComponent(h[2]));", "  if (h[0] === \"fq\" && h[2]) return viewFullQ(+h[1], decodeURIComponent(h[2]));\n  if (h[0] === \"full\" && h[2]) return viewFull(+h[1], decodeURIComponent(h[2]));"]
]);
})();
