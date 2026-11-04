/* LC 실전 모의고사 — 회차별 '문제 PDF 받기' + '정답 입력 → 채점·오답 분석 → PDF 저장/인쇄' (2026-11-05, 모든 Season)
   - 회차 전체 풀기 목록(#/full), 문제 풀기 폴더(#/learn), 회차 전체 풀기 결과 화면에 버튼
   - #/lcx/시즌/회차 : 답안지(OMR)에 정답 입력 → 채점 → PART별·유형별 분석 + 틀린 문제 해설 → PDF
   - PDF는 기기에서 바로 만든다(html2canvas + jsPDF, 페이지마다 따로 그려 한 문항이 페이지에 걸쳐 잘리지 않게)
   - 기출 릴스는 학습실에서 뺀다(reelList 비움, #/reels → 홈)
   - get_app 코드에 문자열 패치로 덧붙임 — 앵커가 하나라도 안 맞으면 원본 그대로 사용(index.html 로더 규칙). */
(function () {
function T(f) { var s = f.toString(); return s.slice(s.indexOf("/*") + 2, s.lastIndexOf("*/")); }

var CODE = T(function () {/*// LC 모의고사 PDF · 정답 입력 오답 분석 — study/lcpdf.js
var LCX = {};
function lcxIsMock(list) { return list.length && list.every(function (s) { return s.area === "LC" && /LC 실전 모의고사/.test(s.group || ""); }); }
function lcxBtns(ser, g) {
  return '<div style="display:flex;gap:6px;margin:-4px 0 12px"><button class="btn sm" data-lcxpdf="' + ser + '|' + esc(g) + '" style="flex:1;padding:11px 6px;font-size:14px;background:#172844">📄 문제 PDF 받기</button>'
    + '<button class="btn sm" data-go="#/lcx/' + ser + '/' + encodeURIComponent(g) + '" style="flex:1;padding:11px 6px;font-size:14px">✍ 정답 입력 · 오답 분석</button></div>';
}
function lcxRow(g, list) {
  if (!lcxIsMock(list)) return "";
  return lcxBtns(seasonOf(list) || 3, list[0].group);
}
function lcxLoad(ser, g) {
  var metas = S.catalog.sections.filter(function (s) { return s.area === "LC" && s.group === g && seasonOf([s]) === ser; });
  return Promise.all(metas.map(function (m) { return load("sec:" + m.id).catch(function () { return null; }); })).then(function (secs) {
    secs = secs.filter(Boolean).sort(function (a, b) { return (a.part || 0) - (b.part || 0) || String(a.title).localeCompare(String(b.title), "ko", { numeric: true }); });
    var list = [];
    secs.forEach(function (sec) { itemsOf(sec).forEach(function (x) { x.sec = sec; x.part = sec.part || 0; list.push(x); }); });
    var nos = list.map(function (x) { return +x.q.no; }), uniq = nos.every(function (n, i) { return n > 0 && nos.indexOf(n) === i; });
    list.forEach(function (x, i) { x.n = uniq ? +x.q.no : i + 1; });
    list.sort(function (a, b) { return a.n - b.n; });
    return { ser: ser, g: g, secs: secs, list: list };
  });
}
function lcxName(D) { return "메이크토익_Season" + D.ser + "_" + String(D.g).replace(/\s+/g, "_"); }
function lcxType(x) {
  var q = x.q || {}, t = qType(q), s = String(q.q || "").trim(), p = x.part;
  if (t && t.length < 30) return t;
  if (p === 1) return "사진 묘사";
  if (p === 2) {
    if (/\bor\b/i.test(s) && /\?$/.test(s) && !/^(Who|Whose|Whom|What|Which|When|Where|Why|How)\b/i.test(s)) return "선택 의문문";
    if (/^(Would you|Could you|Can you|Will you|Why don't|Let's|How about|Shall|Do you want|Would you like)/i.test(s)) return "제안·요청 의문문";
    if (/^(Don't|Doesn't|Didn't|Isn't|Aren't|Wasn't|Weren't|Haven't|Hasn't|Won't|Can't|Shouldn't|Wouldn't)\b/i.test(s)) return "부정 의문문";
    if (/,\s*(isn't|aren't|don't|doesn't|didn't|won't|haven't|hasn't|can't|wasn't|weren't|right|correct)\b[^,]*\?$/i.test(s)) return "부가 의문문";
    var m = s.match(/^(Who|Whose|Whom|What|Which|When|Where|Why|How)\b/i);
    if (m) return m[1].replace(/^Who(se|m)$/i, "Who").replace(/^Which$/i, "What").toUpperCase().slice(0, 1) + m[1].replace(/^Who(se|m)$/i, "Who").replace(/^Which$/i, "What").slice(1).toLowerCase() + " 의문문";
    if (/\bor\b/i.test(s) && /\?$/.test(s)) return "선택 의문문";
    if (/^(Is|Are|Was|Were|Do|Does|Did|Have|Has|Will|Can|Should|Would|Could|May)\b/i.test(s)) return "일반(Yes/No) 의문문";
    if (!/\?$/.test(s)) return "평서문";
    return "기타 의문문";
  }
  if (/mean when|imply when|say(s)?,?\s*["“]|says?\s*["“]/i.test(s)) return "화자 의도";
  if (/graphic/i.test(s)) return "시각 정보";
  if (/(main(ly)?\s+(topic|discuss|about|purpose))|purpose of|What is the (talk|announcement|message|conversation|broadcast|report|speech|meeting|call) (mainly )?about|Why is the (man|woman|speaker) (calling|speaking)|What are the speakers (mainly )?discussing|What is being (advertised|announced)/i.test(s)) return "주제·목적";
  if (/(Who|Where)\b.*(most likely|probably)|Who (is|are) the (speaker|listener|man|woman)|What (is|are) .* (job|occupation|profession)|What (industry|field|kind of business|type of business)|work (for|in|at)\b/i.test(s)) return "화자·장소";
  if (/(do|happen) next|will .* (probably|most likely) do|What will .* do\b|plan(s)? to do/i.test(s)) return "다음 행동";
  if (/\b(ask(ed|s)?|request|suggest|recommend|offer|advise|invite|remind|encourage|instruct)\b/i.test(s)) return "요청·제안";
  if (/problem|concern|worried|issue|complain|wrong|mistake|delay/i.test(s)) return "문제점";
  return "세부 사항";
}
var LCX_TIP = {
  "사진 묘사": "사람 사진은 동작(동사), 사물 사진은 위치·상태(is/are being + p.p., have been p.p.)를 먼저 확인하고, 사진에 없는 명사가 나오면 바로 지워요.",
  "Who 의문문": "사람 이름·직책·부서가 답이 돼요. 첫 단어 Who를 놓치지 않게 질문 첫 3단어에 집중!",
  "What 의문문": "What 바로 뒤 명사(What time / What kind)가 무엇을 묻는지 결정해요. What + 명사까지 듣고 답을 정해요.",
  "When 의문문": "시점 표현(yesterday, next week, by Friday)이 답. 과거 질문에 미래 응답 같은 시제 함정을 조심해요.",
  "Where 의문문": "장소·위치·출처가 답. 전치사 in/on/at/from + 장소, 또는 사람 이름(에게 있다)도 정답이 될 수 있어요.",
  "Why 의문문": "Because 없이 이유만 말하는 응답이 많아요. 질문 단어를 그대로 반복하는 보기는 함정!",
  "How 의문문": "How 뒤 형용사·부사(How long / How often / How much)까지 들어야 묻는 내용이 정해져요.",
  "부정 의문문": "not은 없다고 생각하고 일반 의문문처럼 풀어요. 사실이면 Yes, 아니면 No.",
  "부가 의문문": "꼬리(isn't it?)는 무시하고 앞 문장 내용이 사실인지만 판단해요.",
  "선택 의문문": "A or B 중 하나, 둘 다, 둘 다 아님, 제3의 선택이 답. Yes/No로 시작하는 보기는 대부분 오답!",
  "제안·요청 의문문": "Sure / I'd love to / Sorry, but ~ 같은 수락·거절 응답이 정답. 질문 단어 반복 보기는 함정.",
  "일반(Yes/No) 의문문": "Yes/No를 생략한 응답, 되묻는 응답(Do you need it today?)도 정답이 돼요. 내용 연결로 판단해요.",
  "평서문": "정해진 답이 없어요. 상황에 맞는 맞장구·해결책·되묻기를 고르고, 비슷한 발음 보기는 지워요.",
  "기타 의문문": "질문 첫 3단어 + 핵심 명사를 듣고, 비슷한 발음·같은 단어 반복 보기를 먼저 지워요.",
  "화자 의도": "인용 문장 앞뒤 문맥이 정답 포인트. 인용문만 해석하지 말고 바로 앞 상대방 말을 꼭 들어요.",
  "시각 정보": "보기에 있는 정보(이름·숫자)는 음성에 안 나오고, 표의 다른 칸 정보가 들려요. 들리는 칸 → 옆 칸 연결!",
  "주제·목적": "정답 포인트는 대화·담화 처음 1~2문장. 시작 부분을 놓치면 바로 틀려요.",
  "화자·장소": "직업·장소는 한 단어가 아니라 관련 어휘(patients → 병원, menu → 식당)로 추론해요.",
  "다음 행동": "마지막 1~2문장(I'll ~ / Let me ~)이 정답 포인트. 문제 미리 읽고 끝까지 집중!",
  "요청·제안": "Could you ~ / Why don't you ~ / I suggest ~ 가 나오는 문장이 정답 포인트. 누가 누구에게 하는지 확인해요.",
  "문제점": "but / unfortunately / I'm afraid ~ 뒤가 정답 포인트예요.",
  "세부 사항": "문제의 핵심 명사를 미리 보고, 그 단어(또는 패러프레이즈)가 들리는 순간 답을 골라요."
};
function lcxScript(lines) {
  return (lines || []).map(function (l) { return '<div style="margin:3px 0"><b>' + esc(l.spk || "") + '</b> ' + esc(l.en || "") + (l.ko ? '<div style="color:#172844;font-size:12.5px">' + esc(l.ko) + '</div>' : "") + "</div>"; }).join("");
}
var LCX_LIB = null;
function lcxLibs() {
  if (LCX_LIB) return LCX_LIB;
  function js(u) { return new Promise(function (ok, no) { var s = document.createElement("script"); s.src = u; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
  LCX_LIB = Promise.all([window.html2canvas ? 0 : js("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"), window.jspdf ? 0 : js("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js")]).catch(function (e) { LCX_LIB = null; throw e; });
  return LCX_LIB;
}
// blocks(HTML 조각)를 A4 페이지에 차례로 채운다 — 한 조각은 절대 두 페이지로 나누지 않음
function lcxPdf(title, blocks, filename, btn, mode) {
  var old = btn ? btn.textContent : "";
  function st(t) { if (btn) btn.textContent = t; }
  if (btn) btn.disabled = true; st("PDF 준비 중…");
  var W = 794, H = 1123, PAD = 44, FOOT = 30;
  var host = document.createElement("div");
  host.style.cssText = "position:fixed;left:-12000px;top:0;width:" + W + "px;z-index:-1";
  document.body.appendChild(host);
  var pages = [];
  function newPage() {
    var pg = document.createElement("div");
    pg.style.cssText = "width:" + W + "px;height:" + H + "px;box-sizing:border-box;padding:" + PAD + "px " + PAD + "px 0;background:#fff;color:#111;font-family:'Pretendard Variable',Pretendard,-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:14.5px;line-height:1.55;position:relative;overflow:hidden;word-break:keep-all";
    pg.innerHTML = '<div class="in" style="height:' + (H - PAD - FOOT - 12) + 'px;overflow:hidden"></div><div style="position:absolute;left:' + PAD + 'px;right:' + PAD + 'px;bottom:14px;display:flex;justify-content:space-between;font-size:11.5px;color:#172844;border-top:1.5px solid #172844;padding-top:5px"><b>MAKE TOEIC · 메이크토익</b><span>' + esc(title) + ' · ' + (pages.length + 1) + '</span></div>';
    host.appendChild(pg); pages.push(pg); return pg.querySelector(".in");
  }
  var cur = newPage();
  blocks.forEach(function (b) {
    var d = document.createElement("div"); d.innerHTML = b;
    var el = d.firstElementChild || d; cur.appendChild(el);
    if (cur.scrollHeight > cur.clientHeight + 1 && cur.children.length > 1) { cur.removeChild(el); var pv = cur, lk = pv.lastElementChild; cur = newPage(); if (lk && lk.getAttribute("data-keep") && pv.children.length > 1) cur.appendChild(lk); cur.appendChild(el); }
  });
  var imgs = [].slice.call(host.querySelectorAll("img"));
  return Promise.all([lcxLibs(), document.fonts ? document.fonts.ready : 0].concat(imgs.map(function (im) {
    return im.complete && im.naturalWidth ? 0 : new Promise(function (ok) { im.onload = im.onerror = ok; setTimeout(ok, 15000); });
  }))).then(function () {
    // 이미지가 실린 뒤 다시 넘침 확인 — 넘친 조각은 다음 페이지로
    for (var i = 0; i < pages.length; i++) {
      var inn = pages[i].querySelector(".in"), moved = [];
      while (inn.scrollHeight > inn.clientHeight + 1 && inn.children.length > 1) moved.unshift(inn.removeChild(inn.lastElementChild));
      if (moved.length) while (inn.children.length > 1 && inn.lastElementChild.getAttribute("data-keep")) moved.unshift(inn.removeChild(inn.lastElementChild));
      if (moved.length) {
        var nx = pages[i + 1] ? pages[i + 1].querySelector(".in") : null;
        if (!nx) { nx = newPage(); }
        moved.slice().reverse().forEach(function (el) { nx.insertBefore(el, nx.firstChild); });
      }
    }
    pages.forEach(function (pg, k) { var sp = pg.lastElementChild.lastElementChild; if (sp) sp.textContent = title + " · " + (k + 1) + " / " + pages.length; });
    var pdf = new window.jspdf.jsPDF({ unit: "mm", format: "a4", compress: true }), k = 0;
    function one() {
      if (k >= pages.length) return Promise.resolve();
      st("PDF 만드는 중 " + (k + 1) + " / " + pages.length);
      return window.html2canvas(pages[k], { scale: 1.6, useCORS: true, backgroundColor: "#ffffff", logging: false }).then(function (cv) {
        if (k) pdf.addPage();
        pdf.addImage(cv.toDataURL("image/jpeg", 0.88), "JPEG", 0, 0, 210, 297);
        cv.width = cv.height = 0; k++; return one();
      });
    }
    return one().then(function () {
      var blob = pdf.output("blob"), url = URL.createObjectURL(blob);
      if (mode === "print") { var w = window.open(url, "_blank"); if (!w) location.href = url; }
      else { var a = document.createElement("a"); a.href = url; a.download = filename + ".pdf"; document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); }, 4000); }
      setTimeout(function () { URL.revokeObjectURL(url); }, 120000);
      st("✔ PDF 완성 (" + pages.length + "쪽)"); setTimeout(function () { if (btn) { btn.textContent = old; btn.disabled = false; } }, 3500);
    });
  }).catch(function () {
    alert("PDF를 만들지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.");
    if (btn) { btn.textContent = old; btn.disabled = false; }
  }).then(function () { host.remove(); });
}
var LCX_PART = { 1: ["PART 1", "사진 묘사", "사진을 보고 들려주는 네 문장 중 사진을 가장 잘 묘사한 것을 고르세요. 문장은 시험지에 인쇄되지 않습니다."], 2: ["PART 2", "질의 응답", "질문(또는 말)을 듣고 가장 알맞은 응답을 (A)~(C) 중에서 고르세요. 질문과 응답은 시험지에 인쇄되지 않습니다."], 3: ["PART 3", "짧은 대화", "두 사람 이상의 대화를 듣고 각 문제에 알맞은 답을 고르세요. 대화는 시험지에 인쇄되지 않습니다."], 4: ["PART 4", "짧은 담화", "한 사람의 담화를 듣고 각 문제에 알맞은 답을 고르세요. 담화는 시험지에 인쇄되지 않습니다."] };
function lcxPartHead(p) {
  var h = LCX_PART[p] || ["PART " + p, "", ""];
  return '<div data-keep="1" style="margin:6px 0 12px;border:2px solid #172844;border-radius:10px;overflow:hidden"><div style="background:#172844;color:#fff;padding:7px 14px;font-size:17px;font-weight:900">' + h[0] + ' <span style="color:#FF8A3D">· ' + h[1] + '</span></div><div style="padding:8px 14px;font-size:13.5px">' + h[2] + "</div></div>";
}
function lcxCover(D, sub) {
  return '<div style="border-bottom:3px solid #172844;padding-bottom:10px;margin-bottom:14px"><div style="font-size:12px;font-weight:800;letter-spacing:.12em;color:#FF581F">MAKE TOEIC · SEASON ' + D.ser + '</div><div style="font-size:26px;font-weight:900;color:#172844;letter-spacing:-.02em">' + esc(D.g) + '</div><div style="font-size:15px;font-weight:700;margin-top:2px">' + sub + "</div></div>";
}
function lcxImg(src, w) { return src ? '<img crossorigin="anonymous" src="' + esc(audioUrl(src)) + '" style="display:block;max-width:' + w + 'px;max-height:330px;border:1px solid #172844;border-radius:6px;margin:6px 0">' : ""; }
// 회차 문제지 PDF
function lcxQuestionPdf(ser, g, btn) {
  var old = btn.textContent; btn.disabled = true; btn.textContent = "문제 불러오는 중…";
  lcxLoad(ser, g).then(function (D) {
    btn.disabled = false; btn.textContent = old;
    if (!D.list.length) return alert("문제를 불러오지 못했어요.");
    var blocks = [lcxCover(D, "LC 문제지 · " + D.list.length + "문항 · 이름 ____________")], lastPart = 0, seenSet = [];
    D.list.forEach(function (x) {
      var q = x.q, opts = q.options || [];
      if (x.part !== lastPart) { lastPart = x.part; blocks.push(lcxPartHead(x.part)); }
      if (x.set) {
        if (seenSet.indexOf(x.set) >= 0) return; seenSet.push(x.set);
        var qs = D.list.filter(function (y) { return y.set === x.set; });
        blocks.push('<div style="margin:0 0 14px;padding:10px 12px;border:1.5px solid #172844;border-radius:8px"><div style="font-weight:900;color:#172844;margin-bottom:4px">Questions ' + qs[0].n + (qs.length > 1 ? "–" + qs[qs.length - 1].n : "") + '</div>' + lcxImg(x.set.image, 460) + qs.map(function (y) {
          return '<div style="margin:6px 0 2px"><b>' + y.n + '.</b> ' + esc(y.q.q || "") + '</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:1px 14px;padding-left:22px">' + (y.q.options || []).map(function (o, k) { return "<div>(" + L[k] + ") " + esc(o) + "</div>"; }).join("") + "</div>";
        }).join("") + "</div>");
      } else if (x.part === 1) {
        blocks.push('<div style="margin:0 0 14px"><b style="font-size:16px">' + x.n + '.</b>' + lcxImg(q.image, 420) + '<div style="font-weight:700;letter-spacing:.2em">' + opts.map(function (o, k) { return "(" + L[k] + ")"; }).join("  ") + "</div></div>");
      } else {
        blocks.push('<div style="margin:0 0 9px;display:flex;gap:10px;align-items:baseline"><b style="font-size:15px;min-width:30px">' + x.n + '.</b><span>Mark your answer on your answer sheet.</span><b style="margin-left:auto;letter-spacing:.2em">' + (opts.length ? opts : [0, 0, 0]).map(function (o, k) { return "(" + L[k] + ")"; }).join(" ") + "</b></div>");
      }
    });
    // 답안지(OMR) — 25문항씩 한 줄
    var omr = '<div style="margin-top:6px"><div style="font-size:18px;font-weight:900;color:#172844;margin-bottom:8px">ANSWER SHEET · 답안지</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0 10px;border:2px solid #172844;border-radius:8px;padding:8px 10px">';
    var cols = [[], [], [], []], per = Math.ceil(D.list.length / 4);
    D.list.forEach(function (x, i) { cols[Math.min(3, Math.floor(i / per))].push(x); });
    omr += cols.map(function (c) { return "<div>" + c.map(function (x) { var n = (x.q.options || []).length || 4; return '<div style="display:flex;align-items:center;gap:4px;height:21px;font-size:12.5px"><b style="width:26px;text-align:right">' + x.n + '</b>' + L.slice(0, n).map(function (l) { return '<span style="display:inline-flex;width:16px;height:16px;border:1.3px solid #172844;border-radius:50%;align-items:center;justify-content:center;font-size:9.5px;font-weight:800">' + l + "</span>"; }).join("") + "</div>"; }).join("") + "</div>"; }).join("");
    blocks.push(omr + '</div><div style="font-size:12px;margin-top:6px">채점은 학습실 → 실전 모의고사 → <b>✍ 정답 입력 · 오답 분석</b>에서 답을 입력하면 바로 돼요.</div></div>');
    lcxPdf(D.g + " 문제지", blocks, lcxName(D) + "_문제지", btn);
  }).catch(function () { btn.disabled = false; btn.textContent = old; });
}
// 채점 결과 계산
function lcxGrade(D, ans) {
  var R = { ok: 0, n: D.list.length, parts: {}, types: {}, rows: [] };
  D.list.forEach(function (x) {
    var c = ans[x.key] != null ? ans[x.key] : -1, good = c === x.q.answer, ty = lcxType(x);
    var P = R.parts[x.part] = R.parts[x.part] || { n: 0, ok: 0 }; P.n++; if (good) { P.ok++; R.ok++; }
    var tk = "PART " + x.part + " · " + ty, Ty = R.types[tk] = R.types[tk] || { part: x.part, t: ty, n: 0, ok: 0, nos: [] }; Ty.n++; if (good) Ty.ok++; else Ty.nos.push(x.n);
    R.rows.push({ x: x, c: c, good: good, ty: ty });
  });
  return R;
}
function lcxBar(ok, n) { var p = pct(ok, n); return '<span style="display:inline-block;width:110px;height:9px;border:1.3px solid #172844;border-radius:9px;overflow:hidden;vertical-align:middle"><i style="display:block;height:100%;width:' + p + '%;background:' + (p >= 80 ? "#1E8E5A" : p >= 50 ? "#FF8A3D" : "#E0313A") + '"></i></span>'; }
// 오답 분석 리포트(화면 + PDF 공용 조각)
function lcxReportBlocks(D, R, who) {
  var B = [], wrong = R.rows.filter(function (r) { return !r.good; });
  B.push(lcxCover(D, "LC 오답 분석 리포트" + (who ? " · " + esc(who) : "") + " · " + ymdLocal()));
  B.push('<div style="display:flex;gap:12px;margin-bottom:12px"><div style="flex:0 0 190px;background:#172844;color:#fff;border-radius:12px;padding:14px;text-align:center"><div style="font-size:13px;font-weight:700">맞힌 문제</div><div style="font-size:40px;font-weight:900;line-height:1.1">' + R.ok + ' <span style="font-size:20px">/ ' + R.n + '</span></div><div style="font-size:14px;font-weight:800;color:#FFB27A">정답률 ' + pct(R.ok, R.n) + '%</div></div><div style="flex:1;border:2px solid #172844;border-radius:12px;padding:8px 14px">' + Object.keys(R.parts).map(function (p) { var P = R.parts[p]; return '<div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid #D5DBE5"><b style="width:66px">PART ' + p + '</b>' + lcxBar(P.ok, P.n) + '<b style="margin-left:auto;color:' + (P.ok === P.n ? "#1E8E5A" : "#E0313A") + '">' + P.ok + " / " + P.n + "</b></div>"; }).join("") + "</div></div>");
  var tys = Object.keys(R.types).map(function (k) { return R.types[k]; }).sort(function (a, b) { return a.part - b.part || (a.ok / a.n) - (b.ok / b.n); });
  B.push('<div data-keep="1" style="font-size:17px;font-weight:900;color:#172844;margin:6px 0 6px">유형별 분석</div>');
  B.push('<table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:10px"><tr style="background:#172844;color:#fff"><th style="padding:5px 6px;text-align:left">유형</th><th style="padding:5px 6px">정답</th><th style="padding:5px 6px">정답률</th><th style="padding:5px 6px;text-align:left">틀린 번호</th></tr>' + tys.map(function (t) { return '<tr style="border-bottom:1px solid #C9D1DD"><td style="padding:5px 6px"><b>PART ' + t.part + "</b> " + esc(t.t) + '</td><td style="padding:5px 6px;text-align:center">' + t.ok + "/" + t.n + '</td><td style="padding:5px 6px;text-align:center;font-weight:800;color:' + (t.ok === t.n ? "#1E8E5A" : "#E0313A") + '">' + pct(t.ok, t.n) + '%</td><td style="padding:5px 6px">' + (t.nos.join(", ") || "-") + "</td></tr>"; }).join("") + "</table>");
  var weak = tys.filter(function (t) { return t.n - t.ok > 0; }).sort(function (a, b) { return (b.n - b.ok) - (a.n - a.ok) || (a.ok / a.n) - (b.ok / b.n); }).slice(0, 5);
  if (weak.length) {
    B.push('<div data-keep="1" style="font-size:17px;font-weight:900;color:#172844;margin:8px 0 6px">약점 TOP ' + weak.length + ' · 이렇게 고쳐요</div>');
    weak.forEach(function (t, i) { B.push('<div style="border-left:5px solid #FF581F;background:#FFF4EC;padding:8px 12px;margin:0 0 8px;border-radius:0 8px 8px 0"><b>' + (i + 1) + ". PART " + t.part + " · " + esc(t.t) + '</b> <span style="color:#E0313A;font-weight:800">' + (t.n - t.ok) + "문제 틀림</span><div style=\"font-size:13.5px;margin-top:2px\">" + esc(LCX_TIP[t.t] || "문제의 핵심 단어를 미리 보고, 그 단어(또는 패러프레이즈)가 들리는 곳을 정답 포인트로 잡아요.") + "</div></div>"); });
  }
  B.push('<div data-keep="1" style="font-size:17px;font-weight:900;color:#172844;margin:8px 0 6px">전체 채점표</div>');
  var grid = '<div style="display:grid;grid-template-columns:repeat(10,1fr);border:1.5px solid #172844;border-radius:8px;overflow:hidden;font-size:12px;margin-bottom:12px">';
  grid += R.rows.map(function (r) { return '<div style="border-right:1px solid #C9D1DD;border-bottom:1px solid #C9D1DD;padding:3px 0;text-align:center;background:' + (r.good ? "#fff" : "#FFE6E6") + '"><b>' + r.x.n + '</b><br>' + (r.c < 0 ? "-" : L[r.c]) + (r.good ? ' <span style="color:#1E8E5A">○</span>' : ' <span style="color:#E0313A">✕' + L[r.x.q.answer] + "</span>") + "</div>"; }).join("");
  B.push(grid + "</div>");
  if (wrong.length) {
    B.push('<div data-keep="1" style="font-size:17px;font-weight:900;color:#172844;margin:8px 0 6px">틀린 문제 해설 (' + wrong.length + '문제)</div>');
    var shown = [];
    wrong.forEach(function (r) {
      var x = r.x, q = x.q, opts = q.options || [];
      var head = '<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:4px"><b style="font-size:16px;color:#172844">' + x.n + '번</b><span style="background:#172844;color:#fff;border-radius:6px;padding:1px 7px;font-size:12px;font-weight:800">PART ' + x.part + '</span><span style="border:1.3px solid #172844;border-radius:6px;padding:0 7px;font-size:12px;font-weight:800">' + esc(r.ty) + '</span><span style="margin-left:auto;font-weight:800">내 답 <span style="color:#E0313A">' + (r.c < 0 ? "안 품" : "(" + L[r.c] + ")") + '</span> · 정답 <span style="color:#1E8E5A">(' + L[q.answer] + ")</span></span></div>";
      var body = "";
      if (x.part === 1) body += lcxImg(q.image, 300);
      if (q.q) body += '<div style="font-weight:700">' + esc(q.q) + "</div>";
      body += '<div style="padding-left:10px">' + opts.map(function (o, k) { return '<div style="' + (k === q.answer ? "color:#1E8E5A;font-weight:800" : k === r.c ? "color:#E0313A;text-decoration:line-through" : "") + '">(' + L[k] + ") " + esc(o) + "</div>"; }).join("") + "</div>";
      if (q.translation) body += '<div style="font-size:13px;margin-top:3px"><b>해석</b> ' + esc(q.translation) + "</div>";
      if (q.explain) body += '<div style="font-size:13px;margin-top:3px;white-space:pre-line">' + esc(String(q.explain).trim()) + "</div>";
      if (q.vocab) body += '<div style="font-size:13px;margin-top:3px"><b>어휘</b> ' + esc(q.vocab) + "</div>";
      if (q.script && q.script.length) body += '<div style="font-size:13px;margin-top:4px;border-top:1px dashed #172844;padding-top:3px">' + lcxScript(q.script) + "</div>";
      B.push('<div style="border:1.5px solid #172844;border-radius:8px;padding:8px 12px;margin:0 0 9px">' + head + body + "</div>");
      if (x.set && shown.indexOf(x.set) < 0 && (x.set.script || x.set.translation)) {
        var last = D.list.filter(function (y) { return y.set === x.set; }).pop();
        if (wrong.filter(function (w) { return w.x.set === x.set; }).pop() === r) {
          shown.push(x.set);
          B.push('<div style="border:1.5px dashed #172844;border-radius:8px;padding:8px 12px;margin:-2px 0 12px;font-size:13px"><b style="color:#172844">📜 ' + esc(String(D.list.filter(function (y) { return y.set === x.set; })[0].n)) + "–" + last.n + "번 스크립트</b>" + lcxImg(x.set.image, 360) + (x.set.script ? lcxScript(x.set.script) : "") + (x.set.translation && !x.set.script ? '<div>' + esc(x.set.translation) + "</div>" : "") + "</div>");
        }
      }
    });
  } else B.push('<div style="border:2px solid #1E8E5A;border-radius:10px;padding:14px;text-align:center;font-weight:900;color:#1E8E5A;font-size:18px">전부 맞혔어요! 🎉</div>');
  return B;
}
function lcxReportView(D, R, ans, back) {
  var blocks = lcxReportBlocks(D, R, (S.profile || {}).name);
  render(topbar(D.g + " 오답 분석") + `<div style="display:grid;gap:8px;margin-bottom:12px"><button class="btn" id="lcx-save">📄 오답 분석 PDF 저장</button><button class="btn navy" id="lcx-print">🖨 인쇄용으로 열기</button>${back ? `<button class="btn ghost" id="lcx-again">답 고쳐서 다시 채점</button>` : ""}<button class="btn ghost" data-go="#/full">다른 회차</button></div>
    <div class="card" style="padding:14px;overflow-x:auto;font-size:14px;line-height:1.55;color:#111">${blocks.join("")}</div>`);
  bindCommon();
  var nm = lcxName(D) + "_오답분석" + ((S.profile || {}).name ? "_" + S.profile.name : "");
  document.getElementById("lcx-save").onclick = function () { lcxPdf(D.g + " 오답 분석", blocks, nm, this); };
  document.getElementById("lcx-print").onclick = function () { lcxPdf(D.g + " 오답 분석", blocks, nm, this, "print"); };
  var ag = document.getElementById("lcx-again"); if (ag) ag.onclick = back;
  scrollTop();
}
// #/lcx/시즌/회차 — 답안지에 정답 입력
function viewLcx(ser, g) {
  if (allowedSeries().indexOf(ser) < 0) { render(topbar("정답 입력") + '<div class="empty">이 Season은 수강 기간에 포함되지 않았어요.</div>'); bindCommon(); return; }
  render('<div class="empty">답안지를 준비하는 중…</div>');
  lcxLoad(ser, g).then(function (D) {
    if (!D.list.length) { render(topbar(g) + '<div class="empty">아직 공개되지 않은 회차예요.</div>'); bindCommon(); return; }
    var sid = "lcx:" + ser + ":" + g, ans = exGet(sid).ans || {};
    function draw() {
      var lp = 0, n = D.list.filter(function (x) { return ans[x.key] != null; }).length;
      render(topbar(g + " 정답 입력") + `<div class="card hero"><span class="kicker">SEASON ${ser} · LC 실전 모의고사</span><h1>✍ ${esc(g)} 정답 입력</h1><p>종이(문제 PDF)로 푼 답을 그대로 눌러 주세요. 채점하면 PART별·유형별 오답 분석이 나오고 PDF로 저장·인쇄할 수 있어요.</p></div>
        <div class="card" style="padding:10px 12px">${D.list.map(function (x) {
          var h = x.part !== lp ? (lp = x.part, `<div style="font-weight:900;color:#172844;margin:${x === D.list[0] ? 0 : 12}px 0 6px;border-bottom:2px solid #172844;padding-bottom:3px">PART ${x.part}</div>`) : "";
          var k = (x.q.options || []).length || 4;
          return h + `<div style="display:flex;align-items:center;gap:6px;padding:3px 0"><b style="width:34px;text-align:right;font-size:15px">${x.n}</b>${L.slice(0, k).map(function (l, j) { return `<button data-lk="${esc(x.key)}" data-lj="${j}" style="flex:0 0 46px;height:38px;border-radius:999px;border:2px solid #172844;font-weight:900;font-size:15px;background:${ans[x.key] === j ? "#172844" : "#fff"};color:${ans[x.key] === j ? "#fff" : "#172844"}">${l}</button>`; }).join("")}</div>`;
        }).join("")}</div>
        <div class="sticky" style="display:flex;gap:8px"><button class="btn ghost" id="lcx-clear" style="flex:0 0 96px">지우기</button><button class="btn" id="lcx-go" style="flex:1">채점하기 (${n} / ${D.list.length})</button></div>`);
      bindCommon();
      app.querySelectorAll("[data-lk]").forEach(function (b) {
        b.onclick = function () {
          var key = b.dataset.lk, j = +b.dataset.lj; if (ans[key] === j) delete ans[key]; else ans[key] = j;
          exSet(sid, { ans: ans });
          app.querySelectorAll('[data-lk="' + key.replace(/"/g, '\\"') + '"]').forEach(function (o) { var on = ans[key] === +o.dataset.lj; o.style.background = on ? "#172844" : "#fff"; o.style.color = on ? "#fff" : "#172844"; });
          var m = D.list.filter(function (x) { return ans[x.key] != null; }).length; document.getElementById("lcx-go").textContent = "채점하기 (" + m + " / " + D.list.length + ")";
        };
      });
      document.getElementById("lcx-clear").onclick = function () { if (confirm("입력한 답을 모두 지울까요?")) { ans = {}; exSet(sid, null); draw(); } };
      document.getElementById("lcx-go").onclick = function () {
        var left = D.list.filter(function (x) { return ans[x.key] == null; }).length;
        if (left && !confirm("아직 답을 안 넣은 문제가 " + left + "개 있어요. 그대로 채점할까요? (빈칸은 오답 처리)")) return;
        D.list.forEach(function (y) {
          var c = ans[y.key] != null ? ans[y.key] : -1, ok = c === y.q.answer, prev = S.prog[y.key];
          S.prog[y.key] = [c, ok, prev ? prev[2] + 1 : 1];
          api("save_progress", { p_token: S.token, p_item: y.key, p_chosen: c, p_correct: ok }).catch(function () { });
        });
        lcxReportView(D, lcxGrade(D, ans), ans, draw);
      };
    }
    draw();
  }).catch(function () { });
}
// 회차 전체 풀기 결과 화면 → 오답 분석 PDF
function lcxFromFull(F, btn) {
  var D = { ser: F.ser, g: F.g, secs: F.secs, list: F.list.slice() };
  var nos = D.list.map(function (x) { return +x.q.no; }), uniq = nos.every(function (n, i) { return n > 0 && nos.indexOf(n) === i; });
  D.list.forEach(function (x, i) { x.part = x.sec.part || 0; x.n = uniq ? +x.q.no : i + 1; });
  var ans = {}; D.list.forEach(function (x) { var p = S.prog[x.key]; if (p && p[0] >= 0) ans[x.key] = p[0]; });
  lcxReportView(D, lcxGrade(D, ans), ans, null);
}
document.addEventListener("click", function (e) {
  var b = e.target.closest && e.target.closest("[data-lcxpdf]"); if (!b || b.disabled) return;
  e.stopPropagation(); var i = b.dataset.lcxpdf.indexOf("|");
  lcxQuestionPdf(+b.dataset.lcxpdf.slice(0, i), b.dataset.lcxpdf.slice(i + 1), b);
}, true);
*/});

window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
  // 새 함수들
  ["function bindCommon() {\n", CODE + "\nfunction bindCommon() {\n"],
  // 라우트 + 릴스 제거
  ['  if (h[0] === "full") return viewFullList();\n', '  if (h[0] === "lcx" && h[2]) return viewLcx(+h[1], decodeURIComponent(h[2]));\n  if (h[0] === "full") return viewFullList();\n'],
  ['  if (h[0] === "reels") return viewReels();\n  if (h[0] === "reel" && h[1]) return viewReel(decodeURIComponent(h[1]));\n', '  if (h[0] === "reels" || h[0] === "reel") { location.replace("#/"); return; }\n'],
  ["function reelList() { return (S.videos && S.videos.reels) || []; }", "function reelList() { return []; }"],
  // 비회원 LC 수강권도 정답 입력 화면 열기
  ['var LC_OPEN = ["", "learn", "full",', 'var LC_OPEN = ["", "learn", "full", "lcx",'],
  // 회차 전체 풀기 목록 · 문제 풀기 폴더에 버튼
  ['+ (typeof lcdlBtn === "function" ? lcdlBtn(g, secs) : "");', '+ (typeof lcdlBtn === "function" ? lcdlBtn(g, secs) : "") + lcxBtns(ser, g);'],
  ["+ lcdlRow(g, groups[g]) +", "+ lcdlRow(g, groups[g]) + lcxRow(g, groups[g]) +"],
  // 회차 전체 풀기 결과 → 오답 분석 PDF
  ['        <button class="btn ghost" data-go="#/full">다른 회차 풀기</button></div>`);\n    bindCommon();\n',
   '        <button class="btn" id="fr-lcx">📄 오답 분석 리포트 · PDF 저장</button>\n        <button class="btn ghost" data-go="#/full">다른 회차 풀기</button></div>`);\n    bindCommon();\n    document.getElementById("fr-lcx").onclick = function () { lcxFromFull(F); };\n']
]);
})();
