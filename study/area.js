/* 학습실 LC/RC 학습실 나누기 + LC 실전 모의고사 회차 전체 풀기 (2026-10-31)
   - 입장하면 LC 학습실 / RC 학습실 중 하나를 고른다 → 고른 학습실만 보인다 (학습실 바꾸기 버튼으로 이동)
   - 학습실 안에서는 "학습 선택" 메뉴: 문제 풀기(#/learn = 예전 홈 목록), 해설강의, 실전 테스트 등
   - VOCA 단어 암기장·단어 게임은 RC 학습실에만
   - LC 실전 모의고사: 회차마다 PART 1~4 전체를 한 번에 실전처럼 풀기(#/full)
   - get_app 코드에 문자열 패치로 덧붙임 — 앵커가 하나라도 안 맞으면 원본 그대로 사용(index.html 로더 규칙). */
(function () {
function T(f) { var s = f.toString(); return s.slice(s.indexOf("/*") + 2, s.lastIndexOf("*/")); }

var NEW_HOME = T(function () {/*// 학습실 선택 · 학습 선택 메뉴 — study/area.js
function viewRoom() {
  var p = S.profile || {};
  render(`<div class="card hero"><img class="logo" src="${LOGO}" alt="MAKE TOEIC" onerror="this.style.display='none'">
    <span class="kicker">MAKE TOEIC · 학습실</span><h1>${esc(p.name || "")}님, 어느 학습실로 들어갈까요?</h1>
    <p>들어간 학습실의 학습만 보여요. 안에서 언제든 학습실을 바꿀 수 있어요.</p></div>
    ${allowedSeries().length ? serBar() : ""}
    <button class="row" data-room="LC" style="padding:26px 20px;background:linear-gradient(125deg,#14233E,#233C5C);color:#fff;border:0"><span class="pill" style="background:#fff;color:#172844;font-size:15px;padding:6px 14px">LC</span><span class="t"><b style="color:#fff;font-size:21px">🎧 LC 학습실</b><small style="color:#fff">듣기 · PART 1~4 · 실전 모의고사 · 해설강의</small></span>›</button>
    <button class="row" data-room="RC" style="padding:26px 20px;background:linear-gradient(125deg,#E95721,#FF8A3D);color:#fff;border:0"><span class="pill" style="background:#fff;color:#E95721;font-size:15px;padding:6px 14px">RC</span><span class="t"><b style="color:#fff;font-size:21px">📖 RC 학습실</b><small style="color:#fff">읽기 · PART 5~7 · A급 과제 · VOCA 단어 암기장</small></span>›</button>
    <div class="foot"><button class="btn ghost sm" id="mkst-logout">로그아웃</button><br><br><a href="/">메인페이지로 돌아가기</a></div>`);
  bindCommon();
  app.querySelectorAll("[data-room]").forEach(function (b) {
    b.onclick = function () {
      S.area = b.dataset.room; ls("area", S.area); S.roomPicked = true;
      var h = location.hash.replace(/^#\/?/, "");
      if (h) go("#/"); else viewHome();
      scrollTop();
    };
  });
  document.getElementById("mkst-logout").onclick = logout;
}
function roomRow(go2, pill, title, sub, bg) {
  return `<button class="row" data-go="${go2}" style="${bg ? "background:" + bg + ";color:#fff;border:0" : ""}"><span class="pill ${bg ? "" : "o"}" style="${bg ? "background:#fff;color:#172844" : ""}">${pill}</span><span class="t"><b style="${bg ? "color:#fff" : ""}">${title}</b><small style="${bg ? "color:#fff" : ""}">${sub}</small></span>›</button>`;
}
function viewHome() {
  if (!S.roomPicked) return viewRoom();
  var p = S.profile, lc = S.area === "LC", ser = curSer();
  var mine = S.catalog.sections.filter(function (s) { return s.area === S.area; }), tot = 0, done = 0, ok = 0;
  mine.forEach(function (s) { var t = secStats(s); tot += t.total; done += t.done; ok += t.ok; });
  var wrongN = Object.keys(S.prog).filter(function (k) { return !S.prog[k][1] && mine.some(function (s) { return k.indexOf(s.id + ":") === 0; }); }).length;
  var fulls = lc ? fullGroups(ser) : [];
  var menu = lc
    ? roomRow("#/learn", "문제", "📝 문제 풀기", "기본 유형 연습 · 실전 모의고사 PART별 풀기", "linear-gradient(125deg,#14233E,#233C5C)") +
      (fulls.length ? roomRow("#/full", "전체", "🎯 실전 모의고사 회차 전체 풀기", "한 회차 PART 1~4 전체를 실전처럼 한 번에 · " + fulls.length + "회", "linear-gradient(125deg,#E95721,#FF8A3D)") : "") +
      (typeof viewLcvRounds === "function" && window.MKST_LCVID ? roomRow("#/lcv", "강의", "🎬 실전 모의고사 해설강의", "회차 → 문제를 골라 그 문제 강의만 보기", "") : "") +
      (reelList().length ? roomRow("#/reels", "REELS", "🎬 기출 릴스 · PART 3·4", "원본 음원 + 단어 자막 + 정답 공개 · " + reelList().length + "편", "linear-gradient(125deg,#172844,#3A2A6B)") : "")
    : roomRow("#/learn", "문제", "📝 문제 풀기", "기본 문제 연습 · PART 5~7", "linear-gradient(125deg,#E95721,#FF8A3D)") +
      roomRow("#/a", "A급", "A급 과제 · Series " + ser, "1~15회 · PART 5·6·7 과제 · 해설", "") +
      roomRow("#/v", "VOCA", "VOCA 단어 암기장", "DAY 01~30 · 단어 누르면 발음 · 한 단어 10번 듣기 · 플래시카드 · 뜻 테스트", "linear-gradient(125deg,#14233E,#233C5C)") +
      roomRow("#/game", "GAME", "🎮 단어 점프 게임", "뜻을 보고 철자가 맞는 단어 블록을 점프로 치기", "") +
      roomRow("#/race", "GAME", "🚗 빈칸 레이서", "파트5 빈칸에 맞는 차선으로 운전 · 시간 순위", "");
  render(`<div class="card hero"><img class="logo" src="${LOGO}" alt="MAKE TOEIC" onerror="this.style.display='none'">
    <span class="kicker">MAKE TOEIC · ${lc ? "🎧 LC 학습실" : "📖 RC 학습실"}</span><h1>${esc(p.name)}님, 오늘도 한 걸음!</h1>
    <p>${S.area} 푼 문제 ${done} / ${tot} · 정답률 ${pct(ok, done)}%</p>
    <span class="dday">수강 기간 ${esc(p.end_date)}까지 · D-${p.days_left}</span></div>
  <div class="serbar" style="border-color:${lc ? "#172844" : "#FF581F"}"><span>지금 학습실</span><b style="color:${lc ? "#172844" : "#FF581F"}">${lc ? "🎧 LC 학습실" : "📖 RC 학습실"}</b><button data-go="#/room">학습실 바꾸기</button></div>
  ${serBar()}
  ${todayCard()}
  <div class="grp">학습 선택</div>
  ${menu}
  <div class="tiles" style="margin-top:10px">
    <button class="tile" data-go="#/mock"><span class="pill o">실전 테스트</span><b>${lc ? "파트2 25문제" : "파트5 30문제"}</b><small>${lc ? "실전처럼 자동 넘김" : "제한 시간 10분 · 랜덤 출제"}</small></button>
    <button class="tile" data-go="#/weak"><span class="pill o">약점 맞춤</span><b>약점 유형 20문제</b><small>틀린·안 푼 문제 위주</small></button>
    <button class="tile" data-go="#/wrong"><span class="pill n">오답노트</span><b>틀린 문제 ${wrongN}개</b><small>다시 풀고 졸업하기</small></button>
    <button class="tile" data-go="#/bm"><span class="pill n">저장한 문제</span><b>☆ ${bmList().length}문제</b><small>다시 볼 문제 모음</small></button>
    <button class="tile" data-go="#/stats"><span class="pill n">실력 분석</span><b>유형별 정답률</b><small>약점 유형 · 맞춤 문제 추천</small></button>
    <button class="tile" data-go="#/room"><span class="pill o">학습실</span><b>${lc ? "📖 RC 학습실로" : "🎧 LC 학습실로"}</b><small>학습실 바꾸기</small></button>
  </div>
  <div class="foot"><button class="btn ghost sm" id="mkst-logout">로그아웃</button><br><br><a href="/">메인페이지로 돌아가기</a></div>`);
  bindCommon();
  app.querySelectorAll("[data-goal]").forEach(function (b) { b.onclick = function () { ls("goal", b.dataset.goal); viewHome(); }; });
  document.getElementById("mkst-logout").onclick = logout;
}

// ---------- LC 실전 모의고사 회차 전체 풀기 (PART 1~4 한 번에) ----------
function fullRound(g) { var m = String(g).match(/(\d+)\s*회/); return m ? +m[1] : 0; }
function fullGroups(ser) {
  var gs = [];
  S.catalog.sections.forEach(function (s) {
    if (s.area !== "LC" || !/LC 실전 모의고사/.test(s.group || "") || seasonOf([s]) !== ser) return;
    if (gs.indexOf(s.group) < 0) gs.push(s.group);
  });
  return gs.sort(function (a, b) { return fullRound(a) - fullRound(b); });
}
function fullSecs(ser, g) { return S.catalog.sections.filter(function (s) { return s.area === "LC" && s.group === g && seasonOf([s]) === ser; }); }
function viewFullList() {
  var ser = curSer(), gs = fullGroups(ser);
  render(topbar("실전 모의고사 전체 풀기") + `<div class="card hero"><span class="kicker">SERIES ${ser} · LC 실전 모의고사</span><h1>🎯 회차 전체 풀기</h1><p>한 회차의 PART 1~4를 실제 시험처럼 처음부터 끝까지 한 번에 풀어요. 음성이 끝나면 자동으로 다음 문제로 넘어가요.</p></div>` +
    (gs.length ? gs.map(function (g) {
      var secs = fullSecs(ser, g), tt = 0, dd = 0; secs.forEach(function (s) { var t = secStats(s); tt += t.total; dd += t.done; });
      var sv = exGet("full:" + ser + ":" + g);
      return `<button class="row" data-go="#/full/${ser}/${encodeURIComponent(g)}"><span class="pill o">${fullRound(g)}회</span><span class="t"><b>${esc(g)} 전체</b><small>PART 1~4 · ${tt}문항${sv.ans ? " · 풀던 중 (이어서 풀기)" : dd ? " · " + dd + "문항 푼 적 있음" : ""}</small></span>›</button>`;
    }).join("") : '<div class="empty">이 Series의 실전 모의고사를 준비 중이에요.</div>'));
  bindCommon();
}
function viewFull(ser, g) {
  if (allowedSeries().indexOf(ser) < 0) { render(topbar("실전 모의고사") + '<div class="empty">이 Series는 수강 기간에 포함되지 않았어요.</div>'); bindCommon(); return; }
  var metas = fullSecs(ser, g);
  if (!metas.length) { render(topbar("실전 모의고사") + '<div class="empty">아직 공개되지 않은 회차예요.</div>'); bindCommon(); return; }
  render('<div class="empty">문제를 준비하는 중…</div>');
  Promise.all(metas.map(function (m) { return load("sec:" + m.id).catch(function () { return null; }); })).then(function (secs) {
    secs = secs.filter(Boolean).sort(function (a, b) { return (a.part || 0) - (b.part || 0) || String(a.title).localeCompare(String(b.title), "ko", { numeric: true }); });
    var list = [], pages = [];
    secs.forEach(function (sec) {
      var seen = {};
      itemsOf(sec).forEach(function (x) {
        x.sec = sec; list.push(x);
        if (x.set) { var k = sec.sets.indexOf(x.set); if (seen[k] != null) { pages[seen[k]].push(x); return; } seen[k] = pages.length; }
        pages.push([x]);
      });
    });
    if (!list.length) { render(topbar(g) + '<div class="empty">문제를 불러오지 못했어요.</div>'); bindCommon(); return; }
    var id = "full:" + ser + ":" + g, sv = exGet(id), parts = {};
    list.forEach(function (x) { var pp = x.sec.part || 0; parts[pp] = (parts[pp] || 0) + 1; });
    var F = { id: id, ser: ser, g: g, secs: secs, list: list, pages: pages, i: 0, ans: {} };
    render(topbar(g + " 전체") + `<div class="card hero"><span class="kicker">SERIES ${ser} · 실전 모의고사</span><h1>${esc(g)} 전체 풀기</h1>
      <p>${Object.keys(parts).map(function (pp) { return "PART " + pp + " " + parts[pp] + "문항"; }).join(" · ")} · 총 ${list.length}문항</p></div>
      <div class="card" style="font-size:14px;line-height:1.7">· 실제 시험처럼 음성이 끝나고 몇 초 뒤 <b>자동으로 다음 문제</b>로 넘어가요. (PART 1·2: 5초, PART 3·4: 문제당 8초)<br>· 남은 시간은 문제 위에 초로 보여요. <b>잠시 멈춤</b>과 <b>다음 문제</b> 버튼도 있어요.<br>· 다 풀면 PART별 점수가 나오고, 틀린 문제 해설을 바로 볼 수 있어요.<br>· 중간에 나가도 푼 곳까지 저장돼요.</div>
      <div style="display:grid;gap:8px">${sv.ans ? `<button class="btn" id="fu-cont">이어서 풀기 (${(sv.i || 0) + 1}번째 화면부터)</button><button class="btn ghost" id="fu-new">처음부터 다시 풀기</button>` : `<button class="btn" id="fu-new">시작하기</button>`}</div>`);
    bindCommon();
    var c = document.getElementById("fu-cont"); if (c) c.onclick = function () { F.ans = sv.ans || {}; F.i = Math.min(sv.i || 0, pages.length - 1); fullPage(F); };
    document.getElementById("fu-new").onclick = function () { exSet(id, null); F.ans = {}; F.i = 0; fullPage(F); };
  }).catch(function () { });
}
function fullPage(F) {
  stopPlay();
  var pg = F.pages[F.i], set = pg[0].set, q0 = pg[0].q, part = pg[0].sec.part || 0, run = PL.run, shortQ = !set && part <= 2;
  exSet(F.id, { ans: F.ans, i: F.i });
  var answered = F.list.filter(function (x) { return F.ans[x.key] != null; }).length;
  var img = set ? (set.image ? `<img class="lcimg" src="${esc(audioUrl(set.image))}" alt="">` : "") : (q0.image ? `<img class="lcimg" src="${esc(audioUrl(q0.image))}" alt="">` : "");
  var qs = pg.map(function (x) {
    var q = x.q, opts = q.options || [];
    return `<div class="qb"><span class="qno">${esc(q.no != null ? q.no : "")}.</span> ${shortQ ? `<span class="sent">${part === 1 ? "사진을 가장 잘 묘사한 것을 고르세요." : "질문에 알맞은 응답을 고르세요."}</span>` : `<span class="qt">${esc(q.q || "")}</span>`}
      <div class="opts" ${shortQ ? 'style="grid-template-columns:repeat(' + opts.length + ',1fr)"' : ""}>${opts.map(function (o, k) {
        return `<button class="opt ${F.ans[x.key] === k ? "sel" : ""}" data-key="${esc(x.key)}" data-k="${k}" ${shortQ ? 'style="justify-content:center"' : ""}><span class="k">${L[k]}</span>${shortQ ? "" : `<span>${esc(o)}</span>`}</button>`;
      }).join("")}</div></div>`;
  }).join("");
  render(`${topbar(F.g + " 전체")}
    <div class="qhead"><span>PART ${part} · 실전 모드</span><span>${F.i + 1} / ${F.pages.length}</span></div>
    <div class="bar"><i style="width:${pct(answered, F.list.length)}%"></i></div>
    <div style="display:flex;justify-content:center;margin:6px 0 10px"><span id="lc-time" style="display:inline-flex;align-items:center;gap:6px;background:#172844;color:#fff;border-radius:999px;padding:8px 18px;font-size:20px;font-weight:900">⏱ <b id="lc-sec">--</b>초</span></div>
    <div class="twocol ${set && img ? "set" : ""}">${img ? `<div>${img}</div>` : ""}<div class="card">${qs}
      <div id="lc-tap" style="display:none;margin-top:12px"><button class="btn" id="lc-play">▶ 음성 시작</button></div></div></div>
    <div class="sticky" style="display:flex;gap:8px"><button class="btn ghost" id="lc-pause" style="flex:1">❚❚ 잠시 멈춤</button><button class="btn navy" id="lc-next" style="flex:1">${F.i + 1 < F.pages.length ? "다음 문제 ›" : "제출하고 채점하기"}</button></div>`);
  bindCommon();
  app.querySelectorAll(".opt").forEach(function (b) {
    b.onclick = function () {
      F.ans[b.dataset.key] = +b.dataset.k; exSet(F.id, { ans: F.ans, i: F.i });
      app.querySelectorAll('.opt[data-key="' + b.dataset.key + '"]').forEach(function (o) { o.classList.toggle("sel", o === b); });
    };
  });
  var secEl = document.getElementById("lc-sec"), timeEl = document.getElementById("lc-time");
  var gap = set ? 8 * pg.length : 5, total = null, t0 = null, paused = false, pausedAt = 0, timer = null, src = set ? set.audio : q0.audio;
  function tick() {
    if (run !== PL.run || !document.contains(secEl)) { clearInterval(timer); return; }
    if (total == null || paused) return;
    var left = Math.max(0, Math.ceil(total - (Date.now() - t0) / 1000));
    secEl.textContent = left; timeEl.style.background = left <= 3 ? "#E95721" : "#172844";
    if (left <= 0) { clearInterval(timer); next(); }
  }
  function begin() {
    if (!src) { total = gap + 10; t0 = Date.now(); return; }
    if (!PL.audio) PL.audio = new Audio();
    var a = PL.audio; a.onended = a.onerror = null; a.src = audioUrl(src); a.currentTime = 0;
    a.onloadedmetadata = function () { if (total == null) { total = Math.ceil(a.duration || 10) + gap; t0 = Date.now(); } };
    a.play().then(function () { if (total == null && a.duration) { total = Math.ceil(a.duration) + gap; t0 = Date.now(); } })
      .catch(function () { document.getElementById("lc-tap").style.display = ""; });
  }
  function next() {
    stopPlay(); clearInterval(timer);
    if (F.i + 1 < F.pages.length) { F.i++; fullPage(F); scrollTop(); return; }
    var left2 = F.list.filter(function (x) { return F.ans[x.key] == null; }).length;
    F.list.forEach(function (y) {
      var c = F.ans[y.key] != null ? F.ans[y.key] : -1, ok = c === y.q.answer, prev = S.prog[y.key];
      S.prog[y.key] = [c, ok, prev ? prev[2] + 1 : 1];
      api("save_progress", { p_token: S.token, p_item: y.key, p_chosen: c, p_correct: ok }).catch(function () { });
    });
    exSet(F.id, null);
    fullResult(F, left2);
  }
  document.getElementById("lc-play").onclick = function () { document.getElementById("lc-tap").style.display = "none"; begin(); };
  document.getElementById("lc-next").onclick = function () {
    if (F.i + 1 >= F.pages.length) { var n2 = F.list.filter(function (x) { return F.ans[x.key] == null; }).length; if (n2 && !confirm("아직 안 푼 문제가 " + n2 + "개 있어요. 그대로 제출할까요? (안 푼 문제는 오답 처리)")) return; }
    next();
  };
  document.getElementById("lc-pause").onclick = function () {
    var b = this, a = PL.audio;
    if (!paused) { paused = true; pausedAt = Date.now(); if (a) a.pause(); b.textContent = "▶ 계속"; }
    else { paused = false; if (t0) t0 += Date.now() - pausedAt; if (a && src && a.currentTime < (a.duration || 0)) a.play().catch(function () { }); b.textContent = "❚❚ 잠시 멈춤"; }
  };
  timer = setInterval(tick, 200);
  begin();
}
function fullResult(F, skipped) {
  var list = F.list, ok = 0, by = {};
  list.forEach(function (x) { var pp = x.sec.part || 0, b = by[pp] = by[pp] || { n: 0, ok: 0 }; b.n++; if (S.prog[x.key] && S.prog[x.key][1]) { b.ok++; ok++; } });
  var wrong = list.filter(function (x) { return !(S.prog[x.key] && S.prog[x.key][1]); });
  var lk = typeof lcvKey === "function" ? lcvKey(F.secs[0]) : null;
  var mix = { id: "full", title: F.g + " 전체", area: "LC", part: 0, items: [], sets: [] };
  function draw() {
    render(topbar(F.g + " 전체") + `<div class="card hero score"><span class="kicker">실전 모의고사 결과</span><div class="big">${ok} / ${list.length}</div><p>정답률 ${pct(ok, list.length)}%${skipped ? " · 안 푼 문제 " + skipped + "개" : ""}</p></div>
      <div class="grp">PART별 결과</div><div class="card">${Object.keys(by).map(function (pp) { var b = by[pp]; return `<div style="display:flex;padding:8px 0;border-bottom:1px solid #EEF1F5;font-size:15px"><b style="flex:1">PART ${pp}</b><span style="font-weight:800;color:${b.ok === b.n ? "#1E8E5A" : "#E95721"}">${b.ok} / ${b.n}</span></div>`; }).join("")}</div>
      <div style="display:grid;gap:8px">${wrong.length ? `<button class="btn navy" id="fr-wrong">틀린 ${wrong.length}문제 해설 보기</button>` : ""}
        ${lk ? `<button class="btn" data-go="#/lcv/${lk}">🎬 이 회차 해설강의 보기</button>` : ""}
        ${F.secs.map(function (s) { return `<button class="btn ghost" data-go="#/ex/${encodeURIComponent(s.id)}">PART ${s.part} 채점표 · ${esc(s.title)}</button>`; }).join("")}
        <button class="btn ghost" data-go="#/full">다른 회차 풀기</button></div>`);
    bindCommon();
    var w = document.getElementById("fr-wrong"); if (w) w.onclick = function () { examReview(mix, wrong, draw); };
  }
  draw(); scrollTop();
}
function viewLearn() {
*/});

window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
// 1) 학습실 선택·메뉴·전체 풀기 추가, 예전 홈은 "문제 풀기"(viewLearn)로
["function viewHome() {\n", NEW_HOME + "\n"],
// 2) 문제 풀기 화면: 위쪽 큰 카드·오늘의 학습은 숨기고 뒤로 버튼
["  render(`\n  <div class=\"card hero\"><img class=\"logo\" src=\"${LOGO}\" alt=\"MAKE TOEIC\" onerror=\"this.style.display='none'\">\n    <span class=\"kicker\">MAKE TOEIC · 학습실</span><h1>${esc(p.name)}님, 오늘도", "  render(`${topbar((S.area === \"LC\" ? \"🎧 LC\" : \"📖 RC\") + \" 문제 풀기\")}<div style=\"display:none\">\n  <div class=\"card hero\"><img class=\"logo\" src=\"${LOGO}\" alt=\"MAKE TOEIC\" onerror=\"this.style.display='none'\">\n    <span class=\"kicker\">MAKE TOEIC · 학습실</span><h1>${esc(p.name)}님, 오늘도"],
["  ${todayCard()}\n  <div class=\"seg lv\">", "  </div>\n  <div class=\"seg lv\">"],
// 3) 문제 풀기 안의 LC/RC 전환은 숨김 (학습실에서 고름)
["  <div class=\"seg ar\">", "  <div class=\"seg ar\" style=\"display:none\">"],
// 4) Series 목록의 VOCA 링크는 RC 학습실 메뉴로 옮김
["out += `<div class=\"sea\"><b>SERIES ${n}</b>Series ${n}</div>` + voca + ", "out += `<div class=\"sea\"><b>SERIES ${n}</b>Series ${n}</div>` + "],
// 5) 과제·복습·타일·로그아웃은 학습실 메뉴로 옮겼으므로 숨김
["  <div class=\"grp\">과제 · 복습</div>", "  <div style=\"display:none\"><div class=\"grp\">과제 · 복습</div>"],
["  <div class=\"foot\"><button class=\"btn ghost sm\" id=\"mkst-logout\">로그아웃</button><br><br><a href=\"/\">메인페이지로 돌아가기</a></div>`);\n  bindCommon();\n  app.querySelectorAll(\"[data-lv]\")",
 "  <div class=\"foot\"><button class=\"btn ghost sm\" id=\"mkst-logout\">로그아웃</button></div></div>`);\n  bindCommon();\n  app.querySelectorAll(\"[data-lv]\")"],
// 6) 문제 풀기 화면 안에서 다시 그리기
["ls(\"level\", S.level); viewHome();", "ls(\"level\", S.level); viewLearn();"],
["ls(k, ls(k) === \"1\" ? \"0\" : \"1\"); viewHome();", "ls(k, ls(k) === \"1\" ? \"0\" : \"1\"); viewLearn();"],
["S.area = b.dataset.ar; ls(\"area\", S.area); viewHome();", "S.area = b.dataset.ar; ls(\"area\", S.area); viewLearn();"],
// 7) 라우터
["  if (h[0] === \"pick\") return viewPick();\n", "  if (h[0] === \"pick\") return viewPick();\n  if (h[0] === \"room\") return viewRoom();\n  if (h[0] === \"learn\") return viewLearn();\n  if (h[0] === \"full\" && h[2]) return viewFull(+h[1], decodeURIComponent(h[2]));\n  if (h[0] === \"full\") return viewFullList();\n"]
]);
})();
