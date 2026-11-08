/* LC 학습실 첫 화면 정리 (2026-11-08 ~ 11-09)
   - "PART 2 문제 풀기 · 교재 강의" 폴더(#/lcf/p2) = 문제 풀기 + 교재 강의
   - "실전 모의고사" 폴더(#/lcf/mock) = 회차 전체 풀기 + 해설강의 + 실전 테스트 · 복습
   - LC 실전 테스트 · 약점 · 오답노트 · 저장 · 실력 분석은 실전 모의고사 문제만 기준 (RC는 그대로)
   - LC 문제 풀기(#/learn) 화면의 실전 모의고사 줄·빈 Season 칸은 뺌(실전 모의고사 폴더와 중복)
   - LC 실력 분석(#/stats) = 실전 모의고사에서 틀린 문제 위주로 PART별 약점 유형 분석(lcpdf.js의 lcxType 유형 분류 사용)
   - RC 첫 화면 '실전 테스트 · 복습' 칸에 설명 문구 */
(function () {
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
 [
  "      roomRow(\"#/learn\", \"문제\", \"📝 문제 풀기\", \"교재 파트2 추가 유형 연습문제\", \"linear-gradient(125deg,#14233E,#233C5C)\") +\n      (fulls.length ? roomRow(\"#/full\", \"전체\", \"🎯 실전 모의고사 회차 전체 풀기\", \"전체 풀기 · PART별 풀기 · 문제별 풀기 · \" + fulls.length + \"회\", \"linear-gradient(125deg,#E95721,#FF8A3D)\") : \"\") +\n      (typeof viewLcvRounds === \"function\" && window.MKST_LCVID ? roomRow(\"#/lcv\", \"강의\", \"🎬 실전 모의고사 해설강의\", \"회차 → 문제를 골라 그 문제 강의만 보기\", \"\") : \"\") +\n      (tblOf(ser).length ? roomRow(\"#/tbl\", \"교재\", \"📘 교재 강의\", ({ 1: \"교재1\", 2: \"교재2\", 3: \"통합 교재\" })[ser] + \" · PART 2 · PART 3·4 · 강의 \" + tblOf(ser).reduce(function (a, c) { return a + c.l.length; }, 0) + \"개\",\"linear-gradient(125deg,#0E6E5C,#1BA37F)\") : \"\") +\n      (\"lcrow\", \"\"))",
  "      roomRow(\"#/lcf/p2\", \"PART 2\", \"📂 PART 2 문제 풀기 · 교재 강의\", \"문제 풀기(교재 파트2 추가 유형 연습문제)\" + (tblOf(ser).length ? \" · 교재 강의\" : \"\"), \"linear-gradient(125deg,#14233E,#233C5C)\") +\n      roomRow(\"#/lcf/mock\", \"모의고사\", \"📂 실전 모의고사\", \"회차 풀기 · 해설강의 · 실전 테스트 · 오답노트 · 실력 분석\" + (fulls.length ? \" · \" + fulls.length + \"회\" : \"\"), \"linear-gradient(125deg,#E95721,#FF8A3D)\") +\n      (\"lcrow\", \"\"))"
 ],
 [
  "function viewHome() {\n",
  "// LC 학습실 폴더(PART 2 · 실전 모의고사) — study/lcfold.js\n// LC 복습(실전 테스트·약점·오답·저장·분석)은 실전 모의고사 문제만 기준으로\nfunction lcMockSec(s) { return s.area === \"LC\" && /LC 실전 모의고사/.test(s.group || \"\"); }\nfunction lcMockWrongN() { return Object.keys(S.prog).filter(function (k) { return !S.prog[k][1] && S.catalog.sections.some(function (s) { return lcMockSec(s) && inSea(s) && k.indexOf(s.id + \":\") === 0; }); }).length; }\nfunction viewLcFolder(k) {\n  var ser = curSer(), fulls = fullGroups(ser), p2 = k === \"p2\";\n  var rows = p2\n    ? roomRow(\"#/learn\", \"문제\", \"📝 PART 2 문제 풀기\", \"교재 파트2 추가 유형 연습문제\", \"linear-gradient(125deg,#14233E,#233C5C)\") +\n      (tblOf(ser).length ? roomRow(\"#/tbl\", \"교재\", \"📘 교재 강의\", ({ 1: \"교재1\", 2: \"교재2\", 3: \"통합 교재\" })[ser] + \" · PART 2 · PART 3·4 · 강의 \" + tblOf(ser).reduce(function (a, c) { return a + c.l.length; }, 0) + \"개\", \"linear-gradient(125deg,#0E6E5C,#1BA37F)\") : \"\")\n    : (fulls.length ? roomRow(\"#/full\", \"전체\", \"🎯 실전 모의고사 회차 전체 풀기\", \"전체 풀기 · PART별 풀기 · 문제별 풀기 · \" + fulls.length + \"회\", \"linear-gradient(125deg,#E95721,#FF8A3D)\") : \"\") +\n      (typeof viewLcvRounds === \"function\" && window.MKST_LCVID ? roomRow(\"#/lcv\", \"강의\", \"🎬 실전 모의고사 해설강의\", \"회차 → 문제를 골라 그 문제 강의만 보기\", \"\") : \"\") +\n      `<div class=\"grp\">📊 실전 테스트 · 복습</div><p style=\"margin:-2px 4px 10px;color:#33404F;font-size:14px\">실전 모의고사에서 푼 문제를 기준으로 테스트하고 분석해요.</p>` +\n      roomRow(\"#/mock\", \"실전\", \"실전 테스트 · 파트2 25문제\", \"실전 모의고사 PART 2에서 출제 · 실전처럼 자동 넘김\", \"\") +\n      roomRow(\"#/weak\", \"약점\", \"약점 유형 20문제\", \"실전 모의고사에서 틀린·안 푼 유형 위주로 맞춤 출제\", \"\") +\n      roomRow(\"#/wrong\", \"오답\", \"오답노트 · 틀린 문제 \" + lcMockWrongN() + \"개\", \"실전 모의고사에서 틀린 문제 다시 풀기\", \"\") +\n      roomRow(\"#/bm\", \"저장\", \"저장한 문제 · ☆ \" + bmSea().length + \"문제\", \"실전 모의고사에서 저장한 문제\", \"\") +\n      roomRow(\"#/stats\", \"분석\", \"실력 분석 · PART별 약점 유형\", \"실전 모의고사에서 틀린 문제 위주로 PART별 약점 유형 분석\", \"\");\n  render(topbar(p2 ? \"PART 2 문제 풀기 · 교재 강의\" : \"실전 모의고사\") +\n    `<div class=\"card hero\"><span class=\"kicker\">SEASON ${ser} · 🎧 LC 학습실</span><h1>${p2 ? \"📂 PART 2 문제 풀기 · 교재 강의\" : \"📂 실전 모의고사\"}</h1><p>${p2 ? \"PART 2 문제 풀기와 교재 강의를 여기서 골라요.\" : \"실전 모의고사 문제 풀기 · 해설강의 · 실전 테스트 · 복습을 여기서 해요.\"}</p></div>` +\n    (rows || '<div class=\"empty\">이 Season에는 아직 준비 중이에요.</div>'));\n  bindCommon();\n}\n// LC 실력 분석: 실전 모의고사에서 틀린 문제 위주로 PART별 약점 유형 (2026-11-09)\nfunction viewLcStats() {\n  var ser = curSer(), metas = S.catalog.sections.filter(function (s) { return lcMockSec(s) && inSea(s); });\n  render(topbar(\"실력 분석\") + '<div class=\"empty\">실전 모의고사 기록을 모으는 중…</div>'); bindCommon();\n  Promise.all(metas.map(function (m) { return load(\"sec:\" + m.id).catch(function () { return null; }); })).then(function (secs) {\n    var P = {}, all = [], done = 0, ok = 0;\n    secs.filter(Boolean).forEach(function (sec) {\n      itemsOf(sec).forEach(function (x) {\n        x.sec = sec; x.part = sec.part || 0;\n        var pr = S.prog[x.key]; if (!pr) return;\n        var t = typeof lcxType === \"function\" ? lcxType(x) : \"PART \" + x.part;\n        var p = P[x.part] = P[x.part] || { part: x.part, done: 0, ok: 0, ty: {} };\n        var b = p.ty[t] = p.ty[t] || { t: t, done: 0, ok: 0, wrong: [] };\n        p.done++; b.done++; done++; all.push(x);\n        if (pr[1]) { p.ok++; b.ok++; ok++; } else b.wrong.push(x);\n      });\n    });\n    var parts = Object.keys(P).map(function (k) { return P[k]; }).sort(function (a, b) { return a.part - b.part; });\n    var wrongAll = done - ok;\n    function rnd(x) { var m = String(x.sec.group || \"\").match(/(\\d+)\\s*회/); return (m ? m[1] + \"회 \" : \"\") + (x.q.no != null ? x.q.no + \"번\" : \"\"); }\n    var html = topbar(\"실력 분석 · PART별 약점\") +\n      `<div class=\"card hero\"><span class=\"kicker\">SEASON ${ser} · 실전 모의고사 기준</span><h1>PART별 약점 유형</h1><p>푼 문제 ${done}개 · 정답률 ${pct(ok, done)}% · 틀린 문제 ${wrongAll}개</p></div>`;\n    if (!done) html += '<div class=\"card peach\">실전 모의고사를 풀면 PART별로 틀린 유형을 분석해 드려요.</div><button class=\"btn\" data-go=\"#/full\">🎯 실전 모의고사 풀러 가기</button>';\n    else {\n      var top = [];\n      parts.forEach(function (p) { Object.keys(p.ty).forEach(function (k) { var b = p.ty[k]; if (b.wrong.length) top.push({ p: p.part, b: b }); }); });\n      top.sort(function (a, b) { return b.b.wrong.length - a.b.wrong.length || a.b.ok / a.b.done - b.b.ok / b.b.done; });\n      if (top.length) html += `<div class=\"card peach\"><b>가장 많이 틀린 유형</b>` + top.slice(0, 3).map(function (o, i) {\n        return `<div style=\"margin-top:8px;font-size:15px\"><b>${i + 1}. PART ${o.p} · ${esc(o.b.t)}</b> <span style=\"color:#A13A2C;font-weight:800\">틀림 ${o.b.wrong.length}개</span> <span style=\"color:#33404F\">(정답률 ${pct(o.b.ok, o.b.done)}%)</span></div>`;\n      }).join(\"\") + `</div>`;\n      parts.forEach(function (p) {\n        var ts = Object.keys(p.ty).map(function (k) { return p.ty[k]; }).sort(function (a, b) { return b.wrong.length - a.wrong.length || a.ok / a.done - b.ok / b.done; });\n        html += `<div class=\"grp\">PART ${p.part} · 정답률 ${pct(p.ok, p.done)}% · 틀린 문제 ${p.done - p.ok}개 / 푼 문제 ${p.done}개</div><div class=\"card\">` + ts.map(function (b, i) {\n          var r = pct(b.ok, b.done), col = r >= 80 ? \"#2E9E6A\" : r >= 60 ? \"#F2B33D\" : \"#E95721\", weak = i === 0 && b.wrong.length;\n          return `<div style=\"padding:9px 0;border-bottom:1px solid #EEF1F5\"><div style=\"display:flex;align-items:center;gap:6px;font-size:15px\"><b style=\"flex:1\">${esc(b.t)}${weak ? ' <span class=\"pill o\" style=\"font-size:12px\">약점</span>' : \"\"}</b><span style=\"color:${b.wrong.length ? \"#A13A2C\" : \"#165846\"};font-weight:800\">${b.wrong.length ? \"틀림 \" + b.wrong.length + \"개\" : \"다 맞음\"}</span><span style=\"color:#33404F;font-size:13px\">· ${r}% (${b.ok}/${b.done})</span></div>\n            <div style=\"height:8px;background:#EEF1F5;border-radius:6px;margin-top:6px;overflow:hidden\"><i style=\"display:block;height:100%;width:${r}%;background:${col}\"></i></div>` +\n            (b.wrong.length ? `<div style=\"display:flex;flex-wrap:wrap;gap:6px;margin-top:8px\">` + b.wrong.map(function (x) { return `<button class=\"btn sm ghost\" data-lw=\"${all.indexOf(x)}\" style=\"padding:7px 10px;font-size:13px;color:#A13A2C\">${esc(rnd(x))} 다시 풀기</button>`; }).join(\"\") + `</div>` : \"\") + `</div>`;\n        }).join(\"\") + `</div>`;\n      });\n      html += '<p style=\"color:#33404F;font-size:13px\">틀린 문제 버튼을 누르면 그 문제(PART 3·4는 같은 지문 3문제)를 다시 풀 수 있어요. 다시 맞히면 틀린 문제에서 빠져요.</p>';\n    }\n    render(html); bindCommon();\n    app.querySelectorAll(\"[data-lw]\").forEach(function (b) {\n      b.onclick = function () {\n        var x = all[+b.dataset.lw], sec = x.sec, list = x.set ? itemsOf(sec).filter(function (y) { return y.set === x.set; }) : [x];\n        list.forEach(function (y) { y.sec = sec; });\n        quiz(sec, list, Math.max(0, list.indexOf(x)), \"약점 다시 풀기 · PART \" + x.part, \"#/stats\");\n      };\n    });\n  }).catch(function () { render(topbar(\"실력 분석\") + '<div class=\"empty\">기록을 불러오지 못했어요. 잠시 뒤 다시 열어 주세요.</div>'); bindCommon(); });\n}\nfunction viewHome() {\n"
 ],
 [
  "\"lock\", \"pick\", \"room\"];",
  "\"lock\", \"pick\", \"room\", \"lcf\"];"
 ],
 [
  "  if (h[0] === \"pick\") return viewPick();\n",
  "  if (h[0] === \"pick\") return viewPick();\n  if (h[0] === \"lcf\") return viewLcFolder(h[1] === \"mock\" ? \"mock\" : \"p2\");\n"
 ],
 [
  "${box(\"📊 실전 테스트 · 복습\", \"\", \"#33404F\",",
  "${lc ? \"\" : box(\"📊 실전 테스트 · 복습\", \"이 Season에서 푼 RC 문제 전체로 테스트하고 복습해요\", \"#33404F\","
 ],
 [
  "S.catalog.sections.forEach(function (s) { if (s.area !== area || !inSea(s)) return; (s.keys || []).forEach(function (k, i) { out.push(",
  "S.catalog.sections.forEach(function (s) { if (s.area !== area || !inSea(s)) return; if (area === \"LC\" && !lcMockSec(s)) return; (s.keys || []).forEach(function (k, i) { out.push("
 ],
 [
  "var metas = S.catalog.sections.filter(function (s) { return bySec[s.id] && s.area === S.area && inSea(s); });",
  "var metas = S.catalog.sections.filter(function (s) { return bySec[s.id] && s.area === S.area && inSea(s) && (S.area !== \"LC\" || lcMockSec(s)); });"
 ],
 [
  "return s.id === id && s.area === S.area && inSea(s); }); }); }",
  "return s.id === id && s.area === S.area && inSea(s) && (S.area !== \"LC\" || lcMockSec(s)); }); }); }"
 ],
 [
  "지금 보는 Season ${curSer()} 문제(교재 · A급 과제)에서 무작위로 출제돼요.",
  "${area === \"LC\" ? \"지금 보는 Season \" + curSer() + \" 실전 모의고사 PART 2 문제\" : \"지금 보는 Season \" + curSer() + \" 문제(교재 · A급 과제)\"}에서 무작위로 출제돼요."
 ],
 [
  "  if (h[0] === \"stats\") return viewStats();",
  "  if (h[0] === \"stats\") return S.area === \"LC\" ? viewLcStats() : viewStats();"
 ],
 [
  "      if (hasMock) out += `",
  "      if (hasMock && false) out += `"
 ],
 [
  "      out += `<div class=\"sea\"><b>SERIES ${n}</b>Series ${n}</div>`",
  "      if (!(S.area === \"LC\" && !sg.length)) out += `<div class=\"sea\"><b>SERIES ${n}</b>Series ${n}</div>`"
 ]
]);
})();
