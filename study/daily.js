/* 매일 과제 (2026-11-05): 첫 화면 폴더 → 오늘의 단어 · PART 2 듣기 · PART 5 · PART 6 · PART 7
   - 날마다 자동으로 바뀐다(처음 연 날 = Day 1). 같은 날에는 같은 문제(기기 안에 저장).
   - 교재(메이크토익_교재_최종) 진도와 페이지를 함께 적는다: PART 2 하루 2챕터 / PART 5 하루 1단원 / PART 7 하루 1쪽
   - OT 결과로 과정을 나눈다: PART 5가 낮으면 '기초 다지기'(OT 안 본 학생 포함), 그 밖은 '실전 다지기'(학생 화면엔 기준 점수를 적지 않는다)
   - OT를 봤으면 OT에서 틀린 유형 위주로 고른다. 문제은행: tp5/tp6/tp7(유형 연습) + v5/v6/v7(A급 과제 변형) */
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
["function viewARound(n) {\n", String.raw`
var DG_OT = "ot-1011", DG_CUT = 15;
// PART 2 교재 진도 (교재 1~24쪽): WHO·WHERE → WHEN·HOW → WHAT/WHICH·WHY → BE동사·조동사 → DO동사·부정/부가 → 평서문
var DG_P2 = [
  { ids: ["lc-p2-who", "lc-p2-where"], pg: "2~5", nm: "WHO · WHERE" },
  { ids: ["lc-p2-when", "lc-p2-how"], pg: "6~9", nm: "WHEN · HOW" },
  { ids: ["lc-p2-what-which", "lc-p2-why"], pg: "10~13", nm: "WHAT · WHICH · WHY" },
  { ids: ["lc-p2-be", "lc-p2-modal"], pg: "14~17", nm: "BE동사 · 조동사" },
  { ids: ["lc-p2-do", "lc-p2-neg-tag"], pg: "18~21", nm: "DO동사 · 부정·부가의문문" },
  { ids: ["lc-p2-statement"], pg: "22~24", nm: "평서문" }];
// PART 5 교재 진도 (교재 53~97쪽): [단원, 앱 단원 id, 교재 쪽, 연습 유형, 오늘의 포인트]
var DG_P5 = [
  ["2형식", "rc-p5-2form", "53~55", "품사 자리", "be·become·remain·seem 뒤는 형용사(보어) 자리. 부사는 못 온다."],
  ["명사", "rc-p5-noun", "56~59", "품사 자리", "a/an/the·소유격·형용사 뒤는 명사 자리. a/an이 없으면 복수명사(-s). the는 단수·복수 모두 쓴다."],
  ["격", "rc-p5-case", "60~61", "대명사", "빈칸 뒤에 명사가 있으면 소유격, 동사 앞은 주격, 동사·전치사 뒤는 목적격, 주어와 같은 대상이면 재귀대명사."],
  ["부사", "rc-p5-adverb", "62~63", "품사 자리", "명사+동사+명사면 완벽한 문장. 완벽한 문장 안 빈칸은 부사 자리. have와 p.p. 사이, 조동사와 동사 사이도 부사."],
  ["형용사 · 소유격 · ing/ed", "rc-p5-adj", "64~66", "품사 자리", "명사 앞은 형용사류. 감정동사는 꾸미는 대상이 사물이면 -ing, 사람이면 -ed."],
  ["능동태 · 수동태", "rc-p5-voice", "67~68", "동사 태", "동사 뒤에 목적어(명사·명사절)가 있으면 능동, 없으면 수동(be p.p.). 자동사는 수동이 안 된다."],
  ["동사 수일치 · 조동사", "rc-p5-agreement", "69~70", "동사 시제·수일치", "주어가 단수면 동사에 -s, 복수면 동사원형. will·can·must 같은 조동사 뒤는 동사원형."],
  ["자동사", "rc-p5-intransitive", "71~72", "동사 태", "자동사는 목적어를 못 받고 수동도 안 된다. 뒤에는 전치사+명사나 부사가 온다."],
  ["명사절 · 관계대명사", "rc-p5-clause", "73~74", "관계사 · 명사절", "동사가 2개면 접속사가 필요하다. 뒤 문장에 주어·목적어가 빠졌으면 관계대명사·what, 완전하면 that·whether."],
  ["동명사 · to부정사 / 시제", "rc-p5-gerund-tense", "75~76", "준동사", "타동사에서 온 -ing·to부정사 뒤엔 명사가 있어야 한다. since·for the past → 현재완료, next → 미래."],
  ["어휘 1회", "rc-p5-vocab-1", "77~79", "어휘 · 명사", "뜻만 보지 말고 빈칸 앞뒤 짝 단어(콜로케이션)부터 본다. 틀린 단어는 짝 표현째 외운다."],
  ["어휘 2회", "rc-p5-vocab-2", "80~82", "어휘 · 동사", "동사 어휘는 뒤에 오는 목적어·전치사와 짝으로 고른다."],
  ["어휘 3회", "rc-p5-vocab-3", "83~85", "어휘 · 형용사", "형용사 어휘는 꾸미는 명사, 뒤의 전치사(be responsible for 등)와 짝으로 고른다."],
  ["어휘 4회", "rc-p5-vocab-4", "86~88", "어휘 · 부사", "부사 어휘는 시제·숫자·동사 단서와 짝이다. recently(과거·현재완료), soon(미래), nearly(숫자 앞)."],
  ["어휘 5회", "rc-p5-vocab-5", "89~91", "전치사 vs 접속사 vs 접속부사", "빈칸 뒤가 명사면 전치사, 주어+동사면 접속사. 뜻은 그다음에 고른다."],
  ["어휘 6회", "rc-p5-vocab-6", "92~94", "어휘 · 명사", "명사 어휘는 앞의 동사·전치사와 짝으로 외운다(meet the deadline, in compliance with)."],
  ["어휘 7회", "rc-p5-vocab-7", "95~97", "전치사 선택", "전치사 뒤는 명사 자리. by(~까지 완료) / until(~까지 계속), during(기간 명사) / for(숫자 기간)."]];
var DG_V = { 5: [], 6: [], 7: [] }; for (var _d = 1; _d <= 55; _d++) DG_V[5].push("v5-" + _d); for (_d = 1; _d <= 30; _d++) DG_V[6].push("v6-" + _d); for (_d = 1; _d <= 38; _d++) DG_V[7].push("v7-" + _d);
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
// OT 결과: 파트별 틀린 유형 + 과정(basic = PART 5가 낮음)
function dgWeak() {
  if (DG_WEAK) return Promise.resolve(DG_WEAK);
  return Promise.all([5, 6, 7].map(function (p) { return load("sec:" + DG_OT + "-p" + p).catch(function () { return null; }); })).then(function (secs) {
    var w = { 5: {}, 6: {}, 7: {}, ot: false, ok5: 0, n5: 0 };
    secs.forEach(function (sec, i) { if (!sec) return; var part = 5 + i; itemsOf(sec).forEach(function (x) {
      var p = S.prog[x.key]; if (!p) return; w.ot = true; if (part === 5) { w.n5++; if (p[1]) w.ok5++; }
      if (!p[1]) { var t = x.q.qtype || onGuess(x.q, x.set, part); if (t) w[part][t] = (w[part][t] || 0) + 1; }
    }); });
    w.basic = !w.ot || w.ok5 < DG_CUT; // OT를 안 본 학생도 기초 다지기
    DG_WEAK = w; return w;
  });
}
function dgKey(part) { return "dg:" + dgYmd(new Date()) + ":" + part + (part === 5 ? "a" : ""); }
function dgIsVoc(x) { var t = x.q.qtype || (x.sec && x.sec.qtype) || onGuess(x.q, x.set, 5) || ""; return /^어휘|전치사 선택/.test(t); }
function dgLoadKeys(keys, part) {
  var ids = []; keys.forEach(function (k) { var id = k.split(":")[0]; if (ids.indexOf(id) < 0) ids.push(id); });
  return Promise.all(ids.map(function (id) { return load("sec:" + id).catch(function () { return null; }); })).then(function (secs) {
    var M = {}; secs.forEach(function (sec) { if (sec) itemsOf(sec).forEach(function (x) { x.sec = sec; if (part === 6 && x.set) x.set = onFill(x.set, x.q.no); M[x.key] = x; }); });
    return keys.map(function (k) { return M[k]; }).filter(Boolean);
  });
}
function dgLoadAll(ids) { return Promise.all(ids.map(function (id) { return load("sec:" + id).catch(function () { return null; }); })); }
function dgItems(secs, types) {
  var out = []; secs.forEach(function (sec) { if (sec) itemsOf(sec).forEach(function (x) { if (S.prog[x.key]) return; var t = x.q.qtype || sec.qtype; if (types && types.length && types.indexOf(t) < 0) return; x.sec = sec; out.push(x); }); }); return out;
}
// 지문 세트 단위로 묶어서 안 푼 세트만, 약한 유형이 많이 든 세트부터
function dgSets(secs, part, weak, n, seed) {
  var sets = [];
  secs.forEach(function (sec) { if (!sec) return; var by = {}; itemsOf(sec).forEach(function (x) { x.sec = sec; var sk = x.key.replace(/-\d+$/, ""); (by[sk] = by[sk] || []).push(x); });
    Object.keys(by).forEach(function (k) { var g = by[k]; if (g.some(function (x) { return S.prog[x.key]; })) return;
      sets.push({ g: g, sc: g.filter(function (x) { return (weak[part] || {})[x.q.qtype]; }).length }); }); });
  sets = dgShuffle(sets, seed).sort(function (a, b) { return b.sc - a.sc; }).slice(0, n);
  var pick = []; sets.forEach(function (s) { s.g.forEach(function (x) { if (part === 6 && x.set) x.set = onFill(x.set, x.q.no); pick.push(x); }); });
  return pick;
}
// 오늘 문제 고르기 — A급 과제와 같은 구성 (Day N = A급 과제 N회 구성, 15일마다 다음 변형으로)
//  PART 5: 1~8회 문법만, 9~15회 어휘만 / PART 6: 4지문 / PART 7: 그 회차와 같은 지문 수 — 전부 그 회차 문제의 변형 문제
function dgRound(day) { return (day - 1) % 15 + 1; }
function dgASec(r, part) { var ser = curSer(); return ((S.catalog || {}).sections || []).filter(function (s) { return s.group === "A급 과제" && +s.round === r && +s.part === part && serOf(s) === ser; })[0]; }
function dgPick(part, day) {
  var k = "dg2:" + dgYmd(new Date()) + ":" + part + ":" + curSer(), saved;
  try { saved = JSON.parse(ls(k) || "null"); } catch (e) { saved = null; }
  if (saved && saved.length) return dgLoadKeys(saved, part);
  var r = dgRound(day), v = Math.floor((day - 1) / 15), sc = dgASec(r, part);
  if (!sc) return Promise.resolve([]);
  return Promise.all([sc.keys ? Promise.resolve(sc.keys) : load("sec:" + sc.id).then(function (x) { return itemsOf(x).map(function (y) { return y.key; }); }), onVmap()]).then(function (x) {
    var keys = x[0].map(function (o) { var L = x[1][o] || []; return L.length ? L[v % L.length] : null; }).filter(Boolean);
    return dgLoadKeys(keys, part);
  }).then(function (pick) { pick = pick || []; if (pick.length) ls(k, JSON.stringify(pick.map(function (x) { return x.key; }))); return pick; });
}
function dgSetN(L) { var o = {}; (L || []).forEach(function (x) { o[x.key.replace(/-\d+$/, "")] = 1; }); return Object.keys(o).length; }
function dgP2(day) {
  var u = DG_P2[(day - 1) % DG_P2.length], all = ((S.catalog || {}).sections || []).filter(function (s) { return s.group === "Part 2 유형별"; });
  return { u: u, secs: u.ids.map(function (id) { return all.filter(function (s) { return s.id === id; })[0]; }).filter(Boolean) };
}
function dgCard() {
  return '<button class="row" data-go="#/dg" style="padding:26px 20px;background:linear-gradient(125deg,#172844,#2D4F86);color:#fff;border:0"><span class="pill" style="background:#FF581F;color:#fff;font-size:15px;padding:6px 14px">매일</span><span class="t"><b style="color:#fff;font-size:21px">📅 매일 과제</b><small style="color:#fff">오늘의 단어 · PART 2 · 5 · 6 · 7 — 교재 진도 + 맞춤 문제, 날마다 자동으로</small></span><span style="font-size:22px;color:#fff">›</span></button>';
}
function dgInject(html) {
  if (!/어느 학습실로 들어갈까요/.test(html) || app.querySelector('[data-go="#/dg"]')) return;
  var at = app.querySelector('[data-go="#/ot"]') || app.querySelector('[data-go="#/rec"]') || app.querySelector('[data-room="RC"]'); if (!at) return;
  at.insertAdjacentHTML("afterend", dgCard());
  var b = app.querySelector('[data-go="#/dg"]'); if (b) b.onclick = function () { go("#/dg"); };
}
function viewDG() {
  render('<div class="empty">오늘 과제를 준비하는 중…</div>');
  var day = dgDay(), r5 = dgRound(day), vd = (day - 1) % 30 + 1, u5 = DG_P5[r5 <= 8 ? (r5 - 1) % 10 : 10 + (r5 - 9) % 7], p2 = dgP2(day), p7pg = 99 + (day - 1) % 27;
  dgWeak().then(function (w) {
    return Promise.all([dgPick(5, day), dgPick(6, day), dgPick(7, day)]).then(function (L) { return { w: w, L: L }; });
  }).then(function (r) {
    var w = r.w, L = { 5: r.L[0], 6: r.L[1], 7: r.L[2] }, d = new Date();
    function st(list) { var n = list.length, k = list.filter(function (x) { return S.prog[x.key]; }).length; return { n: n, k: k, done: n && k >= n }; }
    function pgTag(t) { return '<span style="display:inline-block;background:#FFF1D6;color:#8A5300;border-radius:99px;padding:2px 9px;font-size:12.5px;font-weight:800;margin-top:4px">📘 교재 ' + t + '</span>'; }
    function row(ic, t, sub, btn, done, prog, pg) {
      return '<div class="card" style="display:flex;align-items:center;gap:12px;padding:16px;' + (done ? 'background:#F1F8F4;border-color:#9BD3B4' : '') + '"><div style="font-size:26px">' + (done ? "✅" : ic) + '</div><div style="flex:1;min-width:0"><b style="font-size:17px">' + t + '</b><div style="font-size:13.5px;color:#3A4250;margin-top:2px">' + sub + '</div>' + (pg ? pgTag(pg) : "") + (prog ? '<div style="font-size:13px;font-weight:800;margin-top:4px">' + prog + '</div>' : '') + '</div>' + btn + '</div>';
    }
    function topW(part) { var o = w[part] || {}; return Object.keys(o).sort(function (a, b) { return o[b] - o[a]; }).slice(0, part === 5 ? 4 : 2).map(function (t) { return t.replace(/^PART \d · /, ""); }); }
    function qbtn(p, s) { return '<button class="btn sm" data-dg="' + p + '"' + (s.n ? "" : " disabled") + '>' + (s.k ? "이어 풀기" : "풀기") + '</button>'; }
    var tw5 = topW(5), L5g = L[5].filter(function (x) { return !dgIsVoc(x); }), L5v = L[5].filter(dgIsVoc), s5g = st(L5g), s5v = st(L5v), tw5g = tw5.filter(function (t) { return !/^어휘|전치사 선택/.test(t); }), tw5v = tw5.filter(function (t) { return /^어휘|전치사 선택/.test(t); }), s5 = st(L[5]), s6 = st(L[6]), s7 = st(L[7]), tw6 = topW(6), tw7 = topW(7), basic = w.basic;
    var allDone = s5.done && s6.done && s7.done;
    var p2t = p2.secs.map(function (x) { var t = secStats(x); return { x: x, t: t }; });
    render(topbar("매일 과제") +
      '<div class="card hero"><span class="kicker">' + (d.getMonth() + 1) + "월 " + d.getDate() + '일 · Day ' + day + ' · A급 과제 ' + r5 + '회 구성</span><h1 style="margin:4px 0">오늘의 과제</h1><p>' + (allDone ? "오늘 문제를 다 풀었어요! 👏 내일 새 과제가 나와요." : "위에서부터 순서대로 하면 돼요. 내일이 되면 새 과제로 바뀌어요.") + "<br><small>A급 과제 " + r5 + "회와 같은 구성(PART 5 " + (r5 <= 8 ? "문법" : "어휘") + " · PART 6 · PART 7)의 변형 문제예요.</small>" + '</p></div>' +
      '<div class="card peach" style="font-size:14px"><b>💡 오늘의 ' + (r5 <= 8 ? "문법" : "어휘") + ' 포인트 · ' + esc(u5[0]) + '</b><br>' + esc(u5[4]) + '<br>' + pgTag("p." + u5[2] + " KEY POINT") + '</div>' +
      row("📖", "단어 암기 · VOCA DAY " + String(vd).padStart(2, "0"), "단어 외우기 → 카드 → 단어 시험까지", '<button class="btn sm" data-go="#/v/' + vd + '">열기</button>', false, "", "") +
      (p2t.length ? row("🎧", "PART 2 듣기 · " + esc(p2.u.nm), "교재 진도 · 오늘 " + p2t.length + "챕터", '<div style="display:grid;gap:6px">' + p2t.map(function (o) { return '<button class="btn sm" data-go="#/s/' + encodeURIComponent(o.x.id) + '">' + esc(o.x.title.replace(/ 의문[사문]$/, "")) + '</button>'; }).join("") + '</div>', p2t.every(function (o) { return o.t.total && o.t.done >= o.t.total; }), p2t.map(function (o) { return esc(o.x.title.replace(/ 의문[사문]$/, "")) + " " + o.t.done + " / " + o.t.total; }).join(" · "), "p." + p2.u.pg + " (정답 패턴 → 기출 → 마킹 시트)") : "") +
      row(r5 <= 8 ? "✏️" : "🔤", "PART 5 " + (r5 <= 8 ? "문법" : "어휘") + " · " + s5.n + "문제", "A급 과제 " + r5 + "회 구성 · " + (r5 <= 8 ? "문법만" : "어휘만") + " (변형 문제)", qbtn(5, s5), s5.done, s5.k + " / " + s5.n, "p." + u5[2] + " " + u5[0] + " 복습") +
      '<div id="dg-on5" style="display:grid;gap:8px;margin:-4px 0 12px"></div>' +
      row("📄", "PART 6 · 지문 " + dgSetN(L[6]) + "개 (" + s6.n + "문제)", "A급 과제 " + r5 + "회 구성 · 문법 · 어휘 · 접속부사 · 문장 고르기", qbtn(6, s6), s6.done, s6.k + " / " + s6.n, "") +
      '<div id="dg-on6" style="display:grid;gap:8px;margin:-4px 0 12px"></div>' +
      row("📰", "PART 7 · 지문 " + dgSetN(L[7]) + "개 (" + s7.n + "문제)", "A급 과제 " + r5 + "회 구성 · 세부 사항 · 사실 확인 · 추론 등", qbtn(7, s7), s7.done, s7.k + " / " + s7.n, "p." + p7pg + " 지문 1세트" + (day === 1 ? " · p.98 유형별 풀이법 먼저" : "")) +
      '<div id="dg-on7" style="display:grid;gap:8px;margin:-4px 0 12px"></div>' +
      '<div class="card" style="font-size:13.5px;color:#3A4250">📘 표시는 메이크토익 교재 쪽수예요. 교재로 먼저 풀고 학습실 문제로 확인하세요. 틀린 문제는 해설의 ‘의식의 흐름’을 소리 내 읽고, 다음 날 시작 전에 한 번 더 보세요.</div>');
    bindCommon();
    // 오늘 푼 RC에서 틀린 유형별 추가 50문제 + 오답노트 (A급 과제와 같은 방식)
    var ymd = dgYmd(new Date()), parts = [5, 6, 7].map(function (p) {
      return { part: p, title: "매일 과제 Day " + day, list: L[p].filter(function (x) { return S.prog[x.key]; }).map(function (x) { var g = S.prog[x.key]; return { key: x.key, q: x.q, set: x.set, mine: g[0], ok: !!g[1], type: x.q.qtype || (x.sec && x.sec.qtype) || onGuess(x.q, x.set, p) }; }) };
    }).filter(function (p) { return p.list.length; });
    // 파트별로: 그 PART를 풀면 바로 아래에 틀린 유형 50문제 + 그 PART 오답노트
    ON_CTX = "dg" + ymd;
    parts.forEach(function (p) {
      var box = document.getElementById("dg-on" + p.part); if (!box) return;
      var wb = onWrongBy([p]); ON_SID[p.part] = "dg" + ymd + "-" + p.part;
      box.innerHTML = (onPracBtn(p.part, wb[p.part]) || '<div class="card" style="margin:0;padding:12px;font-size:14px">PART ' + p.part + ' 푼 문제는 전부 맞혔어요! 👏</div>') +
        '<button class="btn ghost" data-onnote="1">📄 PART ' + p.part + ' 오답노트 출력 · PDF 저장</button>' + onLastBtns([p.part]);
      onBind(box, wb, "#/dg", { title: "매일 과제 Day " + day + " (" + (d.getMonth() + 1) + "/" + d.getDate() + ") · PART " + p.part, parts: [p] }); onLastBind(box);
    });
    app.querySelectorAll("[data-dg]").forEach(function (b) { b.onclick = function () {
      var d0 = b.dataset.dg, p = parseInt(d0, 10), src = L[p], list = src.filter(function (x) { return !S.prog[x.key]; });
      if (!list.length) list = src;
      mixQuiz("매일 과제 · PART " + (p === 5 ? "5 " + (r5 <= 8 ? "문법" : "어휘") : p), "RC", list, "#/dg");
    }; });
  }).catch(function (e) { render(topbar("매일 과제") + '<div class="empty">과제를 불러오지 못했어요. 잠시 뒤 다시 열어 주세요.</div>'); bindCommon(); });
}
function viewARound(n) {
`],
["function render(html) { app.innerHTML = html; otInject(html); }", "function render(html) { app.innerHTML = html; otInject(html); dgInject(html); }"],
['  if (h[0] === "ot") return viewOT(h[1] || "");', '  if (h[0] === "dg") return viewDG();\n  if (h[0] === "ot") return viewOT(h[1] || "");']
]);
