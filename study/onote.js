/* A급 과제: 한 회차(PART 5·6·7)를 다 풀면 ① 오답노트 출력·PDF 저장 ② PART별 틀린 유형 50문제 풀기 (2026-11-03)
   - 틀린 문제 유형: /study/rctypes.json (문항 키 → 유형 이름), 없으면 보기·질문 모양으로 추정
   - 50문제: 유형 연습 문제은행(tp5-*, tp6-*, tp7-*)에서 틀린 유형 비율대로 뽑는다 */
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
["function viewARound(n) {\n", String.raw`
var ON_T5 = { "어휘 · 명사": "vocab-n", "어휘 · 동사": "vocab-v", "어휘 · 형용사": "vocab-adj", "어휘 · 부사": "vocab-adv", "품사 자리": "pos", "동사 태": "voice", "동사 시제·수일치": "tense", "준동사": "verbal", "대명사": "pronoun", "전치사 선택": "prep", "전치사 vs 접속사 vs 접속부사": "conj", "관계사 · 명사절": "relative", "비교 · 수량 · 한정사": "compare" };
var ON_BANK = { 6: [], 7: [] }; for (var _i = 1; _i <= 30; _i++) ON_BANK[6].push("tp6-" + _i); for (_i = 1; _i <= 50; _i++) ON_BANK[7].push("tp7-" + _i);
function onIds5(slug) { var a = ["tp5-" + slug]; for (var k = 2; k <= 6; k++) a.push("tp5-" + slug + "-" + k); return a; }
function onUsed(id) { var n = 0, p = id + ":"; for (var k in S.prog) if (k.indexOf(p) === 0) n++; return n; }
var ON_RCT = null, ON_LAST = {};
function onTypes() { if (ON_RCT) return Promise.resolve(ON_RCT); return fetch("/study/rctypes.json?t=" + Date.now(), { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; }).then(function (j) { ON_RCT = j || {}; return ON_RCT; }); }
function onGuess(q, set, part) { return window.MKONOTE ? window.MKONOTE.guess(q, set, part) : ""; }
function onTitle(ser, n) { return "A급 과제 " + n + "회 (Season " + ser + ")"; }
function onCollect(secs, rct) {
  return Promise.all(secs.map(function (m) { return load("sec:" + m.id); })).then(function (full) {
    return full.map(function (sec, i) {
      return { part: sec.part || secs[i].part, title: String(sec.title || "").replace(/^A급 과제 \d+회 · PART \d\s*/, "").replace(/^\(|\)$/g, ""), list: itemsOf(sec).map(function (x) {
        var p = S.prog[x.key] || [-1, false];
        return { key: x.key, q: x.q, set: x.set, mine: p[0], ok: !!p[1], type: rct[x.key] || x.q.qtype || onGuess(x.q, x.set, sec.part || secs[i].part) };
      }) };
    });
  });
}
function onFill(set, keepNo) {
  // PART 6 연습: 고르는 빈칸만 남기고 나머지 빈칸은 정답을 채워 보여 준다
  var c = {}; for (var k in set) c[k] = set[k];
  c.passage = String(set.passage || "").replace(/-{2,}(\d{3})-{2,}/g, function (all, no) {
    if (+no === +keepNo) return all;
    var q = (set.questions || []).filter(function (x) { return +x.no === +no; })[0];
    return q && q.options ? "[" + q.options[q.answer] + "]" : all;
  });
  return c;
}
var ON_CTX = "", ON_SID = {};
function onSetKey(part) { return "onset:" + (ON_SID[part] || ON_CTX) + ":" + part; }
function onSetLoad(part) {
  var keys; try { keys = JSON.parse(ls(onSetKey(part)) || "null"); } catch (e) { keys = null; }
  if (!keys || !keys.length) return Promise.resolve(null);
  var ids = []; keys.forEach(function (k) { var id = k.split(":")[0]; if (ids.indexOf(id) < 0) ids.push(id); });
  return Promise.all(ids.map(function (id) { return load("sec:" + id).catch(function () { return null; }); })).then(function (secs) {
    var M = {}; secs.forEach(function (sec) { if (sec) itemsOf(sec).forEach(function (x) { x.sec = sec; if (part === 6 && x.set) x.set = onFill(x.set, x.q.no); M[x.key] = x; }); });
    var out = keys.map(function (k) { return M[k]; }).filter(Boolean);
    return out.length ? out : null;
  });
}
function onPractice(part, wrongTypes, back) {
  render('<div class="empty">틀린 유형 문제를 모으는 중…</div>');
  onPick(part, wrongTypes).then(function (pick) {
    if (!pick) { render(topbar("틀린 유형 50문제") + '<div class="card peach">이 유형의 연습 문제를 준비 중이에요.</div><button class="btn" data-go="' + back + '">돌아가기</button>'); bindCommon(); return; }
    ON_LAST[part] = pick;
    mixQuiz("PART " + part + " 틀린 유형 " + pick.length + "문제", "RC", pick, back);
  });
}
function onPick(part, wrongTypes) {
  return onSetLoad(part).then(function (got) { return got || onPickNew(part, wrongTypes); });
}
function onPickNew(part, wrongTypes) {
  var types = Object.keys(wrongTypes); if (!types.length) return Promise.resolve(null);
  var tot = types.reduce(function (a, t) { return a + wrongTypes[t]; }, 0), want = {};
  types.forEach(function (t) { want[t] = Math.max(1, Math.round(50 * wrongTypes[t] / tot)); });
  // 덜 푼 문제은행 파일부터 조금씩 불러온다 (안 푼 문제가 모자라면 더 불러옴)
  var ids = [];
  if (part === 5) types.forEach(function (t) { if (ON_T5[t]) ids = ids.concat(onIds5(ON_T5[t])); }); else ids = ON_BANK[part].slice();
  ids = shuffle(ids).sort(function (a, b) { return onUsed(a) - onUsed(b); });
  var pool = {}, seen = {}, step = part === 5 ? Math.max(2, types.length) : part === 6 ? 6 : 8;
  function unN(t) { return (pool[t] || []).filter(function (x) { return !S.prog[x.key]; }).length; }
  function enough() { return types.every(function (t) { return unN(t) >= want[t]; }); }
  function more() {
    var batch = ids.splice(0, step); if (!batch.length) return Promise.resolve();
    return Promise.all(batch.map(function (id) { return load("sec:" + id).catch(function () { return null; }); })).then(function (secs) {
      secs.forEach(function (sec) { if (!sec || seen[sec.id]) return; seen[sec.id] = 1; itemsOf(sec).forEach(function (x) {
        var t = x.q.qtype || sec.qtype; if (!wrongTypes[t]) return;
        x.sec = sec; if (part === 6 && x.set) x.set = onFill(x.set, x.q.no);
        (pool[t] = pool[t] || []).push(x);
      }); });
      if (!enough() && ids.length) return more();
    });
  }
  return more().then(function () {
    var have = types.filter(function (t) { return pool[t] && pool[t].length; });
    if (!have.length) return null;
    var left = 50, pick = [];
    have.forEach(function (t) {
      var ks = pool[t], un = ks.filter(function (x) { return !S.prog[x.key]; }), wr = ks.filter(function (x) { var p = S.prog[x.key]; return p && !p[1]; }), rt = ks.filter(function (x) { var p = S.prog[x.key]; return p && p[1]; });
      pool[t] = shuffle(un).concat(shuffle(wr), shuffle(rt));
    });
    have.forEach(function (t) { var k = Math.min(want[t], pool[t].length, left); pick = pick.concat(pool[t].splice(0, k)); left -= k; });
    var i = 0; while (left > 0 && have.some(function (t) { return pool[t].length; })) { var t = have[i++ % have.length]; if (pool[t].length) { pick.push(pool[t].shift()); left--; } }
    pick = shuffle(pick);
    if (ON_CTX) ls(onSetKey(part), JSON.stringify(pick.map(function (x) { return x.key; })));
    return pick;
  });
}
// 한 회차 추가 문제 전체(다 푼 PART마다 50문제) → 문제편 + 정답·해설편 PDF
function onSetPdf(parts, wrongBy, title, btn) {
  var ps = parts.filter(function (p) { return wrongBy[p] && Object.keys(wrongBy[p]).length; });
  if (!ps.length) return;
  var old = btn.textContent; btn.disabled = true; btn.textContent = "문제 모으는 중…";
  var rct = ON_RCT || {};
  Promise.all(ps.map(function (p) { return onPick(p, wrongBy[p]); })).then(function (sets) {
    var out = [];
    sets.forEach(function (pick, i) { if (pick && pick.length) out.push({ part: ps[i], list: pick.map(function (x) { return { key: x.key, q: x.q, set: x.set, type: x.q.qtype || (x.sec && x.sec.qtype) || rct[x.key] || onGuess(x.q, x.set, ps[i]) }; }) }); });
    if (!out.length) { alert("추가 문제를 준비 중이에요."); return; }
    var d = new Date();
    window.MKONOTE.openSet({ name: (S.profile || {}).name || "", title: title + " · 틀린 유형 추가 문제", date: d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate(), parts: out });
  }).catch(function () { alert("문제를 불러오지 못했어요. 다시 눌러 주세요."); }).then(function () { btn.disabled = false; btn.textContent = old; });
}
function onWrongBy(parts) {
  var w = {}; parts.forEach(function (p) { p.list.forEach(function (x) { if (!x.ok) { w[p.part] = w[p.part] || {}; w[p.part][x.type] = (w[p.part][x.type] || 0) + 1; } }); }); return w;
}
function onPracBtn(p, w) {
  var ks = Object.keys(w || {}); if (!ks.length) return "";
  return '<button class="btn navy" data-onp="' + p + '" style="text-align:left;line-height:1.35">🎯 PART ' + p + ' 틀린 유형 50문제 더 풀기<br><small style="font-weight:600;opacity:.85">' + ks.map(function (t) { return esc(t.replace(/^PART \d · /, "")) + " " + w[t]; }).join(" · ") + "</small></button>";
}
function onBind(box, wrongBy, back, note) {
  box.querySelectorAll("[data-onp]").forEach(function (b) { b.onclick = function () { onPractice(+b.dataset.onp, wrongBy[b.dataset.onp], back); }; });
  var nb = box.querySelector("[data-onnote]"); if (nb) nb.onclick = function () { if (!window.MKONOTE) return; var d = new Date(); window.MKONOTE.open({ name: (S.profile || {}).name || "", title: note.title, date: d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate(), parts: note.parts }); };
}
function onLastBtns(parts) {
  return parts.filter(function (p) { return ON_LAST[p] && ON_LAST[p].some(function (x) { return S.prog[x.key]; }); }).map(function (p) {
    return '<button class="btn ghost" data-onlast="' + p + '">📄 방금 푼 PART ' + p + ' 50문제 오답노트</button>';
  }).join("");
}
function onLastBind(box) {
  box.querySelectorAll("[data-onlast]").forEach(function (b) { b.onclick = function () {
    var p = +b.dataset.onlast, rct = ON_RCT || {}, d = new Date();
    var list = ON_LAST[p].filter(function (x) { return S.prog[x.key]; }).map(function (x) { var g = S.prog[x.key]; return { key: x.key, q: x.q, set: x.set, mine: g[0], ok: !!g[1], type: x.q.qtype || rct[x.key] || onGuess(x.q, x.set, p) }; });
    window.MKONOTE.open({ name: (S.profile || {}).name || "", title: "PART " + p + " 틀린 유형 연습 " + list.length + "문제", date: d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate(), parts: [{ part: p, title: "틀린 유형 연습", list: list }] });
  }; });
}
function onoteRound(secs, ser, n) {
  secs = secs.filter(function (s) { return s.area !== "LC" && s.part >= 5; });
  if (!secs.length) return;
  var fin = secs.filter(function (s) { var t = secStats(s); return t.total && t.done >= t.total; });
  var box = document.createElement("div"); box.className = "card"; box.style.cssText = "margin-top:6px;border:2px solid #172844";
  if (!fin.length) {
    box.innerHTML = '<b>📄 RC 오답노트 · 🎯 틀린 유형 50문제</b><p style="margin:6px 0 0;font-size:14px;color:#5B6573">PART를 하나 다 풀면 그 PART의 틀린 유형 50문제와 오답노트가 열려요.</p>';
    app.appendChild(box); return;
  }
  var back = location.hash || "#/a"; ON_CTX = "r" + ser + "-" + n; fin.forEach(function (s) { ON_SID[s.part] = s.id; });
  var rest = secs.filter(function (s) { return fin.indexOf(s) < 0; }).map(function (s) { return s.part; });
  box.innerHTML = '<b style="font-size:16px">📄 오답노트 · 🎯 틀린 유형 50문제</b><p style="margin:4px 0 10px;font-size:14px;color:#5B6573">다 푼 PART ' + fin.map(function (s) { return s.part; }).join("·") + '의 틀린 문제로 만들어요.' + (rest.length ? " (PART " + rest.join("·") + "도 다 풀면 추가돼요)" : "") + '</p>'
    + '<button class="btn" data-onnote="1" style="width:100%">📄 오답노트 출력 · PDF 저장</button><div class="on-prac" style="display:grid;gap:8px;margin-top:8px"><div class="empty" style="padding:8px">틀린 유형 확인 중…</div></div>';
  app.appendChild(box);
  onTypes().then(function (rct) { return onCollect(fin, rct); }).then(function (parts) {
    var w = onWrongBy(parts), pr = box.querySelector(".on-prac"); if (!pr) return;
    var fp = fin.map(function (s) { return s.part; }), hasW = fp.some(function (p) { return w[p] && Object.keys(w[p]).length; });
    pr.innerHTML = (fin.map(function (s) { return onPracBtn(s.part, w[s.part]); }).join("") || '<p style="margin:0;font-size:14px">틀린 문제가 없어요. 전부 맞혔어요! 👏</p>') + onLastBtns(fp)
      + (hasW ? '<button class="btn ghost" data-onset="1" style="border:2px solid #FF581F;text-align:left;line-height:1.35">📥 이 회차 추가 문제 전체 PDF 받기<br><small style="font-weight:600">PART ' + fp.filter(function (p) { return w[p]; }).join("·") + ' 틀린 유형 문제 + 정답·해설까지 한 파일로</small></button>' : "");
    onBind(box, w, back, { title: onTitle(ser, n), parts: parts }); onLastBind(box);
    var sb = box.querySelector("[data-onset]"); if (sb) sb.onclick = function () { onSetPdf(fp, w, onTitle(ser, n), sb); };
  });
}
function onoteExam(sec) {
  if (!sec || sec.group !== "A급 과제" || sec.area === "LC" || !(sec.part >= 5)) return;
  var box = document.getElementById("on-ex"); if (!box) return;
  var back = location.hash; ON_CTX = "s" + sec.id; ON_SID[sec.part] = sec.id;
  onTypes().then(function (rct) {
    var meta = S.catalog.sections.filter(function (s) { return s.id === sec.id; })[0] || sec;
    return onCollect([meta], rct);
  }).then(function (parts) {
    var w = onWrongBy(parts), b = onPracBtn(sec.part, w[sec.part]);
    box.innerHTML = '<div class="card" style="border:2px solid #172844;display:grid;gap:8px">' + (b || '<p style="margin:0;font-size:14px">틀린 문제가 없어요. 전부 맞혔어요! 👏</p>') + '<button class="btn ghost" data-onnote="1">📄 이 PART 오답노트 출력 · PDF 저장</button>' + onLastBtns([sec.part]) + (b ? '<button class="btn ghost" data-onset="1" style="border:2px solid #FF581F">📥 이 PART 추가 문제 전체 PDF (문제 + 해설)</button>' : "") + '</div>';
    onBind(box, w, back, { title: String(sec.title || "A급 과제"), parts: parts }); onLastBind(box);
    var sb = box.querySelector("[data-onset]"); if (sb) sb.onclick = function () { onSetPdf([sec.part], w, String(sec.title || "A급 과제"), sb); };
  });
}
function viewARound(n) {
`],
["  bindCommon();\n}\n\n/* ---------- 섹션 & 문제 풀이 ---------- */", "  onoteRound(secs, ser, n);\n  bindCommon();\n}\n\n/* ---------- 섹션 & 문제 풀이 ---------- */"],
["<div style=\"display:grid;gap:8px\">${lectureButton(sec, true)}<button class=\"btn ghost\" id=\"ex-retry\">", "<div id=\"on-ex\"></div><div style=\"display:grid;gap:8px\">${lectureButton(sec, true)}<button class=\"btn ghost\" id=\"ex-retry\">"],
["document.getElementById(\"ex-go\").onclick = function () { examReview(sec, list.filter(function (x) { return pick[x.key]; }), draw); };", "document.getElementById(\"ex-go\").onclick = function () { examReview(sec, list.filter(function (x) { return pick[x.key]; }), draw); };\n      onoteExam(sec);"]
]);
