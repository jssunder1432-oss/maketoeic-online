/* 화면 표시 이름 Series → Season (2026-11-01) — 데이터·주소는 그대로, 학습실 화면 글자만 바꾼다 */
(function () {
var RE = /Series|SERIES/g;
function fix(n) {
  if (n.nodeType === 3) { if (RE.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/Series/g, "Season").replace(/SERIES/g, "SEASON"); RE.lastIndex = 0; return; }
  if (n.nodeType !== 1 || n.tagName === "SCRIPT" || n.tagName === "STYLE") return;
  var w = document.createTreeWalker(n, NodeFilter.SHOW_TEXT), t;
  while ((t = w.nextNode())) { if (/Series|SERIES/.test(t.nodeValue)) t.nodeValue = t.nodeValue.replace(/Series/g, "Season").replace(/SERIES/g, "SEASON"); }
}
new MutationObserver(function (ms) { ms.forEach(function (m) { if (m.type === "characterData") fix(m.target); else m.addedNodes.forEach(fix); }); })
  .observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
