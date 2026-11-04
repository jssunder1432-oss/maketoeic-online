/* OT 오답노트 (2026-11-04): 수업 첫날 종이로 푼 RC(101~200) 답을 입력하면 채점·유형 분석·오답노트·틀린 유형 50문제
   문제·해설: content 'sec:ot-<id>-p5' / '-p6' / '-p7' (A급 과제와 같은 형식, 문항마다 qtype) */
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
["function viewARound(n) {\n", String.raw`
var OT_LIST = [{ id: "ot-1011", title: "2026. 10. 11 정기토익 RC", short: "10.11 정기토익 RC" }];
function otSecs(o) { return [5, 6, 7].map(function (p) { return { id: o.id + "-p" + p, part: p }; }); }
function otGet(o) { return Promise.all(otSecs(o).map(function (m) { return load("sec:" + m.id).catch(function () { return null; }); })); }
function otDone(full) { var n = 0, t = 0; full.forEach(function (s) { if (s) itemsOf(s).forEach(function (x) { t++; if (S.prog[x.key]) n++; }); }); return t && n >= t; }
function otCard() {
  return '<button class="row" data-go="#/ot" style="border:2px solid #172844;background:#F3F6FB"><span class="pill n">OT</span><span class="t"><b>📝 OT 오답노트</b><small>수업 첫날 푼 RC 답을 입력하면 채점·약점 분석·오답노트가 나와요</small></span><span style="font-size:18px;color:#172844">›</span></button>';
}
function viewOT(id) {
  var o = OT_LIST.filter(function (x) { return x.id === id; })[0];
  if (!o && OT_LIST.length === 1) o = OT_LIST[0];
  if (!o) { render(topbar("OT 오답노트") + OT_LIST.map(function (x) { return '<button class="row" data-go="#/ot/' + x.id + '"><span class="t"><b>' + esc(x.title) + '</b></span></button>'; }).join("")); bindCommon(); return; }
  render('<div class="empty">불러오는 중…</div>');
  otGet(o).then(function (full) {
    if (full.some(function (s) { return !s; })) { render(topbar("OT 오답노트") + '<div class="empty">OT 문제를 불러오지 못했어요. 잠시 뒤 다시 열어 주세요.</div>'); bindCommon(); return; }
    if (otDone(full) && !S._otEdit) otResult(o, full); else otSheet(o, full);
  });
}
function otSheet(o, full) {
  var draft = {}; try { draft = JSON.parse(ls("ot:" + o.id) || "{}") || {}; } catch (e) { draft = {}; }
  full.forEach(function (s) { itemsOf(s).forEach(function (x) { var p = S.prog[x.key]; if (p && draft[x.key] == null) draft[x.key] = p[0]; }); });
  var all = []; full.forEach(function (s) { itemsOf(s).forEach(function (x) { all.push({ x: x, part: s.part }); }); });
  function cnt() { return all.filter(function (a) { return draft[a.x.key] != null && draft[a.x.key] >= 0; }).length; }
  var lastPart = 0;
  render(topbar("OT 답안 입력") +
    '<div class="card peach" style="font-size:14px"><b>' + esc(o.title) + '</b><br>시험지에 표시한 답을 그대로 눌러 주세요. 다 누르고 <b>제출</b>하면 채점과 약점 분석이 나와요. (입력한 답은 자동 저장)</div>' +
    '<div class="card" style="padding:6px 10px">' + all.map(function (a) {
      var head = a.part !== lastPart ? '<div style="font-weight:900;color:#172844;margin:12px 0 4px">PART ' + a.part + "</div>" : ""; lastPart = a.part;
      var no = a.x.q.no, v = draft[a.x.key];
      return head + '<div style="display:flex;align-items:center;gap:6px;padding:5px 0;border-bottom:1px solid #EEF1F5"><b style="min-width:40px">' + esc(no) + "</b>" +
        [0, 1, 2, 3].map(function (k) { return '<button data-otk="' + esc(a.x.key) + '" data-otv="' + k + '" style="flex:1;max-width:58px;height:38px;border-radius:19px;border:2px solid #172844;font-weight:900;font-size:15px;background:' + (v === k ? "#172844;color:#fff" : "#fff;color:#172844") + '">' + L[k] + "</button>"; }).join("") + "</div>";
    }).join("") + "</div>" +
    '<div class="sticky"><button class="btn navy" id="ot-go">제출하고 채점하기 (<span id="ot-n">' + cnt() + "</span> / " + all.length + ")</button></div>");
  bindCommon();
  app.querySelectorAll("[data-otk]").forEach(function (b) { b.onclick = function () {
    var k = b.dataset.otk, v = +b.dataset.otv; draft[k] = draft[k] === v ? null : v; ls("ot:" + o.id, JSON.stringify(draft));
    app.querySelectorAll('[data-otk="' + k.replace(/"/g, '\\"') + '"]').forEach(function (c) { var on = draft[k] === +c.dataset.otv; c.style.background = on ? "#172844" : "#fff"; c.style.color = on ? "#fff" : "#172844"; });
    document.getElementById("ot-n").textContent = cnt();
  }; });
  document.getElementById("ot-go").onclick = function () {
    var miss = all.length - cnt();
    if (miss && !window.confirm("아직 " + miss + "문제를 안 눌렀어요. 안 누른 문제는 틀린 것으로 채점할까요?")) return;
    all.forEach(function (a) {
      var x = a.x, c = draft[x.key] == null ? -1 : draft[x.key], ok = c === x.q.answer, prev = S.prog[x.key];
      S.prog[x.key] = [c, ok, prev ? prev[2] + 1 : 1];
      api("save_progress", { p_token: S.token, p_item: x.key, p_chosen: c, p_correct: ok }).catch(function () { });
    });
    S._otEdit = false; otResult(o, full); window.scrollTo(0, 0);
  };
}
function otResult(o, full) {
  render('<div class="empty">분석 중…</div>');
  onTypes().then(function (rct) { return onCollect(otSecs(o), rct); }).then(function (parts) {
    var tot = 0, ok = 0; parts.forEach(function (p) { tot += p.list.length; ok += p.list.filter(function (x) { return x.ok; }).length; });
    var w = onWrongBy(parts), back = "#/ot/" + o.id;
    var types = {}; parts.forEach(function (p) { p.list.forEach(function (x) { if (!x.ok) types[x.type] = (types[x.type] || 0) + 1; }); });
    var tl = Object.keys(types).sort(function (a, b) { return types[b] - types[a]; });
    render(topbar("OT 오답노트") +
      '<div class="card hero score"><span class="kicker">' + esc(o.title) + '</span><div class="big">' + ok + " / " + tot + '</div><p>정답률 ' + pct(ok, tot) + "% · 틀린 문제 " + (tot - ok) + "개</p></div>" +
      '<div class="card"><b>PART별 점수</b><div style="display:grid;gap:6px;margin-top:8px">' + parts.map(function (p) {
        var k = p.list.filter(function (x) { return x.ok; }).length, n = p.list.length;
        return '<div style="display:flex;align-items:center;gap:8px"><span class="pill n" style="min-width:64px;text-align:center">PART ' + p.part + '</span><span class="pbar" style="flex:1"><i style="width:' + pct(k, n) + '%"></i></span><b style="min-width:62px;text-align:right">' + k + " / " + n + "</b></div>";
      }).join("") + "</div></div>" +
      (tl.length ? '<div class="card"><b>약점 유형</b> <small style="color:#5B6573">(틀린 개수 많은 순)</small><div style="display:grid;gap:4px;margin-top:8px">' + tl.map(function (t, i) {
        return '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #EEF1F5' + (i < 3 ? ";font-weight:800" : "") + '"><span>' + (i < 3 ? "🔥 " : "") + esc(t) + "</span><span>" + types[t] + "개</span></div>";
      }).join("") + "</div></div>" : "") +
      '<div class="card" id="ot-box" style="border:2px solid #172844;display:grid;gap:8px"><button class="btn" data-onnote="1">📄 OT 오답노트 출력 · PDF 저장</button>' +
      [5, 6, 7].map(function (p) { return onPracBtn(p, w[p]); }).join("") + onLastBtns([5, 6, 7]) + "</div>" +
      '<button class="btn ghost" id="ot-edit">답안 다시 입력하기</button>');
    bindCommon();
    var box = document.getElementById("ot-box");
    onBind(box, w, back, { title: "OT · " + o.title, parts: parts }); onLastBind(box);
    document.getElementById("ot-edit").onclick = function () { S._otEdit = true; otSheet(o, full); window.scrollTo(0, 0); };
  });
}
function viewARound(n) {
`],
["  ${todayCard()}", "  ${otCard()}\n  ${todayCard()}"],
['  if (h[0] === "rank") return viewRank(h[1] ? +h[1] : 0);', '  if (h[0] === "ot") return viewOT(h[1] || "");\n  if (h[0] === "rank") return viewRank(h[1] ? +h[1] : 0);']
]);
