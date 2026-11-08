/* LC 학습실 첫 화면 정리 (2026-11-08 ~ 11-09)
   - "PART 2 문제 풀기 · 교재 강의" 폴더(#/lcf/p2) = 문제 풀기 + 교재 강의
   - "실전 모의고사" 폴더(#/lcf/mock) = 회차 전체 풀기 + 해설강의 + 실전 테스트 · 복습
   - LC 실전 테스트 · 약점 · 오답노트 · 저장 · 실력 분석은 실전 모의고사 문제만 기준 (RC는 그대로)
   - RC 첫 화면 '실전 테스트 · 복습' 칸에 설명 문구 */
(function () {
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
 [
  "      roomRow(\"#/learn\", \"문제\", \"📝 문제 풀기\", \"교재 파트2 추가 유형 연습문제\", \"linear-gradient(125deg,#14233E,#233C5C)\") +\n      (fulls.length ? roomRow(\"#/full\", \"전체\", \"🎯 실전 모의고사 회차 전체 풀기\", \"전체 풀기 · PART별 풀기 · 문제별 풀기 · \" + fulls.length + \"회\", \"linear-gradient(125deg,#E95721,#FF8A3D)\") : \"\") +\n      (typeof viewLcvRounds === \"function\" && window.MKST_LCVID ? roomRow(\"#/lcv\", \"강의\", \"🎬 실전 모의고사 해설강의\", \"회차 → 문제를 골라 그 문제 강의만 보기\", \"\") : \"\") +\n      (tblOf(ser).length ? roomRow(\"#/tbl\", \"교재\", \"📘 교재 강의\", ({ 1: \"교재1\", 2: \"교재2\", 3: \"통합 교재\" })[ser] + \" · PART 2 · PART 3·4 · 강의 \" + tblOf(ser).reduce(function (a, c) { return a + c.l.length; }, 0) + \"개\",\"linear-gradient(125deg,#0E6E5C,#1BA37F)\") : \"\") +\n      (\"lcrow\", \"\"))",
  "      roomRow(\"#/lcf/p2\", \"PART 2\", \"📂 PART 2 문제 풀기 · 교재 강의\", \"문제 풀기(교재 파트2 추가 유형 연습문제)\" + (tblOf(ser).length ? \" · 교재 강의\" : \"\"), \"linear-gradient(125deg,#14233E,#233C5C)\") +\n      roomRow(\"#/lcf/mock\", \"모의고사\", \"📂 실전 모의고사\", \"회차 풀기 · 해설강의 · 실전 테스트 · 오답노트 · 실력 분석\" + (fulls.length ? \" · \" + fulls.length + \"회\" : \"\"), \"linear-gradient(125deg,#E95721,#FF8A3D)\") +\n      (\"lcrow\", \"\"))"
 ],
 [
  "function viewHome() {\n",
  "// LC 학습실 폴더(PART 2 · 실전 모의고사) — study/lcfold.js\n// LC 복습(실전 테스트·약점·오답·저장·분석)은 실전 모의고사 문제만 기준으로\nfunction lcMockSec(s) { return s.area === \"LC\" && /LC 실전 모의고사/.test(s.group || \"\"); }\nfunction lcMockWrongN() { return Object.keys(S.prog).filter(function (k) { return !S.prog[k][1] && S.catalog.sections.some(function (s) { return lcMockSec(s) && inSea(s) && k.indexOf(s.id + \":\") === 0; }); }).length; }\nfunction viewLcFolder(k) {\n  var ser = curSer(), fulls = fullGroups(ser), p2 = k === \"p2\";\n  var rows = p2\n    ? roomRow(\"#/learn\", \"문제\", \"📝 PART 2 문제 풀기\", \"교재 파트2 추가 유형 연습문제\", \"linear-gradient(125deg,#14233E,#233C5C)\") +\n      (tblOf(ser).length ? roomRow(\"#/tbl\", \"교재\", \"📘 교재 강의\", ({ 1: \"교재1\", 2: \"교재2\", 3: \"통합 교재\" })[ser] + \" · PART 2 · PART 3·4 · 강의 \" + tblOf(ser).reduce(function (a, c) { return a + c.l.length; }, 0) + \"개\", \"linear-gradient(125deg,#0E6E5C,#1BA37F)\") : \"\")\n    : (fulls.length ? roomRow(\"#/full\", \"전체\", \"🎯 실전 모의고사 회차 전체 풀기\", \"전체 풀기 · PART별 풀기 · 문제별 풀기 · \" + fulls.length + \"회\", \"linear-gradient(125deg,#E95721,#FF8A3D)\") : \"\") +\n      (typeof viewLcvRounds === \"function\" && window.MKST_LCVID ? roomRow(\"#/lcv\", \"강의\", \"🎬 실전 모의고사 해설강의\", \"회차 → 문제를 골라 그 문제 강의만 보기\", \"\") : \"\") +\n      `<div class=\"grp\">📊 실전 테스트 · 복습</div><p style=\"margin:-2px 4px 10px;color:#33404F;font-size:14px\">실전 모의고사에서 푼 문제를 기준으로 테스트하고 분석해요.</p>` +\n      roomRow(\"#/mock\", \"실전\", \"실전 테스트 · 파트2 25문제\", \"실전 모의고사 PART 2에서 출제 · 실전처럼 자동 넘김\", \"\") +\n      roomRow(\"#/weak\", \"약점\", \"약점 유형 20문제\", \"실전 모의고사에서 틀린·안 푼 유형 위주로 맞춤 출제\", \"\") +\n      roomRow(\"#/wrong\", \"오답\", \"오답노트 · 틀린 문제 \" + lcMockWrongN() + \"개\", \"실전 모의고사에서 틀린 문제 다시 풀기\", \"\") +\n      roomRow(\"#/bm\", \"저장\", \"저장한 문제 · ☆ \" + bmSea().length + \"문제\", \"실전 모의고사에서 저장한 문제\", \"\") +\n      roomRow(\"#/stats\", \"분석\", \"실력 분석 · 유형별 정답률\", \"실전 모의고사 기준 약점 유형 · 맞춤 문제 추천\", \"\");\n  render(topbar(p2 ? \"PART 2 문제 풀기 · 교재 강의\" : \"실전 모의고사\") +\n    `<div class=\"card hero\"><span class=\"kicker\">SEASON ${ser} · 🎧 LC 학습실</span><h1>${p2 ? \"📂 PART 2 문제 풀기 · 교재 강의\" : \"📂 실전 모의고사\"}</h1><p>${p2 ? \"PART 2 문제 풀기와 교재 강의를 여기서 골라요.\" : \"실전 모의고사 문제 풀기 · 해설강의 · 실전 테스트 · 복습을 여기서 해요.\"}</p></div>` +\n    (rows || '<div class=\"empty\">이 Season에는 아직 준비 중이에요.</div>'));\n  bindCommon();\n}\nfunction viewHome() {\n"
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
 ]
]);
})();
