/* 매일 과제 (2026-11-05): 첫 화면 폴더 → 오늘의 단어 · PART 2 듣기 · PART 5 · PART 6 · PART 7
   - 날마다 자동으로 바뀐다(처음 연 날 = Day 1). 같은 날에는 같은 문제(기기 안에 저장).
   - OT를 봤으면 OT에서 틀린 유형 위주로 고른다. 문제은행: tp5-*, tp6-*, tp7-* / PART 2: 'Part 2 유형별' */
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
["function viewARound(n) {\n", String.raw`
var DG_OT = "ot-1011", DG_TIP = [
  ["명사 자리", "a/an/the·소유격·형용사 뒤는 명사 자리. a/an이 없으면 복수명사(-s). the는 단수·복수 모두 쓴다."],
  ["형용사 자리", "명사 앞, be동사 뒤는 형용사류. 감정동사는 꾸미는 대상이 사물이면 -ing, 사람이면 -ed."],
  ["부사 자리", "명사+동사+명사면 완벽한 문장. 완벽한 문장 안 빈칸은 부사 자리. have와 p.p. 사이, 조동사와 동사 사이도 부사."],
  ["대명사 격", "빈칸 뒤에 명사가 있으면 소유격, 동사 앞은 주격, 동사·전치사 뒤는 목적격, 주어와 같은 대상이면 재귀대명사."],
  ["능동 · 수동", "동사 뒤에 목적어(명사·명사절)가 있으면 능동, 없으면 수동(be p.p.). 자동사는 수동이 안 된다."],
  ["수일치 · 조동사", "주어가 단수면 동사에 -s, 복수면 동사원형. will·can·must 같은 조동사 뒤는 동사원형."],
  ["시제", "since·for the past → 현재완료, next·tomorrow → 미래, by the time → 완료. 시간 단서부터 찾는다."],
  ["준동사", "타동사에서 온 -ing·to부정사 뒤엔 명사가 있어야 한다. 명사가 없으면 being p.p. / to be p.p."],
  ["전치사 vs 접속사", "빈칸 뒤가 명사면 전치사, 주어+동사면 접속사. 동사가 2개면 접속사가 하나 필요하다."],
  ["관계사 · 명사절", "뒤 문장에 주어·목적어가 빠졌으면 관계대명사·what, 완전하면 that·whether. 전치사 뒤엔 that·if를 못 쓴다."],
  ["어휘는 짝으로", "뜻만 보지 말고 빈칸 앞뒤 짝 단어(콜로케이션)부터 본다. 틀린 단어는 짝 표현째 외운다."]
];
function dgYmd(d) { return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); }
function dgDate(n) { return new Date(Math.floor(n / 10000), Math.floor(n / 100) % 100 - 1, n % 100); }
function dgStart() {
  var p = S.prog["dg:start"]; if (p && +p[0] > 20200000) return +p[0];
  var t = dgYmd(new Date()); S.prog["dg:start"] = [t, true, 1];
  api("save_progress", { p_token: S.token, p_item: "dg:start", p_chosen: t, p_correct: true }).catch(function () { });
  return t;
}
function dgDay() { return Math.max(1, Math.round((dgDate(dgYmd(new Date())) - dgDate(dgStart())) / 864e5) + 1); }
function dgRand(seed) { var s = seed % 2147483647 || 1; return function () { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; }; }
function dgShuffle(a, seed) { var r = dgRand(seed), b = a.slice(); for (var i = b.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = b[i]; b[i] = b[j]; b[j] = t; } return b; }
var DG_WEAK = null;
function dgWeak() {
  if (DG_WEAK) return Promise.resolve(DG_WEAK);
  return Promise.all([5, 6, 7].map(function (p) { return load("sec:" + DG_OT + "-p" + p).catch(function () { return null; }); })).then(function (secs) {
    var w = { 5: {}, 6: {}, 7: {}, ot: false };
    secs.forEach(function (sec, i) { if (!sec) return; var part = 5 + i; itemsOf(sec).forEach(function (x) {
      var p = S.prog[x.key]; if (!p) return; w.ot = true;
      if (!p[1]) { var t = x.q.qtype || onGuess(x.q, x.set, part); if (t) w[part][t] = (w[part][t] || 0) + 1; }
    }); });
    DG_WEAK = w; return w;
  });
}
function dgKey(part) { return "dg:" + dgYmd(new Date()) + ":" + part; }
function dgLoadKeys(keys, part) {
  var ids = []; keys.forEach(function (k) { var id = k.split(":")[0]; if (ids.indexOf(id) < 0) ids.push(id); });
  return Promise.all(ids.map(function (id) { return load("sec:" + id).catch(function () { return null; }); })).then(function (secs) {
    var M = {}; secs.forEach(function (sec) { if (sec) itemsOf(sec).forEach(function (x) { x.sec = sec; if (part === 6 && x.set) x.set = onFill(x.set, x.q.no); M[x.key] = x; }); });
    return keys.map(function (k) { return M[k]; }).filter(Boolean);
  });
}
// 오늘 문제 고르기: PART 5 = 12문제, PART 6 = 1지문(4문제), PART 7 = 2지문
function dgPick(part, weak) {
  var saved; try { saved = JSON.parse(ls(dgKey(part)) || "null"); } catch (e) { saved = null; }
  if (saved && saved.length) return dgLoadKeys(saved, part);
  var seed = dgYmd(new Date()) * 10 + part + (S.profile && S.profile.name ? S.profile.name.length * 7 : 0);
  var wt = Object.keys(weak[part] || {}), ids = [];
  if (part === 5) { var sl = wt.map(function (t) { return ON_T5[t]; }).filter(Boolean); if (!sl.length) sl = Object.keys(ON_T5).map(function (t) { return ON_T5[t]; }); sl.forEach(function (s) { ids = ids.concat(onIds5(s)); }); }
  else ids = ON_BANK[part].slice();
  ids = dgShuffle(ids, seed).slice(0, part === 5 ? 6 : 3);
  return Promise.all(ids.map(function (id) { return load("sec:" + id).catch(function () { return null; }); })).then(function (secs) {
    var pick = [];
    if (part === 5) {
      var pool = []; secs.forEach(function (sec) { if (sec) itemsOf(sec).forEach(function (x) { if (!S.prog[x.key]) { x.sec = sec; pool.push(x); } }); });
      pick = dgShuffle(pool, seed + 1).slice(0, 12);
    } else {
      var sets = []; secs.forEach(function (sec) { if (!sec) return; var by = {}; itemsOf(sec).forEach(function (x) { x.sec = sec; var sk = x.key.replace(/-\d+$/, ""); (by[sk] = by[sk] || []).push(x); }); Object.keys(by).forEach(function (k) {
        var g = by[k]; if (g.some(function (x) { return S.prog[x.key]; })) return;
        var sc = wt.length ? g.filter(function (x) { return weak[part][x.q.qtype]; }).length : 1; sets.push({ g: g, sc: sc });
      }); });
      sets = dgShuffle(sets, seed + 2).sort(function (a, b) { return b.sc - a.sc; }).slice(0, part === 6 ? 1 : 2);
      sets.forEach(function (s) { s.g.forEach(function (x) { if (part === 6 && x.set) x.set = onFill(x.set, x.q.no); pick.push(x); }); });
    }
    if (pick.length) ls(dgKey(part), JSON.stringify(pick.map(function (x) { return x.key; })));
    return pick;
  });
}
function dgP2() {
  var secs = ((S.catalog || {}).sections || []).filter(function (s) { return s.group === "Part 2 유형별"; });
  if (!secs.length) return null;
  return secs[(dgDay() - 1) % secs.length];
}
function dgCard() {
  return '<button class="row" data-go="#/dg" style="padding:26px 20px;background:linear-gradient(125deg,#172844,#2D4F86);color:#fff;border:0"><span class="pill" style="background:#FF581F;color:#fff;font-size:15px;padding:6px 14px">매일</span><span class="t"><b style="color:#fff;font-size:21px">📅 매일 과제</b><small style="color:#fff">오늘의 단어 · PART 2 듣기 · PART 5 · 6 · 7 — 날마다 자동으로 바뀌어요</small></span><span style="font-size:22px;color:#fff">›</span></button>';
}
function dgInject(html) {
  if (!/어느 학습실로 들어갈까요/.test(html) || app.querySelector('[data-go="#/dg"]')) return;
  var at = app.querySelector('[data-go="#/ot"]') || app.querySelector('[data-go="#/rec"]') || app.querySelector('[data-room="RC"]'); if (!at) return;
  at.insertAdjacentHTML("afterend", dgCard());
  var b = app.querySelector('[data-go="#/dg"]'); if (b) b.onclick = function () { go("#/dg"); };
}
function viewDG() {
  render('<div class="empty">오늘 과제를 준비하는 중…</div>');
  var day = dgDay(), vd = (day - 1) % 30 + 1, tip = DG_TIP[(day - 1) % DG_TIP.length], p2 = dgP2();
  dgWeak().then(function (w) {
    return Promise.all([dgPick(5, w), dgPick(6, w), dgPick(7, w)]).then(function (L) { return { w: w, L: L }; });
  }).then(function (r) {
    var w = r.w, L = { 5: r.L[0], 6: r.L[1], 7: r.L[2] }, d = new Date();
    function st(list) { var n = list.length, k = list.filter(function (x) { return S.prog[x.key]; }).length; return { n: n, k: k, done: n && k >= n }; }
    function row(ic, t, sub, btn, done, prog) {
      return '<div class="card" style="display:flex;align-items:center;gap:12px;padding:16px;' + (done ? 'background:#F1F8F4;border-color:#9BD3B4' : '') + '"><div style="font-size:26px">' + (done ? "✅" : ic) + '</div><div style="flex:1;min-width:0"><b style="font-size:17px">' + t + '</b><div style="font-size:13.5px;color:#3A4250;margin-top:2px">' + sub + '</div>' + (prog ? '<div style="font-size:13px;font-weight:800;margin-top:4px">' + prog + '</div>' : '') + '</div>' + btn + '</div>';
    }
    function topW(part) { var o = w[part] || {}; return Object.keys(o).sort(function (a, b) { return o[b] - o[a]; }).slice(0, 2).map(function (t) { return t.replace(/^PART \d · /, ""); }); }
    var s5 = st(L[5]), s6 = st(L[6]), s7 = st(L[7]), p2s = p2 ? secStats(p2) : null;
    var tw5 = topW(5), tw6 = topW(6), tw7 = topW(7);
    var allDone = s5.done && s6.done && s7.done;
    render(topbar("매일 과제") +
      '<div class="card hero"><span class="kicker">' + (d.getMonth() + 1) + "월 " + d.getDate() + '일 · Day ' + day + '</span><h1 style="margin:4px 0">오늘의 과제</h1><p>' + (allDone ? "오늘 문제를 다 풀었어요! 👏 내일 새 과제가 나와요." : "위에서부터 순서대로 하면 돼요. 내일이 되면 새 과제로 바뀌어요.") + (w.ot ? "<br><small>OT에서 틀린 유형 위주로 골랐어요.</small>" : "") + '</p></div>' +
      '<div class="card peach" style="font-size:14px"><b>💡 오늘의 문법 포인트 · ' + esc(tip[0]) + '</b><br>' + esc(tip[1]) + '</div>' +
      row("📖", "단어 암기 · VOCA DAY " + String(vd).padStart(2, "0"), "단어 외우기 → 카드 → 단어 시험까지", '<button class="btn sm" data-go="#/v/' + vd + '">열기</button>', false, "") +
      (p2 ? row("🎧", "PART 2 듣기 · " + esc(p2.title), "Part 2 유형별 — 듣고 바로 답 고르기", '<button class="btn sm" data-go="#/s/' + encodeURIComponent(p2.id) + '">열기</button>', p2s && p2s.total && p2s.done >= p2s.total, p2s ? p2s.done + " / " + p2s.total + " 풀이" : "") : "") +
      row("✏️", "PART 5 · " + s5.n + "문제", tw5.length ? "집중 유형: " + esc(tw5.join(", ")) : "문법 · 어휘 골고루", '<button class="btn sm" data-dg="5"' + (s5.n ? "" : " disabled") + '>' + (s5.k ? "이어 풀기" : "풀기") + '</button>', s5.done, s5.k + " / " + s5.n) +
      row("📄", "PART 6 · 지문 1개 (" + s6.n + "문제)", tw6.length ? "집중 유형: " + esc(tw6.join(", ")) : "문법 · 어휘 · 접속부사 · 문장 고르기", '<button class="btn sm" data-dg="6"' + (s6.n ? "" : " disabled") + '>' + (s6.k ? "이어 풀기" : "풀기") + '</button>', s6.done, s6.k + " / " + s6.n) +
      row("📰", "PART 7 · 지문 2개 (" + s7.n + "문제)", tw7.length ? "집중 유형: " + esc(tw7.join(", ")) : "세부 사항 · 사실 확인 · 추론 등", '<button class="btn sm" data-dg="7"' + (s7.n ? "" : " disabled") + '>' + (s7.k ? "이어 풀기" : "풀기") + '</button>', s7.done, s7.k + " / " + s7.n) +
      '<div class="card" style="font-size:13.5px;color:#3A4250">틀린 문제는 풀고 난 뒤 해설의 ‘의식의 흐름’을 소리 내 읽고, 다음 날 시작 전에 한 번 더 보세요.</div>');
    bindCommon();
    app.querySelectorAll("[data-dg]").forEach(function (b) { b.onclick = function () {
      var p = +b.dataset.dg, list = L[p].filter(function (x) { return !S.prog[x.key]; });
      if (!list.length) list = L[p];
      mixQuiz("매일 과제 · PART " + p, "RC", list, "#/dg");
    }; });
  }).catch(function (e) { render(topbar("매일 과제") + '<div class="empty">과제를 불러오지 못했어요. 잠시 뒤 다시 열어 주세요.</div>'); bindCommon(); });
}
function viewARound(n) {
`],
["function render(html) { app.innerHTML = html; otInject(html); }", "function render(html) { app.innerHTML = html; otInject(html); dgInject(html); }"],
['  if (h[0] === "ot") return viewOT(h[1] || "");', '  if (h[0] === "dg") return viewDG();\n  if (h[0] === "ot") return viewOT(h[1] || "");']
]);
