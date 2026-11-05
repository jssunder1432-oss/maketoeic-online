/* 기초 부족 학생(OT PART 5 기준 미달 또는 OT 안 본 학생): 모든 문제 풀 때 문제 아래 '🎯 풀이 포인트' (2026-11-05)
   - 풀이 포인트 = 문항 hint (정답을 말하지 않고 어디를 보고 무엇을 판단할지)
   - 연습 화면 · 시험 모드 · LC 실전 모드 · 회차 전체 풀기 모두. 학생 화면에 기준 점수는 적지 않는다. */
(function () {
function T(f) { var s = f.toString(); return s.slice(s.indexOf("/*") + 2, s.lastIndexOf("*/")); }
var FN = T(function () {/*// 기초 풀이 포인트 — study/basic.js
function stBasic() {
  var n = 0, ok = 0, P = S.prog || {};
  for (var k in P) if (k.indexOf("ot-1011-p5:") === 0) { n++; if (P[k] && P[k][1]) ok++; }
  return !n || ok < 15;
}
function stPt(q) { return q && q.hint && stBasic() ? '<div class="hint" style="border-left:4px solid #E95721;background:#FFF6EF"><b style="color:#C2410C">🎯 풀이 포인트</b> ' + esc(q.hint) + "</div>" : ""; }
function hintHtml(q, set) { var pt = stPt(q), h = hintHtml0(q, set); if (pt) h = h.replace(/<b>힌트<\/b> [^<]*(<br>)?/, "").replace(/<div class="hint">💡 <\/div>/, ""); return pt + h; }
function hintHtml0(q, set) {
  var lv = S.level;*/});
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
["function hintHtml(q, set) {\n  var lv = S.level;", FN],
['      ${qko ? `<div class="hint">💡 <b>질문 해석</b> ${esc(qko)}</div>` : ""}\n      <div class="opts" ${showOpt', '      ${qko ? `<div class="hint">💡 <b>질문 해석</b> ${esc(qko)}</div>` : ""}${stPt(q)}\n      <div class="opts" ${showOpt'],
['      <div class="opts" ${shortQ ?', '      ${stPt(q)}<div class="opts" ${shortQ ?']
]);
})();
