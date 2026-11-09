/* 모든 안쪽 화면 위에 '🏠 홈' 버튼 (2026-11-09) — 누르면 LC · RC 고르는 첫 화면(#/)으로 */
(function () {
var A = '<button class="back" data-back>‹ 뒤로</button><div class="tt">${esc(t)}</div></div>';
var B = '<button class="back" data-back>‹ 뒤로</button><div class="tt">${esc(t)}</div><button class="back mk-home" data-home>🏠 홈</button></div>';
var FN = '// 홈 버튼 — study/homebtn.js\nwindow.MK_HOME_PATCHED = 1;\n' +
  'document.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("[data-home]"); if (!b) return; e.preventDefault(); S.picked = true; if (location.hash === "#/" || location.hash === "") viewHome(); else location.hash = "#/"; window.scrollTo(0, 0); });\n' +
  'function topbar(t) {';
var st = document.createElement("style");
st.textContent = ".mkst .top .mk-home{margin-left:auto;flex:0 0 auto;white-space:nowrap}.mkst .top .tt{flex:1;min-width:0}.mkst .mk-hometop{justify-content:flex-end}";
document.head.appendChild(st);
// topbar를 안 쓰는 화면(문제 풀이 · 해설 보기 · 교재 · 강의 등)에도 홈 버튼을 붙인다
function addHome() {
  var app = document.querySelector(".mkst > .wrap"); if (!app) return;
  var h = location.hash.replace(/^#\/?/, "");
  app.querySelectorAll(".top").forEach(function (t) { if (!t.querySelector("[data-home]")) t.insertAdjacentHTML("beforeend", '<button class="back mk-home" data-home>🏠 홈</button>'); });
  if (h && !app.querySelector(".top") && !app.querySelector("[data-home]") && app.firstElementChild && !app.querySelector(".card.hero"))
    app.insertAdjacentHTML("afterbegin", '<div class="top mk-hometop"><button class="back mk-home" data-home>🏠 홈</button></div>');
}
(function start() { var app = document.querySelector(".mkst > .wrap"); if (!app) return setTimeout(start, 400); new MutationObserver(function () { addHome(); }).observe(app, { childList: true }); addHome(); })();
window.addEventListener("hashchange", function () { setTimeout(addHome, 50); });
document.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest(".mk-hometop [data-home], .top [data-home]"); if (!b || window.MK_HOME_PATCHED) return; e.preventDefault(); location.hash = "#/"; });
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([[A, B], ["function topbar(t) {", FN]]);
})();
