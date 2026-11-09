/* 모든 안쪽 화면 위에 '🏠 홈' 버튼 (2026-11-09) — 누르면 LC · RC 고르는 첫 화면(#/)으로 */
(function () {
var A = '<button class="back" data-back>‹ 뒤로</button><div class="tt">${esc(t)}</div></div>';
var B = '<button class="back" data-back>‹ 뒤로</button><div class="tt">${esc(t)}</div><button class="back mk-home" data-home>🏠 홈</button></div>';
var FN = '// 홈 버튼 — study/homebtn.js\n' +
  'document.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("[data-home]"); if (!b) return; e.preventDefault(); S.picked = true; if (location.hash === "#/" || location.hash === "") viewHome(); else location.hash = "#/"; window.scrollTo(0, 0); });\n' +
  'function topbar(t) {';
var st = document.createElement("style");
st.textContent = ".mkst .top .mk-home{margin-left:auto;flex:0 0 auto;white-space:nowrap}.mkst .top .tt{flex:1;min-width:0}";
document.head.appendChild(st);
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([[A, B], ["function topbar(t) {", FN]]);
})();
