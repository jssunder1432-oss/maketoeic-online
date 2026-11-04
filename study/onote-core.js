/* 메이크토익 A급 과제 오답노트 — 학생 학습실과 관리자 페이지가 같이 쓰는 화면·인쇄 모듈 (2026-11-03)
   MKONOTE.open({ name, title, date, parts:[{part, title, list:[{key,q,set,mine,ok,type}]}] }) */
(function () {
  if (window.MKONOTE) return;
  var L = ["A", "B", "C", "D"];
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var LB = /^(유형|정답 근거|정답|오답 분석|오답|암기|해석|어휘|의식의 흐름|보기 정리|지문 개요|발음|함정|Paraphrase|패러프레이즈|POINT|핵심)/;
  function fmt(t) {
    return String(t || "").split(/\n+/).map(function (ln) {
      ln = ln.trim(); if (!ln || /^유형\s*:/.test(ln)) return "";
      var m = ln.match(LB), body = esc(m ? ln.slice(m[0].length).replace(/^\s*:?\s*/, "") : ln);
      if (m && /^오답 분석/.test(m[0])) body = body.split(/\s+\/\s+(?=\([A-D]\))/).join("<br>");
      return "<p>" + (m ? "<b>" + esc(m[0]) + "</b> " : "") + body + "</p>";
    }).join("");
  }
  function blankTxt(s) { return esc(s).replace(/_{3,}|-{4,}/g, '<span class="bl"></span>'); }
  function psg(s) { return esc(s || "").replace(/-{2,}(\d{3})-{2,}/g, '<b class="bn">($1)</b>').replace(/\n\n=====\n\n/g, '\n<hr>\n'); }
  var CSS = '#mk-onote{position:fixed;inset:0;z-index:100000;background:#fff;overflow:auto;-webkit-overflow-scrolling:touch;color:#000;font-family:"Pretendard Variable",Pretendard,"Apple SD Gothic Neo","Malgun Gothic",sans-serif}'
    + '#mk-onote .tb{position:sticky;top:0;display:flex;gap:8px;padding:10px 12px;background:#172844;z-index:2}'
    + '#mk-onote .tb button{flex:1;border:0;border-radius:10px;padding:12px;font:inherit;font-weight:800;font-size:15px;background:#FF581F;color:#fff}#mk-onote .tb .x{flex:none;background:#fff;color:#172844;padding:12px 16px}'
    + '#mk-onote .pg{max-width:780px;margin:0 auto;padding:18px 16px 60px;font-size:14px;line-height:1.6}'
    + '#mk-onote .hd{border:2px solid #000;padding:14px 16px;margin-bottom:14px}#mk-onote .hd small{display:block;letter-spacing:.18em;font-weight:800;font-size:11px}'
    + '#mk-onote .hd h1{margin:4px 0 6px;font-size:22px;font-weight:900}#mk-onote .hd .mt{display:flex;flex-wrap:wrap;gap:4px 16px;font-size:13px}'
    + '#mk-onote table{width:100%;border-collapse:collapse;margin:8px 0 14px;font-size:13px}#mk-onote th,#mk-onote td{border:1px solid #000;padding:5px 7px;text-align:center}#mk-onote th{background:#000;color:#fff}'
    + '#mk-onote .sec{background:#000;color:#fff;font-weight:900;padding:6px 10px;margin:18px 0 10px;font-size:15px;break-after:avoid;page-break-after:avoid}'
    + '#mk-onote .q{border:1px solid #000;padding:10px 12px;margin:0 0 10px;break-inside:avoid;page-break-inside:avoid}'
    + '#mk-onote .q .no{font-weight:900;margin-right:6px}#mk-onote .q .ty{float:right;border:1px solid #000;font-size:11px;padding:0 6px;font-weight:700}'
    + '#mk-onote .an{border:2px solid #000;padding:8px 12px;margin:10px 0;border-radius:6px;break-inside:avoid}#mk-onote .an p{margin:4px 0}#mk-onote .an-h{font-weight:900;font-size:16px;margin-bottom:4px}#mk-onote .an-i{border-top:1px dashed #000;padding-top:4px;margin-top:4px}#mk-onote .why{border:2px solid #000;padding:6px 10px;margin:6px 0;border-radius:6px}#mk-onote .why p{margin:3px 0}#mk-onote .q ol{list-style:none;padding:0;margin:6px 0}#mk-onote .q li{padding:1px 0}#mk-onote .q li.ok{font-weight:900}#mk-onote .q li.ok:after{content:"  ← 정답"}#mk-onote .q li.me{text-decoration:line-through}#mk-onote .q li.me:after{content:"  ← 내 답";text-decoration:none;display:inline-block;margin-left:4px}'
    + '#mk-onote .ex{border-top:1px dashed #000;margin-top:6px;padding-top:6px;font-size:13px}#mk-onote .ex p{margin:2px 0}'
    + '#mk-onote .ps{border:1px solid #000;padding:10px 12px;margin:0 0 8px;white-space:pre-wrap;font-size:12.5px;line-height:1.55;break-inside:auto}#mk-onote .ps hr{border:0;border-top:1px dashed #000}'
    + '#mk-onote .tr{font-size:12.5px;margin:0 0 10px;padding:8px 12px;border-left:3px solid #000;background:#f2f2f2;white-space:pre-wrap}'
    + '#mk-onote .bl{display:inline-block;min-width:60px;border-bottom:2px solid #000}#mk-onote .bn{text-decoration:underline}'
    + '#mk-onote .none{border:1px solid #000;padding:14px;text-align:center;font-weight:700}'
    + '@media print{@page{size:A4;margin:12mm}body>*:not(#mk-onote){display:none!important}html,body{background:#fff!important}#mk-onote{position:static;overflow:visible}#mk-onote .tb{display:none}#mk-onote .pg{max-width:none;padding:0}#mk-onote .q,#mk-onote .tr{background:#fff}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}';
  function why(q, mine) {
    var ex = String(q.explain || ""), a = q.answer, h = "";
    function seg(k) {
      var re = new RegExp("\\(" + L[k] + "\\)\\s*([^\\n]*?)(?=\\s+/\\s+\\([A-D]\\)|\\n|$)", "g"), m, r = "";
      var oi = ex.search(/오답(\s*분석)?\s*[:：\n]/), src = oi >= 0 ? ex.slice(oi) : ex;
      function scan(t) { re.lastIndex = 0; while ((m = re.exec(t))) { var pre = t.slice(Math.max(0, m.index - 4), m.index); if (/정답\s*$/.test(pre)) continue; return m[1]; } return ""; }
      var noTr = ex.replace(/^\s*보기 해석[^\n]*$/m, "");
      r = scan(oi >= 0 ? noTr.slice(Math.max(0, noTr.search(/오답(\s*분석)?\s*[:：\n]/))) : noTr) || scan(noTr);
      if (!r) { var tm = ex.match(/보기 해석[^\n]*/); var mm = tm && tm[0].match(new RegExp("\\(" + L[k] + "\\)\\s*([^/\\n]+)")); r = (mm ? "'" + mm[1].trim() + "' — " : "") + "지문의 정답 포인트와 맞지 않는 보기예요. 아래 정답 근거를 보세요."; }
      return r.trim();
    }
    function point() {
      var m = ex.match(/(?:정답 근거|의식의 흐름|정답 포인트)\s*[:：—-]?\s*([^\n]+)/); return m ? m[1].trim() : "";
    }
    var op = q.options || [];
    if (mine == null || mine < 0) h += '<p><b>✕ 답을 고르지 않음</b></p>';
    else { var r = seg(mine); h += '<p><b>✕ 내가 고른 (' + L[mine] + ') ' + esc(op[mine] || "") + '</b>' + (r ? ' — 틀린 이유: ' + esc(r.indexOf(String(op[mine]).trim()) === 0 ? r.slice(String(op[mine]).trim().length).replace(/^\s*[:：—–-]?\s*/, "") : r) : "") + "</p>"; }
    var pt = point(); h += '<p><b>○ 정답 (' + L[a] + ') ' + esc(op[a] || "") + '</b>' + (pt ? ' — 이유: ' + esc(pt) : "") + "</p>";
    return '<div class="why">' + h + "</div>";
  }
  // 유형별 약점 진단: [개선해야 할 점, 개선 방법]
  var ADV = {
    "어휘 · 명사": ["빈칸 앞뒤 짝꿍 단어(콜로케이션)를 못 잡고 뜻만으로 고르고 있어요.", "명사는 앞의 동사·전치사와 짝으로 외우세요(예: meet the deadline, in compliance with). 틀린 단어는 짝 표현째 단어장에 적고 3번 소리 내 읽기."],
    "어휘 · 동사": ["동사 뒤 목적어·전치사 구조를 안 보고 뜻으로만 고르고 있어요.", "동사 뒤에 명사가 있으면 타동사, 전치사가 있으면 자동사부터 거르세요. 「동사+전치사」 짝(comply with, adhere to)은 묶어서 외우기."],
    "어휘 · 형용사": ["형용사 뒤 전치사·명사 짝을 놓치고 있어요.", "be + 형용사 + 전치사(responsible for, eligible for, familiar with)를 짝으로 외우고, 명사 앞 형용사는 꾸밈 받는 명사와 함께 외우세요."],
    "어휘 · 부사": ["시제·숫자·동사와 어울리는 부사를 구별 못 하고 있어요.", "recently(과거·현재완료), soon(미래), nearly·approximately(숫자 앞)처럼 단서와 짝인 부사를 정리하세요. 해석보다 단서부터."],
    "품사 자리": ["빈칸 자리(명사·형용사·부사·동사)를 구조로 판단하지 않고 있어요.", "빈칸 앞뒤 1단어만 보세요. a/the 뒤 명사, 명사 앞 형용사, 완벽한 문장(명사+동사+명사) 안 빈칸은 부사. 해석은 마지막에."],
    "동사 태": ["능동·수동을 해석으로 고르고 있어요.", "기준은 하나: 동사 뒤에 목적어(명사·명사절)가 있으면 능동, 없으면 수동. 자동사는 수동 불가. 매 문제 동사 뒤를 먼저 확인하세요."],
    "동사 시제·수일치": ["수 → 태 → 시제 순서로 점검하지 않고 있어요.", "주어의 단수·복수부터 보고(수), 목적어 유무(태), 마지막에 시간 단서(last week, since, by next month)로 시제를 정하세요."],
    "준동사": ["to부정사·-ing·pp 자리를 동사 성질(자동사·타동사)로 판단하지 않고 있어요.", "타동사에서 온 -ing·to부정사 뒤엔 명사가 있어야 해요. 뒤에 명사가 없으면 being pp / to be pp. 전치사 뒤 빈칸 + the 명사는 -ing."],
    "대명사": ["빈칸 뒤 명사 유무로 격을 고르지 않고 있어요.", "빈칸 뒤 명사가 있으면 소유격, 동사 앞이면 주격, 동사·전치사 뒤면 목적격, 주어와 같으면 재귀대명사. 격 표를 한 번 정리하세요."],
    "전치사 선택": ["시간·장소·이유 전치사 구별이 약해요.", "by(~까지 완료) / until(~까지 계속), during(기간 명사) / for(숫자 기간)처럼 헷갈리는 짝을 표로 정리하고 예문째 외우세요."],
    "전치사 vs 접속사 vs 접속부사": ["빈칸 뒤가 명사인지 문장(주어+동사)인지 확인하지 않고 있어요.", "뒤에 명사면 전치사, 주어+동사면 접속사, 마침표·세미콜론 뒤 콤마와 함께면 접속부사. 뜻 고르기는 그다음에."],
    "관계사 · 명사절": ["빈칸 뒤 문장이 완전한지 불완전한지 확인하지 않고 있어요.", "동사가 2개면 접속사가 필요해요. 뒤 문장에 주어·목적어가 빠졌으면 관계대명사·what, 완전하면 관계부사·that·whether. 전치사 뒤엔 that·if 불가."],
    "비교 · 수량 · 한정사": ["비교급·최상급 단서와 수량 형용사 뒤 명사의 수를 놓치고 있어요.", "than → 비교급, the + of/in 범위 → 최상급, as ~ as → 원급. each·every 뒤 단수, many·several 뒤 복수 명사를 확인하세요."],
    "PART 6 · 문법": ["빈칸 문장만 보고 지문 날짜·앞뒤 문장의 시제 단서를 놓치고 있어요.", "PART 5처럼 수·태·시제를 보되, 시제는 이메일 날짜와 앞뒤 문장으로 결정하세요."],
    "PART 6 · 어휘": ["빈칸 문장만 해석하고 앞뒤 문맥으로 범위를 좁히지 않고 있어요.", "빈칸 앞 문장과 뒤 문장을 먼저 읽고, 같은 대상을 다르게 말한 단어(패러프레이즈)를 찾으세요."],
    "PART 6 · 접속부사": ["앞뒤 문장의 관계(추가·반대·결과·예시)를 정하지 않고 고르고 있어요.", "앞 문장과 뒤 문장을 한 줄씩 요약하고 관계를 먼저 정하세요: 추가 In addition, 반대 However, 결과 Therefore, 예시 For example."],
    "PART 6 · 문장 고르기": ["빈칸 앞뒤 문장과 이어지는 연결 고리(지시어·대명사·같은 단어)를 안 보고 있어요.", "보기 문장의 this·these·they·such가 가리키는 대상이 바로 앞 문장에 있는지 확인하세요. 새로운 주제를 꺼내는 보기는 오답."],
    "PART 7 · 주제·목적": ["지문 전체를 다 읽고 나서 목적을 찾고 있어요.", "목적은 첫 문단 1~2문장에 있어요. I am writing to ~, This is to inform ~ 같은 표현부터 찾으세요."],
    "PART 7 · 세부 사항": ["질문의 핵심어로 지문 위치를 찾지 않고 처음부터 읽고 있어요.", "질문에서 고유명사·숫자·날짜를 표시하고 그 단어가 있는 문장만 정밀하게 읽으세요. 정답은 지문 표현을 바꿔 말한 보기(패러프레이즈)."],
    "PART 7 · 사실 확인": ["보기 4개를 지문과 하나씩 대조하지 않고 기억으로 고르고 있어요.", "보기마다 핵심어를 지문에서 찾아 O·X 표시하세요. 지문 단어를 그대로 쓴 보기는 함정일 때가 많아요."],
    "PART 7 · NOT 문제": ["언급된 3개를 지우는 순서로 풀지 않고 있어요.", "보기 4개를 지문에서 하나씩 찾아 지우고, 끝까지 안 나오는 보기를 고르세요."],
    "PART 7 · 추론": ["지문에 직접 없는 내용을 상상으로 고르고 있어요.", "추론도 근거 문장이 반드시 있어요. 정답 포인트 문장을 찾고, 그 문장에서 한 걸음만 나아간 보기를 고르세요."],
    "PART 7 · 의도 파악": ["인용문 앞뒤 대화를 안 보고 문장 뜻만으로 고르고 있어요.", "인용문 바로 앞 사람의 말에 대한 대답이에요. 앞 1줄 + 뒤 1줄을 읽고 상황을 정하세요."],
    "PART 7 · 문장 삽입": ["주어진 문장의 연결 단서(this·they·also·however)를 먼저 보지 않고 있어요.", "주어진 문장의 지시어·접속부사부터 표시하고, 그 대상이 바로 앞에 있는 위치를 고르세요."],
    "PART 7 · 동의어": ["사전 뜻으로 고르고 문맥 뜻을 확인하지 않고 있어요.", "해당 단어를 보기로 바꿔 넣어 문장 뜻이 그대로인지 확인하세요. 가장 흔한 뜻은 오히려 함정."]
  };
  function analysis(parts, types, tl) {
    if (!tl.length) return "";
    var pr = parts.map(function (p) { var n = p.list.length, k = p.list.filter(function (x) { return x.ok; }).length; return { part: p.part, n: n, k: k, r: n ? k / n : 1 }; }).filter(function (x) { return x.n; });
    var weakP = pr.slice().sort(function (a, b) { return a.r - b.r; })[0], strongP = pr.slice().sort(function (a, b) { return b.r - a.r; })[0];
    var top = tl.slice(0, 3);
    var h = '<div class="an"><div class="an-h">📊 분석 — 약점 · 개선해야 할 점 · 개선 방법</div>';
    h += "<p><b>한눈에 보기</b> " + pr.map(function (x) { return "PART " + x.part + " " + Math.round(x.r * 100) + "%"; }).join(" · ")
      + (pr.length > 1 ? " — 가장 약한 곳은 <b>PART " + weakP.part + "</b>" + (strongP.part !== weakP.part ? ", 가장 강한 곳은 PART " + strongP.part : "") + "." : "") + "</p>";
    h += "<p><b>약점 TOP " + top.length + "</b> " + top.map(function (t, i) { return (i + 1) + ". " + esc(t) + " (" + types[t] + "개)"; }).join(" / ") + "</p>";
    h += top.map(function (t, i) {
      var a = ADV[t] || ["이 유형의 판단 순서가 아직 잡히지 않았어요.", "틀린 문제의 해설을 다시 읽고, 정답 근거 문장을 직접 표시하며 한 번 더 풀어 보세요."];
      return '<div class="an-i"><p><b>' + (i + 1) + ". " + esc(t) + "</b></p><p>▸ 개선해야 할 점: " + esc(a[0]) + "</p><p>▸ 개선 방법: " + esc(a[1]) + "</p></div>";
    }).join("");
    h += "<p><b>다음 공부 순서</b> ① 아래 틀린 문제의 '틀린 이유'를 읽고 ② 해설 없이 다시 풀고 ③ 약점 1순위 유형부터 같은 유형 문제를 더 풀어 보세요.</p></div>";
    return h;
  }
  function html(o) {
    var tot = 0, ok = 0, rows = [], types = {};
    o.parts.forEach(function (p) {
      var n = p.list.length, k = p.list.filter(function (x) { return x.ok; }).length; tot += n; ok += k;
      rows.push("<tr><td>PART " + p.part + "</td><td>" + k + " / " + n + "</td><td>" + (n - k) + "</td></tr>");
      p.list.forEach(function (x) { if (!x.ok && x.type) types[x.type] = (types[x.type] || 0) + 1; });
    });
    var tl = Object.keys(types).sort(function (a, b) { return types[b] - types[a]; });
    var out = '<div class="hd"><small>MAKE TOEIC · 메이크토익</small><h1>' + esc(o.title) + ' 오답노트</h1><div class="mt"><span>이름 <b>' + esc(o.name || "") + '</b></span><span>날짜 ' + esc(o.date || "") + '</span><span>맞은 개수 <b>' + ok + " / " + tot + '</b></span></div></div>'
      + "<table><tr><th>PART</th><th>맞은 개수</th><th>틀린 개수</th></tr>" + rows.join("") + "</table>"
      + analysis(o.parts, types, tl)
      + (tl.length ? '<table><tr><th>틀린 유형</th><th style="width:80px">개수</th></tr>' + tl.map(function (t) { return "<tr><td style=\"text-align:left\">" + esc(t) + "</td><td>" + types[t] + "</td></tr>"; }).join("") + "</table>" : "");
    var any = false;
    o.parts.forEach(function (p) {
      var wrong = p.list.filter(function (x) { return !x.ok; }); if (!wrong.length) return; any = true;
      out += '<div class="sec">PART ' + p.part + (p.title ? " · " + esc(p.title) : "") + " — 틀린 문제 " + wrong.length + "개</div>";
      var lastSet = null;
      wrong.forEach(function (x) {
        var q = x.q, set = x.set;
        if (set && set !== lastSet) {
          out += '<p style="margin:12px 0 4px;font-weight:900">■ ' + esc(set.range || "") + "번 지문</p>" + '<div class="ps">' + psg(set.passage) + "</div>" + (set.tr || set.translation ? '<div class="tr"><b>지문 해석</b>\n' + esc(set.tr || set.translation) + "</div>" : "");
          lastSet = set;
        }
        out += '<div class="q">' + (x.type ? '<span class="ty">' + esc(x.type) + "</span>" : "") + '<span class="no">' + esc(q.no != null ? q.no : "") + ".</span>" + (q.q ? blankTxt(q.q) : "") + "<ol>"
          + (q.options || []).map(function (op, k) { return '<li class="' + (k === q.answer ? "ok" : k === x.mine ? "me" : "") + '">(' + L[k] + ") " + esc(op) + "</li>"; }).join("") + "</ol>"
          + why(q, x.mine)
          + '<div class="ex">' + (q.translation && !/(^|\n)\s*해석\s*[:：]/.test(q.explain || "") ? "<p><b>해석</b> " + esc(q.translation) + "</p>" : "") + fmt(q.explain) + "</div></div>";
      });
    });
    if (!any) out += '<div class="none">틀린 문제가 없어요. 전부 맞혔어요!</div>';
    return out;
  }
  function open(o) {
    if (!document.getElementById("mk-onote-css")) { var st = document.createElement("style"); st.id = "mk-onote-css"; st.textContent = CSS; document.head.appendChild(st); }
    var old = document.getElementById("mk-onote"); if (old) old.remove();
    var d = document.createElement("div"); d.id = "mk-onote";
    d.innerHTML = '<div class="tb"><button type="button" class="pr">🖨 출력 · PDF로 저장</button><button type="button" class="x">닫기</button></div><div class="pg">' + html(o) + "</div>";
    document.body.appendChild(d);
    var t0 = document.title;
    d.querySelector(".pr").onclick = function () { document.title = "메이크토익_" + (o.title || "오답노트").replace(/\s+/g, "_") + "_오답노트_" + (o.name || ""); window.print(); setTimeout(function () { document.title = t0; }, 1500); };
    d.querySelector(".x").onclick = function () { d.remove(); };
    return d;
  }
  function onGuess(q, set, part) {
    var o = (q.options || []).map(function (x) { return String(x).trim(); }), s = String(q.q || "");
    if (part === 7) {
      if (/closest in meaning/i.test(s)) return "PART 7 · 동의어";
      if (/\[1\]|best belong/i.test(s)) return "PART 7 · 문장 삽입";
      if (/mean when|writes,/i.test(s)) return "PART 7 · 의도 파악";
      if (/\bNOT\b/.test(s)) return "PART 7 · NOT 문제";
      if (/purpose|mainly (about|discuss)|why (was|is) .* (written|sent)|why did .* (write|send|e-mail|contact)|why is .* writing/i.test(s)) return "PART 7 · 주제·목적";
      if (/suggest|impl|most likely|probably|infer/i.test(s)) return "PART 7 · 추론";
      if (/indicated|stated|true|mentioned/i.test(s)) return "PART 7 · 사실 확인";
      return "PART 7 · 세부 사항";
    }
    if (part === 6) {
      if (o.some(function (x) { return x.split(/\s+/).length >= 5; })) return "PART 6 · 문장 고르기";
      if (o.filter(function (x) { return /^(however|therefore|instead|in addition|additionally|moreover|furthermore|as a result|consequently|for example|for instance|otherwise|nevertheless|meanwhile|in fact|similarly|likewise|afterward|then|still|besides|thus|accordingly|on the other hand|in contrast|of course|indeed|finally|also|even so|in that case|to that end|nonetheless|rather|alternatively|regardless|that is)[,.]?$/i.test(x); }).length >= 2) return "PART 6 · 접속부사";
      var r = o.map(function (x) { return x.toLowerCase().replace(/^(has been|have been|had been|will be|will have|to be|being|been|be|to|was|were|is|are|will|has|have|had|would|could|may|might|should)\s+/, "").slice(0, 4); });
      if (r.filter(function (x) { return x === r[0]; }).length >= 3) return "PART 6 · 문법";
      return "PART 6 · 어휘";
    }
    var low = o.map(function (x) { return x.toLowerCase(); });
    var PR = /^(in|on|at|by|for|with|from|to|of|about|during|within|through|throughout|until|since|despite|among|between|toward|towards|across|along|against|without|beyond|under|over|above|below|after|before|around|upon|into|regarding|concerning|following|including|except|like|unlike|via|per|amid|prior to|due to|because of|according to|in spite of|instead of|as of|ahead of|in addition to)$/;
    if (low.every(function (x) { return PR.test(x); })) return "전치사 선택";
    if (low.some(function (x) { return /^(although|because|while|whereas|unless|if|once|since|so that|even though|as soon as|whether|provided that|in case)$/.test(x); }) && low.some(function (x) { return PR.test(x) || /^(however|therefore|moreover|nevertheless|instead|otherwise)$/.test(x); })) return "전치사 vs 접속사 vs 접속부사";
    if (low.some(function (x) { return /^(who|whom|whose|which|that|what|where|when|whoever|whatever|whichever|how|why)$/.test(x); }) && low.filter(function (x) { return /^wh|^that$|^how$/.test(x); }).length >= 2) return "관계사 · 명사절";
    if (low.every(function (x) { return /^(i|me|my|mine|myself|you|your|yours|yourself|he|him|his|himself|she|her|hers|herself|it|its|itself|we|us|our|ours|ourselves|they|them|their|theirs|themselves|one|ones|those|these|each other|someone|anyone|everyone|another|other|others)$/.test(x); })) return "대명사";
    if (low.some(function (x) { return /^(more |most |less |least )|er$|est$/.test(x); }) && low.filter(function (x) { return /^(more |most )|est$/.test(x); }).length >= 1 && low.map(function (x) { return x.replace(/^(more|most) /, "").slice(0, 4); }).filter(function (x, i, a) { return x === a[0]; }).length >= 3) return "비교 · 수량 · 한정사";
    var root = low.map(function (x) { return x.replace(/^(has been|have been|had been|will be|will have|to be|being|been|be|to|was|were|is|are|will|has|have|had)\s+/, "").slice(0, 4); });
    if (root.filter(function (x) { return x === root[0]; }).length >= 3) {
      if (low.some(function (x) { return /^(has been|have been|had been|will be|was|were|is|are|be|being|been) \w+(ed|en|wn|ne)$/.test(x); }) && low.some(function (x) { return !/ /.test(x) || /^(will|has|have|had) /.test(x); })) return "동사 태";
      if (low.some(function (x) { return /^to /.test(x); }) || low.filter(function (x) { return /ing$/.test(x); }).length && low.filter(function (x) { return /(s|ed)$/.test(x); }).length >= 2 && low.some(function (x) { return / /.test(x); })) return "준동사";
      if (low.filter(function (x) { return / /.test(x); }).length >= 2) return "동사 시제·수일치";
      return "품사 자리";
    }
    if (low.every(function (x) { return /ly$/.test(x); })) return "어휘 · 부사";
    return "어휘 · 명사";
  }
  function itemsOf(sec) {
    var out = [];
    (sec.items || []).forEach(function (it, i) { out.push({ key: sec.id + ":i" + (it.src || "") + (it.no != null ? it.no : i), q: it, set: null }); });
    (sec.sets || []).forEach(function (st, si) { (st.questions || []).forEach(function (q, qi) { out.push({ key: sec.id + ":s" + si + "-" + (q.no != null ? q.no : qi), q: q, set: st }); }); });
    return out;
  }
  window.MKONOTE = { open: open, html: html, guess: onGuess, itemsOf: itemsOf };
})();
