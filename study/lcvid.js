/* 학습실 LC 실전 모의고사 해설강의 (2026-10-30)
   - 문제를 풀지 않아도 강의만 볼 수 있게: LC 홈의 "🎬 해설강의" → 회차 선택 → 문제 하나 선택 → 그 문제 강의만 재생.
   - 영상 = R2 문제별 영상(MKST_LCVID_BASE + d + "/P1_001.mp4"). 목록 = lcvid-data.js(window.MKST_LCVID).
     키 = "Series-회차" (Series 3=1세트, Series 1=2세트, Series 2=3세트), d = "s1r1", c = [["P1_001", 길이초], ...]
   - get_app 코드에 문자열 패치로 덧붙임 — 앵커가 하나라도 안 맞으면 원본 그대로 사용(index.html 로더 규칙). */
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
// 1) 기능 함수 추가 (lecturesOf 앞)
["function lecturesOf(sec) {\n", "// LC 실전 모의고사 해설강의 — study/lcvid.js\n" +
"function lcvKey(sec) {\n" +
"  if (!window.MKST_LCVID || sec.area !== \"LC\") return null;\n" +
"  var name = (sec.group || \"\") + \" \" + (sec.title || \"\"); if (!/LC 실전 모의고사/.test(name)) return null;\n" +
"  var m = name.match(/(\\d+)\\s*회/); if (!m) return null;\n" +
"  var k = seasonOf([sec]) + \"-\" + (+m[1]); return window.MKST_LCVID[k] ? k : null;\n" +
"}\n" +
"function lcvLabel(lab) { var m = String(lab).match(/P(\\d)_(\\d+)(?:-(\\d+))?/); if (!m) return null; return { part: +m[1], t: m[3] ? (+m[2]) + \"~\" + (+m[3]) + \"번\" : (+m[2]) + \"번\" }; }\n" +
"function lcvTime(t) { t = Math.max(0, Math.round(t)); return Math.floor(t / 60) + \":\" + (t % 60 < 10 ? \"0\" : \"\") + t % 60; }\n" +
"function viewLcvRounds() {\n" +
"  var ser = curSer(), D = window.MKST_LCVID || {}, ks = [];\n" +
"  for (var r = 1; r <= 10; r++) if (D[ser + \"-\" + r]) ks.push(r);\n" +
"  render(topbar(\"해설강의\") + `<div class=\"card hero\"><span class=\"kicker\">SERIES ${ser} · LC 실전 모의고사</span><h1>🎬 해설강의</h1><p>회차를 고른 뒤 듣고 싶은 문제를 하나씩 눌러 보세요.</p></div>` +\n" +
"    (ks.length ? ks.map(function (r) { var n = (D[ser + \"-\" + r].c || []).length; return `<button class=\"row\" data-go=\"#/lcv/${ser}-${r}\"><span class=\"pill o\">${r}회</span><span class=\"t\"><b>LC 실전 모의고사 ${r}회</b><small>문제별 해설강의 ${n}개</small></span>›</button>`; }).join(\"\") : '<div class=\"empty\">해설강의를 준비 중이에요.</div>'));\n" +
"  bindCommon();\n" +
"}\n" +
"function viewLcv(key) {\n" +
"  var D = window.MKST_LCVID || {}, V = D[key], m = String(key).match(/^(\\d)-(\\d+)$/);\n" +
"  if (!V || !m) { viewLcvRounds(); return; }\n" +
"  if (allowedSeries().indexOf(+m[1]) < 0) { render(topbar(\"해설강의\") + '<div class=\"empty\">이 Series는 수강 기간에 포함되지 않았어요.</div>'); bindCommon(); return; }\n" +
"  var B = (window.MKST_LCVID_BASE || \"\") + V.d + \"/\";\n" +
"  var L2 = (V.c || []).map(function (c) { var l = lcvLabel(c[0]); return l ? { part: l.part, t: l.t, f: c[0], d: c[1] } : null; }).filter(Boolean);\n" +
"  var cur = -1, last = 0;\n" +
"  render(topbar(\"LC 실전 모의고사 \" + m[2] + \"회 해설강의\") +\n" +
"    `<div id=\"lcv-box\" style=\"position:sticky;top:0;z-index:5;border-radius:14px;overflow:hidden;background:#000;margin-bottom:8px\"><video id=\"lcv-v\" controls playsinline preload=\"none\" style=\"display:block;width:100%;aspect-ratio:16/9;background:#000\"></video></div>` +\n" +
"    `<p id=\"lcv-now\" style=\"margin:0 2px 10px;color:#33404F;font-size:14px\">아래에서 문제를 하나 고르면 그 문제 강의가 재생돼요.</p>` +\n" +
"    L2.map(function (l, i) {\n" +
"      var head = l.part !== last ? `<div class=\"grp\">PART ${l.part}</div>` : \"\"; last = l.part;\n" +
"      return head + `<button class=\"row\" data-lv=\"${i}\"><span class=\"pill n\">${esc(l.t)}</span><span class=\"t\"><b>${esc(l.t)} 문제 해설</b><small>${lcvTime(l.d)}</small></span>›</button>`;\n" +
"    }).join(\"\"));\n" +
"  bindCommon();\n" +
"  var v = app.querySelector(\"#lcv-v\"), now = app.querySelector(\"#lcv-now\");\n" +
"  function mark() { app.querySelectorAll(\"[data-lv]\").forEach(function (b) { var on = +b.dataset.lv === cur; b.style.borderColor = on ? \"#F26B1D\" : \"\"; b.style.background = on ? \"#FFF4EC\" : \"\"; b.querySelector(\".pill\").className = \"pill \" + (on ? \"o\" : \"n\"); }); }\n" +
"  function go(i) {\n" +
"    cur = i; mark(); now.innerHTML = `▶ <b>PART ${L2[i].part} · ${esc(L2[i].t)}</b> 해설 재생 중`;\n" +
"    v.src = B + L2[i].f + \".mp4\"; var p = v.play(); if (p && p.catch) p.catch(function () { });\n" +
"  }\n" +
"  v.addEventListener(\"ended\", function () { if (cur >= 0) now.innerHTML = `✓ <b>PART ${L2[cur].part} · ${esc(L2[cur].t)}</b> 해설 끝 · 다음 문제를 골라 주세요`; });\n" +
"  v.addEventListener(\"error\", function () { if (cur >= 0) now.innerHTML = `영상을 불러오지 못했어요. 잠시 뒤 다시 눌러 주세요.`; });\n" +
"  app.querySelectorAll(\"[data-lv]\").forEach(function (b) { b.onclick = function () { go(+b.dataset.lv); window.scrollTo({ top: 0, behavior: \"smooth\" }); }; });\n" +
"}\n" +
"function lecturesOf(sec) {\n"],
// 2) LC 홈에 "해설강의" 타일
["    <button class=\"tile\" data-go=\"#/mock\">", "    ${S.area === \"LC\" && window.MKST_LCVID ? `<button class=\"tile\" data-go=\"#/lcv\"><span class=\"pill o\">해설강의</span><b>🎬 실전 모의고사 강의</b><small>문제 하나씩 골라 듣기</small></button>` : \"\"}\n    <button class=\"tile\" data-go=\"#/mock\">"],
// 3) 주소 연결
["  if (h[0] === \"lec\" && h[1]) return viewLectures(decodeURIComponent(h[1]));", "  if (h[0] === \"lcv\") return h[1] ? viewLcv(decodeURIComponent(h[1])) : viewLcvRounds();\n  if (h[0] === \"lec\" && h[1]) return viewLectures(decodeURIComponent(h[1]));"],
// 4) 각 단원 화면의 해설강의 버튼: 문제를 안 풀어도 바로 강의로
["function lectureButton(sec, allDone) {\n", "function lectureButton(sec, allDone) {\n  var lk = lcvKey(sec); if (lk) return `<button class=\"btn navy\" data-go=\"#/lcv/${lk}\">🎬 이 회차 해설강의 보기 (문제별)</button>`;\n"]
]);
