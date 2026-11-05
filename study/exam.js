/* LC 실전 모의고사: 실제 토익 시험처럼 한 회차 PART 1~4를 한 번에 듣기 (2026-11-06)
   - 회차 전체 풀기 첫 화면에 "🎧 실제 시험처럼 한 번에 듣기" 버튼
   - 음성이 멈추지 않고 끝까지 이어서 나온다 (PART 1·2: 문항 뒤 5초, PART 3·4: 문제당 8초) — 멈춤·다음 버튼 없음
   - 화면 = 시험지(PART 1 사진, PART 3·4 문제·보기) + 답안지(전 문항 A~D 마킹, 언제든 고치기 가능)
   - 다 끝나면(또는 '그만두고 채점') 회차 전체 풀기와 같은 결과 화면 · 틀린 문제 해설 */
(function () {
function T(f) { var s = f.toString(); return s.slice(s.indexOf("/*") + 2, s.lastIndexOf("*/")); }
var EXAM = T(function () {/*// 실제 시험처럼 한 번에 듣기 — study/exam.js
function examRun(F) {
  stopPlay();
  var run = PL.run, i = -1, tmr = null, cur = {};
  if (!PL.audio) PL.audio = new Audio();
  var a = PL.audio; F.ans = {};
  var by = {}, order = [];
  F.list.forEach(function (x) { var p = x.sec.part || 0; if (!by[p]) { by[p] = []; order.push(p); } by[p].push(x); });
  var omr = order.map(function (p) {
    return `<div class="grp">PART ${p}</div><div class="exo">` + by[p].map(function (x) {
      var n = (x.q.options || []).length || 4;
      return `<div class="exr" data-row="${esc(x.key)}"><b>${esc(x.q.no != null ? x.q.no : "")}</b>${L.slice(0, n).map(function (l, j) { return `<button class="exb" data-key="${esc(x.key)}" data-k="${j}">${l}</button>`; }).join("")}</div>`;
    }).join("") + `</div>`;
  }).join("");
  render(`${topbar(F.g + " · 실제 시험처럼")}
    <style>.mkst .exo{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px}.mkst .exr{display:flex;align-items:center;gap:5px;padding:5px 8px;border-radius:10px;background:#fff;border:1px solid #E7EAF0}.mkst .exr b{width:30px;font-size:13px;color:#172844}.mkst .exr.now{border-color:#FF581F;box-shadow:0 0 0 2px rgba(255,88,31,.25)}.mkst .exb{width:28px;height:28px;border-radius:50%;border:1.5px solid #AAB6C8;background:#fff;color:#5B6573;font-weight:800;font-size:12px;padding:0}.mkst .exb.on{background:#172844;border-color:#172844;color:#fff}.mkst .exp .lcimg{max-width:100%;border-radius:12px}.mkst .exp .qt{font-weight:800}.mkst .exp ol{margin:6px 0 12px;padding-left:20px}</style>
    <div class="card hero"><span class="kicker">SERIES ${F.ser} · 실제 시험처럼 한 번에</span><h1>🎧 ${esc(F.g)} LC 전체</h1><p id="ex-now">음성을 준비하는 중…</p></div>
    <div id="ex-tap" style="display:none;margin-bottom:10px"><button class="btn" id="ex-go">▶ 음성 이어서 듣기</button></div>
    <div class="card exp" id="ex-page"></div>
    <div class="grp">답안지 · 듣는 중에도 언제든 마킹 · 고치기 가능</div>
    <div class="card" style="background:#F5F7FA;padding:10px">${omr}</div>
    <div class="sticky"><button class="btn ghost" id="ex-stop" style="width:100%">그만두고 채점하기</button></div>`);
  bindCommon();
  app.querySelectorAll(".exb").forEach(function (b) {
    b.onclick = function () {
      F.ans[b.dataset.key] = +b.dataset.k;
      app.querySelectorAll('.exb[data-key="' + b.dataset.key + '"]').forEach(function (o) { o.classList.toggle("on", o === b); });
    };
  });
  var nowEl = document.getElementById("ex-now"), pgEl = document.getElementById("ex-page"), tap = document.getElementById("ex-tap");
  function show(pg) {
    var set = pg[0].set, part = pg[0].sec.part || 0, nos = pg.map(function (x) { return x.q.no; }).filter(function (n) { return n != null; });
    nowEl.textContent = "지금 PART " + part + " · " + (nos.length > 1 ? nos[0] + "~" + nos[nos.length - 1] : (nos[0] != null ? nos[0] : "")) + "번 듣는 중 (" + (i + 1) + " / " + F.pages.length + ")";
    var img = set ? set.image : pg[0].q.image, h = img ? `<img class="lcimg" src="${esc(audioUrl(img))}" alt="">` : "";
    if (part === 2 && !set) h += `<p class="qt">${esc(pg[0].q.no != null ? pg[0].q.no + ". " : "")}Mark your answer on your answer sheet.</p>`;
    else if (set || part >= 3) h += pg.map(function (x) { return `<p class="qt" style="margin:12px 0 0">${esc(x.q.no != null ? x.q.no + ". " : "")}${esc(x.q.q || "")}</p><ol type="A">${(x.q.options || []).map(function (o) { return `<li>${esc(o)}</li>`; }).join("")}</ol>`; }).join("");
    else h += `<p class="qt">${esc(pg[0].q.no != null ? pg[0].q.no + ". " : "")}사진을 가장 잘 묘사한 것을 고르세요.</p>`;
    pgEl.innerHTML = h;
    app.querySelectorAll(".exr.now").forEach(function (r) { r.classList.remove("now"); });
    pg.forEach(function (x) { var r = app.querySelector('.exr[data-row="' + x.key + '"]'); if (r) r.classList.add("now"); });
  }
  function next() {
    clearTimeout(tmr); if (run !== PL.run) return;
    i++; if (i >= F.pages.length) return finish();
    var pg = F.pages[i], set = pg[0].set, src = set ? set.audio : pg[0].q.audio, gap = set ? 8 * pg.length : 5;
    show(pg);
    if (!src) { tmr = setTimeout(next, (gap + 5) * 1000); return; }
    a.onended = a.onerror = function () { a.onended = a.onerror = null; if (run === PL.run) tmr = setTimeout(next, gap * 1000); };
    a.src = audioUrl(src); a.currentTime = 0;
    a.play().then(function () { tap.style.display = "none"; }).catch(function () { tap.style.display = ""; });
  }
  document.getElementById("ex-go").onclick = function () { tap.style.display = "none"; a.play().catch(function () { tap.style.display = ""; }); };
  function finish() {
    stopPlay(); clearTimeout(tmr);
    var left2 = F.list.filter(function (x) { return F.ans[x.key] == null; }).length;
    F.list.forEach(function (y) {
      var c = F.ans[y.key] != null ? F.ans[y.key] : -1, ok = c === y.q.answer, prev = S.prog[y.key];
      S.prog[y.key] = [c, ok, prev ? prev[2] + 1 : 1];
      api("save_progress", { p_token: S.token, p_item: y.key, p_chosen: c, p_correct: ok }).catch(function () { });
    });
    exSet(F.id, null);
    fullResult(F, left2); scrollTop();
  }
  document.getElementById("ex-stop").onclick = function () {
    var n2 = F.list.filter(function (x) { return F.ans[x.key] == null; }).length;
    if (!confirm((i + 1 < F.pages.length ? "아직 음성이 남아 있어요. " : "") + (n2 ? "마킹 안 한 문제 " + n2 + "개는 오답 처리돼요. " : "") + "지금 채점할까요?")) return;
    finish();
  };
  next();
}
*/});
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
  ["function fullPage(F) {\n", EXAM + "\nfunction fullPage(F) {\n"],
  ["    document.getElementById(\"fu-new\").onclick = function () { exSet(id, null); F.ans = {}; F.i = 0; fullPage(F); };\n",
   "    document.getElementById(\"fu-new\").onclick = function () { exSet(id, null); F.ans = {}; F.i = 0; fullPage(F); };\n" +
   "    (function () { var nb = document.getElementById(\"fu-new\"), bx = document.createElement(\"button\"); bx.className = \"btn navy\"; bx.innerHTML = \"🎧 실제 시험처럼 한 번에 듣기 <small style=\\\"display:block;font-weight:600;opacity:.85;font-size:12px\\\">PART 1~4 음성이 멈추지 않고 끝까지 · 답안지에 마킹</small>\"; nb.parentNode.insertBefore(bx, nb.parentNode.firstChild); bx.onclick = function () { exSet(id, null); examRun(F); }; })();\n"]
]);
})();
