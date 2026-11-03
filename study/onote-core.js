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
    + '#mk-onote .why{border:2px solid #000;padding:6px 10px;margin:6px 0;border-radius:6px}#mk-onote .why p{margin:3px 0}#mk-onote .q ol{list-style:none;padding:0;margin:6px 0}#mk-onote .q li{padding:1px 0}#mk-onote .q li.ok{font-weight:900}#mk-onote .q li.ok:after{content:"  ← 정답"}#mk-onote .q li.me{text-decoration:line-through}#mk-onote .q li.me:after{content:"  ← 내 답";text-decoration:none;display:inline-block;margin-left:4px}'
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
      while ((m = re.exec(ex))) { var pre = ex.slice(Math.max(0, m.index - 4), m.index); if (/정답\s*$/.test(pre)) continue; r = m[1]; break; }
      return r.replace(/^[^:：]{0,40}[:：]\s*/, function (x) { return /['"‘’]/.test(x) || x.length < 40 ? x : ""; }).trim();
    }
    function point() {
      var m = ex.match(/(?:정답 근거|의식의 흐름|정답 포인트)\s*[:：—-]?\s*([^\n]+)/); return m ? m[1].trim() : "";
    }
    var op = q.options || [];
    if (mine == null || mine < 0) h += '<p><b>✕ 답을 고르지 않음</b></p>';
    else { var r = seg(mine); h += '<p><b>✕ 내가 고른 (' + L[mine] + ') ' + esc(op[mine] || "") + '</b>' + (r ? ' — 틀린 이유: ' + esc(r.slice(0, String(op[mine] || "").length + 3).replace(/[:：]\s*$/, "").trim() === String(op[mine] || "").trim() || r.indexOf(String(op[mine]) + ":") === 0 ? r.slice(String(op[mine]).length).replace(/^\s*[:：]\s*/, "") : r) : "") + "</p>"; }
    var pt = point(); h += '<p><b>○ 정답 (' + L[a] + ') ' + esc(op[a] || "") + '</b>' + (pt ? ' — 이유: ' + esc(pt) : "") + "</p>";
    return '<div class="why">' + h + "</div>";
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
          + '<div class="ex">' + (q.translation ? "<p><b>해석</b> " + esc(q.translation) + "</p>" : "") + fmt(q.explain) + "</div></div>";
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
